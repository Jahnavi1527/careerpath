import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Route, BookOpen, FlaskConical, Briefcase, Bell, Sparkles, LogOut, X, Bot } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Route, label: 'Roadmap', path: '/dashboard/roadmap' },
  { icon: BookOpen, label: 'Resources', path: '/dashboard/resources' },
  { icon: FlaskConical, label: 'Quizzes', path: '/dashboard/quizzes' },
  { icon: Briefcase, label: 'Jobs', path: '/dashboard/jobs' },
  { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
  { icon: Bot, label: 'AI Advisor', path: '/dashboard/advisor' },
];

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const location = useLocation();
  const { logout } = useAuth();

  const content = (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-bold text-sidebar-foreground">CareerMap</span>
        </Link>
        <Button variant="ghost" size="icon" className="md:hidden text-sidebar-foreground" onClick={onCloseMobile}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border fixed inset-y-0 left-0 z-40">
        {content}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onCloseMobile} />
          <aside className="relative w-64 h-full bg-sidebar">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}