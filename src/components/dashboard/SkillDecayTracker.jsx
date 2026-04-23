import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { backend } from '@/api/backendClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Clock, Target, Zap, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const SkillDecayTracker = () => {
  const { user } = useAuth();
  const [decayData, setDecayData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDecayData();
  }, []);

  const loadDecayData = async () => {
    try {
      const progress = await backend.get(`/user-progress?created_by=${encodeURIComponent(user.email)}`);
      if (progress.length > 0) {
        const userProgress = progress[0];
        const lastActivity = new Date(user.learningProfile?.lastActivity || userProgress.updatedAt);
        const now = new Date();
        const daysSinceActivity = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));

        // Calculate skill decay based on time inactive
        const decayRate = user.learningProfile?.skillDecayRate || 0.1;
        const decayedSkills = userProgress.known_skills.map(skill => ({
          name: skill,
          originalConfidence: user.learningProfile?.confidenceLevels?.[skill] || 80,
          currentConfidence: Math.max(0, (user.learningProfile?.confidenceLevels?.[skill] || 80) - (daysSinceActivity * decayRate)),
          daysDecayed: daysSinceActivity
        }));

        const decayingSkills = decayedSkills.filter(skill => skill.currentConfidence < 70);
        const criticalSkills = decayedSkills.filter(skill => skill.currentConfidence < 50);

        setDecayData({
          daysInactive: daysSinceActivity,
          decayingSkills,
          criticalSkills,
          overallDecay: decayingSkills.length > 0 ? decayingSkills.reduce((sum, skill) => sum + (skill.originalConfidence - skill.currentConfidence), 0) / decayingSkills.length : 0
        });
      }
    } catch (error) {
      console.error('Error loading decay data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSkill = async (skillName) => {
    try {
      // Update last activity
      const updatedProfile = {
        ...user.learningProfile,
        lastActivity: new Date(),
        confidenceLevels: {
          ...user.learningProfile?.confidenceLevels,
          [skillName]: 85 // Reset to high confidence
        }
      };

      await backend.put(`/users/${user._id}`, { learningProfile: updatedProfile });
      toast.success(`Refreshed ${skillName} knowledge!`);
      loadDecayData(); // Reload data
    } catch (error) {
      toast.error('Failed to refresh skill');
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

  if (!decayData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Skill Decay Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Complete some learning activities to see your skill decay tracking.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Skill Decay Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{decayData.daysInactive}</div>
              <div className="text-sm text-muted-foreground">Days Inactive</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{decayData.decayingSkills.length}</div>
              <div className="text-sm text-muted-foreground">Decaying Skills</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{decayData.criticalSkills.length}</div>
              <div className="text-sm text-muted-foreground">Critical Skills</div>
            </div>
          </div>

          {decayData.daysInactive > 7 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                You haven't been active for {decayData.daysInactive} days. Your skills are starting to decay!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Critical Skills Alert */}
      {decayData.criticalSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                Critical Skills Need Attention!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {decayData.criticalSkills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex-1">
                      <div className="font-medium text-red-800">{skill.name}</div>
                      <div className="text-sm text-red-600">
                        Confidence dropped to {Math.round(skill.currentConfidence)}%
                      </div>
                      <Progress value={skill.currentConfidence} className="h-2 mt-1" />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => refreshSkill(skill.name)}
                      className="ml-4"
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Refresh
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Decaying Skills */}
      {decayData.decayingSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-orange-500" />
              Skills Needing Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {decayData.decayingSkills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <Badge variant="outline" className="text-orange-600">
                        {Math.round(skill.currentConfidence)}% confidence
                      </Badge>
                    </div>
                    <Progress value={skill.currentConfidence} className="h-2 mb-2" />
                    <div className="text-sm text-muted-foreground">
                      Last active {skill.daysDecayed} days ago
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refreshSkill(skill.name)}
                  >
                    <Target className="w-4 h-4 mr-1" />
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Motivational Message */}
      {decayData.decayingSkills.length === 0 && decayData.daysInactive <= 7 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-green-800 mb-2">Great Job!</h3>
            <p className="text-green-700">
              Your skills are fresh and you're staying consistent. Keep up the excellent work!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SkillDecayTracker;