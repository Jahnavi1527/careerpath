import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { backend } from '@/api/backendClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { AlertTriangle, HelpCircle, BookOpen, Target, Lightbulb, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const ConfusionDetectionSystem = () => {
  const { user } = useAuth();
  const [confusionData, setConfusionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeConfusionPatterns();
  }, []);

  const analyzeConfusionPatterns = async () => {
    try {
      // Get user's quiz performance
      const progress = await backend.get(`/user-progress?created_by=${encodeURIComponent(user.email)}`);
      const quizzes = await backend.get('/quizzes');

      if (progress.length === 0) {
        setLoading(false);
        return;
      }

      const userProgress = progress[0];
      const quizScores = userProgress.quiz_scores || {};

      // Analyze quiz performance patterns
      const skillPerformance = {};
      const failedAttempts = {};

      Object.entries(quizScores).forEach(([quizId, score]) => {
        const quiz = quizzes.find(q => q._id === quizId);
        if (quiz) {
          const skill = quiz.skill_name;
          if (!skillPerformance[skill]) {
            skillPerformance[skill] = { total: 0, count: 0, fails: 0 };
          }
          skillPerformance[skill].total += score;
          skillPerformance[skill].count += 1;

          if (score < 60) { // Consider below 60% as failing
            skillPerformance[skill].fails += 1;
            failedAttempts[skill] = (failedAttempts[skill] || 0) + 1;
          }
        }
      });

      // Identify confused topics
      const confusedTopics = Object.entries(skillPerformance)
        .filter(([skill, data]) => {
          const avgScore = data.total / data.count;
          return avgScore < 70 || data.fails > 2; // Low average or multiple fails
        })
        .map(([skill, data]) => ({
          skill,
          avgScore: Math.round(data.total / data.count),
          failCount: data.fails,
          severity: data.fails > 3 ? 'high' : data.fails > 1 ? 'medium' : 'low'
        }))
        .sort((a, b) => b.failCount - a.failCount);

      // Generate recommendations
      const recommendations = confusedTopics.map(topic => {
        const recs = [];
        if (topic.avgScore < 50) {
          recs.push('Start with basics - revisit fundamental concepts');
        } else if (topic.avgScore < 70) {
          recs.push('Practice more examples and exercises');
        }

        if (topic.failCount > 2) {
          recs.push('Take a break and return with fresh perspective');
        }

        return { ...topic, recommendations: recs };
      });

      setConfusionData({
        confusedTopics: recommendations,
        overallPerformance: Object.values(skillPerformance).reduce((acc, data) => {
          acc.totalScore += data.total;
          acc.totalCount += data.count;
          return acc;
        }, { totalScore: 0, totalCount: 0 })
      });

    } catch (error) {
      console.error('Error analyzing confusion patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHelpForTopic = async (skill) => {
    try {
      // Get resources for this skill
      const resources = await backend.get(`/resources?skill_name=${encodeURIComponent(skill)}`);
      const topResources = resources.slice(0, 3);

      // Show help dialog or navigate to resources
      if (topResources.length > 0) {
        toast.success(`Found ${topResources.length} resources for ${skill}`);
        // Could open a modal with resources or navigate to resources page
      } else {
        toast.info(`No specific resources found for ${skill}. Try general programming resources.`);
      }
    } catch (error) {
      toast.error('Failed to get help resources');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-orange-200 bg-orange-50';
      default: return 'border-yellow-200 bg-yellow-50';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium': return <HelpCircle className="w-5 h-5 text-orange-500" />;
      default: return <Lightbulb className="w-5 h-5 text-yellow-500" />;
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

  if (!confusionData || confusionData.confusedTopics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Learning Progress Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-green-800 mb-2">You're doing great!</h3>
            <p className="text-green-700 text-sm">
              No confusion patterns detected. Keep up the excellent learning progress!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Learning Progress Monitor
          </CardTitle>
          <p className="text-muted-foreground">
            We've detected some areas where you might need extra help
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {confusionData.confusedTopics.map((topic, index) => (
              <motion.div
                key={topic.skill}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${getSeverityColor(topic.severity)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(topic.severity)}
                    <span className="font-semibold">{topic.skill}</span>
                    <Badge variant="outline" className="text-xs">
                      {topic.avgScore}% avg score
                    </Badge>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {topic.failCount} failed attempts
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  {topic.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Target className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => getHelpForTopic(topic.skill)}
                  >
                    <BookOpen className="w-4 h-4 mr-1" />
                    Get Resources
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.info(`Practice mode for ${topic.skill} coming soon!`)}
                  >
                    <Target className="w-4 h-4 mr-1" />
                    Practice Mode
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Overall Performance Alert */}
      {confusionData.confusedTopics.some(t => t.severity === 'high') && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>High confusion detected!</strong> Consider taking a break from complex topics
            and revisiting fundamentals. Learning is a marathon, not a sprint.
          </AlertDescription>
        </Alert>
      )}

      {/* Encouragement */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-blue-800 mb-2">Remember:</h3>
          <p className="text-blue-700 text-sm">
            Confusion is a natural part of learning. Every expert was once confused about these topics.
            You're making progress! 💪
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfusionDetectionSystem;