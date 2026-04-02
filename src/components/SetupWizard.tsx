import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Monitor, Palette, User, CheckCircle, Shield } from 'lucide-react';

interface SetupWizardProps {
  onComplete: (data: { username: string; wallpaper: string; password?: string; isPasswordEnabled: boolean }) => void;
}

const WALLPAPERS = [
  'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2070',
];

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState(WALLPAPERS[0]);

  const steps = [
    {
      title: "Welcome to Zet OS",
      description: "Let's get your new system ready for use. This will only take a moment.",
      icon: <Monitor className="w-12 h-12 text-blue-500" />,
    },
    {
      title: "Who are you?",
      description: "Enter a username for your primary account.",
      icon: <User className="w-12 h-12 text-purple-500" />,
      content: (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </motion.div>
      ),
    },
    {
      title: "Security",
      description: "Protect your system with a password.",
      icon: <Shield className="w-12 h-12 text-red-500" />,
      content: (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="text-sm">Enable Password</span>
            <button
              onClick={() => setIsPasswordEnabled(!isPasswordEnabled)}
              className={`w-12 h-6 rounded-full transition-all relative ${
                isPasswordEnabled ? 'bg-blue-600' : 'bg-white/10'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                isPasswordEnabled ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
          {isPasswordEnabled && (
            <motion.input
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          )}
        </motion.div>
      ),
    },
    {
      title: "Personalize",
      description: "Choose a wallpaper to start with.",
      icon: <Palette className="w-12 h-12 text-pink-500" />,
      content: (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          {WALLPAPERS.map((wp, idx) => (
            <motion.button
              key={wp}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              onClick={() => setSelectedWallpaper(wp)}
              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                selectedWallpaper === wp ? 'border-blue-500 scale-95' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={wp} alt="Wallpaper" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </motion.button>
          ))}
        </motion.div>
      ),
    },
    {
      title: "All set!",
      description: "Your system is configured and ready to go.",
      icon: <CheckCircle className="w-12 h-12 text-green-500" />,
    },
  ];

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete({ 
        username, 
        wallpaper: selectedWallpaper, 
        password: isPasswordEnabled ? password : undefined,
        isPasswordEnabled
      });
    }
  };

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[9997]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -40, filter: 'blur(10px)' }}
          transition={{ duration: 0.4, ease: "circOut" }}
          className="glass-dark w-full max-w-md p-8 rounded-3xl relative z-10 shadow-2xl border border-white/10"
        >
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            {currentStep.icon}
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-center mb-2"
          >
            {currentStep.title}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-center mb-8"
          >
            {currentStep.description}
          </motion.p>

          <div className="mb-8 min-h-[100px] flex flex-col justify-center">
            {currentStep.content}
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={next}
            disabled={step === 1 && !username}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
          >
            {step === steps.length - 1 ? 'Get Started' : 'Continue'}
            <ArrowRight size={20} />
          </motion.button>
          
          <div className="mt-6 flex justify-center gap-1.5">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === step ? 'w-8 bg-blue-500' : 'w-2 bg-white/10'
                }`} 
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
