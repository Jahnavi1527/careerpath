import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Advisor() {
  const { progress, careerPath } = useOutletContext();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm your AI Career Advisor 🎯\n\nI can help you with:\n- **What to learn next** based on your current progress\n- **Career advice** for ${careerPath?.title || 'your chosen path'}\n- **Skill recommendations** and study tips\n- **Interview preparation** guidance\n\nWhat would you like to know?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simple mock responses based on keywords
    const userInput = input.trim().toLowerCase();
    let response = '';

    if (userInput.includes('next') || userInput.includes('learn')) {
      const missing = progress?.missing_skills || [];
      if (missing.length > 0) {
        response = `Great question! 🎯\n\nBased on your progress, here are the **next skills** you should focus on:\n\n${missing.slice(0, 3).map(skill => `• **${skill}**`).join('\n')}\n\nStart with online tutorials on YouTube or freeCodeCamp. Practice daily for 1-2 hours!`;
      } else {
        response = `Excellent! 🎉 You've completed all the required skills for ${careerPath?.title || 'your career path'}!\n\nConsider:\n• Building real projects to showcase your skills\n• Contributing to open source\n• Preparing for interviews\n• Exploring advanced topics`;
      }
    } else if (userInput.includes('interview') || userInput.includes('job')) {
      response = `Smart focus on interviews! 💼\n\n**Key preparation steps:**\n\n1. **Technical Skills**: Practice coding problems on LeetCode/HackerRank\n2. **System Design**: Study common patterns for your role\n3. **Behavioral Questions**: Prepare STAR method answers\n4. **Projects**: Have 2-3 strong projects to discuss\n\n**Resources:**\n• Pramp for mock interviews\n• Interviewing.io for anonymous practice\n• Company-specific LeetCode questions`;
    } else if (userInput.includes('project') || userInput.includes('build')) {
      response = `Building projects is crucial! 🚀\n\n**Project Ideas for ${careerPath?.title || 'your field'}:**\n\n• **Portfolio Website**: Showcase your skills\n• **Full-Stack App**: Combine frontend + backend\n• **API Integration**: Work with real APIs\n• **Open Source**: Contribute to existing projects\n\nStart small, focus on clean code and documentation!`;
    } else {
      response = `Thanks for your question! 🤔\n\nI'm here to help with:\n• **Learning recommendations** for your career path\n• **Skill development** strategies\n• **Interview preparation** tips\n• **Project ideas** and guidance\n\nCould you be more specific about what you'd like to know? For example:\n- "What should I learn next?"\n- "How do I prepare for interviews?"\n- "What projects should I build?"`;
    }

    // Simulate typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = [
    "What should I learn next?",
    "How do I prepare for interviews?",
    "Give me a study plan for this week",
    "What jobs can I apply for now?"
  ];

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      <div className="mb-4">
        <h1 className="font-heading text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" /> AI Career Advisor
        </h1>
        <p className="text-muted-foreground mt-1">Your personal AI-powered career coach.</p>
      </div>

      {/* Chat messages */}
      <Card className="flex-1 border-border/50 overflow-hidden flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </CardContent>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => { setInput(s); }}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/20 text-primary hover:bg-primary/5 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border/50 flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your career advisor..."
            className="flex-1"
            disabled={loading}
          />
          <Button onClick={sendMessage} disabled={!input.trim() || loading} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}