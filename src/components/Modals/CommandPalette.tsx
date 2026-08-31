import React, { useState, useEffect } from 'react';
import { Search, MapPin, Code2, Bookmark, ArrowRight, Train } from 'lucide-react';
import { GeoLocation, OverpassPreset } from '../../types';
import { INITIAL_GEO_MARKERS, HAMBURG_GEO_MARKERS, MOCK_OVERPASS_PRESETS, HAMBURG_OVERPASS_PRESETS } from '../../data/mockData';
import { ALL_HANNOVER_STATIONS } from '../../data/hannoverStations';
import { ALL_HAMBURG_STATIONS } from '../../data/hamburgStations';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMarker: (marker: GeoLocation) => void;
  onSelectPreset: (preset: OverpassPreset) => void;
  onOpenLinklist: () => void;
  onOpenAdmin?: () => void;
  activeCity?: 'H' | 'HH';
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectMarker,
  onSelectPreset,
  onOpenLinklist,
  onOpenAdmin,
  activeCity = 'H'
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allMarkers = [...INITIAL_GEO_MARKERS, ...HAMBURG_GEO_MARKERS];
  const cityStationList = activeCity === 'HH' ? ALL_HAMBURG_STATIONS : ALL_HANNOVER_STATIONS;
  const otherStationList = activeCity === 'HH' ? ALL_HANNOVER_STATIONS : ALL_HAMBURG_STATIONS;
  const allStations = [...cityStationList, ...otherStationList];
  const allPresets = activeCity === 'HH' 
    ? [...HAMBURG_OVERPASS_PRESETS, ...MOCK_OVERPASS_PRESETS]
    : [...MOCK_OVERPASS_PRESETS, ...HAMBURG_OVERPASS_PRESETS];

  const filteredMarkers = allMarkers.filter(m => {
    const match = m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.type.toLowerCase().includes(query.toLowerCase()) ||
      m.district?.toLowerCase().includes(query.toLowerCase());
    return match;
  }).slice(0, 8);

  const filteredStations = query.trim().length >= 2
    ? allStations.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.type?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const filteredPresets = allPresets.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);

  return (
    <div className="fixed inset-0 z-[1200] flex items-end lg:items-start justify-center pt-0 lg:pt-20 p-0 lg:p-4 bg-anthrazit-950/80 backdrop-blur-sm">
      <div className="w-full lg:max-w-2xl max-h-[90dvh] lg:max-h-[85dvh] flex flex-col rounded-t-xl lg:rounded-xl bg-anthrazit-900 border-t lg:border border-anthrazit-700 shadow-2xl overflow-hidden font-mono pb-[env(safe-area-inset-bottom)] z-[1201]">
        {/* Input */}
        <div className="flex items-center px-3 lg:px-4 border-b border-anthrazit-800 bg-anthrazit-950 min-h-[60px]">
          <Search className="w-5 h-5 text-accent mr-3 shrink-0" />
          <input
            type="text"
            placeholder={activeCity === 'HH' ? 'Haltestellen, Knoten, Presets...' : 'Haltestellen, Knoten, Presets...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-3 min-h-[44px] bg-transparent text-sm text-anthrazit-100 placeholder-anthrazit-500 focus:outline-none"
            autoFocus
          />
          <kbd className="px-2 py-1 rounded bg-anthrazit-800 border border-anthrazit-700 text-xs text-anthrazit-400 hidden lg:inline-block shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3 lg:p-4 space-y-4">
          {/* Quick Actions */}
          <div>
            <div className="text-xs font-bold text-anthrazit-500 uppercase px-2 mb-2">
              Direkt-Aktionen ({activeCity === 'HH' ? 'Hamburg' : 'Hannover'})
            </div>
            <div className="space-y-2">
              {onOpenAdmin && (
                <button
                  onClick={() => {
                    onOpenAdmin();
                    onClose();
                  }}
                  className="w-full min-h-[48px] flex items-center justify-between p-3 rounded hover:bg-accent/10 border border-accent/30 text-xs text-accent transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-bold">⚡</span>
                    <span className="font-bold leading-tight">Ops & Admin Command Center öffnen (Milestones, Datasets, VPS)</span>
                  </div>
                  <span className="text-[10px] text-accent font-bold px-2 py-1 rounded bg-accent/20 hidden sm:block shrink-0 ml-2">PW: 4dm1n</span>
                </button>
              )}

              <button
                onClick={() => {
                  onOpenLinklist();
                  onClose();
                }}
                className="w-full min-h-[48px] flex items-center justify-between p-3 rounded hover:bg-anthrazit-850 border border-transparent hover:border-anthrazit-700 text-xs text-anthrazit-200 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Bookmark className="w-4 h-4 text-accent shrink-0" />
                  <span className="leading-tight">{activeCity === 'HH' ? 'Hamburg OSINT Linkliste & Datenquellen öffnen' : 'Hannover OSINT Linkliste & Datenquellen öffnen'}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-anthrazit-500 shrink-0 ml-2" />
              </button>
            </div>
          </div>

          {/* Station Results */}
          {filteredStations.length > 0 && (
            <div>
              <div className="text-xs font-bold text-anthrazit-500 uppercase px-2 mb-2">
                ÖPNV Haltestellen ({filteredStations.length})
              </div>
              <div className="space-y-2">
                {filteredStations.map((station) => (
                  <button
                    key={station.id}
                    onClick={() => {
                      onSelectMarker({
                        id: station.id,
                        name: station.name,
                        lat: station.lat,
                        lng: station.lng,
                        category: 'traffic',
                        type: 'Haltestelle',
                        status: 'active',
                        explanation: `Haltestelle ${station.name} im GVH/ÜSTRA-Netz (${station.type}).`,
                        details: {
                          'Station': station.name,
                          'Linien': station.type || 'ÖPNV',
                          'Quelle': 'ÜSTRA / GVH'
                        },
                        timestamp: 'Live'
                      });
                      onClose();
                    }}
                    className="w-full min-h-[48px] flex items-center justify-between p-3 rounded hover:bg-anthrazit-850 border border-transparent hover:border-anthrazit-700 text-xs text-anthrazit-200 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Train className="w-4 h-4 text-accent shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-anthrazit-100 block truncate">{station.name}</span>
                        <span className="text-xs text-anthrazit-400 block font-sans truncate">
                          {station.type || 'Haltestelle'} • Lat: {station.lat.toFixed(4)}, Lng: {station.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded bg-accent/15 text-accent font-bold shrink-0 ml-2">
                      Fokus Map
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Marker Results */}
          {filteredMarkers.length > 0 && (
            <div>
              <div className="text-xs font-bold text-anthrazit-500 uppercase px-2 mb-2">
                Karten-Knoten & Sensoren ({filteredMarkers.length})
              </div>
              <div className="space-y-2">
                {filteredMarkers.map((marker) => (
                  <button
                    key={marker.id}
                    onClick={() => {
                      onSelectMarker(marker);
                      onClose();
                    }}
                    className="w-full min-h-[48px] flex items-center justify-between p-3 rounded hover:bg-anthrazit-850 border border-transparent hover:border-anthrazit-700 text-xs text-anthrazit-200 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-accent shrink-0" />
                      <div>
                        <span className="font-bold text-anthrazit-100">{marker.name}</span>
                        <span className="text-xs text-anthrazit-400 block font-sans">
                          {marker.type} • {marker.district || 'Hannover'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-anthrazit-500 hidden sm:block shrink-0 ml-2">
                      {marker.lat.toFixed(3)}, {marker.lng.toFixed(3)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preset Results */}
          {filteredPresets.length > 0 && (
            <div>
              <div className="text-xs font-bold text-anthrazit-500 uppercase px-2 mb-2">
                Overpass GIS Presets ({filteredPresets.length})
              </div>
              <div className="space-y-2">
                {filteredPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onSelectPreset(preset);
                      onClose();
                    }}
                    className="w-full min-h-[48px] flex items-center justify-between p-3 rounded hover:bg-anthrazit-850 border border-transparent hover:border-anthrazit-700 text-xs text-anthrazit-200 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <Code2 className="w-4 h-4 text-accent shrink-0" />
                      <div>
                        <span className="font-bold text-anthrazit-100">{preset.title}</span>
                        <span className="text-xs text-anthrazit-400 block font-sans">
                          {preset.description}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-accent shrink-0 ml-2">QL Preset</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
