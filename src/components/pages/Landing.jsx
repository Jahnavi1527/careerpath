import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Rocket, Target, BookOpen, BarChart3, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const features = [
  { icon: Target, title: "Smart Analysis", desc: "Upload your resume or select skills — we identify your strengths and gaps instantly." },
  { icon: Rocket, title: "Career Roadmaps", desc: "Get a step-by-step learning path tailored to your dream career." },
  { icon: BookOpen, title: "Curated Resources", desc: "Access free and paid learning materials for every skill." },
  { icon: BarChart3, title: "Progress Tracking", desc: "Track your journey with real-time progress indicators and milestones." },
];

const stats = [
  { value: "5+", label: "Career Paths" },
  { value: "25+", label: "Skills Tracked" },
  { value: "100+", label: "Learning Resources" },
  { value: "50+", label: "Quiz Questions" },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold">CareerMap</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button className="rounded-full px-6">Go to Dashboard <ArrowRight className="w-4 h-4 ml-1" /></Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="rounded-full">Log in</Button>
                </Link>
                <Link to="/login">
                  <Button className="rounded-full px-6">Sign up free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-28 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" /> AI-Powered Career Planning
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-6 max-w-4xl mx-auto">
              Your <span className="text-primary">Smart Career</span><br />Roadmap Starts Here
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Analyze your skills, discover gaps, and follow a personalized learning path to land your dream tech career.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/analyze">
                <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                  Start Your Analysis <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/analyze">
                <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg">
                  Explore Careers
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 bg-card/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary">{s.value}</div>
                <div className="text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reverse Career Finder */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              🎯 Know Your Goal? <span className="text-primary">We Build Backward</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tell us your dream salary, company, or role — we'll create the exact roadmap to get there.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Target, title: "Salary Target", desc: "Enter '15 LPA' and get the skills needed", example: '"I want ₹15 LPA job"' },
              { icon: Rocket, title: "Dream Company", desc: "Company-focused career planning", example: '"I want to work at Google"' },
              { icon: CheckCircle2, title: "Specific Role", desc: "Direct role-based roadmaps", example: '"I want to be a Data Scientist"' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground mb-3">{item.desc}</p>
                <div className="text-sm bg-card rounded-lg p-3 border">
                  <code className="text-primary">{item.example}</code>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/reverse-finder">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                Try Reverse Career Finder <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">From skill analysis to job opportunities — we've got your career journey covered.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-card/50 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Input Your Skills", desc: "Select skills you know or upload your resume for automatic extraction." },
              { step: "02", title: "Choose a Career", desc: "Pick your dream career path and we'll analyze the gap." },
              { step: "03", title: "Follow & Grow", desc: "Complete skills, take quizzes, unlock resources, and track your progress." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative p-8 rounded-2xl bg-card border border-border/50"
              >
                <div className="font-heading text-6xl font-bold text-primary/10 absolute top-4 right-6">{item.step}</div>
                <div className="relative">
                  <h3 className="font-heading text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="p-12 md:p-16 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/20"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Ready to Map Your Career?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">Join thousands of learners who are building their future with a clear roadmap.</p>
          <Link to="/analyze">
            <Button size="lg" className="rounded-full px-10 py-6 text-lg shadow-lg shadow-primary/25">
              Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold">CareerMap</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Smart Career Roadmap System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}