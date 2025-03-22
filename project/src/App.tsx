import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, RefreshCw, Star, Settings } from 'lucide-react';

interface Dhikr {
  name: string;
  arabic: string;
  meaning: string;
  recommended: number;
  virtues: string;
}

const dhikrList: Dhikr[] = [
  {
    name: "Subhan Allah",
    arabic: "سُبْحَانَ ٱللَّٰهِ",
    meaning: "Glory be to Allah",
    recommended: 33,
    virtues: "Saying 'Subhan Allah' 33 times after each prayer is from the Sunnah of the Prophet ﷺ"
  },
  {
    name: "Alhamdulillah",
    arabic: "ٱلْحَمْدُ لِلَّٰهِ",
    meaning: "All praise is due to Allah",
    recommended: 33,
    virtues: "The Prophet ﷺ said: 'Alhamdulillah fills the scales of good deeds'"
  },
  {
    name: "Allahu Akbar",
    arabic: "ٱللَّٰهُ أَكْبَرُ",
    meaning: "Allah is the Greatest",
    recommended: 34,
    virtues: "These three phrases are beloved to Allah and were recommended by the Prophet ﷺ"
  },
  {
    name: "SubhanAllahi Wabihamdihi SubhanAllahil Azim",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
    meaning: "Glory be to Allah and His is the praise, Glory be to Allah the Supreme",
    recommended: 100,
    virtues: "The Prophet ﷺ said: 'Whoever says this 100 times a day will have their sins forgiven'"
  },
  {
    name: "La ilaha illallah",
    arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ",
    meaning: "There is no deity worthy of worship except Allah",
    recommended: 100,
    virtues: "The best dhikr is La ilaha illallah - Prophet Muhammad ﷺ"
  }
];


function CosmicBackground() {
  const [stars, setStars] = useState<{ top: number; left: number; size: number; duration: number }[]>([]);

  useEffect(() => {
    const createStars = () => {
      const newStars = Array.from({ length: 150 }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 3 + 2
      }));
      setStars(newStars);
    };
    createStars();
    window.addEventListener('resize', createStars);
    return () => window.removeEventListener('resize', createStars);
  }, []);

  return (
    <>
      <div className="milky-way" />
      <div className="stars-container">
        {stars.map((star, i) => (
          <div
            key={i}
            className="star"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              opacity: Math.random() * 0.5 + 0.3
            }}
          />
        ))}
      </div>
    </>
  );
}

function CircularProgress({ progress, count }: { progress: number; count: number }) {
  const radius = 45;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg className="progress-ring" width="100" height="100" viewBox="0 0 100 100">
      {/* Background Circle */}
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth="3"
        r={radius}
        cx="50"
        cy="50"
      />
      {/* Progress Circle */}
      <circle
        stroke="#ffffff"
        fill="transparent"
        strokeWidth="3"
        strokeLinecap="round"
        r={radius}
        cx="50"
        cy="50"
        style={{
          strokeDasharray: `${circumference} ${circumference}`,
          strokeDashoffset,
        }}
      />
      {/* Perfectly Centered Text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle" 
        className="fill-white text-4xl font-bold"
      >
        {count}
      </text>
    </svg>
  );
}





function App() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('tasbihCount');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [selectedDhikr, setSelectedDhikr] = useState(() => {
    const saved = localStorage.getItem('selectedDhikr');
    return saved ? dhikrList.find(d => d.name === saved) || dhikrList[0] : dhikrList[0];
  });

  const [target, setTarget] = useState(() => {
    const saved = localStorage.getItem('tasbihTarget');
    return saved ? parseInt(saved, 10) : 33;
  });

  const [showBlessing, setShowBlessing] = useState(false);
  const [showVirtues, setShowVirtues] = useState(false);
  const lastTapTime = useRef(0);
  const vibrationEnabled = useRef(true);

  useEffect(() => {
    localStorage.setItem('tasbihCount', count.toString());
    localStorage.setItem('selectedDhikr', selectedDhikr.name);
    localStorage.setItem('tasbihTarget', target.toString());
  }, [count, selectedDhikr, target]);

  useEffect(() => {
    if (count === target) {
      setShowBlessing(true);
      if (vibrationEnabled.current && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      setTimeout(() => setShowBlessing(false), 5000);
    }
  }, [count, target]);

  const handleIncrement = useCallback(() => {
    if (count < target) {
      setCount(prev => prev + 1);
      lastTapTime.current = Date.now();
      if (vibrationEnabled.current && 'vibrate' in navigator) {
        navigator.vibrate(30);
      }
    }
  }, [count, target]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleIncrement();
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [handleIncrement]);

  const resetCounter = () => {
    setCount(0);
    setShowBlessing(false);
    if (vibrationEnabled.current && 'vibrate' in navigator) {
      navigator.vibrate(100);
    }
  };

  const progress = (count / target) * 100;

  return (
    <div className="cosmic-bg">
      <CosmicBackground />

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-lg min-h-screen flex flex-col">
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">
              Digital Tasbeeh
            </h1>
            <p className="text-sm text-gray-300">
              Simple and clean remembrance counter
            </p>
          </div>

          {/* Dhikr Selection */}
          <select
            value={selectedDhikr.name}
            onChange={(e) => {
              const selected = dhikrList.find(d => d.name === e.target.value);
              if (selected) {
                setSelectedDhikr(selected);
                setTarget(selected.recommended);
                resetCounter();
              }
            }}
            className="w-full p-3 bg-white/10 rounded-lg text-white text-center border border-white/20 focus:outline-none"
          >
            {dhikrList.map((dhikr) => (
              <option key={dhikr.name} value={dhikr.name} className="bg-gray-800">
                {dhikr.name}
              </option>
            ))}
          </select>

          {/* Arabic Text */}
          <div
            className="text-center p-5 rounded-lg bg-white/10 border border-white/20"
            onClick={() => setShowVirtues(!showVirtues)}
          >
            <p className="arabic-text text-2xl mb-3 text-white">
              {selectedDhikr.arabic}
            </p>
            <p className="text-sm text-gray-300">{selectedDhikr.meaning}</p>
            <div className={`text-sm text-gray-400 transition-all ${
              showVirtues ? 'opacity-100 mt-3' : 'opacity-0 h-0'
            }`}>
              {selectedDhikr.virtues}
            </div>
          </div>

          {/* Counter Display */}
          <div className="relative flex flex-col items-center">
            <div className="absolute inset-5 flex items-center justify-center">
              <div className="text-4xl font-bold text-white">{count}</div>
            </div>
            <CircularProgress progress={progress} />
            <div className="mt-3 text-sm text-gray-300">
              Target: {target}
            </div>
          </div>

          {/* Counter Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={resetCounter}
              className="p-4 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              <RefreshCw size={24} className="text-white" />
            </button>

            <button
              onClick={handleIncrement}
              disabled={count >= target}
              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                count >= target ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'
              } transition-colors`}
            >
              <Heart size={32} className="text-white" />
            </button>

            <button
              onClick={() => {
                vibrationEnabled.current = !vibrationEnabled.current;
                if (vibrationEnabled.current && 'vibrate' in navigator) {
                  navigator.vibrate(30);
                }
              }}
              className="p-4 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              <Settings size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Blessing Message */}
        {showBlessing && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="px-6 py-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-white" />
              <h2 className="text-lg font-bold text-white">MashaAllah!</h2>
              <p className="text-sm text-gray-300">May Allah accept your worship</p>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            Developed by Ubaidullah
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;