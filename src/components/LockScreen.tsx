import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, Lock } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface LockScreenProps {
  wallpaper: string;
  clockFont: string;
  onUnlock: () => void;
  password?: string;
  isPasswordEnabled: boolean;
}

export const LockScreen: React.FC<LockScreenProps> = ({ 
  wallpaper, 
  clockFont, 
  onUnlock, 
  password, 
  isPasswordEnabled 
}) => {
  const [time, setTime] = useState(new Date());
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlockClick = () => {
    if (isPasswordEnabled && password) {
      setShowPasswordInput(true);
    } else {
      onUnlock();
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === password) {
      onUnlock();
    } else {
      setError(true);
      setInputPassword('');
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.5, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[8000] bg-cover bg-center flex flex-col items-center justify-between py-20 overflow-hidden"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px]" />

      <div className="relative z-10 flex flex-col items-center text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("text-8xl font-bold tracking-tighter drop-shadow-2xl", clockFont)}
        >
          {time.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-medium mt-2 drop-shadow-lg"
        >
          {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-xs flex flex-col items-center gap-8">
        <AnimatePresence mode="wait">
          {!showPasswordInput ? (
            <motion.button
              key="unlock-btn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={handleUnlockClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-4 text-white/80 hover:text-white transition-all group"
            >
              <div className="w-16 h-16 rounded-full glass flex items-center justify-center group-hover:bg-white/20 shadow-2xl">
                <Lock size={24} />
              </div>
              <div className="flex flex-col items-center animate-bounce">
                <ChevronUp size={24} />
                <span className="text-xs font-bold tracking-widest uppercase">Click to Unlock</span>
              </div>
            </motion.button>
          ) : (
            <motion.form
              key="password-form"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onSubmit={handlePasswordSubmit}
              className="w-full flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-2">
                <Lock size={32} />
              </div>
              <div className="w-full space-y-2">
                <input
                  autoFocus
                  type="password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Enter Password"
                  className={cn(
                    "w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-center text-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all backdrop-blur-xl",
                    error && "border-red-500 animate-shake"
                  )}
                />
                {error && <p className="text-red-500 text-xs text-center font-bold">Incorrect Password</p>}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordInput(false)}
                  className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-blue-400 hover:text-blue-300 text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Unlock
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 text-white/20 text-[10px] uppercase font-bold tracking-[0.3em]">
        Zeta OS Stable 1.0
      </div>
    </motion.div>
  );
};
