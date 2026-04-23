import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { backend } from '@/api/backendClient';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, Moon, Sun, Bell, BellOff, LogOut } from 'lucide-react';

export default function TopBar({ onMenuClick, progress, onProgressUpdate }) {
  const { user, logout } = useAuth();

  const isDark = progress?.theme === 'dark';
  const notifEnabled = progress?.notifications_enabled !== false;

  const toggleTheme = async () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    if (progress) {
      await backend.put(`/user-progress/${progress._id}`, { theme: newTheme });
      onProgressUpdate({ ...progress, theme: newTheme });
    }
  };

  const toggleNotifications = async () => {
    if (progress) {
      const newVal = !notifEnabled;
      await backend.put(`/user-progress/${progress._id}`, { notifications_enabled: newVal });
      onProgressUpdate({ ...progress, notifications_enabled: newVal });
    }
  };

  useEffect(() => {
    if (progress?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [progress?.theme]);

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center px-4 md:px-6 gap-4">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="w-5 h-5" />
      </Button>

      <div className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Avatar className="w-9 h-9 bg-primary">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleTheme} className="flex items-center justify-between cursor-pointer">
            <span className="flex items-center gap-2">
              {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              Dark Mode
            </span>
            <Switch checked={isDark} />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleNotifications} className="flex items-center justify-between cursor-pointer">
            <span className="flex items-center gap-2">
              {notifEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              Notifications
            </span>
            <Switch checked={notifEnabled} />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}