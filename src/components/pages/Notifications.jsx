import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, BookOpen, FlaskConical, Target, Sparkles, BellOff } from 'lucide-react';

export default function Notifications() {
  const { progress, careerPath } = useOutletContext();

  if (!progress || !careerPath) return null;

  const completed = progress.completed_skills || [];
  const skills = careerPath.skill_order || careerPath.required_skills || [];
  const missing = progress.missing_skills || [];
  const notifEnabled = progress.notifications_enabled !== false;

  // Generate contextual notifications
  const notifications = [];

  if (!notifEnabled) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold">Notifications</h1>
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <BellOff className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h2 className="font-heading text-lg font-semibold mb-1">Notifications Disabled</h2>
            <p className="text-muted-foreground text-sm">Enable notifications in your profile settings to receive reminders.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Find next skill to learn
  const nextSkill = skills.find(s => !completed.includes(s));

  if (nextSkill) {
    notifications.push({
      icon: Target,
      color: 'text-primary',
      bg: 'bg-primary/10',
      title: `Continue Learning: ${nextSkill}`,
      desc: `Your next skill in the roadmap is ${nextSkill}. Start learning today!`,
      time: 'Now',
    });
  }

  if (missing.length > 0) {
    notifications.push({
      icon: BookOpen,
      color: 'text-accent',
      bg: 'bg-accent/10',
      title: `${missing.length} skills remaining`,
      desc: `You have ${missing.length} skills left to complete your ${careerPath.title} roadmap.`,
      time: 'Today',
    });
  }

  if (completed.length > 0) {
    const lastCompleted = completed[completed.length - 1];
    notifications.push({
      icon: FlaskConical,
      color: 'text-chart-3',
      bg: 'bg-chart-3/10',
      title: `Quiz Available: ${lastCompleted}`,
      desc: `You completed ${lastCompleted}! Take the quiz to test your knowledge.`,
      time: 'Recent',
    });
  }

  notifications.push({
    icon: Sparkles,
    color: 'text-primary',
    bg: 'bg-primary/10',
    title: 'Daily Learning Reminder',
    desc: 'Consistency is key! Spend at least 30 minutes learning today.',
    time: 'Daily',
  });

  if (progress.percentage >= 50) {
    notifications.push({
      icon: Bell,
      color: 'text-accent',
      bg: 'bg-accent/10',
      title: 'Halfway There! 🎉',
      desc: `You're ${progress.percentage}% done with your roadmap. Keep going!`,
      time: 'Milestone',
    });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground mt-1">Your learning reminders and updates.</p>
      </div>

      <div className="space-y-3">
        {notifications.map((notif, i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="p-4 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl ${notif.bg} flex items-center justify-center flex-shrink-0`}>
                <notif.icon className={`w-5 h-5 ${notif.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm">{notif.title}</h3>
                  <Badge variant="outline" className="text-xs ml-auto">{notif.time}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{notif.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}