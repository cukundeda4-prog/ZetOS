import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Battery, Wifi, Volume2, Search, Calendar, Clock, LayoutGrid, ShoppingBag, Power } from 'lucide-react';
import { WindowState, OSConfig, AppId } from './types';
import { DEFAULT_APP_ICONS } from './constants';
import { Window } from './components/Window';
import { BootAnimation, BIOS } from './components/BootSequence';
import { SetupWizard } from './components/SetupWizard';
import { LockScreen } from './components/LockScreen';
import { Terminal, Notepad, Browser, Assistant, AppStore, CommunityApp } from './components/Apps';
import { StartMenu } from './components/StartMenu';
import { SettingsApp } from './components/SettingsApp';
import { WidgetRenderer } from './components/Widgets';
import { cn } from './lib/utils';

const STORAGE_KEY = 'zet_os_config';
const ICONS_STORAGE_KEY = 'zet_os_desktop_icons';

export default function App() {
  const [osState, setOsState] = useState<'notice' | 'bios' | 'boot' | 'lock' | 'setup' | 'desktop' | 'off'>('notice');
  const [config, setConfig] = useState<OSConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load config", e);
      }
    }
    return {
      bootStyle: 'classic',
      wallpaper: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=2070',
      lockWallpaper: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=2070',
      lockClockFont: 'font-sans',
      theme: 'dark',
      username: 'User',
      isPasswordEnabled: false,
      isSetupComplete: false,
      appIcons: {
        terminal: 'Terminal',
        notepad: 'FileText',
        appstore: 'ShoppingBag',
        browser: 'Globe',
        settings: 'Settings',
        assistant: 'MessageSquare',
        files: 'Folder',
        community: 'Users',
      },
      dockSize: 'medium',
      dockWidth: 80,
      dockStyle: 'glass',
      dockAutoHide: false,
      dockColor: '#000000',
      dockIconsVisible: {
        terminal: true,
        notepad: true,
        appstore: true,
        browser: true,
        settings: true,
        assistant: true,
        files: true,
        community: true,
      },
      iconShape: 'rounded',
      iconColor: '#3b82f6',
      iconTranslucent: false,
      showDesktopIcons: true,
      statusBarStyle: 'glass',
      statusBarColor: '#000000',
      widgets: [
        { id: 'clock', enabled: true, position: { x: 0, y: 0 }, size: 'medium' },
        { id: 'weather', enabled: true, position: { x: 0, y: 0 }, size: 'small' },
        { id: 'calendar', enabled: false, position: { x: 0, y: 0 }, size: 'small' },
        { id: 'stats', enabled: false, position: { x: 0, y: 0 }, size: 'medium' },
      ],
    };
  });

  const [windows, setWindows] = useState<WindowState[]>([]);
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean } | null>(null);
  const [desktopIcons, setDesktopIcons] = useState<{ id: string; appId: AppId; label: string }[]>(() => {
    const saved = localStorage.getItem(ICONS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load desktop icons", e);
      }
    }
    return [
      { id: '1', appId: 'files', label: 'My Files' },
      { id: '2', appId: 'terminal', label: 'Terminal' },
      { id: '3', appId: 'notepad', label: 'Notes' },
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem(ICONS_STORAGE_KEY, JSON.stringify(desktopIcons));
  }, [desktopIcons]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = useCallback((appId: AppId) => {
    const existing = windows.find(w => w.appId === appId);
    if (existing) {
      if (existing.isMinimized) {
        setWindows(prev => prev.map(w => w.appId === appId ? { ...w, isMinimized: false } : w));
      }
      setFocusedWindowId(existing.id);
      setIsStartMenuOpen(false);
      return;
    }

    const newWindow: WindowState = {
      id: Math.random().toString(36).substr(2, 9),
      appId,
      title: appId.charAt(0).toUpperCase() + appId.slice(1),
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 100 + windows.length,
      position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
      size: { width: 800, height: 500 },
    };

    setWindows(prev => [...prev, newWindow]);
    setFocusedWindowId(newWindow.id);
    setIsStartMenuOpen(false);
  }, [windows]);

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (focusedWindowId === id) setFocusedWindowId(null);
  };

  const focusWindow = (id: string) => {
    setFocusedWindowId(id);
    setWindows(prev => {
      const maxZ = Math.max(100, ...prev.map(w => w.zIndex));
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
    });
  };

  const toggleMaximize = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const toggleMinimize = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
  };

  const addDesktopIcon = (appId: AppId) => {
    const newIcon = {
      id: Math.random().toString(36).substr(2, 9),
      appId,
      label: appId.charAt(0).toUpperCase() + appId.slice(1),
    };
    setDesktopIcons(prev => [...prev, newIcon]);
    setContextMenu(null);
  };

  const handleEnterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
    setOsState('boot');
  };

  if (osState === 'notice') {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-center p-8 z-[10000]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <LayoutGrid size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Welcome to Zeta OS</h1>
          <p className="text-white/60 mb-12 leading-relaxed">
            For the most immersive experience, we recommend using fullscreen mode.
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={handleEnterFullscreen}
              className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-white/90 transition-all active:scale-95"
            >
              Enter Fullscreen
            </button>
            <button
              onClick={() => setOsState('boot')}
              className="w-full py-4 bg-white/5 text-white/60 rounded-2xl font-bold hover:bg-white/10 transition-all active:scale-95"
            >
              Continue in Window
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (osState === 'off') {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <button
          onClick={() => setOsState('bios')}
          className="w-16 h-16 rounded-full border-2 border-white/20 hover:border-white/50 flex items-center justify-center transition-all group"
        >
          <Power className="text-white/20 group-hover:text-white/50" />
        </button>
      </div>
    );
  }

  if (osState === 'bios') return <BIOS onBoot={() => setOsState('boot')} />;
  if (osState === 'boot') return <BootAnimation style={config.bootStyle} onComplete={() => setOsState(config.isSetupComplete ? 'lock' : 'setup')} onEnterBIOS={() => setOsState('bios')} />;
  if (osState === 'lock') return (
    <LockScreen 
      wallpaper={config.lockWallpaper} 
      clockFont={config.lockClockFont} 
      onUnlock={() => setOsState('desktop')} 
      password={config.password}
      isPasswordEnabled={config.isPasswordEnabled}
    />
  );
  if (osState === 'setup') return (
    <SetupWizard
      onComplete={(data) => {
        setConfig(prev => ({ ...prev, ...data, isSetupComplete: true }));
        setOsState('desktop');
      }}
    />
  );

  return (
    <div
      className="fixed inset-0 bg-cover bg-center transition-all duration-1000 overflow-hidden"
      style={{ backgroundImage: `url(${config.wallpaper})` }}
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenu(null)}
    >
      {/* Top Menu Bar */}
      <div className={cn(
        "h-8 w-full flex items-center justify-between px-4 z-[2000] text-xs font-medium transition-all",
        config.statusBarStyle === 'glass' && "glass",
        config.statusBarStyle === 'solid' && "border-b border-white/5",
        config.statusBarStyle === 'minimal' && "bg-transparent border-b border-white/5"
      )}
      style={config.statusBarStyle === 'solid' ? { backgroundColor: config.statusBarColor } : {}}
      >
        <div className="flex items-center gap-4">
          <button onClick={() => setIsStartMenuOpen(!isStartMenuOpen)} className="hover:text-white/70 font-bold">Zeta OS</button>
          <div className="flex gap-4 text-white/60">
            <button className="hover:text-white">File</button>
            <button className="hover:text-white">Edit</button>
            <button className="hover:text-white">View</button>
            <button className="hover:text-white">Go</button>
            <button className="hover:text-white">Window</button>
            <button className="hover:text-white">Help</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white/80">
            <Wifi size={14} />
            <Volume2 size={14} />
            <Battery size={14} />
          </div>
          <div className="flex items-center gap-2">
            <span>{time.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            <span>{time.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Desktop Icons */}
      {config.showDesktopIcons && (
        <div className="p-6 grid grid-flow-col grid-rows-6 gap-6 w-fit">
          {desktopIcons.map((icon) => (
            <DesktopIcon
              key={icon.id}
              id={icon.appId}
              label={icon.label}
              onClick={() => openApp(icon.appId)}
              shape={config.iconShape}
              color={config.iconColor}
              isTranslucent={config.iconTranslucent}
            />
          ))}
        </div>
      )}

      {/* Widgets Layer */}
      <div className="absolute top-12 right-6 flex flex-col gap-6 pointer-events-none z-[1]">
        {config.widgets.filter(w => w.enabled).map(widget => (
          <div key={widget.id} className="pointer-events-auto">
            <WidgetRenderer id={widget.id} size={widget.size} />
          </div>
        ))}
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu?.visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed glass-dark rounded-lg py-1 min-w-[160px] z-[5000] border border-white/10 shadow-2xl"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              onClick={() => setConfig(prev => ({ ...prev, showDesktopIcons: !prev.showDesktopIcons }))}
              className="w-full text-left px-4 py-2 hover:bg-white/10 text-xs"
            >
              {config.showDesktopIcons ? 'Hide Desktop Icons' : 'Show Desktop Icons'}
            </button>
            <div className="h-px bg-white/5 my-1" />
            <div className="px-4 py-1 text-[10px] text-white/40 uppercase font-bold tracking-wider">Add Icon</div>
            <button onClick={() => addDesktopIcon('terminal')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-xs">Terminal</button>
            <button onClick={() => addDesktopIcon('notepad')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-xs">Notes</button>
            <button onClick={() => addDesktopIcon('browser')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-xs">Browser</button>
            <div className="h-px bg-white/5 my-1" />
            <button onClick={() => openApp('settings')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-xs">Personalize</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Windows Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {windows.map((win) => (
            <div key={win.id} className="pointer-events-auto">
              <Window
                title={win.title}
                icon={React.createElement(DEFAULT_APP_ICONS[win.appId], { size: 16 })}
                isOpen={win.isOpen}
                isMinimized={win.isMinimized}
                isMaximized={win.isMaximized}
                onClose={() => closeWindow(win.id)}
                onMinimize={() => toggleMinimize(win.id)}
                onMaximize={() => toggleMaximize(win.id)}
                onFocus={() => focusWindow(win.id)}
                zIndex={win.zIndex}
              >
                {win.appId === 'terminal' && <Terminal />}
                {win.appId === 'notepad' && <Notepad />}
                {win.appId === 'browser' && <Browser />}
                {win.appId === 'assistant' && <Assistant />}
                {win.appId === 'appstore' && <AppStore />}
                {win.appId === 'community' && <CommunityApp />}
                {win.appId === 'settings' && (
                  <SettingsApp
                    config={config}
                    onUpdateConfig={(updates) => setConfig(prev => ({ ...prev, ...updates }))}
                  />
                )}
                {win.appId === 'files' && (
                  <div className="h-full p-8 grid grid-cols-4 gap-8 content-start">
                    <DesktopIcon id="files" label="Documents" onClick={() => {}} />
                    <DesktopIcon id="files" label="Pictures" onClick={() => {}} />
                    <DesktopIcon id="files" label="Downloads" onClick={() => {}} />
                  </div>
                )}
              </Window>
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Start Menu */}
      <AnimatePresence>
        {isStartMenuOpen && (
          <StartMenu
            username={config.username}
            onOpenApp={openApp}
            onPowerOff={() => setOsState('off')}
            onRestart={() => setOsState('bios')}
            onLogout={() => setOsState('lock')}
          />
        )}
      </AnimatePresence>

      {/* Dock */}
      <motion.div
        initial={false}
        animate={{
          y: config.dockAutoHide ? 60 : 0,
          opacity: config.dockAutoHide ? 0 : 1,
        }}
        whileHover={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={cn(
          "absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center px-2 gap-2 z-[2000] transition-all",
          config.dockStyle === 'glass' && "glass rounded-2xl",
          config.dockStyle === 'solid' && "border border-white/10 rounded-xl",
          config.dockStyle === 'translucent' && "bg-white/5 backdrop-blur-md rounded-3xl",
          config.dockSize === 'small' && "h-10",
          config.dockSize === 'medium' && "h-14",
          config.dockSize === 'large' && "h-20"
        )}
        style={{
          backgroundColor: config.dockStyle === 'solid' ? config.dockColor : undefined,
          width: `${config.dockWidth}%`,
          maxWidth: '95vw'
        }}
      >
        <div className="flex items-center justify-center w-full gap-2 overflow-x-auto no-scrollbar">
          {config.dockIconsVisible.terminal && <DockIcon appId="terminal" onClick={() => openApp('terminal')} isOpen={windows.some(w => w.appId === 'terminal')} size={config.dockSize} />}
          {config.dockIconsVisible.browser && <DockIcon appId="browser" onClick={() => openApp('browser')} isOpen={windows.some(w => w.appId === 'browser')} size={config.dockSize} />}
          {config.dockIconsVisible.notepad && <DockIcon appId="notepad" onClick={() => openApp('notepad')} isOpen={windows.some(w => w.appId === 'notepad')} size={config.dockSize} />}
          {config.dockIconsVisible.assistant && <DockIcon appId="assistant" onClick={() => openApp('assistant')} isOpen={windows.some(w => w.appId === 'assistant')} size={config.dockSize} />}
          {config.dockIconsVisible.appstore && <DockIcon appId="appstore" onClick={() => openApp('appstore')} isOpen={windows.some(w => w.appId === 'appstore')} size={config.dockSize} />}
          {config.dockIconsVisible.community && <DockIcon appId="community" onClick={() => openApp('community')} isOpen={windows.some(w => w.appId === 'community')} size={config.dockSize} />}
          <div className="w-px h-8 bg-white/10 mx-1 shrink-0" />
          {config.dockIconsVisible.settings && <DockIcon appId="settings" onClick={() => openApp('settings')} isOpen={windows.some(w => w.appId === 'settings')} size={config.dockSize} />}
        </div>
      </motion.div>
    </div>
  );
}

const DesktopIcon: React.FC<{ id: AppId; label: string; onClick: () => void; shape: string; color: string; isTranslucent: boolean }> = ({ id, label, onClick, shape, color, isTranslucent }) => {
  const Icon = DEFAULT_APP_ICONS[id];
  return (
    <button
      onDoubleClick={onClick}
      onTouchStart={(e) => {
        const now = Date.now();
        const lastTap = (e.currentTarget as any).lastTap || 0;
        if (now - lastTap < 300) {
          onClick();
        }
        (e.currentTarget as any).lastTap = now;
      }}
      className="flex flex-col items-center gap-1 w-20 group"
    >
      <div
        className={cn(
          "w-12 h-12 flex items-center justify-center transition-all group-active:scale-95 shadow-lg",
          shape === 'square' && "rounded-none",
          shape === 'circle' && "rounded-full",
          shape === 'rounded' && "rounded-xl",
          shape === 'ios' && "rounded-[1.2rem]",
          isTranslucent && "backdrop-blur-md border border-white/20"
        )}
        style={{ backgroundColor: isTranslucent ? `${color}44` : color }}
      >
        <Icon size={24} className="text-white" />
      </div>
      <span className="text-[10px] text-white font-medium drop-shadow-md text-center px-1 rounded bg-black/20">
        {label}
      </span>
    </button>
  );
};

const DockIcon: React.FC<{ appId: AppId; onClick: () => void; isOpen: boolean; size: 'small' | 'medium' | 'large' }> = ({ appId, onClick, isOpen, size }) => {
  const Icon = DEFAULT_APP_ICONS[appId];
  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 28;
  const containerSize = size === 'small' ? 'w-8 h-8' : size === 'medium' ? 'w-10 h-10' : 'w-16 h-16';

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-xl hover:bg-white/10 flex items-center justify-center transition-all hover:-translate-y-1 active:scale-90 group",
        containerSize
      )}
    >
      <Icon size={iconSize} className="text-white/80" />
      {isOpen && (
        <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
      )}
      <div className="absolute -top-10 px-2 py-1 bg-black/80 text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {appId.charAt(0).toUpperCase() + appId.slice(1)}
      </div>
    </button>
  );
}
