import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { DollarSign, Users, TrendingUp, AlertTriangle, CheckCircle2, Info, Star, Target } from 'lucide-react';
import { backend } from '@/api/backendClient';

const CareerRealityCheck = () => {
  const { careerPath } = useOutletContext();
  const [realityData, setRealityData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (careerPath) {
      generateRealityCheck();
    }
  }, [careerPath]);

  const generateRealityCheck = async () => {
    try {
      // Get job data for this career path
      const jobs = await backend.get(`/jobs?career_path=${encodeURIComponent(careerPath.title)}`);

      if (jobs.length === 0) {
        setLoading(false);
        return;
      }

      // Calculate salary ranges
      const salaries = jobs.map(job => job.salary_range).filter(s => s);
      const avgSalary = salaries.length > 0
        ? salaries.reduce((sum, range) => {
            const match = range.match(/\$?(\d+),?(\d+)?/);
            if (match) {
              const min = parseInt(match[1]);
              const max = match[2] ? parseInt(match[2]) : min;
              return sum + (min + max) / 2;
            }
            return sum;
          }, 0) / salaries.length
        : 75000; // Default fallback

      // Calculate competition level based on job count and requirements
      const competitionLevel = jobs.length > 20 ? 'high' : jobs.length > 10 ? 'medium' : 'low';

      // Calculate difficulty based on required skills
      const skillCount = careerPath.skill_order?.length || careerPath.required_skills?.length || 0;
      const difficulty = skillCount > 15 ? 'high' : skillCount > 8 ? 'medium' : 'low';

      // Market demand based on job availability and growth
      const demandLevel = jobs.length > 15 ? 'high' : jobs.length > 5 ? 'medium' : 'low';

      // Generate insights
      const insights = [];

      if (competitionLevel === 'high') {
        insights.push({
          type: 'warning',
          title: 'High Competition',
          description: 'This field has many qualified candidates. Focus on building a strong portfolio and networking.',
          action: 'Consider specializing in a niche area'
        });
      }

      if (difficulty === 'high') {
        insights.push({
          type: 'info',
          title: 'Steep Learning Curve',
          description: 'This career requires extensive skill development. Plan for 1-2 years of dedicated learning.',
          action: 'Break down learning into manageable milestones'
        });
      }

      if (demandLevel === 'high') {
        insights.push({
          type: 'success',
          title: 'Strong Market Demand',
          description: 'Jobs in this field are readily available with good growth prospects.',
          action: 'Great choice! Focus on practical experience'
        });
      }

      // Salary insights
      if (avgSalary > 100000) {
        insights.push({
          type: 'success',
          title: 'High Earning Potential',
          description: `Average salary of $${Math.round(avgSalary).toLocaleString()} shows strong financial prospects.`,
          action: 'Consider long-term career investment'
        });
      } else if (avgSalary < 50000) {
        insights.push({
          type: 'warning',
          title: 'Entry-Level Compensation',
          description: `Starting salaries around $${Math.round(avgSalary).toLocaleString()} may require experience building.`,
          action: 'Look for entry-level positions and internships'
        });
      }

      setRealityData({
        salary: Math.round(avgSalary),
        competitionLevel,
        difficulty,
        demandLevel,
        jobCount: jobs.length,
        insights
      });

    } catch (error) {
      console.error('Error generating reality check:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Info className="w-4 h-4" />;
      default: return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
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

  if (!realityData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Career Reality Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available for reality check.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Career Reality Check: {careerPath.title}
          </CardTitle>
          <p className="text-muted-foreground">
            Honest assessment of your chosen career path based on real market data
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Salary */}
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-800">${realityData.salary.toLocaleString()}</p>
              <p className="text-sm text-green-700">Average Salary</p>
            </div>

            {/* Competition */}
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
              <Users className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <Badge className={`capitalize ${getLevelColor(realityData.competitionLevel)}`}>
                {realityData.competitionLevel}
              </Badge>
              <p className="text-sm text-red-700 mt-2">Competition</p>
            </div>

            {/* Difficulty */}
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <Badge className={`capitalize ${getLevelColor(realityData.difficulty)}`}>
                {realityData.difficulty}
              </Badge>
              <p className="text-sm text-orange-700 mt-2">Difficulty</p>
            </div>

            {/* Demand */}
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <Badge className={`capitalize ${getLevelColor(realityData.demandLevel)}`}>
                {realityData.demandLevel}
              </Badge>
              <p className="text-sm text-blue-700 mt-2">Market Demand</p>
            </div>
          </div>

          {/* Job Count */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Available Positions</span>
              <span className="text-sm text-muted-foreground">{realityData.jobCount} jobs found</span>
            </div>
            <Progress value={Math.min(realityData.jobCount * 5, 100)} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {realityData.insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 rounded-lg border bg-card"
              >
                <div className="flex-shrink-0 mt-1">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                  <Badge variant="outline" className="text-xs">
                    💡 {insight.action}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reality Check Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Remember:</strong> Career success depends on passion, persistence, and continuous learning.
          These metrics are guides, not guarantees. Your unique journey matters most! 🌟
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default CareerRealityCheck;