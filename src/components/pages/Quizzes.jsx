import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { backend } from '@/api/backendClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, FlaskConical, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function Quizzes() {
  const { progress, setProgress, careerPath } = useOutletContext();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSkill, setActiveSkill] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    backend.get('/quizzes').then(data => {
      setQuizzes(data);
      setLoading(false);
    }).catch(() => {
      setQuizzes([]);
      setLoading(false);
    });
  }, []);

  if (!progress || !careerPath) return null;

  const skills = careerPath.skill_order || careerPath.required_skills || [];
  const completed = progress.completed_skills || [];
  const quizScores = progress.quiz_scores || {};

  const getQuizzesForSkill = (skill) => quizzes.filter(q => q.skill_name === skill);

  const generateQuiz = async (skill) => {
    setLoading(true);

    // Mock quiz questions for demo
    const mockQuestions = [
      {
        question: `What is the primary purpose of ${skill}?`,
        options: [
          'To create web applications',
          'To manage databases',
          'To design user interfaces',
          'To write documentation'
        ],
        correct_answer: 0,
        explanation: `${skill} is primarily used for creating web applications and interactive user experiences.`
      },
      {
        question: `Which of the following is a key feature of ${skill}?`,
        options: [
          'Component-based architecture',
          'Server-side rendering only',
          'Static HTML generation',
          'Database management'
        ],
        correct_answer: 0,
        explanation: `${skill} uses a component-based architecture to build reusable UI elements.`
      },
      {
        question: `What type of language is ${skill}?`,
        options: [
          'Markup language',
          'Programming language',
          'Styling language',
          'Query language'
        ],
        correct_answer: 1,
        explanation: `${skill} is a programming language used for building interactive applications.`
      },
      {
        question: `Which environment is commonly used to run ${skill} applications?`,
        options: [
          'Web browser',
          'Command line only',
          'Database server',
          'File system'
        ],
        correct_answer: 0,
        explanation: `${skill} applications typically run in web browsers with JavaScript engines.`
      },
      {
        question: `What is a common use case for ${skill}?`,
        options: [
          'Data analysis',
          'User interface development',
          'System administration',
          'Network configuration'
        ],
        correct_answer: 1,
        explanation: `${skill} is commonly used for developing user interfaces and interactive web applications.`
      }
    ];

    const created = await backend.post('/quizzes', mockQuestions.map(q => ({ ...q, skill_name: skill })));
    setQuizzes(prev => [...prev, ...(Array.isArray(created) ? created : [created])]);
    setLoading(false);
    toast.success(`Generated ${created.length} questions for ${skill}!`);
  };

  const startQuiz = (skill) => {
    setActiveSkill(skill);
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
  };

  const handleAnswer = (idx) => {
    setSelected(idx);
  };

  const nextQuestion = async () => {
    const qs = getQuizzesForSkill(activeSkill);
    const isCorrect = selected === qs[currentQ].correct_answer;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentQ + 1 >= qs.length) {
      // Quiz complete
      const pct = Math.round((newScore / qs.length) * 100);
      const newScores = { ...quizScores, [activeSkill]: pct };
      await backend.put(`/user-progress/${progress._id}`, { quiz_scores: newScores });
      setProgress({ ...progress, quiz_scores: newScores });
      setShowResult(true);
      toast.success(`Quiz completed! Score: ${pct}%`);
    } else {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    }
  };

  // Quiz taking view
  if (activeSkill && !showResult) {
    const qs = getQuizzesForSkill(activeSkill);
    if (qs.length === 0) {
      return (
        <div className="max-w-3xl mx-auto text-center py-20">
          <p className="text-muted-foreground">No quiz questions available for {activeSkill} yet.</p>
          <Button onClick={() => setActiveSkill(null)} variant="outline" className="mt-4">Back</Button>
        </div>
      );
    }
    const q = qs[currentQ];

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">{activeSkill} Quiz</h1>
          <Badge variant="outline">{currentQ + 1}/{qs.length}</Badge>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <p className="font-medium text-lg mb-6">{q.question}</p>
            <div className="space-y-3">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selected === idx
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border/50 hover:border-primary/30 hover:bg-muted/30'
                  }`}
                >
                  <span className="text-sm font-medium">{opt}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setActiveSkill(null)}>Cancel</Button>
          <Button onClick={nextQuestion} disabled={selected === null}>
            {currentQ + 1 >= qs.length ? 'Finish' : 'Next'} <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  // Quiz result view
  if (activeSkill && showResult) {
    const qs = getQuizzesForSkill(activeSkill);
    const pct = Math.round((score / qs.length) * 100);

    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-10">
        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${pct >= 70 ? 'bg-primary/10' : 'bg-destructive/10'}`}>
          {pct >= 70 ? <CheckCircle2 className="w-10 h-10 text-primary" /> : <XCircle className="w-10 h-10 text-destructive" />}
        </div>
        <h1 className="font-heading text-3xl font-bold">{pct >= 70 ? 'Great Job!' : 'Keep Practicing!'}</h1>
        <p className="text-muted-foreground">You scored <span className="font-bold text-foreground">{score}/{qs.length}</span> ({pct}%)</p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => startQuiz(activeSkill)}>
            <RotateCcw className="w-4 h-4 mr-2" /> Retry
          </Button>
          <Button onClick={() => { setActiveSkill(null); setShowResult(false); }}>
            Back to Quizzes
          </Button>
        </div>
      </div>
    );
  }

  // Skill list view
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold">Quizzes & Tests</h1>
        <p className="text-muted-foreground mt-1">Complete a skill in your roadmap to unlock its quiz.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {skills.map(skill => {
            const isCompleted = completed.includes(skill);
            const hasQuiz = getQuizzesForSkill(skill).length > 0;
            const prevScore = quizScores[skill];

            return (
              <Card key={skill} className={`border-border/50 transition-all ${!isCompleted ? 'opacity-60' : 'hover:shadow-md'}`}>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    {isCompleted ? <FlaskConical className="w-5 h-5 text-primary" /> : <Lock className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold">{skill}</h3>
                    {!isCompleted && <p className="text-xs text-muted-foreground">Complete this skill to unlock quiz</p>}
                    {isCompleted && !hasQuiz && <p className="text-xs text-muted-foreground">No questions yet — generate with AI</p>}
                    {isCompleted && hasQuiz && prevScore !== undefined && (
                      <p className="text-xs text-muted-foreground">Best score: {prevScore}%</p>
                    )}
                  </div>
                  {isCompleted && !hasQuiz && (
                    <Button size="sm" variant="outline" onClick={() => generateQuiz(skill)} disabled={loading} className="rounded-full gap-1">
                      <Sparkles className="w-3 h-3" /> Generate
                    </Button>
                  )}
                  {isCompleted && hasQuiz && (
                    <Button size="sm" onClick={() => startQuiz(skill)} className="rounded-full">
                      {prevScore !== undefined ? 'Retry' : 'Start'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}