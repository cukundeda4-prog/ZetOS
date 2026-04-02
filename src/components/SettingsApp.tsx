import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Palette, Monitor, Shield, Info, Upload, Image as ImageIcon, LayoutGrid, MessageSquare, ExternalLink, Clock, Cloud, RefreshCw } from 'lucide-react';
import { OSConfig, AppId } from '@/src/types';
import { DEFAULT_APP_ICONS } from '@/src/constants';
import { cn } from '@/src/lib/utils';

interface SettingsAppProps {
  config: OSConfig;
  onUpdateConfig: (updates: Partial<OSConfig>) => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({ config, onUpdateConfig }) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'system' | 'about' | 'icons' | 'dock' | 'lock' | 'security' | 'widgets'>('appearance');

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'icons', label: 'Icons', icon: LayoutGrid },
    { id: 'widgets', label: 'Widgets', icon: LayoutGrid },
    { id: 'dock', label: 'Dock & Bar', icon: Monitor },
    { id: 'lock', label: 'Lock Screen', icon: Shield },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Shield },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleIconChange = (appId: AppId, iconName: string) => {
    const newIcons = { ...config.appIcons, [appId]: iconName };
    onUpdateConfig({ appIcons: newIcons });
  };

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateConfig({ wallpaper: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full flex bg-[#1a1a1a] text-white">
      {/* Sidebar */}
      <div className="w-48 bg-black/20 border-r border-white/5 p-4 flex flex-col gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-white/60'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === 'appearance' && (
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-4">Wallpaper</h3>
              <div className="grid grid-cols-3 gap-4">
                <label className="aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-blue-500/50 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group">
                  <Upload size={24} className="text-white/40 group-hover:text-blue-500" />
                  <span className="text-xs text-white/40 group-hover:text-blue-500">Upload Custom</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleWallpaperUpload} />
                </label>
                {['https://images.unsplash.com/photo-1477346611705-65d1883cee1e', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'].map((wp) => (
                  <button
                    key={wp}
                    onClick={() => onUpdateConfig({ wallpaper: wp + '?auto=format&fit=crop&q=80&w=2070' })}
                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      config.wallpaper.includes(wp) ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img src={wp} alt="Wallpaper" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">Boot Style</h3>
              <div className="flex gap-4">
                {['classic', 'hacker', 'minimal'].map((style) => (
                  <button
                    key={style}
                    onClick={() => onUpdateConfig({ bootStyle: style as any })}
                    className={`px-6 py-3 rounded-xl border-2 transition-all capitalize ${
                      config.bootStyle === style ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'icons' && (
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-4">Desktop Icon Style</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm text-white/60">Shape</label>
                  <div className="flex gap-2">
                    {['square', 'circle', 'rounded', 'ios'].map((shape) => (
                      <button
                        key={shape}
                        onClick={() => onUpdateConfig({ iconShape: shape as any })}
                        className={`px-3 py-2 rounded-lg border-2 transition-all text-xs capitalize ${
                          config.iconShape === shape ? 'border-blue-500 bg-blue-500/10' : 'border-white/10'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-white/60">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#000000'].map((color) => (
                      <button
                        key={color}
                        onClick={() => onUpdateConfig({ iconColor: color })}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          config.iconColor === color ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <span>Translucent Icons</span>
                <button
                  onClick={() => onUpdateConfig({ iconTranslucent: !config.iconTranslucent })}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    config.iconTranslucent ? 'bg-blue-600' : 'bg-white/10'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    config.iconTranslucent ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">App Icon Themes</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(config.appIcons).map((appId) => (
                  <div key={appId} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        {React.createElement(DEFAULT_APP_ICONS[appId as AppId], { size: 20 })}
                      </div>
                      <span className="capitalize">{appId}</span>
                    </div>
                    <select 
                      className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs"
                      onChange={(e) => handleIconChange(appId as AppId, e.target.value)}
                      value={config.appIcons[appId as AppId]}
                    >
                      <option value="Default">Default</option>
                      <option value="Modern">Modern</option>
                      <option value="Classic">Classic</option>
                      <option value="Minimal">Minimal</option>
                    </select>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'widgets' && (
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-4">Desktop Widgets</h3>
              <div className="grid grid-cols-1 gap-4">
                {config.widgets.map((widget) => (
                  <div key={widget.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                        {widget.id === 'clock' && <Clock size={24} />}
                        {widget.id === 'weather' && <Cloud size={24} />}
                        {widget.id === 'calendar' && <LayoutGrid size={24} />}
                        {widget.id === 'stats' && <Monitor size={24} />}
                      </div>
                      <div>
                        <div className="font-bold capitalize">{widget.id} Widget</div>
                        <div className="text-xs text-white/40">Display {widget.id} info on desktop</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex bg-black/40 rounded-lg p-1">
                        {['small', 'medium', 'large'].map((size) => (
                          <button
                            key={size}
                            onClick={() => {
                              const newWidgets = config.widgets.map(w => w.id === widget.id ? { ...w, size: size as any } : w);
                              onUpdateConfig({ widgets: newWidgets });
                            }}
                            className={cn(
                              "px-3 py-1 rounded text-[10px] font-bold uppercase transition-all",
                              widget.size === size ? "bg-blue-600 text-white" : "text-white/40 hover:text-white"
                            )}
                          >
                            {size[0]}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          const newWidgets = config.widgets.map(w => w.id === widget.id ? { ...w, enabled: !w.enabled } : w);
                          onUpdateConfig({ widgets: newWidgets });
                        }}
                        className={`w-12 h-6 rounded-full transition-all relative ${
                          widget.enabled ? 'bg-blue-600' : 'bg-white/10'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                          widget.enabled ? 'right-1' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'dock' && (
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-4">Dock Customization</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <span>Auto-hide Dock</span>
                  <button
                    onClick={() => onUpdateConfig({ dockAutoHide: !config.dockAutoHide })}
                    className={`w-12 h-6 rounded-full transition-all relative ${
                      config.dockAutoHide ? 'bg-blue-600' : 'bg-white/10'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      config.dockAutoHide ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-white/60">Dock Width ({config.dockWidth}%)</label>
                  <input 
                    type="range" 
                    min="20" 
                    max="100" 
                    value={config.dockWidth} 
                    onChange={(e) => onUpdateConfig({ dockWidth: parseInt(e.target.value) })}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-white/60">Icon Size</label>
                  <div className="flex gap-2">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => onUpdateConfig({ dockSize: size as any })}
                        className={`px-4 py-2 rounded-lg border-2 transition-all capitalize ${
                          config.dockSize === size ? 'border-blue-500 bg-blue-500/10' : 'border-white/10'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-white/60">Style</label>
                  <div className="flex gap-2">
                    {['glass', 'solid', 'translucent'].map((style) => (
                      <button
                        key={style}
                        onClick={() => onUpdateConfig({ dockStyle: style as any })}
                        className={`px-4 py-2 rounded-lg border-2 transition-all capitalize ${
                          config.dockStyle === style ? 'border-blue-500 bg-blue-500/10' : 'border-white/10'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                  {config.dockStyle === 'solid' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 mt-2"
                    >
                      <label className="text-xs text-white/40 block mb-2">Choose Dock Color</label>
                      <div className="flex gap-2 flex-wrap">
                        {['#000000', '#1a1a1a', '#2d3748', '#2c5282', '#276749', '#744210', '#702459'].map((color) => (
                          <button
                            key={color}
                            onClick={() => onUpdateConfig({ dockColor: color })}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${
                              config.dockColor === color ? 'border-white scale-110' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">Dock Icons Visibility</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(config.dockIconsVisible).map((appId) => (
                  <button
                    key={appId}
                    onClick={() => {
                      const newVisible = { ...config.dockIconsVisible, [appId]: !config.dockIconsVisible[appId as AppId] };
                      onUpdateConfig({ dockIconsVisible: newVisible });
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                      config.dockIconsVisible[appId as AppId] ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {React.createElement(DEFAULT_APP_ICONS[appId as AppId], { size: 16 })}
                      <span className="text-xs capitalize">{appId}</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${config.dockIconsVisible[appId as AppId] ? 'bg-blue-500' : 'bg-white/20'}`} />
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">Status Bar Style</h3>
              <div className="flex gap-2">
                {['glass', 'solid', 'minimal'].map((style) => (
                  <button
                    key={style}
                    onClick={() => onUpdateConfig({ statusBarStyle: style as any })}
                    className={`px-4 py-2 rounded-lg border-2 transition-all capitalize ${
                      config.statusBarStyle === style ? 'border-blue-500 bg-blue-500/10' : 'border-white/10'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
              {config.statusBarStyle === 'solid' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 mt-4"
                >
                  <label className="text-xs text-white/40 block mb-2">Choose Status Bar Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {['#000000', '#1a1a1a', '#2d3748', '#2c5282', '#276749', '#744210', '#702459'].map((color) => (
                      <button
                        key={color}
                        onClick={() => onUpdateConfig({ statusBarColor: color })}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          config.statusBarColor === color ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'lock' && (
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-4">Lock Screen Wallpaper</h3>
              <div className="grid grid-cols-3 gap-4">
                {['https://images.unsplash.com/photo-1477346611705-65d1883cee1e', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b', 'https://images.unsplash.com/photo-1501854140801-50d01698950b'].map((wp) => (
                  <button
                    key={wp}
                    onClick={() => onUpdateConfig({ lockWallpaper: wp + '?auto=format&fit=crop&q=80&w=2070' })}
                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      config.lockWallpaper.includes(wp) ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img src={wp} alt="Wallpaper" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">Clock Font</h3>
              <div className="flex gap-4">
                {['font-sans', 'font-serif', 'font-mono'].map((font) => (
                  <button
                    key={font}
                    onClick={() => onUpdateConfig({ lockClockFont: font })}
                    className={`px-6 py-3 rounded-xl border-2 transition-all capitalize ${
                      config.lockClockFont === font ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {font.split('-')[1]}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-4">Password Protection</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <div className="font-medium">Require Password</div>
                    <div className="text-xs text-white/40">Ask for a password to unlock the OS</div>
                  </div>
                  <button
                    onClick={() => onUpdateConfig({ isPasswordEnabled: !config.isPasswordEnabled })}
                    className={`w-12 h-6 rounded-full transition-all relative ${
                      config.isPasswordEnabled ? 'bg-blue-600' : 'bg-white/10'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      config.isPasswordEnabled ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>

                {config.isPasswordEnabled && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 p-6 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="space-y-2">
                      <label className="text-sm text-white/60">Set Password</label>
                      <input 
                        type="password" 
                        placeholder="Enter new password"
                        defaultValue={config.password || ''}
                        onBlur={(e) => onUpdateConfig({ password: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <p className="text-[10px] text-white/40">Leave empty for no password (not recommended if enabled)</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                  <RefreshCw size={24} />
                </div>
                <div>
                  <div className="font-bold">System Updates</div>
                  <div className="text-xs text-white/40">Your system is up to date (v1.0.0-beta)</div>
                </div>
              </div>
              <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all">
                Check for Updates
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 flex items-center justify-center text-red-400">
                  <Shield size={24} />
                </div>
                <div>
                  <div className="font-bold text-red-400">Reset OS</div>
                  <div className="text-xs text-white/40">This will clear all your settings and files.</div>
                </div>
              </div>
              <button 
                onClick={() => {
                  // Using a simple state-based confirmation would be better but for now 
                  // we'll just do it since we can't use window.confirm
                  localStorage.clear();
                  window.location.reload();
                }}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-bold transition-all text-white"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-2xl">
              <span className="text-4xl font-bold">Z</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Zeta OS</h2>
            <p className="text-white/40 mb-8">Version 1.0.0 Beta (Unstable)</p>
            <div className="max-w-md text-sm text-white/60 leading-relaxed mb-8">
              Zeta OS is an experimental operating system simulation built with React and Tailwind CSS.
              It aims to provide a seamless hybrid experience of Linux flexibility and Mac OS aesthetics.
            </div>
            <div className="grid grid-cols-2 gap-8 text-left w-full max-w-md p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
              <div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Founder</div>
                <div className="font-bold">Zeka</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Developer</div>
                <div className="font-bold">Jafko</div>
              </div>
            </div>
            <div className="w-full max-w-md p-6 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-left">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <MessageSquare size={16} className="text-blue-400" />
                Support & Community
              </h4>
              <p className="text-xs text-white/60 mb-4">
                Need help or have a suggestion? Join our Discord to open a ticket and ask your problems.
              </p>
              <a 
                href="https://discord.gg/94yw2Tsx8S" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold transition-all"
              >
                Join Discord & Open Ticket
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
