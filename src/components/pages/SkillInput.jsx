import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { backend } from '@/api/backendClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, Monitor, Server, Layers, BarChart3, Settings, PenLine, Upload, FileText } from 'lucide-react';
import { ALL_SKILLS, CAREER_PATHS } from '@/lib/skillData';
import { toast } from 'sonner';

const iconMap = { Monitor, Server, Layers, BarChart3, Settings };

export default function SkillInput() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: skills, 2: career
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [typedSkills, setTypedSkills] = useState('');
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeLoading(true);
    toast('Resume upload feature coming soon. Please select skills manually for now.');
    setResumeLoading(false);
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  // Parse comma-separated typed skills into a clean array
  const parsedTypedSkills = typedSkills
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const allSkills = [...new Set([...selectedSkills, ...parsedTypedSkills])];
  const canProceed = allSkills.length >= 3;

  const handleAnalyze = async () => {
    if (!selectedCareer) {
      toast.error('Please select a career path');
      return;
    }

    setLoading(true);

    const careerPaths = await backend.get(`/career-paths?title=${encodeURIComponent(selectedCareer.title)}`);
    let careerPathId;

    if (careerPaths.length > 0) {
      careerPathId = careerPaths[0]._id;
    } else {
      const created = await backend.post('/career-paths', {
        title: selectedCareer.title,
        description: selectedCareer.description,
        required_skills: selectedCareer.required_skills,
        skill_order: selectedCareer.skill_order,
        icon: selectedCareer.icon,
        created_by: user.email,
      });
      careerPathId = created._id;
    }

    const knownSkills = allSkills.filter(s => selectedCareer.required_skills.includes(s));
    const missingSkills = selectedCareer.required_skills.filter(s => !allSkills.includes(s));
    const percentage = Math.round((knownSkills.length / selectedCareer.required_skills.length) * 100);
    const level = percentage < 30 ? 'beginner' : percentage < 70 ? 'intermediate' : 'advanced';

    const existing = await backend.get(`/user-progress?created_by=${encodeURIComponent(user.email)}`);

    if (existing.length > 0) {
      await backend.put(`/user-progress/${existing[0]._id}`, {
        created_by: user.email,
        career_path_id: careerPathId,
        known_skills: knownSkills,
        missing_skills: missingSkills,
        completed_skills: knownSkills,
        level,
        percentage,
      });
    } else {
      await backend.post('/user-progress', {
        created_by: user.email,
        career_path_id: careerPathId,
        known_skills: knownSkills,
        missing_skills: missingSkills,
        completed_skills: knownSkills,
        level,
        percentage,
      });
    }

    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold">CareerMap</span>
          </button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>1</div>
            <div className="w-8 h-0.5 bg-border" />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>2</div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="text-center mb-10">
                <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Tell Us About Your Skills</h1>
                <p className="text-muted-foreground text-lg">Select skills from the list below, or type them separated by commas.</p>
              </div>

              {/* Skill Grid */}
              <Card className="mb-8 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-heading">Select Your Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SKILLS.map(skill => (
                      <Badge
                        key={skill}
                        variant={selectedSkills.includes(skill) ? "default" : "outline"}
                        className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                          selectedSkills.includes(skill)
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'hover:bg-primary/10 hover:border-primary/30'
                        }`}
                        onClick={() => toggleSkill(skill)}
                      >
                        {selectedSkills.includes(skill) && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Resume Upload */}
              <Card className="mb-8 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Upload className="w-5 h-5" /> Upload Resume (PDF)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={resumeLoading}
                    className="w-full h-20 border-dashed flex flex-col gap-1 text-muted-foreground hover:text-foreground hover:border-primary/40"
                  >
                    {resumeLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <span className="text-sm">Extracting skills with AI...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-6 h-6" />
                        <span className="text-sm">Click to upload your resume — AI will extract your skills</span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Typed Skills */}
              <Card className="mb-8 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <PenLine className="w-5 h-5" /> Or Type Your Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="e.g. Python, Machine Learning, SQL, Git, Docker..."
                    value={typedSkills}
                    onChange={e => setTypedSkills(e.target.value)}
                    className="h-11 text-sm"
                  />
                  {parsedTypedSkills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-xs text-muted-foreground self-center">Typed:</span>
                      {parsedTypedSkills.map(s => (
                        <Badge key={s} className="bg-accent/10 text-accent border border-accent/20 text-xs">{s}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Validation / Next */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  {canProceed ? (
                    <span className="text-primary flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> {allSkills.length} skills selected</span>
                  ) : (
                    <span className="text-destructive flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Select at least 3 skills</span>
                  )}
                </div>
                <Button onClick={() => setStep(2)} disabled={!canProceed} size="lg" className="rounded-full px-8">
                  Choose Career <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-10">
                <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Choose Your Career Path</h1>
                <p className="text-muted-foreground text-lg">We'll create a personalized roadmap based on your selection.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {CAREER_PATHS.map(career => {
                  const Icon = iconMap[career.icon] || Monitor;
                  const matched = career.required_skills.filter(s => allSkills.includes(s)).length;
                  const total = career.required_skills.length;
                  const pct = Math.round((matched / total) * 100);
                  const isSelected = selectedCareer?.title === career.title;

                  return (
                    <Card
                      key={career.title}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'ring-2 ring-primary border-primary shadow-lg shadow-primary/10'
                          : 'border-border/50 hover:border-primary/30 hover:shadow-md'
                      }`}
                      onClick={() => setSelectedCareer(career)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                        </div>
                        <h3 className="font-heading font-semibold text-lg mb-1">{career.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{career.description}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">{matched}/{total}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{pct}% skill match</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => setStep(1)} className="rounded-full px-6">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={handleAnalyze} disabled={!selectedCareer || loading} size="lg" className="rounded-full px-8">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  {loading ? 'Analyzing...' : 'Generate My Roadmap'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}