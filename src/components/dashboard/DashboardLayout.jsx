import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { backend } from '@/api/backendClient';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [progress, setProgress] = useState(null);
  const [careerPath, setCareerPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    async function load() {
      if (!user?.email) {
        setLoading(false);
        navigate('/');
        return;
      }

      const progList = await backend.get(`/user-progress?created_by=${encodeURIComponent(user.email)}`);
      if (progList.length === 0) {
        navigate('/analyze');
        return;
      }
      const prog = progList[0];
      setProgress(prog);

      if (prog.career_path_id) {
        try {
          const path = await backend.get(`/career-paths/${prog.career_path_id}`);
          setCareerPath(path);
        } catch (error) {
          console.warn('Career path lookup failed', error);
        }
      }
      setLoading(false);
    }
    load();
  }, [navigate, user]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <TopBar
          onMenuClick={() => setMobileOpen(true)}
          progress={progress}
          onProgressUpdate={setProgress}
        />
        <main className="flex-1 p-4 md:p-6">
          <Outlet context={{ progress, setProgress, careerPath }} />
        </main>
      </div>
    </div>
  );
}