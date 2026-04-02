import { AppId } from './types';
import { Terminal, FileText, ShoppingBag, Globe, Settings, MessageSquare, Folder, Users } from 'lucide-react';

export const DEFAULT_APP_ICONS: Record<AppId, any> = {
  terminal: Terminal,
  notepad: FileText,
  appstore: ShoppingBag,
  browser: Globe,
  settings: Settings,
  assistant: MessageSquare,
  files: Folder,
  community: Users,
};

export const INITIAL_FILES = [
  { id: '1', name: 'Documents', type: 'directory', parentId: null },
  { id: '2', name: 'Pictures', type: 'directory', parentId: null },
  { id: '3', name: 'welcome.txt', type: 'file', content: 'Welcome to Zeta OS Beta 1.0!', parentId: null },
];
