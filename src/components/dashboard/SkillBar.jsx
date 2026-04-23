import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export default function SkillBar({ name, known, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
    >
      {known ? (
        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
      ) : (
        <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      )}
      <span className={`text-sm font-medium flex-1 ${known ? 'text-foreground' : 'text-muted-foreground'}`}>
        {name}
      </span>
      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${known ? 'bg-primary' : 'bg-muted-foreground/20'}`}
          style={{ width: known ? '100%' : '0%' }}
        />
      </div>
    </button>
  );
}