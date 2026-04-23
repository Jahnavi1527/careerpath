import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { Briefcase, Clock, CheckCircle2, Star, Target, Code, FileText, Users, Award } from 'lucide-react';
import { backend } from '@/api/backendClient';
import { toast } from 'sonner';

const MiniInternshipMode = () => {
  const { careerPath, progress } = useOutletContext();
  const [currentTask, setCurrentTask] = useState(null);
  const [userSolution, setUserSolution] = useState('');
  const [taskProgress, setTaskProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    generateInternshipTasks();
  }, [careerPath]);

  const generateInternshipTasks = async () => {
    try {
      // Generate realistic internship tasks based on career path
      const tasks = generateTasksForCareer(careerPath.title);
      setTaskProgress(tasks.reduce((acc, task) => ({
        ...acc,
        [task.id]: { completed: false, score: 0, attempts: 0 }
      }), {}));

      // Start with first task
      if (tasks.length > 0) {
        setCurrentTask(tasks[0]);
      }
    } catch (error) {
      console.error('Error generating internship tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTasksForCareer = (careerTitle) => {
    const taskTemplates = {
      'Full Stack Developer': [
        {
          id: 'api-design',
          title: 'API Design Challenge',
          description: 'Design a REST API for a social media platform with user authentication, posts, and comments.',
          type: 'design',
          difficulty: 'medium',
          timeEstimate: '45 min',
          skills: ['API Design', 'REST', 'Authentication'],
          prompt: 'Design the API endpoints, data models, and authentication flow. Include error handling and rate limiting considerations.'
        },
        {
          id: 'frontend-component',
          title: 'React Component Development',
          description: 'Build a reusable data table component with sorting, filtering, and pagination.',
          type: 'coding',
          difficulty: 'hard',
          timeEstimate: '60 min',
          skills: ['React', 'JavaScript', 'Component Design'],
          prompt: 'Implement a DataTable component that accepts data array, columns config, and handles sorting/filtering. Include proper TypeScript types.'
        },
        {
          id: 'database-optimization',
          title: 'Database Query Optimization',
          description: 'Optimize slow database queries for an e-commerce platform.',
          type: 'analysis',
          difficulty: 'hard',
          timeEstimate: '30 min',
          skills: ['SQL', 'Database Design', 'Performance'],
          prompt: 'Analyze the provided slow queries and suggest optimizations. Consider indexes, query structure, and denormalization.'
        }
      ],
      'Data Scientist': [
        {
          id: 'data-analysis',
          title: 'Customer Churn Analysis',
          description: 'Analyze customer data to predict churn and provide business recommendations.',
          type: 'analysis',
          difficulty: 'medium',
          timeEstimate: '50 min',
          skills: ['Python', 'Pandas', 'Statistics'],
          prompt: 'Use the provided dataset to identify churn patterns, build a predictive model, and suggest retention strategies.'
        },
        {
          id: 'ml-model',
          title: 'Machine Learning Model Deployment',
          description: 'Deploy a trained ML model as a REST API service.',
          type: 'coding',
          difficulty: 'hard',
          timeEstimate: '75 min',
          skills: ['Python', 'Flask/FastAPI', 'ML Deployment'],
          prompt: 'Create a REST API that loads your trained model and provides prediction endpoints. Include input validation and error handling.'
        }
      ],
      'UI/UX Designer': [
        {
          id: 'user-research',
          title: 'User Research & Persona Creation',
          description: 'Conduct user research and create detailed user personas for a fitness app.',
          type: 'research',
          difficulty: 'medium',
          timeEstimate: '40 min',
          skills: ['User Research', 'Persona Creation', 'Empathy Mapping'],
          prompt: 'Interview 3 potential users, identify pain points, and create 2-3 detailed personas with goals, behaviors, and motivations.'
        },
        {
          id: 'wireframe-design',
          title: 'Mobile App Wireframing',
          description: 'Create wireframes for a task management mobile app.',
          type: 'design',
          difficulty: 'medium',
          timeEstimate: '55 min',
          skills: ['Wireframing', 'Mobile Design', 'User Flow'],
          prompt: 'Design wireframes for key screens: task list, task creation, settings. Include navigation and user flows.'
        }
      ]
    };

    return taskTemplates[careerTitle] || [
      {
        id: 'general-task',
        title: 'Professional Development Task',
        description: 'Complete a professional task related to your career path.',
        type: 'general',
        difficulty: 'medium',
        timeEstimate: '30 min',
        skills: ['Professional Skills'],
        prompt: 'Describe how you would approach a typical work challenge in your field.'
      }
    ];
  };

  const submitSolution = async () => {
    if (!userSolution.trim()) {
      toast.error('Please provide a solution before submitting');
      return;
    }

    setSubmitting(true);
    try {
      // Simulate AI evaluation (in real implementation, this would call an AI service)
      const score = Math.floor(Math.random() * 40) + 60; // 60-100 score
      const feedback = generateFeedback(currentTask, score);

      setTaskProgress(prev => ({
        ...prev,
        [currentTask.id]: {
          completed: true,
          score,
          attempts: (prev[currentTask.id]?.attempts || 0) + 1,
          feedback
        }
      }));

      toast.success(`Task completed! Score: ${score}/100`);

      // Move to next task
      const allTasks = generateTasksForCareer(careerPath.title);
      const currentIndex = allTasks.findIndex(t => t.id === currentTask.id);
      if (currentIndex < allTasks.length - 1) {
        setCurrentTask(allTasks[currentIndex + 1]);
        setUserSolution('');
      } else {
        toast.success('All internship tasks completed! 🎉');
      }

    } catch (error) {
      toast.error('Failed to submit solution');
    } finally {
      setSubmitting(false);
    }
  };

  const generateFeedback = (task, score) => {
    if (score >= 90) {
      return {
        type: 'excellent',
        message: 'Outstanding work! You demonstrated deep understanding and professional-level skills.',
        improvements: []
      };
    } else if (score >= 80) {
      return {
        type: 'good',
        message: 'Great job! Your solution shows solid understanding with room for refinement.',
        improvements: ['Consider edge cases', 'Add more detailed documentation']
      };
    } else if (score >= 70) {
      return {
        type: 'fair',
        message: 'Good effort! The foundation is there, but needs more development.',
        improvements: ['Review best practices', 'Add error handling', 'Improve structure']
      };
    } else {
      return {
        type: 'needs-improvement',
        message: 'Keep practicing! Focus on the core concepts and try again.',
        improvements: ['Study the fundamentals', 'Review examples', 'Practice similar problems']
      };
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'hard': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'coding': return <Code className="w-5 h-5" />;
      case 'design': return <FileText className="w-5 h-5" />;
      case 'analysis': return <Target className="w-5 h-5" />;
      default: return <Briefcase className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedTasks = Object.values(taskProgress).filter(p => p.completed).length;
  const totalTasks = Object.keys(taskProgress).length;
  const averageScore = completedTasks > 0
    ? Object.values(taskProgress)
        .filter(p => p.completed)
        .reduce((sum, p) => sum + p.score, 0) / completedTasks
    : 0;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Mini Internship Mode
          </CardTitle>
          <p className="text-muted-foreground">
            Complete real-world tasks to build your professional portfolio
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-800">{completedTasks}/{totalTasks}</p>
              <p className="text-sm text-blue-700">Tasks Completed</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
              <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-800">{Math.round(averageScore)}</p>
              <p className="text-sm text-green-700">Average Score</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-800">{careerPath.title}</p>
              <p className="text-sm text-purple-700">Career Focus</p>
            </div>
          </div>
          <Progress value={(completedTasks / totalTasks) * 100} className="h-3" />
        </CardContent>
      </Card>

      {/* Current Task */}
      {currentTask && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getTaskIcon(currentTask.type)}
                <div>
                  <CardTitle className="text-lg">{currentTask.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{currentTask.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className={`capitalize ${getDifficultyColor(currentTask.difficulty)}`}>
                  {currentTask.difficulty}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {currentTask.timeEstimate}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Skills Required */}
              <div>
                <p className="text-sm font-medium mb-2">Skills Required:</p>
                <div className="flex flex-wrap gap-2">
                  {currentTask.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Task Prompt */}
              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  <strong>Task:</strong> {currentTask.prompt}
                </AlertDescription>
              </Alert>

              {/* Solution Input */}
              <div>
                <label className="text-sm font-medium mb-2 block">Your Solution:</label>
                <Textarea
                  value={userSolution}
                  onChange={(e) => setUserSolution(e.target.value)}
                  placeholder="Describe your approach, solution, or provide code/design here..."
                  className="min-h-[200px]"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  onClick={submitSolution}
                  disabled={submitting || !userSolution.trim()}
                  className="flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Submit Solution
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Previous Task Feedback */}
      {Object.entries(taskProgress).map(([taskId, progress]) => {
        if (!progress.completed) return null;

        const task = generateTasksForCareer(careerPath.title).find(t => t.id === taskId);
        if (!task) return null;

        return (
          <motion.div
            key={taskId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-medium">{task.title}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    {progress.score}/100
                  </Badge>
                </div>
                <p className="text-sm text-green-700 mb-2">{progress.feedback.message}</p>
                {progress.feedback.improvements.length > 0 && (
                  <div className="text-xs text-green-600">
                    <strong>Suggestions:</strong> {progress.feedback.improvements.join(', ')}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {/* Completion Message */}
      {completedTasks === totalTasks && totalTasks > 0 && (
        <Alert className="border-green-200 bg-green-50">
          <Award className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Congratulations! 🎉</strong> You've completed all internship tasks.
            Your portfolio now includes practical experience that demonstrates real-world skills!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MiniInternshipMode;