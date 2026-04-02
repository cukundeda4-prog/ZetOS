import React, { useState, useRef, useEffect } from 'react';
import { motion, useDragControls } from 'motion/react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface WindowProps {
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  zIndex: number;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
}

export const Window: React.FC<WindowProps> = ({
  title,
  icon,
  isOpen,
  isMinimized,
  isMaximized,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  zIndex,
  children,
  initialPosition = { x: 100, y: 100 },
}) => {
  const dragControls = useDragControls();

  if (!isOpen || isMinimized) return null;

  return (
    <motion.div
      initial={isMaximized ? { opacity: 0, scale: 0.95 } : { opacity: 0, scale: 0.9, ...initialPosition, width: 800, height: 500 }}
      animate={isMaximized ? { opacity: 1, scale: 1, x: 0, y: 0, width: '100%', height: 'calc(100% - 48px)' } : { opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onPointerDown={onFocus}
      style={{ zIndex }}
      className={cn(
        "absolute flex flex-col overflow-hidden rounded-xl glass-dark border border-white/10 shadow-2xl",
        isMaximized && "rounded-none"
      )}
    >
      {/* Title Bar */}
      <div
        onPointerDown={(e) => {
          dragControls.start(e);
          onFocus();
        }}
        onDoubleClick={(e) => {
          if (e.ctrlKey) {
            onMaximize();
          }
        }}
        className="h-10 flex items-center justify-between px-4 bg-white/5 border-b border-white/5 cursor-default select-none"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="opacity-80">{icon}</span>}
          <span className="text-sm font-medium text-white/90">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors"
          />
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize(); }}
            className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors"
          />
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-black/20">
        {children}
      </div>
    </motion.div>
  );
};
