import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { backend } from '@/api/backendClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, GraduationCap, MapPin, ExternalLink, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Jobs() {
  const { careerPath } = useOutletContext();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backend.get(`/jobs?career_path=${encodeURIComponent(careerPath?.title || '')}`).then(data => {
      setJobs(data);
      setLoading(false);
    }).catch(() => {
      setJobs([]);
      setLoading(false);
    });
  }, [careerPath]);

  if (!careerPath) return null;

  const filtered = jobs.filter(j => j.career_path === careerPath.title);
  const jobList = filtered.filter(j => j.type === 'job');
  const internships = filtered.filter(j => j.type === 'internship');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold">Jobs & Internships</h1>
        <p className="text-muted-foreground mt-1">Opportunities matching your {careerPath.title} career path.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h2 className="font-heading text-lg font-semibold mb-1">No opportunities yet</h2>
            <p className="text-muted-foreground text-sm">We're adding new jobs and internships regularly. Check back soon!</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="jobs">
          <TabsList>
            <TabsTrigger value="jobs" className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" /> Jobs ({jobList.length})
            </TabsTrigger>
            <TabsTrigger value="internships" className="flex items-center gap-1">
              <GraduationCap className="w-4 h-4" /> Internships ({internships.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="mt-4 space-y-3">
            {jobList.map(job => (
              <JobCard key={job._id} job={job} />
            ))}
            {jobList.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No jobs listed yet.</p>}
          </TabsContent>
          <TabsContent value="internships" className="mt-4 space-y-3">
            {internships.map(job => (
              <JobCard key={job._id} job={job} />
            ))}
            {internships.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No internships listed yet.</p>}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function JobCard({ job }) {
  return (
    <Card className="border-border/50 hover:shadow-md transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-lg">{job.title}</h3>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              {job.company && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" /> {job.company}
                </span>
              )}
              {job.location && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {job.location}
                </span>
              )}
            </div>
            {job.description && <p className="text-sm text-muted-foreground mt-2">{job.description}</p>}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={job.type === 'internship' ? 'bg-accent/10 text-accent border-accent/20 border' : 'bg-primary/10 text-primary border-primary/20 border'}>
              {job.type === 'internship' ? 'Internship' : 'Job'}
            </Badge>
            {job.url && (
              <a href={job.url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="text-xs">
                  Apply <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}