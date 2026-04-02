import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, ShoppingBag, Globe, MessageSquare, Users, Bell, ExternalLink, Search, CheckCircle, Download, Star } from 'lucide-react';

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<string[]>(["Welcome to Zet Shell v1.0", "Type 'help' for commands."]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, `zet@os:~$ ${input}`];

    switch (cmd) {
      case 'help':
        newHistory.push("Available commands: help, clear, whoami, date, ls, version, neofetch");
        break;
      case 'clear':
        setHistory([]);
        setInput("");
        return;
      case 'whoami':
        newHistory.push("user@zet-os");
        break;
      case 'date':
        newHistory.push(new Date().toString());
        break;
      case 'ls':
        newHistory.push("Documents  Pictures  Downloads  Desktop  zet_config.sys");
        break;
      case 'version':
        newHistory.push("Zet OS 1.0 Beta (Unstable)");
        break;
      case 'neofetch':
        newHistory.push(
          "  ______   ______  _______ ",
          " /      \\ /      |/       \\",
          "/$$$$$$  |$$$$$$/ $$$$$$$  |",
          "$$ |  $$ |  $$ |  $$ |  $$ |",
          "$$ \\__$$ |  $$ |  $$ |__$$ |",
          "$$    $$/   $$ |  $$    $$/ ",
          " $$$$$$/    $$/   $$$$$$$/  ",
          "----------------------------",
          "OS: Zet OS 1.0 Beta",
          "Kernel: 6.8.0-zet-generic",
          "Uptime: 10 mins",
          "Shell: zsh 5.9",
          "Resolution: 1920x1080",
          "DE: Zet-DE",
          "WM: ZetWM",
          "CPU: Quantum Core i9",
          "Memory: 12GB / 64GB"
        );
        break;
      default:
        newHistory.push(`Command not found: ${cmd}`);
    }

    setHistory(newHistory);
    setInput("");
  };

  return (
    <div className="h-full bg-[#0c0c0c] text-[#00ff00] font-mono p-4 overflow-auto text-sm" ref={scrollRef}>
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap mb-1">{line}</div>
      ))}
      <form onSubmit={handleCommand} className="flex gap-2">
        <span className="text-blue-400">zet@os:~$</span>
        <input
          autoFocus
          className="bg-transparent border-none outline-none flex-1 text-[#00ff00]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
};

export const Notepad: React.FC = () => {
  const [content, setContent] = useState("Start typing your notes here...");
  return (
    <div className="h-full bg-white text-black flex flex-col">
      <div className="p-2 border-b bg-gray-100 flex gap-4 text-xs font-medium">
        <button className="hover:text-blue-600">File</button>
        <button className="hover:text-blue-600">Edit</button>
        <button className="hover:text-blue-600">Format</button>
        <button className="hover:text-blue-600">View</button>
      </div>
      <textarea
        className="flex-1 p-4 outline-none resize-none font-sans leading-relaxed"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
};

export const Browser: React.FC = () => {
  const [url, setUrl] = useState("https://www.bing.com/search?q=Zet+OS");
  const [inputUrl, setInputUrl] = useState("bing.com");

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputUrl;
    if (!target.includes('.')) {
      target = `https://www.bing.com/search?q=${encodeURIComponent(target)}`;
    } else {
      if (!target.startsWith('http')) target = 'https://' + target;
    }
    setUrl(target);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-2 bg-gray-100 border-b flex items-center gap-2">
        <form onSubmit={handleGo} className="flex-1 flex items-center gap-2">
          <Globe size={14} className="text-gray-400" />
          <input
            className="flex-1 px-3 py-1 bg-white border rounded-full text-sm text-black outline-none focus:ring-1 focus:ring-blue-500"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
        </form>
        <button 
          onClick={() => window.open(url, '_blank')}
          className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
          title="Open in New Tab"
        >
          <ExternalLink size={16} />
        </button>
      </div>
      <div className="flex-1 relative bg-gray-50">
        <iframe
          src={url}
          className="w-full h-full border-none"
          title="browser"
        />
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/5">
          <p className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm">Some sites may block iframes. Use the external link button if needed.</p>
        </div>
      </div>
    </div>
  );
};

export const AppStore: React.FC = () => {
  return (
    <div className="h-full bg-[#0f0f0f] text-white flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-2xl animate-pulse">
        <ShoppingBag size={48} />
      </div>
      <h1 className="text-4xl font-bold mb-4">App Store</h1>
      <p className="text-xl text-white/60 mb-8">Coming Soon</p>
      <div className="max-w-md text-sm text-white/40 leading-relaxed">
        We are currently curating the best applications for Zet OS. 
        Stay tuned for the official launch of the Zet App Store.
      </div>
    </div>
  );
};

export const CommunityApp: React.FC = () => {
  const updates = [
    { 
      id: 2, 
      title: 'Phone OS coming out?', 
      date: 'April 2, 2026', 
      content: 'Hey everyone! Jafko here. I am thinking about starting work on a Zet Phone OS. What do you think? You can vote to come out or no on our Discord!', 
      author: 'Jafko',
      link: 'https://discord.gg/94yw2Tsx8S',
      linkText: 'Vote on Discord'
    },
    { 
      id: 1, 
      title: 'Welcome to Zet OS', 
      date: 'April 2, 2026', 
      content: 'Welcome to the official release of Zet OS Beta 1.0! We are excited to have you here.', 
      author: 'Zeka' 
    },
  ];

  return (
    <div className="h-full bg-[#121212] text-white overflow-auto">
      <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 p-8 flex flex-col justify-end">
        <h1 className="text-4xl font-bold mb-2">Community</h1>
        <p className="text-white/80">Stay updated with the latest Zet OS news.</p>
      </div>
      <div className="p-8 space-y-6">
        {updates.map((update) => (
          <div key={update.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{update.title}</h2>
              <span className="text-xs text-white/40">{update.date}</span>
            </div>
            <p className="text-sm text-white/60 mb-4">{update.content}</p>
            {update.link && (
              <a 
                href={update.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold transition-all mb-4"
              >
                {update.linkText}
                <ExternalLink size={14} />
              </a>
            )}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                {update.author[0]}
              </div>
              <span className="text-xs text-white/40">Posted by <span className="text-white">{update.author}</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Assistant: React.FC = () => {
  const [history, setHistory] = useState<{ text: string, type: 'bot' | 'user' }[]>([
    { text: "Hello! I am your Zet Assistant. How can I help you today?", type: 'bot' }
  ]);

  const options = [
    {
      label: "What is Zet OS?",
      response: "Zet OS is a hybrid operating system simulation designed for speed and beauty. It combines Linux power with Mac aesthetics.",
    },
    {
      label: "How to customize?",
      response: "You can change wallpapers and icons in the Settings app. You can also edit the boot style there!",
    },
    {
      label: "Who are the developers?",
      response: "Zet OS was founded by Zeka and is primarily developed by Jafko.",
    }
  ];

  const handleChoice = (opt: typeof options[0]) => {
    setHistory(prev => [
      ...prev,
      { text: opt.label, type: 'user' },
      { text: opt.response, type: 'bot' }
    ]);
  };

  return (
    <div className="h-full bg-gray-900 text-white p-6 flex flex-col gap-4">
      <div className="flex-1 overflow-auto space-y-4">
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.type === 'user' ? 'bg-blue-600' : 'bg-gray-800'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleChoice(opt)}
            className="text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-sm"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};
