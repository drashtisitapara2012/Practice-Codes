'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/app/lib/store';
import { Moon, Sun, Monitor } from 'lucide-react';

export default function ThemeToggle() {
  const { theme: nextTheme, setTheme: setNextTheme, resolvedTheme } = useTheme();
  const { theme: storeTheme, setTheme: setStoreTheme } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Sync Zustand store with next-themes on mount or change
  useEffect(() => {
    setMounted(true);
    if (nextTheme) {
      setStoreTheme(nextTheme as 'light' | 'dark' | 'system');
    }
  }, [nextTheme, setStoreTheme]);

  const toggleTheme = () => {
    let newTheme: 'light' | 'dark' | 'system';
    if (storeTheme === 'light') {
      newTheme = 'dark';
    } else if (storeTheme === 'dark') {
      newTheme = 'system';
    } else {
      newTheme = 'light';
    }

    setStoreTheme(newTheme);
    setNextTheme(newTheme);
  };

  const getThemeIcon = () => {
    if (!mounted) return <Monitor className="w-5 h-5" />;

    if (resolvedTheme === 'light') {
      return <Sun className="w-5 h-5 text-amber-500" />;
    } else if (resolvedTheme === 'dark') {
      return <Moon className="w-5 h-5 text-indigo-400" />;
    }
    return <Monitor className="w-5 h-5" />;
  };

  const getThemeLabel = () => {
    if (!mounted) return 'Loading...';
    return storeTheme.charAt(0).toUpperCase() + storeTheme.slice(1);
  };

  return (
    <button
      onClick={toggleTheme}
      disabled={!mounted}
      className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm border border-gray-100 dark:border-gray-700 group"
      title={`Current theme: ${getThemeLabel()}. Click to cycle.`}
    >
      <div className="transition-transform duration-500 group-hover:rotate-12">
        {getThemeIcon()}
      </div>
      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 min-w-[50px] text-left">
        {getThemeLabel()}
      </span>
    </button>
  );
}
