import React, { useState, useEffect, useMemo } from 'react';
import L from 'leaflet';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OSINTMap } from './components/Map/OSINTMap';
import { TelemetryWidget } from './components/Widgets/TelemetryWidget';
import { TrafficFeed } from './components/Widgets/TrafficFeed';
import { TransitScheduleHub } from './components/Widgets/TransitScheduleHub';
import { CyberAssetsTable } from './components/Widgets/CyberAssetsTable';
import { OsintQueryHub } from './components/Widgets/OsintQueryHub';
import { CommandPalette } from './components/Modals/CommandPalette';
import { LinklistViewModal } from './components/Modals/LinklistViewModal';
import { GlossaryModal } from './components/Modals/GlossaryModal';
import { WebcamViewerModal } from './components/Modals/WebcamViewerModal';
import { 
  ThemeMode, 
  CategoryType, 
  GeoLocation, 
  OverpassPreset,
  OverpassLiveElement 
} from './types';
import { TransitLineRoute } from './data/transitRoutes';
import { 
  INITIAL_GEO_MARKERS, 
  HAMBURG_GEO_MARKERS,
  MOCK_TRAFFIC_INCIDENTS, 
  HAMBURG_TRAFFIC_INCIDENTS,
  MOCK_IOT_SENSORS, 
  HAMBURG_IOT_SENSORS,
  MOCK_CYBER_ASSETS, 
  HAMBURG_CYBER_ASSETS,
  MOCK_WEATHER_TELEMETRY,
  HAMBURG_WEATHER_TELEMETRY,
  MOCK_OVERPASS_PRESETS,
  HAMBURG_OVERPASS_PRESETS,
  HANNOVER_COORDINATES,
  HAMBURG_COORDINATES,
  HANNOVER_DISTRICTS,
  HAMBURG_DISTRICTS
} from './data/mockData';
import { 
  Activity, 
  Globe, 
  Code2, 
  Maximize2, 
  Minimize2, 
  Info, 
  X, 
  ChevronRight,
  Train,
  Calendar,
  Camera,
  ExternalLink
} from 'lucide-react';

export const App: React.FC = () => {
  // Theme State (Dark Mode default)
  const [theme, setTheme] = useState<ThemeMode>('dark');

  // Active City: 'H' (Hannover) or 'HH' (Hamburg)
  const [activeCity, setActiveCity] = useState<'H' | 'HH'>('H');

  // Filters & Selection
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Alle Stadtbezirke');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [selectedMarker, setSelectedMarker] = useState<GeoLocation | null>(null);

  // Active Line Route displayed on Map (e.g. Stadtbahn 1, 4, 5, 6, 10, S4, U1, U3, S1)
  const [activeRoute, setActiveRoute] = useState<TransitLineRoute | null>(null);

  // Dynamic list of markers including dynamically pinned transit stops & webcams
  const [customMarkers, setCustomMarkers] = useState<GeoLocation[]>([
    ...INITIAL_GEO_MARKERS,
    ...HAMBURG_GEO_MARKERS
  ]);

  // Overpass Live Elements rendered on Map
  const [overpassLiveElements, setOverpassLiveElements] = useState<OverpassLiveElement[]>([]);

  // Active Map Layers
  const [activeLayers, setActiveLayers] = useState({
    webcams: true,
    iotSensors: true,
    mobility: true,
    infra: true,
    gridOverlay: false,
  });

  // Right Deck Active Tab
  const [activeRightTab, setActiveRightTab] = useState<'traffic' | 'schedules' | 'telemetry' | 'cyber' | 'overpass' | 'details'>('traffic');
  const [isRightDeckCollapsed, setIsRightDeckCollapsed] = useState<boolean>(false);

  // Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isLinklistOpen, setIsLinklistOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [activeWebcamModal, setActiveWebcamModal] = useState<GeoLocation | null>(null);

  // Map Instance Reference
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const currentDistricts = activeCity === 'HH' ? HAMBURG_DISTRICTS : HANNOVER_DISTRICTS;

  // Handle Clean City Switch (H <-> HH) with Sektoren-Reset
  const handleSelectCity = (city: 'H' | 'HH') => {
    setActiveCity(city);
    setSelectedDistrict('Alle Stadtbezirke');
    setSelectedMarker(null);
    setActiveRoute(null);
    setOverpassLiveElements([]);
    if (mapInstance) {
      const coords = city === 'HH' ? HAMBURG_COORDINATES : HANNOVER_COORDINATES;
      mapInstance.flyTo(coords, 12, { animate: true, duration: 1.2 });
    }
  };

  // Handle Theme Toggle
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter Markers according to City, District, Category, and Layer Toggles
  const filteredMarkers = useMemo(() => {
    return customMarkers.filter((marker) => {
      // Filter by Active City (H: Hannover < 53°N, HH: Hamburg >= 53°N)
      if (activeCity === 'H' && marker.lat >= 53.0) return false;
      if (activeCity === 'HH' && marker.lat < 53.0) return false;

      if (selectedDistrict !== 'Alle Stadtbezirke' && marker.district && marker.district !== selectedDistrict) {
        return false;
      }

      if (activeCategory !== 'all' && marker.category !== activeCategory) {
        return false;
      }

      if (marker.category === 'traffic') {
        if (marker.type === 'Verkehrskamera' && !activeLayers.webcams) return false;
        if (marker.type === 'Mobility Hub' && !activeLayers.mobility) return false;
        if (marker.type === 'Haltestelle' && !activeLayers.mobility) return false;
      }
      if (marker.category === 'iot' && !activeLayers.iotSensors) return false;
      if (marker.category === 'security' && !activeLayers.infra) return false;

      return true;
    });
  }, [customMarkers, activeCity, selectedDistrict, activeCategory, activeLayers]);

  // Center on Active City Center (Hannover or Hamburg)
  const handleCenterCity = () => {
    if (mapInstance) {
      const coords = activeCity === 'HH' ? HAMBURG_COORDINATES : HANNOVER_COORDINATES;
      mapInstance.flyTo(coords, 12, { duration: 1 });
      setSelectedMarker(null);
    }
  };

  // Dynamic category counts for Sidebar based on active city
  const categoryCounts = useMemo(() => {
    const cityMarkers = customMarkers.filter(m => activeCity === 'HH' ? m.lat >= 53.0 : m.lat < 53.0);
    return {
      all: cityMarkers.length,
      traffic: cityMarkers.filter(m => m.category === 'traffic').length,
      iot: cityMarkers.filter(m => m.category === 'iot').length,
      security: cityMarkers.filter(m => m.category === 'security').length,
      cyber: (activeCity === 'HH' ? HAMBURG_CYBER_ASSETS : MOCK_CYBER_ASSETS).length,
    };
  }, [customMarkers, activeCity]);

  // Fly to Station from ÖPNV Search / Pin & add marker if not existing
  const handleFlyToStation = (lat: number, lng: number, name: string) => {
    if (mapInstance) {
      mapInstance.flyTo([lat, lng], 16, { duration: 1.2 });
    }

    const existing = customMarkers.find(m => Math.abs(m.lat - lat) < 0.001 && Math.abs(m.lng - lng) < 0.001);
    if (existing) {
      setSelectedMarker(existing);
    } else {
      const isHH = lat >= 53.0;
      const isWebcam = name.toLowerCase().includes('webcam') || name.toLowerCase().includes('kamera');
      const newMarker: GeoLocation = {
        id: `marker-${Date.now()}`,
        name: name,
        lat: lat,
        lng: lng,
        category: 'traffic',
        type: isWebcam ? 'Verkehrskamera' : 'Haltestelle',
        district: isHH ? 'Hamburg-Mitte' : 'Mitte',
        status: 'active',
        explanation: isWebcam 
          ? `Live-Verkehrskamera an ${name}.` 
          : `Gepinnte Haltestelle ${name}. Zeigt minutengenaue HAFAS-Echtzeitabfahrten und Fahrplandaten.`,
        details: {
          'Knoten': name,
          'Typ': isWebcam ? 'Verkehrskamera' : 'ÖPNV Haltestelle',
          'Quelle': isWebcam ? (isHH ? 'Port of Hamburg / HPA' : 'VMZ Niedersachsen') : (isHH ? 'HVV / HAFAS' : 'GVH / HAFAS')
        },
        timestamp: 'Live'
      };
      setCustomMarkers(prev => [...prev, newMarker]);
      setSelectedMarker(newMarker);
    }
  };

  // Toggle single layer
  const handleToggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Select marker and open details panel
  const handleSelectMarker = (marker: GeoLocation | null) => {
    setSelectedMarker(marker);
    if (marker) {
      setActiveRightTab('details');
      setIsRightDeckCollapsed(false);
    }
  };

  // Select preset from command palette
  const handleSelectPreset = (_preset: OverpassPreset) => {
    setActiveRightTab('overpass');
    setIsRightDeckCollapsed(false);
  };

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'dark bg-anthrazit-950 text-anthrazit-100' : 'light bg-anthrazit-50 text-anthrazit-900'}`}>
      {/* Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        activeCity={activeCity}
        onSelectCity={handleSelectCity}
        selectedDistrict={selectedDistrict}
        districts={currentDistricts}
        onSelectDistrict={setSelectedDistrict}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onOpenLinklist={() => setIsLinklistOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        activeMarkerCount={filteredMarkers.length}
      />

      {/* Main Workspace Layout: Sidebar | Map | Right Widget Deck */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            if (cat === 'cyber') setActiveRightTab('cyber');
            else if (cat === 'traffic') setActiveRightTab('traffic');
            else if (cat === 'iot') setActiveRightTab('telemetry');
          }}
          activeLayers={activeLayers}
          onToggleLayer={handleToggleLayer}
          onCenterCity={handleCenterCity}
          onOpenOverpass={() => {
            setActiveRightTab('overpass');
            setIsRightDeckCollapsed(false);
          }}
          activeCity={activeCity}
          categoryCounts={categoryCounts}
        />

        {/* Center: Full-height Leaflet OSINT Map with Route Polyline & Overpass Elements */}
        <main className="flex-1 relative h-full bg-anthrazit-950">
          <OSINTMap
            markers={filteredMarkers}
            theme={theme}
            selectedMarker={selectedMarker}
            onSelectMarker={handleSelectMarker}
            showGridOverlay={activeLayers.gridOverlay}
            overpassLiveElements={overpassLiveElements}
            onClearOverpassElements={() => setOverpassLiveElements([])}
            activeRoute={activeRoute}
            onClearRoute={() => setActiveRoute(null)}
            onOpenWebcam={(cam) => setActiveWebcamModal(cam)}
            onMapReady={(map) => setMapInstance(map)}
          />
        </main>

        {/* Right Widget Deck (Dockable/Collapsible - No horizontal scroll) */}
        <aside
          className={`border-l border-anthrazit-800 bg-anthrazit-900/95 dark:bg-anthrazit-950/95 flex flex-col shrink-0 transition-all duration-200 z-20 overflow-x-hidden ${
            isRightDeckCollapsed ? 'w-10' : 'w-[420px]'
          }`}
        >
          {/* Deck Header & Clean Segmented Tab Bar */}
          <div className="h-11 border-b border-anthrazit-800 flex items-center justify-between px-2 bg-anthrazit-950 shrink-0">
            {!isRightDeckCollapsed ? (
              <div className="flex items-center space-x-1 flex-1 min-w-0 pr-1">
                {[
                  { id: 'traffic', label: 'ÖPNV Live', icon: Train },
                  { id: 'schedules', label: 'Fahrplan', icon: Calendar },
                  { id: 'telemetry', label: 'IoT/Wetter', icon: Activity },
                  { id: 'cyber', label: 'Cyber', icon: Globe },
                  { id: 'overpass', label: 'Overpass', icon: Code2 },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = activeRightTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveRightTab(t.id as any)}
                      className={`flex-1 py-1 px-1 rounded text-[10.5px] font-mono transition-colors cursor-pointer flex items-center justify-center space-x-1 truncate ${
                        isActive
                          ? 'bg-accent text-anthrazit-950 font-bold shadow-sm'
                          : 'text-anthrazit-400 hover:text-anthrazit-200 hover:bg-anthrazit-900'
                      }`}
                      title={t.label}
                    >
                      <Icon className="w-3 h-3 shrink-0" />
                      <span className="truncate">{t.label}</span>
                    </button>
                  );
                })}

                {selectedMarker && (
                  <button
                    onClick={() => setActiveRightTab('details')}
                    className={`py-1 px-1.5 rounded text-[10.5px] font-mono transition-colors cursor-pointer flex items-center justify-center space-x-1 ${
                      activeRightTab === 'details'
                        ? 'bg-accent text-anthrazit-950 font-bold'
                        : 'text-accent border border-accent/40 hover:bg-accent/15'
                    }`}
                    title="Knoten-Inspektor"
                  >
                    <Info className="w-3 h-3" />
                    <span>Detail</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full flex justify-center text-accent">
                <ChevronRight className="w-4 h-4" />
              </div>
            )}

            {/* Collapse Toggle */}
            <button
              onClick={() => setIsRightDeckCollapsed(prev => !prev)}
              className="p-1 rounded hover:bg-anthrazit-800 text-anthrazit-400 hover:text-anthrazit-200 cursor-pointer shrink-0"
              title={isRightDeckCollapsed ? "Deck ausklappen" : "Deck einklappen"}
            >
              {isRightDeckCollapsed ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Deck Body (Clean Vertical Scroll Only) */}
          {!isRightDeckCollapsed && (
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 w-full">
              {activeRightTab === 'traffic' && (
                <TrafficFeed
                  incidents={activeCity === 'HH' ? HAMBURG_TRAFFIC_INCIDENTS : MOCK_TRAFFIC_INCIDENTS}
                  activeRoute={activeRoute}
                  onSelectStationOnMap={handleFlyToStation}
                  onSelectRoute={(route) => setActiveRoute(route)}
                  activeCity={activeCity}
                />
              )}

              {activeRightTab === 'schedules' && (
                <TransitScheduleHub
                  activeRoute={activeRoute}
                  onSelectRoute={(route) => setActiveRoute(route)}
                  onSelectStationOnMap={handleFlyToStation}
                  activeCity={activeCity}
                />
              )}

              {activeRightTab === 'telemetry' && (
                <TelemetryWidget
                  sensors={activeCity === 'HH' ? HAMBURG_IOT_SENSORS : MOCK_IOT_SENSORS}
                  weather={activeCity === 'HH' ? HAMBURG_WEATHER_TELEMETRY : MOCK_WEATHER_TELEMETRY}
                  activeCity={activeCity}
                />
              )}

              {activeRightTab === 'cyber' && (
                <CyberAssetsTable
                  assets={activeCity === 'HH' ? HAMBURG_CYBER_ASSETS : MOCK_CYBER_ASSETS}
                  activeCity={activeCity}
                />
              )}

              {activeRightTab === 'overpass' && (
                <OsintQueryHub
                  onLoadElementsOnMap={(elements) => setOverpassLiveElements(elements)}
                  activeCity={activeCity}
                  presets={activeCity === 'HH' ? HAMBURG_OVERPASS_PRESETS : MOCK_OVERPASS_PRESETS}
                />
              )}

              {activeRightTab === 'details' && selectedMarker && (
                <div className="space-y-4 font-mono text-xs w-full overflow-x-hidden">
                  <div className="flex items-center justify-between pb-2 border-b border-anthrazit-800">
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/30 font-bold uppercase">
                        {selectedMarker.type}
                      </span>
                      <h3 className="font-bold text-sm text-anthrazit-100 mt-1 truncate">{selectedMarker.name}</h3>
                      <span className="text-[11px] text-anthrazit-400">Bezirk: {selectedMarker.district || (activeCity === 'HH' ? 'Hamburg' : 'Hannover')}</span>
                    </div>
                    <button
                      onClick={() => setSelectedMarker(null)}
                      className="p-1 hover:bg-anthrazit-800 rounded text-anthrazit-400 hover:text-anthrazit-100 cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* If marker is a Webcam, provide direct Live Snapshot Button */}
                  {selectedMarker.type === 'Verkehrskamera' && (
                    <button
                      onClick={() => setActiveWebcamModal(selectedMarker)}
                      className="w-full py-2.5 px-3 rounded bg-accent hover:bg-accent-hover text-anthrazit-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-accent-sm"
                    >
                      <Camera className="w-4 h-4" />
                      <span>📹 Live-Webcam Stream / Snapshot öffnen</span>
                    </button>
                  )}

                  {/* Explanation for Beginners */}
                  {selectedMarker.explanation && (
                    <div className="p-3 rounded bg-accent/10 border border-accent/30 text-anthrazit-200 space-y-1 font-sans">
                      <div className="text-accent font-mono font-bold text-[11px] flex items-center space-x-1">
                        <Info className="w-3.5 h-3.5" />
                        <span>KNOTEN-ERKLÄRUNG (OSINT KONTEXT)</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-anthrazit-300">
                        {selectedMarker.explanation}
                      </p>
                    </div>
                  )}

                  {/* Coordinates & Status */}
                  <div className="p-2.5 rounded bg-anthrazit-950 border border-anthrazit-800 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-anthrazit-400">STATUS:</span>
                      <span className="text-accent font-bold uppercase">{selectedMarker.status || 'OK'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-anthrazit-400">LATITUDE:</span>
                      <span className="text-anthrazit-200 font-bold">{selectedMarker.lat}° N</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-anthrazit-400">LONGITUDE:</span>
                      <span className="text-anthrazit-200 font-bold">{selectedMarker.lng}° E</span>
                    </div>
                  </div>

                  {/* Attributes */}
                  {selectedMarker.details && (
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase font-bold text-anthrazit-400">Knoten-Attribute</div>
                      <div className="space-y-1.5">
                        {Object.entries(selectedMarker.details).map(([key, val]) => (
                          <div
                            key={key}
                            className="p-2 rounded bg-anthrazit-850 border border-anthrazit-800 flex justify-between items-center text-[11px]"
                          >
                            <span className="text-anthrazit-400 truncate pr-1">{key}</span>
                            <span className="text-anthrazit-100 font-semibold truncate">{String(val)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Source Outlink */}
                  {selectedMarker.sourceUrl && (
                    <a
                      href={selectedMarker.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-anthrazit-700 text-accent flex items-center justify-center space-x-1.5 text-xs transition-colors"
                    >
                      <span>Offizielle Primärquelle aufrufen</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Modals */}
      <WebcamViewerModal
        webcam={activeWebcamModal}
        isOpen={Boolean(activeWebcamModal)}
        onClose={() => setActiveWebcamModal(null)}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectMarker={handleSelectMarker}
        onSelectPreset={handleSelectPreset}
        onOpenLinklist={() => setIsLinklistOpen(true)}
        activeCity={activeCity}
      />

      <LinklistViewModal
        isOpen={isLinklistOpen}
        onClose={() => setIsLinklistOpen(false)}
        activeCity={activeCity}
      />

      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
};

export default App;
