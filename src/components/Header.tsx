import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Search, 
  Bookmark,
  Layers,
  Clock,
  HelpCircle
} from 'lucide-react';
import { ThemeMode } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  activeCity: 'H' | 'HH';
  onSelectCity: (city: 'H' | 'HH') => void;
  selectedDistrict: string;
  districts: string[];
  onSelectDistrict: (district: string) => void;
  onOpenSearch: () => void;
  onOpenLinklist: () => void;
  onOpenGlossary: () => void;
  activeMarkerCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  activeCity,
  onSelectCity,
  selectedDistrict,
  districts,
  onSelectDistrict,
  onOpenSearch,
  onOpenLinklist,
  onOpenGlossary,
  activeMarkerCount
}) => {
  const [time, setTime] = useState({
    local: '',
    utc: ''
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime({
        local: now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        utc: now.toISOString().substring(11, 19) + ' UTC'
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const cityCoords = activeCity === 'HH' ? '53.5511°N 9.9937°E' : '52.3759°N 9.7320°E';

  return (
    <header className="h-14 border-b border-anthrazit-800 bg-anthrazit-900/95 dark:bg-anthrazit-950/95 backdrop-blur-md px-4 flex items-center justify-between z-30 select-none">
      {/* Brand & City Indicator with HH Knopf */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-8 h-8 rounded bg-anthrazit-850 border border-accent/40 text-accent font-mono font-bold text-base shadow-accent-sm">
          ⬡
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-mono font-bold tracking-wider text-sm text-anthrazit-100 uppercase hidden xs:inline">
            HBOARD
          </span>

          {/* Quick City Switcher Buttons (H & HH Knopf) */}
          <div className="flex items-center rounded bg-anthrazit-950 border border-anthrazit-800 p-0.5 space-x-0.5">
            <button
              onClick={() => onSelectCity('H')}
              className={`px-2 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                activeCity === 'H'
                  ? 'bg-accent text-anthrazit-950 shadow-sm'
                  : 'text-anthrazit-400 hover:text-anthrazit-200 hover:bg-anthrazit-850'
              }`}
              title="Hannover (H) aktivieren"
            >
              <span>H</span>
              <span className="hidden md:inline text-[10px] font-medium opacity-90">Hannover</span>
            </button>

            <button
              onClick={() => onSelectCity('HH')}
              className={`px-2 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                activeCity === 'HH'
                  ? 'bg-accent text-anthrazit-950 shadow-sm'
                  : 'text-anthrazit-400 hover:text-anthrazit-200 hover:bg-anthrazit-850'
              }`}
              title="Hamburg (HH) aktivieren"
            >
              <span>HH</span>
              <span className="hidden md:inline text-[10px] font-medium opacity-90">Hamburg</span>
            </button>
          </div>

          <span className="hidden lg:inline-block text-[11px] font-mono text-anthrazit-400">
            {cityCoords}
          </span>
        </div>
      </div>

      {/* Center OSINT Quick Stats & Search */}
      <div className="hidden md:flex items-center space-x-4">
        {/* Live Ticker */}
        <div className="flex items-center space-x-3 px-3 py-1 rounded bg-anthrazit-900 border border-anthrazit-800 text-xs font-mono text-anthrazit-300">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-accent font-semibold">LIVE</span>
          </div>
          <span className="text-anthrazit-600">|</span>
          <div className="flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-anthrazit-400" />
            <span>{activeMarkerCount} Nodes</span>
          </div>
          <span className="text-anthrazit-600">|</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-anthrazit-400" />
            <span>{time.local}</span>
            <span className="text-anthrazit-500">({time.utc})</span>
          </div>
        </div>

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-2 px-3 py-1.5 rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-anthrazit-700/60 text-xs text-anthrazit-300 transition-colors cursor-pointer group"
          title="OSINT Schnellsuche (Strg + K)"
        >
          <Search className="w-3.5 h-3.5 text-anthrazit-400 group-hover:text-accent" />
          <span className="text-anthrazit-400">Knoten / Straßen suchen...</span>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 rounded bg-anthrazit-900 border border-anthrazit-700 text-[10px] font-mono text-anthrazit-400">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Actions: District Select, Glossary, Linklist, Theme Toggle */}
      <div className="flex items-center space-x-2">
        {/* District Filter Dropdown */}
        <div className="flex items-center">
          <select
            value={selectedDistrict}
            onChange={(e) => onSelectDistrict(e.target.value)}
            aria-label="Stadtbezirk filtern"
            className="text-xs bg-anthrazit-850 hover:bg-anthrazit-800 border border-anthrazit-700 text-anthrazit-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-accent font-mono transition-colors"
          >
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Glossary & Beginner Help Modal Trigger */}
        <button
          onClick={onOpenGlossary}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-accent/40 text-xs font-mono text-accent transition-colors cursor-pointer"
          title="Glossar & Erklärungen für Einsteiger öffnen"
        >
          <HelpCircle className="w-3.5 h-3.5 text-accent" />
          <span className="hidden sm:inline font-bold">Hilfe & Glossar</span>
        </button>

        {/* Linkliste Modal Trigger */}
        <button
          onClick={onOpenLinklist}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-anthrazit-700/70 text-xs font-mono text-anthrazit-200 transition-colors cursor-pointer"
          title="Hannover OSINT Linkliste & Quellen öffnen"
        >
          <Bookmark className="w-3.5 h-3.5 text-accent" />
          <span className="hidden sm:inline">Quellen</span>
        </button>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Light Mode aktivieren' : 'Dark Mode aktivieren'}
          className="p-1.5 rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-anthrazit-700/70 text-anthrazit-300 hover:text-accent transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Light Mode aktivieren' : 'Dark Mode aktivieren'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-accent" />
          ) : (
            <Moon className="w-4 h-4 text-anthrazit-700" />
          )}
        </button>
      </div>
    </header>
  );
};
