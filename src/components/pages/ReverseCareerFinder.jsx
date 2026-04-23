import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { backend } from '@/api/backendClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, Building, DollarSign, ArrowRight, Sparkles } from 'lucide-react';
import { CAREER_PATHS } from '@/lib/skillData';
import { toast } from 'sonner';

const ReverseCareerFinder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [goal, setGoal] = useState('');
  const [goalType, setGoalType] = useState('salary'); // salary, company, role
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeGoal = async () => {
    if (!goal.trim()) {
      toast.error('Please enter your career goal');
      return;
    }

    setLoading(true);

    try {
      // Find matching career paths based on goal
      let matchingPaths = [];

      if (goalType === 'salary') {
        // Parse salary (handle formats like "10 LPA", "1000000", etc.)
        const salaryMatch = goal.match(/(\d+(?:\.\d+)?)/);
        if (salaryMatch) {
          const salary = parseFloat(salaryMatch[1]);
          // Simple mapping: higher salary = more advanced roles
          if (salary >= 20) {
            matchingPaths = CAREER_PATHS.filter(p => ['Full Stack Developer', 'Data Scientist', 'DevOps Engineer'].includes(p.title));
          } else if (salary >= 10) {
            matchingPaths = CAREER_PATHS.filter(p => ['Frontend Developer', 'Backend Developer', 'Mobile Developer'].includes(p.title));
          } else {
            matchingPaths = CAREER_PATHS.filter(p => ['Web Developer', 'UI/UX Designer'].includes(p.title));
          }
        }
      } else if (goalType === 'company') {
        // Company-based recommendations
        const company = goal.toLowerCase();
        if (company.includes('google') || company.includes('microsoft') || company.includes('amazon')) {
          matchingPaths = CAREER_PATHS.filter(p => ['Full Stack Developer', 'Data Scientist', 'DevOps Engineer'].includes(p.title));
        } else if (company.includes('startup') || company.includes('small')) {
          matchingPaths = CAREER_PATHS.filter(p => ['Full Stack Developer', 'Web Developer'].includes(p.title));
        } else {
          matchingPaths = CAREER_PATHS.slice(0, 3); // Default top 3
        }
      } else {
        // Direct role search
        matchingPaths = CAREER_PATHS.filter(p =>
          p.title.toLowerCase().includes(goal.toLowerCase())
        );
      }

      if (matchingPaths.length === 0) {
        matchingPaths = CAREER_PATHS.slice(0, 2); // Fallback
      }

      // Calculate user's current progress for each path
      const userProgress = await backend.get(`/user-progress?created_by=${encodeURIComponent(user.email)}`);
      const progressData = userProgress.length > 0 ? userProgress[0] : null;

      const analyzedPaths = matchingPaths.map(path => {
        const knownSkills = progressData ? progressData.known_skills.filter(s => path.required_skills.includes(s)) : [];
        const missingSkills = path.required_skills.filter(s => !knownSkills.includes(s));
        const completionRate = Math.round((knownSkills.length / path.required_skills.length) * 100);

        return {
          ...path,
          knownSkills,
          missingSkills,
          completionRate,
          estimatedTime: missingSkills.length * 2, // Rough estimate: 2 weeks per skill
          salary: goalType === 'salary' ? parseFloat(goal.match(/(\d+(?:\.\d+)?)/)?.[1] || 0) : 8 + (completionRate / 10), // LPA
        };
      });

      setResults({
        goal,
        goalType,
        recommendedPaths: analyzedPaths,
        totalSkills: analyzedPaths.reduce((sum, p) => sum + p.required_skills.length, 0),
        completedSkills: analyzedPaths.reduce((sum, p) => sum + p.knownSkills.length, 0),
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze your goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startPath = async (path) => {
    try {
      const existing = await backend.get(`/user-progress?created_by=${encodeURIComponent(user.email)}`);

      if (existing.length > 0) {
        await backend.put(`/user-progress/${existing[0]._id}`, {
          created_by: user.email,
          career_path_id: path._id || 'custom',
          known_skills: path.knownSkills,
          missing_skills: path.missingSkills,
          completed_skills: path.knownSkills,
          level: path.completionRate < 30 ? 'beginner' : path.completionRate < 70 ? 'intermediate' : 'advanced',
          percentage: path.completionRate,
        });
      } else {
        await backend.post('/user-progress', {
          created_by: user.email,
          career_path_id: path._id || 'custom',
          known_skills: path.knownSkills,
          missing_skills: path.missingSkills,
          completed_skills: path.knownSkills,
          level: path.completionRate < 30 ? 'beginner' : path.completionRate < 70 ? 'intermediate' : 'advanced',
          percentage: path.completionRate,
        });
      }

      navigate('/dashboard');
      toast.success(`Started ${path.title} career path!`);
    } catch (error) {
      toast.error('Failed to start career path');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">🎯 Reverse Career Finder</h1>
          <p className="text-xl text-muted-foreground">
            Tell us your dream, we'll build the roadmap backward
          </p>
        </div>

        {/* Goal Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              What's your career goal?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 mb-4">
              {[
                { value: 'salary', label: 'Salary Target', icon: DollarSign },
                { value: 'company', label: 'Dream Company', icon: Building },
                { value: 'role', label: 'Specific Role', icon: Target }
              ].map(type => (
                <Button
                  key={type.value}
                  variant={goalType === type.value ? 'default' : 'outline'}
                  onClick={() => setGoalType(type.value)}
                  className="flex-1"
                >
                  <type.icon className="w-4 h-4 mr-2" />
                  {type.label}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label>
                {goalType === 'salary' && 'Target Salary (e.g., "15 LPA" or "1500000")'}
                {goalType === 'company' && 'Company Name (e.g., "Google", "Microsoft")'}
                {goalType === 'role' && 'Job Role (e.g., "Full Stack Developer")'}
              </Label>
              <Input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder={
                  goalType === 'salary' ? '15 LPA' :
                  goalType === 'company' ? 'Google' :
                  'Full Stack Developer'
                }
                className="text-lg h-12"
              />
            </div>

            <Button
              onClick={analyzeGoal}
              disabled={loading || !goal.trim()}
              size="lg"
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Analyzing your goal...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Find My Path
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Your Personalized Career Roadmap
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Based on your goal: <strong>{results.goal}</strong>
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {results.recommendedPaths.map((path, index) => (
                      <Card key={index} className="border-l-4 border-l-primary">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold mb-2">{path.title}</h3>
                              <p className="text-muted-foreground mb-3">{path.description}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  ~{path.salary} LPA
                                </span>
                                <span className="flex items-center gap-1">
                                  <Target className="w-4 h-4" />
                                  {path.estimatedTime} weeks
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary mb-1">
                                {path.completionRate}%
                              </div>
                              <div className="text-sm text-muted-foreground">Complete</div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <Progress value={path.completionRate} className="h-2" />
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-medium mb-2 text-green-600">✅ Known Skills ({path.knownSkills.length})</h4>
                              <div className="flex flex-wrap gap-1">
                                {path.knownSkills.map(skill => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2 text-orange-600">🎯 Skills to Learn ({path.missingSkills.length})</h4>
                              <div className="flex flex-wrap gap-1">
                                {path.missingSkills.map(skill => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <Button
                            onClick={() => startPath(path)}
                            className="w-full"
                            size="lg"
                          >
                            Start This Career Path
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReverseCareerFinder;