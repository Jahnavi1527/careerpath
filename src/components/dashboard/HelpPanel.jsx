import React from 'react';
import { X, HelpCircle, Target, MapPin } from 'lucide-react';
import { SKILL_HELP } from '@/lib/skillData';
import { motion, AnimatePresence } from 'framer-motion';

export default function HelpPanel({ skill, onClose }) {
  const help = SKILL_HELP[skill];

  return (
    <AnimatePresence>
      {skill && help && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 overflow-y-auto shadow-2xl"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold">{skill}</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  <h3 className="font-heading font-semibold text-sm">What is {skill}?</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{help.what}</p>
              </div>

              <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-accent" />
                  <h3 className="font-heading font-semibold text-sm">Why learn it?</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{help.why}</p>
              </div>

              <div className="p-4 rounded-xl bg-chart-3/5 border border-chart-3/10">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-chart-3" />
                  <h3 className="font-heading font-semibold text-sm">Where is it used?</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{help.where}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}