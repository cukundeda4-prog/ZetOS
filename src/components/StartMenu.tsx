import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Power, Settings, User, LogOut, RefreshCw } from 'lucide-react';
import { AppId } from '@/src/types';
import { DEFAULT_APP_ICONS } from '@/src/constants';

interface StartMenuProps {
  username: string;
  onOpenApp: (appId: AppId) => void;
  onPowerOff: () => void;
  onRestart: () => void;
  onLogout: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ username, onOpenApp, onPowerOff, onRestart, onLogout }) => {
  const [search, setSearch] = useState('');

  const apps: { id: AppId; name: string }[] = [
    { id: 'terminal', name: 'Terminal' },
    { id: 'notepad', name: 'Notepad' },
    { id: 'browser', name: 'Browser' },
    { id: 'appstore', name: 'App Store' },
    { id: 'settings', name: 'Settings' },
    { id: 'assistant', name: 'Assistant' },
    { id: 'files', name: 'Files' },
    { id: 'community', name: 'Community' },
  ];

  const filteredApps = apps.filter(app => app.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="absolute bottom-16 left-4 w-96 glass-dark rounded-2xl overflow-hidden z-[1000] p-6"
    >
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
        <input
          autoFocus
          type="text"
          placeholder="Search apps, files, settings..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {filteredApps.map((app) => {
          const Icon = DEFAULT_APP_ICONS[app.id];
          return (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all group-active:scale-90">
                <Icon size={24} className="text-white/80" />
              </div>
              <span className="text-[10px] text-white/60 group-hover:text-white transition-colors truncate w-full text-center">
                {app.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{username}</span>
            <span className="text-[10px] text-white/40">Zet OS Beta</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onLogout} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white" title="Logout">
            <LogOut size={18} />
          </button>
          <button onClick={onRestart} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white" title="Restart">
            <RefreshCw size={18} />
          </button>
          <button onClick={onPowerOff} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-500" title="Power Off">
            <Power size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
