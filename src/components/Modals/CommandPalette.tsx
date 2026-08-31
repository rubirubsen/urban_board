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
  activeCity?: 'H' | 'HH';
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectMarker,
  onSelectPreset,
  onOpenLinklist,
  activeCity = 'H'
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
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
    return () => window.removeEventListener('keydown', handleKeyDown);
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-anthrazit-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg bg-anthrazit-900 border border-anthrazit-700 shadow-2xl overflow-hidden font-mono">
        {/* Input */}
        <div className="flex items-center px-4 border-b border-anthrazit-800 bg-anthrazit-950">
          <Search className="w-4 h-4 text-accent mr-3 shrink-0" />
          <input
            type="text"
            placeholder={activeCity === 'HH' ? 'Haltestellen (z. B. Landungsbrücken), Knoten, Overpass Presets...' : 'Haltestellen (z. B. Fenskeweg), Knoten, Overpass Presets...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-3.5 bg-transparent text-sm text-anthrazit-100 placeholder-anthrazit-500 focus:outline-none"
            autoFocus
          />
          <kbd className="px-1.5 py-0.5 rounded bg-anthrazit-800 border border-anthrazit-700 text-[10px] text-anthrazit-400">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Actions */}
          <div>
            <div className="text-[10px] font-bold text-anthrazit-500 uppercase px-2 mb-1.5">
              Direkt-Aktionen ({activeCity === 'HH' ? 'Hamburg' : 'Hannover'})
            </div>
            <button
              onClick={() => {
                onOpenLinklist();
                onClose();
              }}
              className="w-full flex items-center justify-between p-2 rounded hover:bg-anthrazit-850 text-xs text-anthrazit-200 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <Bookmark className="w-3.5 h-3.5 text-accent" />
                <span>{activeCity === 'HH' ? 'Hamburg OSINT Linkliste & Datenquellen öffnen' : 'Hannover OSINT Linkliste & Datenquellen öffnen'}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-anthrazit-500" />
            </button>
          </div>

          {/* Station Results */}
          {filteredStations.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-anthrazit-500 uppercase px-2 mb-1.5">
                ÖPNV Haltestellen ({filteredStations.length})
              </div>
              <div className="space-y-1">
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
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-anthrazit-850 text-xs text-anthrazit-200 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Train className="w-3.5 h-3.5 text-accent shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-anthrazit-100 block truncate">{station.name}</span>
                        <span className="text-[10px] text-anthrazit-400 block font-sans truncate">
                          {station.type || 'Haltestelle'} • Lat: {station.lat.toFixed(4)}, Lng: {station.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/15 text-accent font-bold shrink-0 ml-2">
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
              <div className="text-[10px] font-bold text-anthrazit-500 uppercase px-2 mb-1.5">
                Karten-Knoten & Sensoren ({filteredMarkers.length})
              </div>
              <div className="space-y-1">
                {filteredMarkers.map((marker) => (
                  <button
                    key={marker.id}
                    onClick={() => {
                      onSelectMarker(marker);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-anthrazit-850 text-xs text-anthrazit-200 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                      <div>
                        <span className="font-bold text-anthrazit-100">{marker.name}</span>
                        <span className="text-[10px] text-anthrazit-400 block font-sans">
                          {marker.type} • {marker.district || 'Hannover'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-anthrazit-500">
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
              <div className="text-[10px] font-bold text-anthrazit-500 uppercase px-2 mb-1.5">
                Overpass GIS Presets ({filteredPresets.length})
              </div>
              <div className="space-y-1">
                {filteredPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onSelectPreset(preset);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-anthrazit-850 text-xs text-anthrazit-200 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Code2 className="w-3.5 h-3.5 text-accent" />
                      <div>
                        <span className="font-bold text-anthrazit-100">{preset.title}</span>
                        <span className="text-[10px] text-anthrazit-400 block font-sans">
                          {preset.description}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-accent">QL Preset</span>
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
