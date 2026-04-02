import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, Cpu, Shield, HardDrive, Settings, Info } from 'lucide-react';

interface BIOSProps {
  onBoot: () => void;
}

export const BIOS: React.FC<BIOSProps> = ({ onBoot }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [phase, setPhase] = useState<'init' | 'menu'>('init');
  const [activeTab, setActiveTab] = useState<'main' | 'advanced' | 'boot' | 'exit'>('main');

  useEffect(() => {
    const sequence = [
      "ZET BIOS v1.0.4 (C) 2026 Zet Corp.",
      "CPU: Quantum Core i9-15900K @ 6.2GHz",
      "Memory Test: 65536MB OK",
      "Detecting Storage Devices...",
      "SATA 1: ZetSSD 2TB (SMART OK)",
      "Checking for Boot Media...",
      "Booting from ZetOS Partition...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setLogs(prev => [...prev, sequence[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase('menu'), 1000);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-[#00FF00] font-mono p-8 text-sm z-[9999] overflow-hidden">
      <AnimatePresence>
        {phase === 'init' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {logs.map((log, i) => (
              <div key={i} className="mb-1">{log}</div>
            ))}
            <div className="mt-4 animate-pulse">_</div>
          </motion.div>
        )}

        {phase === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto border border-[#00FF00] h-full flex flex-col"
          >
            <div className="bg-[#00FF00] text-black px-4 py-1 font-bold flex justify-between">
              <span>ZET BIOS SETUP UTILITY</span>
              <span>v1.0.4</span>
            </div>
            
            <div className="flex border-b border-[#00FF00]">
              {['Main', 'Advanced', 'Boot', 'Exit'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase() as any)}
                  className={`px-6 py-2 border-r border-[#00FF00] hover:bg-[#00FF00] hover:text-black transition-colors ${
                    activeTab === tab.toLowerCase() ? 'bg-[#00FF00] text-black' : ''
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 p-6 grid grid-cols-3 gap-8">
              <div className="col-span-2 space-y-4">
                {activeTab === 'main' && (
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-[#00FF00]/30 pb-1">
                      <span>System Time</span>
                      <span>[{new Date().toLocaleTimeString()}]</span>
                    </div>
                    <div className="flex justify-between border-b border-[#00FF00]/30 pb-1">
                      <span>System Date</span>
                      <span>[{new Date().toLocaleDateString()}]</span>
                    </div>
                    <div className="flex justify-between border-b border-[#00FF00]/30 pb-1">
                      <span>BIOS Version</span>
                      <span>Zet-1.0.4-2026</span>
                    </div>
                    <div className="flex justify-between border-b border-[#00FF00]/30 pb-1">
                      <span>Total Memory</span>
                      <span>65536 MB</span>
                    </div>
                  </div>
                )}
                {activeTab === 'advanced' && (
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-[#00FF00]/30 pb-1">
                      <span>CPU Configuration</span>
                      <span>[Enter]</span>
                    </div>
                    <div className="flex justify-between border-b border-[#00FF00]/30 pb-1">
                      <span>SATA Configuration</span>
                      <span>[Enter]</span>
                    </div>
                    <div className="flex justify-between border-b border-[#00FF00]/30 pb-1">
                      <span>USB Configuration</span>
                      <span>[Enter]</span>
                    </div>
                    <div className="flex justify-between border-b border-[#00FF00]/30 pb-1">
                      <span>Overclock Settings</span>
                      <span className="text-red-500">[LOCKED]</span>
                    </div>
                  </div>
                )}
                {activeTab === 'boot' && (
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-[#00FF00]/30 pb-1">
                      <span>Boot Priority #1</span>
                      <span>[ZetSSD 2TB]</span>
                    </div>
                    <div className="flex justify-between border-b border-[#00FF00]/30 pb-1">
                      <span>Boot Priority #2</span>
                      <span>[USB Flash]</span>
                    </div>
                    <div className="flex justify-between border-b border-[#00FF00]/30 pb-1">
                      <span>Fast Boot</span>
                      <span>[Enabled]</span>
                    </div>
                  </div>
                )}
                {activeTab === 'exit' && (
                  <div className="space-y-4">
                    <button onClick={onBoot} className="w-full text-left hover:bg-[#00FF00] hover:text-black px-2">
                      Save Changes and Reset
                    </button>
                    <button onClick={onBoot} className="w-full text-left hover:bg-[#00FF00] hover:text-black px-2">
                      Discard Changes and Exit
                    </button>
                    <button className="w-full text-left hover:bg-[#00FF00] hover:text-black px-2">
                      Load Setup Defaults
                    </button>
                  </div>
                )}
              </div>
              <div className="border-l border-[#00FF00] p-4 text-xs opacity-70">
                <p className="mb-4">Use [Arrow Keys] to navigate, [Enter] to select, [ESC] to go back.</p>
                <p>Zet OS BIOS Utility provides advanced hardware configuration options.</p>
              </div>
            </div>
            
            <div className="bg-[#00FF00] text-black px-4 py-1 text-[10px] flex justify-between">
              <span>[F1] Help | [F5] Defaults | [F10] Save & Exit</span>
              <span>Zet Corp.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const BootAnimation: React.FC<{ style: 'classic' | 'hacker' | 'minimal', onComplete: () => void, onEnterBIOS: () => void }> = ({ style, onComplete, onEnterBIOS }) => {
  const [progress, setProgress] = useState(0);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onEnterBIOS();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    const promptTimeout = setTimeout(() => setShowPrompt(false), 2000);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, style === 'minimal' ? 100 : 500);
          return 100;
        }
        const step = style === 'minimal' ? 50 : Math.random() * 15;
        return prev + step;
      });
    }, style === 'minimal' ? 50 : 200);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
      clearTimeout(promptTimeout);
    };
  }, [onComplete, onEnterBIOS, style]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9998] overflow-hidden">
      {showPrompt && (
        <div className="absolute bottom-8 right-8 text-[#00FF00] font-mono text-xs animate-pulse">
          PRESS [ENTER] TO ENTER BIOS
        </div>
      )}

      {style === 'hacker' && (
        <div className="absolute inset-0 font-mono text-[10px] text-green-500/30 grid grid-cols-8 gap-1 p-2 pointer-events-none">
          {Array.from({ length: 200 }).map((_, i) => (
            <div key={i} className="truncate">{Math.random().toString(36).substring(2, 15)}</div>
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center">
        {style === 'classic' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <div className="w-16 h-16 border-2 border-white/10 border-t-white rounded-full animate-spin" />
            </motion.div>
            <motion.h1 className="text-xl font-light tracking-[0.3em] text-white mb-4">
              LOADING ZET OS
            </motion.h1>
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}

        {style === 'hacker' && (
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-bold mb-8 tracking-widest text-green-500 font-mono"
            >
              ZET OS
            </motion.div>
            <div className="w-64 h-1 bg-green-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] text-green-500 font-mono">
              KERNEL_LOAD: {Math.round(progress)}%
            </div>
          </div>
        )}

        {style === 'minimal' && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-light tracking-[0.8em] text-white"
          >
            ZET OS
          </motion.h1>
        )}
      </div>
    </div>
  );
};
