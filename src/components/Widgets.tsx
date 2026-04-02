import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Cloud, Calendar, Cpu, Thermometer, Wind, Droplets } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { WidgetId } from '@/src/types';

interface WidgetWrapperProps {
  children: React.ReactNode;
  size: 'small' | 'medium' | 'large';
  title?: string;
  className?: string;
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({ children, size, title, className }) => {
  const sizeClasses = {
    small: 'w-40 h-40',
    medium: 'w-84 h-40',
    large: 'w-84 h-84',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "glass-dark rounded-[2.5rem] p-6 flex flex-col shadow-2xl border border-white/10 overflow-hidden relative group",
        sizeClasses[size],
        className
      )}
    >
      {title && <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">{title}</div>}
      <div className="flex-1 flex flex-col justify-center">
        {children}
      </div>
    </motion.div>
  );
};

export const ClockWidget: React.FC<{ size: 'small' | 'medium' | 'large' }> = ({ size }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (size === 'small') {
    return (
      <WidgetWrapper size="small">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-bold tracking-tighter">
            {time.getHours().toString().padStart(2, '0')}
          </div>
          <div className="text-4xl font-bold tracking-tighter text-white/40">
            {time.getMinutes().toString().padStart(2, '0')}
          </div>
        </div>
      </WidgetWrapper>
    );
  }

  return (
    <WidgetWrapper size={size} title="World Clock">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-5xl font-bold tracking-tighter">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>
          <div className="text-sm text-white/60 font-medium">
            {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </div>
        <Clock className="text-blue-500 mb-1" size={32} />
      </div>
    </WidgetWrapper>
  );
};

export const WeatherWidget: React.FC<{ size: 'small' | 'medium' | 'large' }> = ({ size }) => {
  if (size === 'small') {
    return (
      <WidgetWrapper size="small" className="bg-gradient-to-br from-blue-500/20 to-purple-500/20">
        <div className="flex flex-col items-center text-center">
          <Cloud className="text-white mb-2" size={40} />
          <div className="text-3xl font-bold">24°</div>
          <div className="text-[10px] font-bold uppercase text-white/60">Cloudy</div>
        </div>
      </WidgetWrapper>
    );
  }

  return (
    <WidgetWrapper size={size} title="Weather" className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-4xl font-bold mb-1">24°</div>
          <div className="text-sm font-medium">Cloudy</div>
          <div className="text-xs text-white/60">H:26° L:18°</div>
        </div>
        <Cloud size={48} className="text-white" />
      </div>
      {size !== 'small' && (
        <div className="mt-4 flex gap-4 border-t border-white/10 pt-4">
          <div className="flex items-center gap-1.5">
            <Droplets size={14} className="text-blue-400" />
            <span className="text-xs font-medium">12%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind size={14} className="text-teal-400" />
            <span className="text-xs font-medium">8km/h</span>
          </div>
        </div>
      )}
    </WidgetWrapper>
  );
};

export const CalendarWidget: React.FC<{ size: 'small' | 'medium' | 'large' }> = ({ size }) => {
  const date = new Date();
  const dayName = date.toLocaleDateString([], { weekday: 'long' });
  const dayNum = date.getDate();

  return (
    <WidgetWrapper size={size} title="Calendar" className="bg-white text-black">
      <div className="flex flex-col items-start">
        <div className="text-red-500 font-bold text-xs uppercase tracking-widest mb-1">{dayName}</div>
        <div className="text-6xl font-light tracking-tighter leading-none">{dayNum}</div>
      </div>
      {size !== 'small' && (
        <div className="mt-4 space-y-2 border-t border-black/5 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-500 rounded-full" />
            <div className="text-xs font-bold">Zeta OS Stable Launch</div>
          </div>
          <div className="text-[10px] text-black/40 ml-3">10:00 AM - 11:00 AM</div>
        </div>
      )}
    </WidgetWrapper>
  );
};

export const StatsWidget: React.FC<{ size: 'small' | 'medium' | 'large' }> = ({ size }) => {
  return (
    <WidgetWrapper size={size} title="System Stats">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
            <span className="text-white/60">CPU Usage</span>
            <span className="text-blue-400">12%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '12%' }}
              className="h-full bg-blue-500" 
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
            <span className="text-white/60">Memory</span>
            <span className="text-purple-400">4.2GB</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '35%' }}
              className="h-full bg-purple-500" 
            />
          </div>
        </div>
      </div>
    </WidgetWrapper>
  );
};

export const WidgetRenderer: React.FC<{ id: WidgetId; size: 'small' | 'medium' | 'large' }> = ({ id, size }) => {
  switch (id) {
    case 'clock': return <ClockWidget size={size} />;
    case 'weather': return <WeatherWidget size={size} />;
    case 'calendar': return <CalendarWidget size={size} />;
    case 'stats': return <StatsWidget size={size} />;
    default: return null;
  }
};
