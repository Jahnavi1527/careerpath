import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';

import Landing from './components/pages/Landing';
import SkillInput from './components/pages/SkillInput';
import ReverseCareerFinder from './components/pages/ReverseCareerFinder';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Dashboard from './components/pages/Dashboard';
import Roadmap from './components/pages/Roadmap';
import Resources from './components/pages/Resources';
import Quizzes from './components/pages/Quizzes';
import Jobs from './components/pages/jobs';
import Notifications from './components/pages/Notifications';
import Advisor from './components/pages/Advisor';
import Login from './components/pages/Login';

const AuthenticatedApp = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/analyze" element={<SkillInput />} />
      <Route path="/reverse-finder" element={<ReverseCareerFinder />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/roadmap" element={<Roadmap />} />
        <Route path="/dashboard/resources" element={<Resources />} />
        <Route path="/dashboard/quizzes" element={<Quizzes />} />
        <Route path="/dashboard/jobs" element={<Jobs />} />
        <Route path="/dashboard/notifications" element={<Notifications />} />
        <Route path="/dashboard/advisor" element={<Advisor />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App