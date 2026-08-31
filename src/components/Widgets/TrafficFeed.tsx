import React, { useState, useEffect, useRef } from 'react';
import { TrafficIncident } from '../../types';
import { 
  fetchLiveDepartures, 
  searchTransitStops, 
  fetchLiveOsmLineRoute,
  DEFAULT_PINNED_STOPS_HANNOVER,
  DEFAULT_PINNED_STOPS_HAMBURG,
  LiveDeparture, 
  TransitStop 
} from '../../services/apiService';
import { HANNOVER_TRANSIT_ROUTES, HAMBURG_TRANSIT_ROUTES, TransitLineRoute } from '../../data/transitRoutes';
import { 
  Clock, 
  Compass, 
  Bus, 
  Train, 
  RefreshCw, 
  Search, 
  Pin, 
  PinOff, 
  X, 
  MapPin, 
  Route,
  Loader2,
  Camera
} from 'lucide-react';

interface TrafficFeedProps {
  incidents?: TrafficIncident[];
  activeRoute?: TransitLineRoute | null;
  onSelectStationOnMap?: (lat: number, lng: number, name: string) => void;
  onSelectRoute?: (route: TransitLineRoute | null) => void;
  activeCity?: 'H' | 'HH';
}

export const TrafficFeed: React.FC<TrafficFeedProps> = ({
  incidents = [],
  activeRoute = null,
  onSelectStationOnMap,
  onSelectRoute,
  activeCity = 'H'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'oepnv' | 'vmz'>('oepnv');

  const defaultStops = activeCity === 'HH' ? DEFAULT_PINNED_STOPS_HAMBURG : DEFAULT_PINNED_STOPS_HANNOVER;
  const storageKey = `hboard_pinned_transit_stops_${activeCity}`;

  // Pinned Stops State
  const [pinnedStops, setPinnedStops] = useState<TransitStop[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : defaultStops;
    } catch {
      return defaultStops;
    }
  });

  const [activeStation, setActiveStation] = useState<TransitStop>(pinnedStops[0] || defaultStops[0]);
  const [departures, setDepartures] = useState<LiveDeparture[]>([]);
  const [loadingDepartures, setLoadingDepartures] = useState<boolean>(false);
  const [loadingRoute, setLoadingRoute] = useState<boolean>(false);

  // Sync pinned stops when city switches
  useEffect(() => {
    const currentDefault = activeCity === 'HH' ? DEFAULT_PINNED_STOPS_HAMBURG : DEFAULT_PINNED_STOPS_HANNOVER;
    try {
      const saved = localStorage.getItem(`hboard_pinned_transit_stops_${activeCity}`);
      const stops = saved ? JSON.parse(saved) : currentDefault;
      setPinnedStops(stops);
      setActiveStation(stops[0] || currentDefault[0]);
    } catch {
      setPinnedStops(currentDefault);
      setActiveStation(currentDefault[0]);
    }
  }, [activeCity]);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<TransitStop[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [filterType, setFilterType] = useState<string>('all');

  const savePinnedStops = (stops: TransitStop[]) => {
    setPinnedStops(stops);
    try {
      localStorage.setItem(storageKey, JSON.stringify(stops));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  };

  const togglePin = (stop: TransitStop) => {
    const isPinned = pinnedStops.some(s => s.id === stop.id);
    if (isPinned) {
      if (pinnedStops.length <= 1) return;
      savePinnedStops(pinnedStops.filter(s => s.id !== stop.id));
    } else {
      savePinnedStops([...pinnedStops, stop]);
    }
  };

  const loadDepartures = async (station: TransitStop) => {
    setLoadingDepartures(true);
    try {
      const res = await fetchLiveDepartures(station.id, 40, activeCity);
      if (res.success) {
        setDepartures(res.departures);
      }
    } finally {
      setLoadingDepartures(false);
    }
  };

  const handleSelectStation = (stop: TransitStop) => {
    setActiveStation(stop);
    setIsSearchOpen(false);
    setSearchQuery('');
    if (onSelectStationOnMap) {
      onSelectStationOnMap(stop.lat, stop.lng, stop.name);
    }
  };

  const [autobahnWebcams, setAutobahnWebcams] = useState<any[]>([]);
  const [autobahnWarnings, setAutobahnWarnings] = useState<any[]>([]);

  useEffect(() => {
    import('../../services/apiService').then(({ fetchLiveAutobahnWebcams, fetchLiveAutobahnWarnings }) => {
      fetchLiveAutobahnWebcams(activeCity).then(cams => setAutobahnWebcams(cams));
      fetchLiveAutobahnWarnings(activeCity).then(warns => setAutobahnWarnings(warns));
    });
  }, [activeCity]);

  const handleToggleLineRoute = async (lineName: string) => {
    const cleanRef = lineName.replace(/Stadtbahn|S-Bahn|Bus|Tram|U-Bahn|\s+/gi, '').trim();
    const lineRef = cleanRef;

    if (activeRoute && activeRoute.ref === lineRef) {
      onSelectRoute?.(null);
      return;
    }

    setLoadingRoute(true);
    try {
      const osmRoute = await fetchLiveOsmLineRoute(lineRef, activeCity);
      if (osmRoute) {
        onSelectRoute?.(osmRoute);
      } else {
        const routesMap = activeCity === 'HH' ? HAMBURG_TRANSIT_ROUTES : HANNOVER_TRANSIT_ROUTES;
        if (routesMap[lineRef]) {
          onSelectRoute?.(routesMap[lineRef]);
        }
      }
    } finally {
      setLoadingRoute(false);
    }
  };

  useEffect(() => {
    loadDepartures(activeStation);
    const interval = setInterval(() => {
      loadDepartures(activeStation);
    }, 30000);
    return () => clearInterval(interval);
  }, [activeStation.id, activeCity]);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchTransitStops(searchQuery, activeCity);
      setSearchResults(results);
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, activeCity]);

  const filteredIncidents = filterType === 'all'
    ? incidents
    : incidents.filter((i: TrafficIncident) => i.type.toLowerCase() === filterType.toLowerCase());

  const isCurrentActivePinned = pinnedStops.some(s => s.id === activeStation.id);
  const routeQuickButtons = activeCity === 'HH' 
    ? ['U1', 'U2', 'U3', 'U4', 'S1', 'S2', 'S3', 'S5', '61', '62', '72'] 
    : ['1', '3', '4', '6', '10', 'S4'];

  return (
    <div className="space-y-4 text-xs font-mono select-none w-full max-w-full overflow-x-hidden">
      {/* Sub-Tab Selector */}
      <div className="flex rounded bg-anthrazit-950 p-1 border border-anthrazit-800">
        <button
          onClick={() => setActiveSubTab('oepnv')}
          className={`flex-1 py-1.5 rounded text-center transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
            activeSubTab === 'oepnv'
              ? 'bg-accent text-anthrazit-950 font-bold shadow-sm'
              : 'text-anthrazit-400 hover:text-anthrazit-200'
          }`}
        >
          <Train className="w-3.5 h-3.5" />
          <span>{activeCity === 'HH' ? 'HVV Live Radar' : 'GVH Live Radar'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('vmz')}
          className={`flex-1 py-1.5 rounded text-center transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
            activeSubTab === 'vmz'
              ? 'bg-accent text-anthrazit-950 font-bold shadow-sm'
              : 'text-anthrazit-400 hover:text-anthrazit-200'
          }`}
        >
          <Bus className="w-3.5 h-3.5" />
          <span>{activeCity === 'HH' ? 'Hafen & Elbe Stau' : 'VMZ Stau & Straßen'}</span>
        </button>
      </div>

      {/* --- TAB 1: ECHTZEIT ÖPNV ABFAHRTEN & LINIENNETZ --- */}
      {activeSubTab === 'oepnv' && (
        <div className="space-y-3">
          {/* Linienverlauf Schnellwahl-Bar */}
          <div className="p-2.5 rounded bg-anthrazit-900 border border-anthrazit-800 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-anthrazit-400">
              <span className="uppercase font-bold flex items-center space-x-1">
                <Route className="w-3 h-3 text-accent" />
                <span>Exakte OSM-Linienführung ({activeCity === 'HH' ? 'HVV' : 'ÜSTRA'}):</span>
              </span>
              {activeRoute ? (
                <button
                  onClick={() => onSelectRoute?.(null)}
                  className="text-accent hover:underline text-[9px] cursor-pointer font-bold"
                >
                  Ausblenden
                </button>
              ) : loadingRoute ? (
                <span className="text-accent text-[9px] flex items-center space-x-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Lade OSM Track...</span>
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {routeQuickButtons.map((ref) => {
                const isActive = activeRoute?.ref === ref;
                const label = ref === '62' ? 'Fähre 62' : ref.startsWith('U') || ref.startsWith('S') ? ref : `Linie ${ref}`;
                return (
                  <button
                    key={ref}
                    onClick={() => handleToggleLineRoute(ref)}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-accent text-anthrazit-950 border-accent shadow-accent-sm'
                        : 'bg-anthrazit-950 border-anthrazit-700 text-anthrazit-300 hover:border-accent hover:text-accent'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & Station Selector Bar */}
          <div className="p-3 rounded bg-anthrazit-900 border border-anthrazit-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-anthrazit-400">
                Haltestelle suchen & pinnen
              </span>
              <button
                onClick={() => loadDepartures(activeStation)}
                disabled={loadingDepartures}
                className="flex items-center space-x-1 text-[10px] text-accent hover:underline cursor-pointer"
                title="Echtzeit-Abfahrten neu laden"
              >
                <RefreshCw className={`w-3 h-3 ${loadingDepartures ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
            </div>

            {/* Live Search Input */}
            <div ref={searchContainerRef} className="relative">
              <div className="flex items-center bg-anthrazit-950 border border-anthrazit-700 rounded px-2 py-1.5 focus-within:border-accent">
                <Search className="w-3.5 h-3.5 text-anthrazit-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Haltestelle suchen (z. B. Fenskeweg, Lister Platz)..."
                  value={searchQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  className="w-full bg-transparent text-xs text-anthrazit-100 placeholder-anthrazit-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="p-0.5 text-anthrazit-400 hover:text-anthrazit-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                {isSearching && <Loader2 className="w-3.5 h-3.5 text-accent animate-spin ml-1" />}
              </div>

              {/* Search Results Dropdown */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 z-30 max-h-56 overflow-y-auto rounded bg-anthrazit-900 border border-anthrazit-700 shadow-2xl p-1 space-y-1">
                  {searchResults.map((stop) => {
                    const isPinned = pinnedStops.some(s => s.id === stop.id);
                    return (
                      <div
                        key={stop.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-anthrazit-850 cursor-pointer transition-colors"
                      >
                        <div
                          onClick={() => handleSelectStation(stop)}
                          className="flex items-center space-x-2 flex-1 min-w-0"
                        >
                          <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                          <div className="truncate">
                            <span className="font-bold text-anthrazit-100 block text-xs truncate">
                              {stop.name}
                            </span>
                            <span className="text-[10px] text-anthrazit-500">{stop.type || 'ÖPNV'}</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePin(stop);
                          }}
                          className={`p-1.5 rounded hover:bg-anthrazit-800 transition-colors ${
                            isPinned ? 'text-accent' : 'text-anthrazit-500 hover:text-anthrazit-300'
                          }`}
                          title={isPinned ? 'Aus Favoriten entfernen' : 'Haltestelle pinnen'}
                        >
                          <Pin className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pinned Quick-Select Buttons */}
            <div>
              <div className="text-[9px] uppercase font-bold text-anthrazit-500 mb-1.5 flex items-center justify-between">
                <span>Gepinnte Haltestellen ({pinnedStops.length})</span>
                <span className="text-[9px] text-anthrazit-400 lowercase">Klick = Map-Focus & Abfahrten</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {pinnedStops.map((stop) => {
                  const isSelected = activeStation.id === stop.id;
                  return (
                    <div
                      key={stop.id}
                      onClick={() => handleSelectStation(stop)}
                      className={`group px-2 py-1.5 rounded text-[11px] flex items-center justify-between transition-colors cursor-pointer border ${
                        isSelected
                          ? 'bg-accent/15 border-accent text-accent font-bold'
                          : 'bg-anthrazit-950 border-anthrazit-800 text-anthrazit-300 hover:border-anthrazit-700'
                      }`}
                    >
                      <span className="truncate pr-1">{stop.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(stop);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-anthrazit-500 hover:text-accent transition-opacity"
                        title="Entpinnen"
                      >
                        <PinOff className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Station Header Info */}
            <div className="pt-2 border-t border-anthrazit-800/70 flex items-center justify-between text-[11px]">
              <div className="flex items-center space-x-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                <span className="font-bold text-anthrazit-100 truncate">{activeStation.name}</span>
              </div>
              <button
                onClick={() => togglePin(activeStation)}
                className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] border transition-colors cursor-pointer ${
                  isCurrentActivePinned
                    ? 'bg-accent/15 border-accent/40 text-accent font-bold'
                    : 'bg-anthrazit-850 border-anthrazit-700 text-anthrazit-400 hover:text-anthrazit-200'
                }`}
                title={isCurrentActivePinned ? 'Gepinnt' : 'Haltestelle anheften'}
              >
                <Pin className="w-3 h-3" />
                <span>{isCurrentActivePinned ? 'Gepinnt' : 'Pinnen'}</span>
              </button>
            </div>
          </div>

          {/* Departures Board */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] uppercase font-bold text-anthrazit-400">
                Echtzeit-Abfahrten ({departures.length})
              </span>
              <span className="text-[10px] text-accent font-mono">Klick auf Zeile = OSM-Track</span>
            </div>

            {loadingDepartures && departures.length === 0 ? (
              <div className="p-6 text-center text-anthrazit-400">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-accent" />
                <span>Lade Abfahrten für {activeStation.name}...</span>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-96 overflow-y-auto pr-0.5">
                {departures.map((dep, idx) => {
                  const isDelayed = dep.delayMinutes > 0;
                  const isCancelled = dep.cancelled;

                  return (
                    <div
                      key={dep.tripId + idx}
                      onClick={() => handleToggleLineRoute(dep.line)}
                      className="p-2.5 rounded bg-anthrazit-900 border border-anthrazit-800 hover:border-accent/60 transition-colors flex items-center justify-between cursor-pointer group"
                      title="Klicken, um OpenStreetMap Linienführung auf der Karte anzuzeigen"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        {/* Line Badge */}
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] shrink-0 group-hover:scale-105 transition-transform ${
                          dep.line.includes('Stadtbahn') || dep.type === 'subway'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            : dep.line.includes('S-Bahn') || dep.type === 'regional'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-accent/20 text-accent border border-accent/40'
                        }`}>
                          {dep.line}
                        </span>

                        <div className="min-w-0">
                          <span className="font-bold text-anthrazit-100 truncate block text-[11px]">
                            {dep.direction}
                          </span>
                          {dep.platform && (
                            <span className="text-[10px] text-anthrazit-500 font-sans">
                              {dep.platform}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Time & Delay */}
                      <div className="text-right shrink-0 pl-2">
                        <div className="font-bold text-anthrazit-100 text-xs">
                          {dep.when}
                        </div>
                        {isCancelled ? (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-red-500/20 text-red-400 font-bold">
                            FÄLLT AUS
                          </span>
                        ) : isDelayed ? (
                          <span className="text-[10px] text-accent font-bold">
                            +{dep.delayMinutes} Min.
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            Pünktlich
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: VMZ STRAßENVERKEHR & STAU --- */}
      {activeSubTab === 'vmz' && (
        <div className="space-y-3">
          <div className="p-3 rounded bg-anthrazit-900 border border-anthrazit-800">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-[11px] text-anthrazit-200 uppercase">VMZ Niedersachsen Lage</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                ONLINE
              </span>
            </div>
            <p className="text-[11px] font-sans text-anthrazit-400 leading-snug">
              Echtzeitmeldungen der Verkehrsmanagementzentrale für Autobahnen (A2, A7) und Schnellwege (B3, B6, B65) in Hannover.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] uppercase font-bold text-anthrazit-400">Aktuelle Störungen</span>
              <div className="flex space-x-1">
                {['all', 'Stau', 'Baustelle'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-1.5 py-0.5 rounded text-[10px] uppercase cursor-pointer ${
                      filterType === t
                        ? 'bg-accent text-anthrazit-950 font-bold'
                        : 'bg-anthrazit-850 text-anthrazit-400 hover:text-anthrazit-200'
                    }`}
                  >
                    {t === 'all' ? 'Alle' : t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {(autobahnWarnings.length > 0 ? autobahnWarnings : filteredIncidents).map((inc: any) => (
                <div
                  key={inc.id}
                  onClick={() => {
                    if (inc.lat && inc.lng && onSelectStationOnMap) {
                      onSelectStationOnMap(inc.lat, inc.lng, `${inc.road}: ${inc.title}`);
                    }
                  }}
                  className="p-2.5 rounded bg-anthrazit-900 border border-anthrazit-800 hover:border-anthrazit-700 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-anthrazit-800 text-anthrazit-100 font-bold text-[10px]">
                        {inc.road}
                      </span>
                      <span className={`text-[10px] px-1 rounded font-bold ${
                        inc.type === 'Stau' 
                          ? 'bg-accent/15 text-accent border border-accent/30' 
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        {inc.type}
                      </span>
                    </div>
                    <span className="text-[10px] text-anthrazit-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{inc.updatedAt}</span>
                    </span>
                  </div>

                  <p className="text-[11px] font-sans text-anthrazit-300 leading-snug mb-2">
                    {inc.title || (Array.isArray(inc.description) ? inc.description.join(' ') : inc.location)}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-anthrazit-400 border-t border-anthrazit-800/60 pt-1.5">
                    <div className="flex items-center space-x-1">
                      <Compass className="w-3 h-3 text-anthrazit-500" />
                      <span>Quelle: Die Autobahn GmbH</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-accent font-bold">Echtzeit-Meldung</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VMZ & Autobahn GmbH Live Webcams Section */}
          <div className="space-y-2 pt-2 border-t border-anthrazit-800">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] uppercase font-bold text-anthrazit-400">Autobahn & VMZ Verkehrskameras (Live)</span>
              <span className="text-[9px] text-accent font-bold">
                {autobahnWebcams.length > 0 ? `${autobahnWebcams.length} Kameras online` : '3 Kameras'}
              </span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {autobahnWebcams.map((cam) => (
                <div
                  key={cam.id}
                  onClick={() => {
                    if (onSelectStationOnMap) {
                      onSelectStationOnMap(cam.lat, cam.lng, `Webcam: ${cam.title}`);
                    }
                  }}
                  className="p-2 rounded bg-anthrazit-900 border border-anthrazit-800 hover:border-accent flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="p-1 rounded bg-anthrazit-950 text-accent border border-anthrazit-800 group-hover:border-accent">
                      <Camera className="w-3.5 h-3.5" />
                    </span>
                    <div className="truncate">
                      <span className="font-bold text-anthrazit-200 block text-xs truncate">{cam.title}</span>
                      <span className="text-[10px] text-anthrazit-400">{cam.road} • {cam.subtitle || 'Autobahn GmbH'}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/15 text-accent font-bold shrink-0">
                    Live Feed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
