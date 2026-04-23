import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { backend } from '@/api/backendClient';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import HelpPanel from '@/components/dashboard/HelpPanel';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Roadmap() {
  const { progress, setProgress, careerPath } = useOutletContext();
  const [helpSkill, setHelpSkill] = useState(null);

  if (!progress || !careerPath) return null;

  const skillOrder = careerPath.skill_order || careerPath.required_skills || [];
  const completed = progress.completed_skills || [];

  const isUnlocked = (index) => {
    if (index === 0) return true;
    return completed.includes(skillOrder[index - 1]);
  };

  const toggleSkill = async (skill, index) => {
    if (!isUnlocked(index)) {
      toast.error('Complete the previous skill first!');
      return;
    }

    let newCompleted;
    if (completed.includes(skill)) {
      // Can't uncomplete if next skill is completed
      const nextIdx = index + 1;
      if (nextIdx < skillOrder.length && completed.includes(skillOrder[nextIdx])) {
        toast.error("Can't uncomplete — next skill depends on this one.");
        return;
      }
      newCompleted = completed.filter(s => s !== skill);
    } else {
      newCompleted = [...completed, skill];
    }

    const known = progress.known_skills || [];
    const allKnown = [...new Set([...known, ...newCompleted])];
    const missing = (careerPath.required_skills || []).filter(s => !allKnown.includes(s));
    const pct = Math.round((newCompleted.length / skillOrder.length) * 100);
    const level = pct < 30 ? 'beginner' : pct < 70 ? 'intermediate' : 'advanced';

    await backend.put(`/user-progress/${progress._id}`, {
      completed_skills: newCompleted,
      known_skills: allKnown,
      missing_skills: missing,
      percentage: pct,
      level
    });

    setProgress({
      ...progress,
      completed_skills: newCompleted,
      known_skills: allKnown,
      missing_skills: missing,
      percentage: pct,
      level
    });

    if (!completed.includes(skill)) {
      toast.success(`${skill} completed! 🎉`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold">Skill Roadmap</h1>
        <p className="text-muted-foreground mt-1">Complete skills in order to unlock the next step.</p>
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-border" />

        <div className="space-y-4">
          {skillOrder.map((skill, index) => {
            const isComplete = completed.includes(skill);
            const unlocked = isUnlocked(index);

            return (
              <motion.div
                key={skill}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`relative border-border/50 transition-all ${
                  isComplete ? 'bg-primary/5 border-primary/20' :
                  unlocked ? 'hover:border-primary/30 hover:shadow-md' :
                  'opacity-60'
                }`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    {/* Step indicator */}
                    <div className={`relative z-10 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isComplete ? 'bg-primary text-primary-foreground' :
                      unlocked ? 'bg-card border-2 border-primary text-primary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {isComplete ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : unlocked ? (
                        <span className="font-heading font-bold">{index + 1}</span>
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-semibold">{skill}</h3>
                        {isComplete && <Badge className="bg-primary/10 text-primary border-primary/20 border text-xs">Done</Badge>}
                        {!unlocked && <Badge variant="outline" className="text-xs">Locked</Badge>}
                      </div>
                      <button
                        onClick={() => setHelpSkill(skill)}
                        className="text-xs text-primary hover:underline mt-1"
                      >
                        Learn more about {skill} →
                      </button>
                    </div>

                    {/* Checkbox */}
                    {unlocked && (
                      <Checkbox
                        checked={isComplete}
                        onCheckedChange={() => toggleSkill(skill, index)}
                        className="w-6 h-6"
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {completed.length === skillOrder.length && (
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-6 text-center">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
            <h2 className="font-heading text-xl font-bold">Roadmap Complete! 🎉</h2>
            <p className="text-muted-foreground mt-1">You've mastered all skills for {careerPath.title}!</p>
          </CardContent>
        </Card>
      )}

      <HelpPanel skill={helpSkill} onClose={() => setHelpSkill(null)} />
    </div>
  );
}