import React from 'react';
import { 
  Car, 
  Cpu, 
  ShieldAlert, 
  Globe, 
  Layers, 
  Eye, 
  EyeOff,
  Crosshair, 
  Code2,
  X
} from 'lucide-react';
import { CategoryType } from '../types';

interface SidebarProps {
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  activeLayers: {
    webcams: boolean;
    iotSensors: boolean;
    mobility: boolean;
    infra: boolean;
    gridOverlay: boolean;
  };
  onToggleLayer: (layer: keyof SidebarProps['activeLayers']) => void;
  onCenterCity: () => void;
  onOpenOverpass: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  activeCity?: 'H' | 'HH';
  categoryCounts?: Partial<Record<CategoryType, number>>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  onSelectCategory,
  activeLayers,
  onToggleLayer,
  onCenterCity,
  onOpenOverpass,
  isOpenMobile = false,
  onCloseMobile,
  activeCity = 'H',
  categoryCounts
}) => {
  const counts = {
    all: categoryCounts?.all ?? (activeCity === 'HH' ? 12 : 11),
    traffic: categoryCounts?.traffic ?? (activeCity === 'HH' ? 6 : 5),
    iot: categoryCounts?.iot ?? (activeCity === 'HH' ? 3 : 3),
    security: categoryCounts?.security ?? (activeCity === 'HH' ? 4 : 2),
    cyber: categoryCounts?.cyber ?? (activeCity === 'HH' ? 5 : 4),
  };

  const navItems = [
    { id: 'all' as CategoryType, label: 'Alle Sektoren', icon: Layers, count: counts.all },
    { id: 'traffic' as CategoryType, label: 'Verkehr & Mobilität', icon: Car, count: counts.traffic },
    { 
      id: 'iot' as CategoryType, 
      label: activeCity === 'HH' ? 'IoT & Smart City (BUKEA)' : 'IoT & Smart City (HIDD)', 
      icon: Cpu, 
      count: counts.iot 
    },
    { id: 'security' as CategoryType, label: 'Kritische Infrastruktur', icon: ShieldAlert, count: counts.security },
    { id: 'cyber' as CategoryType, label: 'Cyber & Recon', icon: Globe, count: counts.cyber },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between select-none overflow-y-auto">
      <div className="p-3 space-y-4">
        {/* Mobile Header with Close Button */}
        <div className="flex md:hidden items-center justify-between pb-2 border-b border-anthrazit-800">
          <span className="font-bold text-xs text-anthrazit-100 uppercase tracking-wide">
            OSINT Sektoren & Layer
          </span>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded hover:bg-anthrazit-800 text-anthrazit-400 hover:text-anthrazit-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sektor-Navigation */}
        <div>
          <div className="text-[10px] font-mono font-bold tracking-wider text-anthrazit-400 uppercase px-2 mb-2 flex items-center justify-between">
            <span>OSINT Sektoren</span>
            <span className="text-accent text-[9px] font-bold">
              {activeCity === 'HH' ? 'HH SEKTOR' : 'H SEKTOR'}
            </span>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectCategory(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-mono transition-all cursor-pointer ${
                    isActive
                      ? 'bg-accent/15 text-accent border border-accent/40 font-semibold'
                      : 'text-anthrazit-300 hover:bg-anthrazit-850 hover:text-anthrazit-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-accent' : 'text-anthrazit-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono shrink-0 ml-1 ${
                    isActive ? 'bg-accent text-anthrazit-950 font-bold' : 'bg-anthrazit-800 text-anthrazit-400'
                  }`}>
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* GIS / Map Layer Toggles */}
        <div>
          <div className="text-[10px] font-mono font-bold tracking-wider text-anthrazit-400 uppercase px-2 mb-2 flex items-center justify-between">
            <span>Karten-Ebenen</span>
            <button
              onClick={onCenterCity}
              className="text-accent hover:underline flex items-center space-x-1 lowercase text-[10px] cursor-pointer"
              title={activeCity === 'HH' ? 'Auf Hamburg Zentrum zentrieren' : 'Auf Hannover Zentrum zentrieren'}
            >
              <Crosshair className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <button
              onClick={() => onToggleLayer('webcams')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-mono border transition-colors cursor-pointer ${
                activeLayers.webcams 
                  ? 'bg-anthrazit-850 border-anthrazit-700 text-anthrazit-200' 
                  : 'bg-anthrazit-900/50 border-anthrazit-800/60 text-anthrazit-500'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                <span>{activeCity === 'HH' ? 'HPA & City Webcams' : 'VMZ Webcams'}</span>
              </div>
              {activeLayers.webcams ? <Eye className="w-3.5 h-3.5 text-accent" /> : <EyeOff className="w-3.5 h-3.5 text-anthrazit-600" />}
            </button>

            <button
              onClick={() => onToggleLayer('iotSensors')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-mono border transition-colors cursor-pointer ${
                activeLayers.iotSensors 
                  ? 'bg-anthrazit-850 border-anthrazit-700 text-anthrazit-200' 
                  : 'bg-anthrazit-900/50 border-anthrazit-800/60 text-anthrazit-500'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Pegel- & Umweltdaten</span>
              </div>
              {activeLayers.iotSensors ? <Eye className="w-3.5 h-3.5 text-accent" /> : <EyeOff className="w-3.5 h-3.5 text-anthrazit-600" />}
            </button>

            <button
              onClick={() => onToggleLayer('mobility')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-mono border transition-colors cursor-pointer ${
                activeLayers.mobility 
                  ? 'bg-anthrazit-850 border-anthrazit-700 text-anthrazit-200' 
                  : 'bg-anthrazit-900/50 border-anthrazit-800/60 text-anthrazit-500'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>{activeCity === 'HH' ? 'StadtRAD & ÖPNV Hubs' : 'Nextbike & GBFS Hubs'}</span>
              </div>
              {activeLayers.mobility ? <Eye className="w-3.5 h-3.5 text-accent" /> : <EyeOff className="w-3.5 h-3.5 text-anthrazit-600" />}
            </button>

            <button
              onClick={() => onToggleLayer('infra')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-mono border transition-colors cursor-pointer ${
                activeLayers.infra 
                  ? 'bg-anthrazit-850 border-anthrazit-700 text-anthrazit-200' 
                  : 'bg-anthrazit-900/50 border-anthrazit-800/60 text-anthrazit-500'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Kritische Infrastruktur</span>
              </div>
              {activeLayers.infra ? <Eye className="w-3.5 h-3.5 text-accent" /> : <EyeOff className="w-3.5 h-3.5 text-anthrazit-600" />}
            </button>

            <button
              onClick={() => onToggleLayer('gridOverlay')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-mono border transition-colors cursor-pointer ${
                activeLayers.gridOverlay 
                  ? 'bg-anthrazit-850 border-anthrazit-700 text-anthrazit-200' 
                  : 'bg-anthrazit-900/50 border-anthrazit-800/60 text-anthrazit-500'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-anthrazit-400"></span>
                <span>MGRS / Taktisches Gitter</span>
              </div>
              {activeLayers.gridOverlay ? <Eye className="w-3.5 h-3.5 text-accent" /> : <EyeOff className="w-3.5 h-3.5 text-anthrazit-600" />}
            </button>
          </div>
        </div>

        {/* Overpass Query Trigger */}
        <div>
          <button
            onClick={onOpenOverpass}
            className="w-full flex items-center justify-between px-3 py-2 rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-accent/30 hover:border-accent text-xs font-mono text-accent transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-accent" />
              <span className="font-semibold">Overpass GIS Turbo</span>
            </div>
            <span className="text-[10px] text-anthrazit-400 group-hover:text-accent">4 Presets</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-anthrazit-800 bg-anthrazit-950/60 text-[11px] font-mono space-y-2">
        <div className="flex items-center justify-between text-anthrazit-400">
          <span>REGION</span>
          <span className="text-anthrazit-200 font-semibold">
            {activeCity === 'HH' ? 'Hamburg / HH' : 'Hannover / NDS'}
          </span>
        </div>
        <div className="flex items-center justify-between text-anthrazit-400">
          <span>{activeCity === 'HH' ? 'BSH / HPA PEGDAT' : 'NLWKN PEGDAT'}</span>
          <span className="text-accent font-semibold">ONLINE</span>
        </div>
        <div className="pt-1 text-[10px] text-anthrazit-500 text-center">
          HBOARD Urban OSINT Engine v0.1
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex md:w-64 border-r border-anthrazit-800 bg-anthrazit-900/90 dark:bg-anthrazit-950/90 shrink-0 select-none overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide-out Overlay) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-anthrazit-950/80 backdrop-blur-sm transition-opacity" 
            onClick={onCloseMobile}
          />
          <aside className="relative w-72 max-w-[85vw] h-full border-r border-anthrazit-700 bg-anthrazit-900/98 shadow-2xl z-10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
