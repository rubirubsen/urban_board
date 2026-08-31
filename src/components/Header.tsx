import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Search, 
  Bookmark,
  Layers, 
  Clock, 
  HelpCircle,
  Menu,
  MoreVertical,
  X,
  Zap,
  SlidersHorizontal
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
  onOpenAdmin?: () => void;
  onToggleMobileSidebar?: () => void;
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
  onOpenAdmin,
  onToggleMobileSidebar,
  activeMarkerCount
}) => {
  const [isMobileQuickMenuOpen, setIsMobileQuickMenuOpen] = useState(false);
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
      <div className="flex items-center space-x-2 sm:space-x-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-1.5 rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-anthrazit-700 text-accent cursor-pointer"
            title="Sektoren & Layer öffnen"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
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

      {/* Right Actions (Desktop: Full Row / Mobile: Compact Icons + Settings Popover) */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {/* Mobile Quick Search Button */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-anthrazit-700 text-anthrazit-300 hover:text-accent transition-colors cursor-pointer"
          title="OSINT Schnellsuche"
        >
          <Search className="w-4 h-4 text-accent" />
        </button>

        {/* Desktop District Filter Dropdown */}
        <div className="hidden md:flex items-center">
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

        {/* Desktop Admin / Ops Hub Trigger */}
        <button
          onClick={onOpenAdmin}
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded bg-accent/15 hover:bg-accent/25 border border-accent/50 text-xs font-mono text-accent transition-colors cursor-pointer shadow-sm"
          title="Admin & Operations Dashboard öffnen (PW: 4dm1n)"
        >
          <span className="font-bold">⚡ OPS</span>
        </button>

        {/* Desktop Glossary & Beginner Help Modal Trigger */}
        <button
          onClick={onOpenGlossary}
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-anthrazit-700/70 text-xs font-mono text-anthrazit-300 hover:text-anthrazit-100 transition-colors cursor-pointer"
          title="Glossar & Erklärungen für Einsteiger öffnen"
        >
          <HelpCircle className="w-3.5 h-3.5 text-accent" />
          <span>Hilfe</span>
        </button>

        {/* Desktop Linkliste Modal Trigger */}
        <button
          onClick={onOpenLinklist}
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-anthrazit-700/70 text-xs font-mono text-anthrazit-300 hover:text-anthrazit-100 transition-colors cursor-pointer"
          title="Hannover OSINT Linkliste & Quellen öffnen"
        >
          <Bookmark className="w-3.5 h-3.5 text-accent" />
          <span>Quellen</span>
        </button>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Light Mode aktivieren' : 'Dark Mode aktivieren'}
          className="p-1.5 sm:p-2 rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-anthrazit-700/70 text-anthrazit-300 hover:text-accent transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Light Mode aktivieren' : 'Dark Mode aktivieren'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-accent" />
          ) : (
            <Moon className="w-4 h-4 text-anthrazit-700" />
          )}
        </button>

        {/* Mobile Quick Menu Hamburger / Dots Button */}
        <div className="relative md:hidden">
          <button
            onClick={() => setIsMobileQuickMenuOpen(prev => !prev)}
            className="p-2 rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-anthrazit-700 text-accent font-bold transition-colors cursor-pointer"
            title="Tools, OPS & Einstellungen"
          >
            {isMobileQuickMenuOpen ? <X className="w-4 h-4" /> : <MoreVertical className="w-4 h-4" />}
          </button>

          {/* Mobile Quick Popover Dropdown */}
          {isMobileQuickMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40 bg-anthrazit-950/60 backdrop-blur-xs"
                onClick={() => setIsMobileQuickMenuOpen(false)}
              />
              <div className="absolute right-0 top-12 w-64 p-3 rounded-xl bg-anthrazit-900 border border-anthrazit-700 shadow-2xl z-50 space-y-2 font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-[10px] font-bold text-anthrazit-400 uppercase pb-1 border-b border-anthrazit-800 flex items-center justify-between">
                  <span>OSINT Tools & Settings</span>
                  <span className="text-accent text-[9px]">v0.1</span>
                </div>

                {/* OPS Admin Hub Button */}
                <button
                  onClick={() => {
                    onOpenAdmin?.();
                    setIsMobileQuickMenuOpen(false);
                  }}
                  className="w-full py-2 px-2.5 rounded bg-accent/15 hover:bg-accent/25 border border-accent/40 text-accent flex items-center space-x-2 font-bold cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-accent" />
                  <span>⚡ OPS & Admin Center</span>
                </button>

                {/* Glossary / Help Button */}
                <button
                  onClick={() => {
                    onOpenGlossary();
                    setIsMobileQuickMenuOpen(false);
                  }}
                  className="w-full py-2 px-2.5 rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-anthrazit-750 text-anthrazit-200 flex items-center space-x-2 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-accent" />
                  <span>📖 Glossar & Einsteiger-Hilfe</span>
                </button>

                {/* Linklist / Sources Button */}
                <button
                  onClick={() => {
                    onOpenLinklist();
                    setIsMobileQuickMenuOpen(false);
                  }}
                  className="w-full py-2 px-2.5 rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-anthrazit-750 text-anthrazit-200 flex items-center space-x-2 cursor-pointer"
                >
                  <Bookmark className="w-4 h-4 text-accent" />
                  <span>🔗 Primärquellen & Linkliste</span>
                </button>

                {/* District Select Dropdown on Mobile */}
                <div className="pt-1 border-t border-anthrazit-800 space-y-1">
                  <div className="text-[10px] text-anthrazit-400 font-bold uppercase flex items-center space-x-1">
                    <SlidersHorizontal className="w-3 h-3 text-accent" />
                    <span>Stadtbezirk filtern:</span>
                  </div>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      onSelectDistrict(e.target.value);
                      setIsMobileQuickMenuOpen(false);
                    }}
                    className="w-full text-xs bg-anthrazit-950 border border-anthrazit-700 text-anthrazit-200 rounded p-2 focus:outline-none focus:border-accent font-mono"
                  >
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
