
import React, { useState } from 'react';
import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import CircularProgress from '@/components/dashboard/CircularProgress';
import SkillBar from '@/components/dashboard/SkillBar';
import HelpPanel from '@/components/dashboard/HelpPanel';
import SkillDecayTracker from '@/components/dashboard/SkillDecayTracker';
import LearningDNAProfile from '@/components/dashboard/LearningDNAProfile';
import ConfusionDetectionSystem from '@/components/dashboard/ConfusionDetectionSystem';
import CareerRealityCheck from '@/components/dashboard/CareerRealityCheck';
import MiniInternshipMode from '@/components/dashboard/MiniInternshipMode';
import { backend } from '@/api/backendClient';
import { TrendingUp, CheckCircle2, AlertCircle, Route, BookOpen, FlaskConical, Sparkles, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const { progress, careerPath } = useOutletContext();
  const [helpSkill, setHelpSkill] = useState(null);
  const [restarting, setRestarting] = useState(false);
  const navigate = useNavigate();

  const handleRestart = async () => {
    setRestarting(true);
    await backend.put(`/user-progress/${progress._id}`, {
      career_path_id: '',
      known_skills: [],
      completed_skills: [],
      missing_skills: [],
      percentage: 0,
      level: 'beginner',
      quiz_scores: {}
    });
    navigate('/analyze');
  };

  if (!progress || !careerPath) return null;

  const allSkills = careerPath.skill_order || careerPath.required_skills || [];
  const known = progress.known_skills || [];
  const completed = progress.completed_skills || [];
  const missing = progress.missing_skills || [];

  const levelColors = {
    beginner: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
    intermediate: 'bg-primary/10 text-primary border-primary/20',
    advanced: 'bg-accent/10 text-accent border-accent/20',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Greeting */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">Welcome back! 👋</h1>
          <p className="text-muted-foreground mt-1">Here's your career progress for <span className="font-medium text-foreground">{careerPath.title}</span></p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 border-destructive/30 text-destructive hover:bg-destructive/5 hover:border-destructive/50">
              <RefreshCw className="w-4 h-4" /> Start New Journey
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Start a New Journey?</AlertDialogTitle>
              <AlertDialogDescription>
                This will clear your current progress, completed skills, and career path. Your account will remain intact. Are you sure you want to restart?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRestart}
                disabled={restarting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {restarting ? 'Resetting...' : 'Yes, Start Over'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-5 flex items-center gap-4">
            <CircularProgress value={progress.percentage || 0} size={70} strokeWidth={7} />
            <div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="font-heading text-xl font-bold">{progress.percentage || 0}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Level</p>
            </div>
            <Badge className={`${levelColors[progress.level || 'beginner']} border text-sm px-3 py-1 capitalize`}>
              {progress.level || 'beginner'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Completed Skills</p>
            </div>
            <p className="font-heading text-2xl font-bold">{completed.length}<span className="text-sm font-normal text-muted-foreground">/{allSkills.length}</span></p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-muted-foreground">Missing Skills</p>
            </div>
            <p className="font-heading text-2xl font-bold text-destructive">{missing.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Career Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={progress.percentage || 0} className="flex-1 h-3" />
            <span className="font-heading font-bold text-lg">{progress.percentage || 0}%</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {completed.length} of {allSkills.length} skills completed toward {careerPath.title}
          </p>
        </CardContent>
      </Card>

      {/* Skill Decay Tracker */}
      <SkillDecayTracker />

      {/* Learning DNA Profile */}
      <LearningDNAProfile />

      {/* Confusion Detection System */}
      <ConfusionDetectionSystem />

      {/* Career Reality Check */}
      <CareerRealityCheck />

      {/* Mini Internship Mode */}
      <MiniInternshipMode />

      {/* Two column: Known & Missing */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" /> Known Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {known.length > 0 ? known.map(s => (
              <SkillBar key={s} name={s} known onClick={() => setHelpSkill(s)} />
            )) : (
              <p className="text-sm text-muted-foreground">No known skills yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" /> Missing Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {missing.length > 0 ? missing.map(s => (
              <SkillBar key={s} name={s} known={false} onClick={() => setHelpSkill(s)} />
            )) : (
              <p className="text-sm text-muted-foreground flex items-center gap-1"><Sparkles className="w-4 h-4" /> All skills mastered!</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/dashboard/roadmap">
          <Card className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Route className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">View Roadmap</p>
                <p className="text-xs text-muted-foreground">Step-by-step path</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/dashboard/resources">
          <Card className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-sm">Learning Resources</p>
                <p className="text-xs text-muted-foreground">Free & paid courses</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/dashboard/quizzes">
          <Card className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-chart-3/10 flex items-center justify-center group-hover:bg-chart-3/20 transition-colors">
                <FlaskConical className="w-5 h-5 text-chart-3" />
              </div>
              <div>
                <p className="font-medium text-sm">Take Quizzes</p>
                <p className="text-xs text-muted-foreground">Test your knowledge</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Help Panel */}
      <HelpPanel skill={helpSkill} onClose={() => setHelpSkill(null)} />
    </div>
  );
}