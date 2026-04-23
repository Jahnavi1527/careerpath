import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { backend } from '@/api/backendClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Brain, Zap, BookOpen, Target, TrendingUp, Clock, Award, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const LearningDNAProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (user?.learningProfile) {
      setProfile(user.learningProfile);
    } else {
      analyzeLearningDNA();
    }
  }, [user]);

  const analyzeLearningDNA = async () => {
    setAnalyzing(true);
    try {
      // Get user's progress data
      const progress = await backend.get(`/user-progress?created_by=${encodeURIComponent(user.email)}`);
      const quizData = await backend.get('/quizzes'); // Get all quizzes for analysis

      // Analyze learning patterns
      const userProgress = progress.length > 0 ? progress[0] : null;

      let learningStyle = 'balanced';
      let preference = 'practical';
      let skillDecayRate = 0.1;
      let confidenceLevels = {};

      if (userProgress) {
        // Analyze based on completed vs known skills ratio
        const completionRatio = userProgress.completed_skills.length / userProgress.known_skills.length;

        if (completionRatio > 0.8) {
          learningStyle = 'fast';
          skillDecayRate = 0.05; // Fast learners retain knowledge longer
        } else if (completionRatio < 0.3) {
          learningStyle = 'slow';
          skillDecayRate = 0.15; // Slow learners need more reinforcement
        }

        // Analyze preference based on skill types
        const theorySkills = ['SQL', 'Git', 'REST APIs', 'TypeScript'];
        const practicalSkills = ['React', 'Node.js', 'Python', 'JavaScript'];

        const theoryCount = userProgress.known_skills.filter(skill =>
          theorySkills.includes(skill)
        ).length;
        const practicalCount = userProgress.known_skills.filter(skill =>
          practicalSkills.includes(skill)
        ).length;

        if (practicalCount > theoryCount * 1.5) {
          preference = 'practical';
        } else if (theoryCount > practicalCount * 1.5) {
          preference = 'theory';
        }

        // Initialize confidence levels
        userProgress.known_skills.forEach(skill => {
          confidenceLevels[skill] = 75 + Math.random() * 20; // 75-95%
        });
      }

      const dnaProfile = {
        learningStyle,
        preference,
        skillDecayRate,
        confidenceLevels,
        lastActivity: new Date(),
        strengths: [],
        recommendations: []
      };

      // Generate strengths and recommendations
      if (learningStyle === 'fast') {
        dnaProfile.strengths.push('Quick learner - picks up new concepts rapidly');
        dnaProfile.recommendations.push('Challenge yourself with advanced topics');
      } else if (learningStyle === 'slow') {
        dnaProfile.strengths.push('Thorough learner - builds strong foundations');
        dnaProfile.recommendations.push('Focus on spaced repetition and practice');
      }

      if (preference === 'practical') {
        dnaProfile.strengths.push('Hands-on learner - excels with real projects');
        dnaProfile.recommendations.push('Prioritize coding exercises and projects');
      } else if (preference === 'theory') {
        dnaProfile.strengths.push('Conceptual learner - strong in theory and design');
        dnaProfile.recommendations.push('Balance with practical implementation');
      }

      // Save the profile
      await backend.put(`/users/${user._id}`, { learningProfile: dnaProfile });
      setProfile(dnaProfile);

      toast.success('Learning DNA profile created!');

    } catch (error) {
      console.error('Error analyzing learning DNA:', error);
      toast.error('Failed to analyze learning profile');
    } finally {
      setAnalyzing(false);
    }
  };

  const getLearningStyleIcon = (style) => {
    switch (style) {
      case 'fast': return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'slow': return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <Target className="w-5 h-5 text-green-500" />;
    }
  };

  const getPreferenceIcon = (pref) => {
    switch (pref) {
      case 'practical': return <Award className="w-5 h-5 text-orange-500" />;
      case 'theory': return <BookOpen className="w-5 h-5 text-purple-500" />;
      default: return <Brain className="w-5 h-5 text-indigo-500" />;
    }
  };

  if (analyzing) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Analyzing your learning DNA...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Learning DNA Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Discover your unique learning style and get personalized recommendations.
          </p>
          <Button onClick={analyzeLearningDNA} className="w-full">
            <Brain className="w-4 h-4 mr-2" />
            Analyze My Learning DNA
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Your Learning DNA Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Learning Style */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {getLearningStyleIcon(profile.learningStyle)}
                <span className="font-medium">Learning Style</span>
              </div>
              <Badge
                variant="secondary"
                className="text-base px-3 py-1 capitalize"
              >
                {profile.learningStyle} Learner
              </Badge>
              <p className="text-sm text-muted-foreground">
                {profile.learningStyle === 'fast' && 'You grasp concepts quickly and can move through material rapidly.'}
                {profile.learningStyle === 'slow' && 'You build deep understanding through thorough study and practice.'}
                {profile.learningStyle === 'balanced' && 'You have a well-rounded approach to learning.'}
              </p>
            </div>

            {/* Learning Preference */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {getPreferenceIcon(profile.preference)}
                <span className="font-medium">Learning Preference</span>
              </div>
              <Badge
                variant="secondary"
                className="text-base px-3 py-1 capitalize"
              >
                {profile.preference} Focus
              </Badge>
              <p className="text-sm text-muted-foreground">
                {profile.preference === 'practical' && 'You learn best through hands-on projects and real-world application.'}
                {profile.preference === 'theory' && 'You excel with conceptual understanding and theoretical foundations.'}
                {profile.preference === 'balanced' && 'You benefit from both theoretical knowledge and practical application.'}
              </p>
            </div>
          </div>

          {/* Skill Decay Rate */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Knowledge Retention</span>
            </div>
            <div className="flex items-center gap-4">
              <Progress
                value={(1 - profile.skillDecayRate) * 100}
                className="flex-1 h-2"
              />
              <span className="text-sm font-medium">
                {Math.round((1 - profile.skillDecayRate) * 100)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              How well you retain learned skills over time
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Recommendations */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Award className="w-5 h-5" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(profile.strengths || []).map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
              {(!profile.strengths || profile.strengths.length === 0) && (
                <li className="text-sm text-muted-foreground italic">
                  Complete more learning activities to discover your strengths
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Target className="w-5 h-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(profile.recommendations || []).map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
              {(!profile.recommendations || profile.recommendations.length === 0) && (
                <li className="text-sm text-muted-foreground italic">
                  Take some quizzes to get personalized recommendations
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Skill Confidence Levels */}
      {Object.keys(profile.confidenceLevels || {}).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skill Confidence Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(profile.confidenceLevels).map(([skill, confidence]) => (
                <div key={skill} className="flex items-center gap-4">
                  <span className="font-medium min-w-0 flex-1">{skill}</span>
                  <div className="flex-1 max-w-xs">
                    <Progress value={confidence} className="h-2" />
                  </div>
                  <span className="text-sm font-medium min-w-[3rem] text-right">
                    {Math.round(confidence)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LearningDNAProfile;