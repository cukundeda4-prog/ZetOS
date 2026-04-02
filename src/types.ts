export type AppId = 'terminal' | 'notepad' | 'appstore' | 'browser' | 'settings' | 'assistant' | 'files' | 'community';

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export type WidgetId = 'clock' | 'weather' | 'calendar' | 'stats';

export interface WidgetConfig {
  id: WidgetId;
  enabled: boolean;
  position: { x: number; y: number };
  size: 'small' | 'medium' | 'large';
}

export interface OSConfig {
  bootStyle: 'classic' | 'hacker' | 'minimal';
  wallpaper: string;
  lockWallpaper: string;
  lockClockFont: string;
  theme: 'dark' | 'light';
  username: string;
  password?: string;
  isPasswordEnabled: boolean;
  isSetupComplete: boolean;
  appIcons: Record<AppId, string>;
  dockSize: 'small' | 'medium' | 'large';
  dockWidth: number; // Percentage 0-100
  dockStyle: 'glass' | 'solid' | 'translucent';
  dockAutoHide: boolean;
  dockColor: string;
  dockIconsVisible: Record<AppId, boolean>;
  iconShape: 'square' | 'circle' | 'rounded' | 'ios';
  iconColor: string;
  iconTranslucent: boolean;
  showDesktopIcons: boolean;
  statusBarStyle: 'glass' | 'solid' | 'minimal';
  statusBarColor: string;
  widgets: WidgetConfig[];
}

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'directory';
  content?: string;
  parentId: string | null;
}
