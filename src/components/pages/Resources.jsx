import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { backend } from '@/api/backendClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Sparkles, RefreshCw } from 'lucide-react';

export default function Resources() {
  const { careerPath } = useOutletContext();
  const [resources, setResources] = useState({});
  const [loadingSkill, setLoadingSkill] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    backend.get('/resources').then(data => {
      const grouped = {};
      data.forEach(r => {
        if (!grouped[r.skill_name]) grouped[r.skill_name] = [];
        grouped[r.skill_name].push(r);
      });
      setResources(grouped);
      setInitialLoading(false);
    }).catch(() => {
      setResources({});
      setInitialLoading(false);
    });
  }, []);

  if (!careerPath) return null;

  const skills = careerPath.skill_order || careerPath.required_skills || [];

  const generateResources = async (skill) => {
    setLoadingSkill(skill);

    // Mock resources for demo - in a real app, this would be AI-generated
    const mockResources = [
      {
        title: `${skill} - Official Documentation`,
        url: `https://developer.mozilla.org/en-US/docs/Web/${skill.replace(' ', '_')}`,
        platform: 'MDN',
        type: 'free'
      },
      {
        title: `${skill} Tutorial on freeCodeCamp`,
        url: 'https://www.freecodecamp.org/learn/',
        platform: 'freeCodeCamp',
        type: 'free'
      },
      {
        title: `${skill} YouTube Course`,
        url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(skill + ' tutorial'),
        platform: 'YouTube',
        type: 'free'
      },
      {
        title: `${skill} Complete Course on Udemy`,
        url: 'https://www.udemy.com/',
        platform: 'Udemy',
        type: 'paid'
      },
      {
        title: `${skill} Certification on Coursera`,
        url: 'https://www.coursera.org/',
        platform: 'Coursera',
        type: 'paid'
      },
      {
        title: `${skill} Interactive Learning on Codecademy`,
        url: 'https://www.codecademy.com/',
        platform: 'Codecademy',
        type: 'free'
      }
    ];

    // Save to backend
    await backend.post('/resources', mockResources.map(r => ({ ...r, skill_name: skill })));

    setResources(prev => ({ ...prev, [skill]: mockResources.map((r, i) => ({ ...r, id: `mock-${skill}-${i}` })) }));
    setLoadingSkill(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold">Learning Resources</h1>
        <p className="text-muted-foreground mt-1">AI-curated resources for each skill in your roadmap.</p>
      </div>

      {initialLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {skills.map(skill => {
            const skillResources = resources[skill] || [];
            const freeRes = skillResources.filter(r => r.type === 'free');
            const paidRes = skillResources.filter(r => r.type === 'paid');
            const isGenerating = loadingSkill === skill;

            return (
              <Card key={skill} className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-heading text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    {skill}
                    <div className="ml-auto flex items-center gap-2">
                      {skillResources.length > 0 && (
                        <Badge variant="outline" className="text-xs">{skillResources.length} resources</Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateResources(skill)}
                        disabled={isGenerating}
                        className="text-xs h-7 gap-1"
                      >
                        {isGenerating ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        {isGenerating ? 'Generating...' : skillResources.length > 0 ? 'Refresh' : 'Generate with AI'}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {skillResources.length === 0 && !isGenerating ? (
                    <p className="text-sm text-muted-foreground">Click "Generate with AI" to get personalized resources for {skill}.</p>
                  ) : isGenerating ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      AI is finding the best resources for {skill}...
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {freeRes.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Free</p>
                          <div className="space-y-1">
                            {freeRes.map(r => (
                              <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                              >
                                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{r.title}</p>
                                  {r.platform && <p className="text-xs text-muted-foreground">{r.platform}</p>}
                                </div>
                                <Badge className="bg-accent/10 text-accent border-accent/20 border text-xs">Free</Badge>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {paidRes.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Paid</p>
                          <div className="space-y-1">
                            {paidRes.map(r => (
                              <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                              >
                                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-chart-3 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{r.title}</p>
                                  {r.platform && <p className="text-xs text-muted-foreground">{r.platform}</p>}
                                </div>
                                <Badge className="bg-chart-3/10 text-chart-3 border-chart-3/20 border text-xs">Paid</Badge>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}