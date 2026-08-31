import React, { useState, useEffect } from 'react';
import { LineSchedule, ScheduleStopItem } from '../../data/transitSchedules';
import { TransitStop, LiveDeparture, fetchLiveDepartures } from '../../services/apiService';
import { 
  ChevronUp, 
  ChevronDown, 
  Crosshair, 
  X, 
  MapPin, 
  Train, 
  Navigation,
  Sparkles
} from 'lucide-react';

export type BottomSheetSnap = 'peek' | 'half' | 'full';

interface MobileTransitBottomSheetProps {
  activeCity: 'H' | 'HH';
  selectedStop: TransitStop | null;
  selectedSchedule: LineSchedule | null;
  onClearStop: () => void;
  onClearSchedule: () => void;
  onSelectStation: (stop: TransitStop) => void;
  onFlyToStation: (lat: number, lng: number, name: string) => void;
}

export const MobileTransitBottomSheet: React.FC<MobileTransitBottomSheetProps> = ({
  activeCity,
  selectedStop,
  selectedSchedule,
  onClearStop,
  onClearSchedule: _onClearSchedule,
  onSelectStation,
  onFlyToStation
}) => {
  const isHamburg = activeCity === 'HH';

  // Snap State
  const [snap, setSnap] = useState<BottomSheetSnap>('half');
  
  // Line Direction State (A or B)
  const [selectedDirection, setSelectedDirection] = useState<'A' | 'B'>('A');

  // Live Departures State for selected stop
  const [departures, setDepartures] = useState<LiveDeparture[]>([]);
  const [loadingDepartures, setLoadingDepartures] = useState<boolean>(false);
  const [departureStationName, setDepartureStationName] = useState<string>('');

  // Fetch departures whenever selectedStop changes
  useEffect(() => {
    if (!selectedStop) {
      setDepartures([]);
      setDepartureStationName('');
      return;
    }

    setLoadingDepartures(true);
    fetchLiveDepartures(selectedStop.id, 45, activeCity).then((res) => {
      setDepartures(res.departures);
      setDepartureStationName(res.stationName || selectedStop.name);
      setLoadingDepartures(false);
    });
  }, [selectedStop, activeCity]);

  // Auto-expand sheet when user selects a stop or line
  useEffect(() => {
    if (selectedStop || selectedSchedule) {
      setSnap(prev => prev === 'peek' ? 'half' : prev);
    }
  }, [selectedStop, selectedSchedule]);

  const snapClasses = {
    peek: 'h-16',
    half: 'h-[48dvh]',
    full: 'h-[82dvh]'
  };

  const handleCycleSnap = () => {
    if (snap === 'peek') setSnap('half');
    else if (snap === 'half') setSnap('full');
    else setSnap('peek');
  };

  const quickHubs = isHamburg
    ? [
        { name: 'Hamburg Hbf', lat: 53.5534, lng: 10.0067, id: 'hh-hbf' },
        { name: 'Jungfernstieg', lat: 53.5528, lng: 9.9928, id: 'hh-jungfernstieg' },
        { name: 'Landungsbrücken', lat: 53.5458, lng: 9.9678, id: 'hh-landungsbruecken' },
        { name: 'Altona', lat: 53.5527, lng: 9.9347, id: 'hh-altona' },
        { name: 'Berliner Tor', lat: 53.5529, lng: 10.0245, id: 'hh-berliner-tor' }
      ]
    : [
        { name: 'Hannover Hbf', lat: 52.3768, lng: 9.7410, id: 'hn-hbf' },
        { name: 'Kröpcke', lat: 52.3744, lng: 9.7386, id: 'hn-kroepcke' },
        { name: 'Aegidientorplatz', lat: 52.3688, lng: 9.7427, id: 'hn-aegi' },
        { name: 'Steintor', lat: 52.3756, lng: 9.7323, id: 'hn-steintor' },
        { name: 'Hauptbahnhof / ZOB', lat: 52.3785, lng: 9.7431, id: 'hn-zob' }
      ];

  const activeDir = selectedSchedule ? (selectedDirection === 'A' ? selectedSchedule.directionA : selectedSchedule.directionB) : null;

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-[1100] bg-anthrazit-950/95 backdrop-blur-xl border-t border-anthrazit-800 rounded-t-2xl shadow-2xl transition-all duration-300 ease-out flex flex-col overflow-hidden ${snapClasses[snap]}`}
    >
      {/* Drag & Header Handle */}
      <div 
        onClick={handleCycleSnap}
        className="w-full py-2 flex flex-col items-center justify-center cursor-pointer shrink-0 select-none border-b border-anthrazit-900"
      >
        <div className="w-10 h-1 rounded-full bg-anthrazit-700 hover:bg-accent transition-colors" />
        <div className="w-full px-4 pt-1.5 flex items-center justify-between">
          {/* Status Label on Peek */}
          <div className="flex items-center space-x-2 truncate">
            {selectedStop ? (
              <>
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
                <span className="font-bold text-xs text-anthrazit-100 font-mono truncate">
                  {selectedStop.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent font-mono font-bold shrink-0">
                  {departures.length > 0 ? `${departures[0].line} in ${departures[0].when}` : 'Live'}
                </span>
              </>
            ) : selectedSchedule ? (
              <>
                <span 
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-anthrazit-950 shrink-0"
                  style={{ backgroundColor: selectedSchedule.color }}
                >
                  {selectedSchedule.lineRef}
                </span>
                <span className="font-bold text-xs text-anthrazit-100 font-mono truncate">
                  {activeDir?.destination}
                </span>
              </>
            ) : (
              <div className="flex items-center space-x-1 text-anthrazit-400 font-mono text-xs">
                <Navigation className="w-3.5 h-3.5 text-accent" />
                <span>ÖPNV Live & Fahrpläne</span>
              </div>
            )}
          </div>

          {/* Expand / Minimize Toggle Icon */}
          <div className="flex items-center space-x-1.5 shrink-0 text-anthrazit-400">
            {snap === 'full' ? (
              <ChevronDown className="w-4 h-4 text-accent" />
            ) : (
              <ChevronUp className="w-4 h-4 text-accent" />
            )}
          </div>
        </div>
      </div>

      {/* Sheet Content Area (Only rendered meaningfully when half or full) */}
      <div className="flex-1 overflow-y-auto px-3.5 py-2.5 space-y-3 font-mono text-xs">
        {/* ========================================================================= */}
        {/* VIEW 1: SELECTED STATION DEPARTURES BOARD                                */}
        {/* ========================================================================= */}
        {selectedStop ? (
          <div className="space-y-3">
            {/* Station Header with Action Buttons */}
            <div className="flex items-start justify-between bg-anthrazit-900/80 p-2.5 rounded-lg border border-anthrazit-800">
              <div className="min-w-0 pr-2">
                <div className="flex items-center space-x-1 text-[10px] text-accent font-bold uppercase">
                  <MapPin className="w-3 h-3" />
                  <span>Haltestelle</span>
                </div>
                <h2 className="text-sm font-bold text-anthrazit-100 truncate mt-0.5">
                  {departureStationName || selectedStop.name}
                </h2>
                <span className="text-[10px] text-anthrazit-400">
                  {selectedStop.type || 'Nahverkehr'} · {selectedStop.lat.toFixed(4)}°N, {selectedStop.lng.toFixed(4)}°E
                </span>
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                <button
                  onClick={() => onFlyToStation(selectedStop.lat, selectedStop.lng, selectedStop.name)}
                  className="p-2 rounded bg-anthrazit-800 hover:bg-anthrazit-700 text-accent border border-anthrazit-700"
                  title="Auf Karte zentrieren"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onClearStop}
                  className="p-2 rounded bg-anthrazit-800 hover:bg-anthrazit-700 text-anthrazit-400 hover:text-anthrazit-200 border border-anthrazit-700"
                  title="Auswahl aufheben"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Departures List */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-anthrazit-400 uppercase px-1">
                <span>Nächste Abfahrten</span>
                <span className="text-accent text-[10px]">Echtzeit</span>
              </div>

              {loadingDepartures ? (
                <div className="py-8 text-center text-anthrazit-400 text-xs flex flex-col items-center justify-center space-y-2">
                  <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <span>Berechne Taktzeiten & HAFAS-Signal...</span>
                </div>
              ) : departures.length === 0 ? (
                <div className="py-6 text-center text-anthrazit-400 text-xs bg-anthrazit-900/40 rounded border border-anthrazit-850 p-3">
                  Keine unmittelbaren Abfahrten für die nächsten 45 Minuten gefunden.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {departures.map((dep, idx) => {
                    const isImminent = dep.when.includes('0') || dep.when.includes('1') || dep.when.includes('2') || dep.when.includes('sofort');

                    return (
                      <div
                        key={`${dep.tripId}-${idx}`}
                        className={`p-2.5 rounded-lg border flex items-center justify-between transition-colors ${
                          isImminent
                            ? 'bg-accent/10 border-accent/40 text-anthrazit-100 shadow-sm'
                            : 'bg-anthrazit-900/90 border-anthrazit-800 text-anthrazit-200'
                        }`}
                      >
                        {/* Line Badge & Direction */}
                        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                          <span className="shrink-0 px-2 py-1 rounded bg-accent text-anthrazit-950 font-bold text-xs shadow-sm">
                            {dep.line}
                          </span>
                          <div className="min-w-0">
                            <div className="font-bold text-xs truncate text-anthrazit-100">
                              {dep.direction}
                            </div>
                            <div className="text-[10px] text-anthrazit-400">
                              {dep.plannedWhen} Uhr {dep.platform ? `· Gl. ${dep.platform}` : ''}
                            </div>
                          </div>
                        </div>

                        {/* Live Arrival Minutes Badge */}
                        <div className="text-right shrink-0">
                          <div className={`font-mono font-bold text-xs ${isImminent ? 'text-accent' : 'text-anthrazit-200'}`}>
                            {dep.when.includes('Min') ? dep.when : `in ${dep.when} Min`}
                          </div>
                          <div className="text-[9px] text-emerald-400 font-medium">
                            {dep.delayMinutes > 0 ? `+${dep.delayMinutes}m Verspätung` : 'Pünktlich'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : selectedSchedule ? (
          /* ========================================================================= */
          /* VIEW 2: SELECTED LINE STOPS PERLENKETTE / TIMELINE                        */
          /* ========================================================================= */
          <div className="space-y-3">
            {/* Line Info Header */}
            <div className="bg-anthrazit-900/90 p-2.5 rounded-lg border border-anthrazit-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-bold text-anthrazit-950"
                    style={{ backgroundColor: selectedSchedule.color }}
                  >
                    {selectedSchedule.lineRef}
                  </span>
                  <span className="font-bold text-xs text-anthrazit-100">
                    {selectedSchedule.lineName}
                  </span>
                </div>
                <span className="text-[10px] text-anthrazit-400 font-mono">
                  Takt: {selectedSchedule.frequency.peak}
                </span>
              </div>

              {/* Direction Switcher Toggle */}
              <div className="flex rounded bg-anthrazit-950 p-0.5 border border-anthrazit-800 space-x-0.5 text-[11px]">
                <button
                  onClick={() => setSelectedDirection('A')}
                  className={`flex-1 py-1 px-1.5 rounded font-bold truncate transition-all cursor-pointer ${
                    selectedDirection === 'A'
                      ? 'bg-accent text-anthrazit-950 shadow-sm'
                      : 'text-anthrazit-400 hover:text-anthrazit-200'
                  }`}
                >
                  ➔ {selectedSchedule.directionA.destination}
                </button>
                <button
                  onClick={() => setSelectedDirection('B')}
                  className={`flex-1 py-1 px-1.5 rounded font-bold truncate transition-all cursor-pointer ${
                    selectedDirection === 'B'
                      ? 'bg-accent text-anthrazit-950 shadow-sm'
                      : 'text-anthrazit-400 hover:text-anthrazit-200'
                  }`}
                >
                  ➔ {selectedSchedule.directionB.destination}
                </button>
              </div>
            </div>

            {/* Stops Timeline (Perlenkette) */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-anthrazit-400 uppercase px-1">
                Haltestellenfolge ({activeDir?.stops.length} Stationen · {activeDir?.totalMinutes} Min)
              </div>

              <div className="space-y-1 relative pl-2 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-anthrazit-750">
                {activeDir?.stops.map((stop: ScheduleStopItem, idx: number) => {
                  const isOrigin = idx === 0;
                  const isDest = idx === activeDir.stops.length - 1;

                  return (
                    <div
                      key={`${stop.stopName}-${idx}`}
                      onClick={() => {
                        onFlyToStation(
                          isHamburg ? 53.5511 : 52.3759,
                          isHamburg ? 9.9937 : 9.7320,
                          stop.stopName
                        );
                        onSelectStation({
                          id: `${isHamburg ? 'hh' : 'hn'}-${stop.stopName.toLowerCase().replace(/\s+/g, '-')}`,
                          name: stop.stopName,
                          lat: isHamburg ? 53.5511 : 52.3759,
                          lng: isHamburg ? 9.9937 : 9.7320,
                          type: selectedSchedule.lineName
                        });
                      }}
                      className="relative flex items-center justify-between p-2 rounded bg-anthrazit-900/60 hover:bg-anthrazit-850 border border-anthrazit-800/80 cursor-pointer active:scale-[0.99] transition-transform ml-4"
                    >
                      {/* Timeline Dot Indicator */}
                      <span
                        className={`absolute -left-[19px] w-2.5 h-2.5 rounded-full border-2 border-anthrazit-950 ${
                          isOrigin || isDest ? 'bg-accent' : 'bg-anthrazit-400'
                        }`}
                      />

                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-xs text-anthrazit-200 truncate">
                          {stop.stopName}
                        </div>
                        {stop.transferLines && stop.transferLines.length > 0 && (
                          <div className="text-[9px] text-accent truncate">
                            Umstieg: {stop.transferLines.join(', ')}
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] text-anthrazit-400 font-mono shrink-0">
                        +{stop.minuteOffset} Min
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 3: QUICK EXPLORER / HUB SHORTCUTS (NOTHING SELECTED)                 */
          /* ========================================================================= */
          <div className="space-y-3">
            <div className="bg-anthrazit-900/80 p-3 rounded-lg border border-anthrazit-800 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-accent font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Wähle eine Linie oder Haltestelle</span>
              </div>
              <p className="text-[11px] text-anthrazit-300 leading-relaxed">
                Tippe oben auf ein Linien-Symbol (z.B. <span className="text-accent font-bold">[U3]</span> oder <span className="text-accent font-bold">[6]</span>) oder wähle einen Knotenpunkt für Live-Abfahrten.
              </p>
            </div>

            {/* Quick Hub Buttons */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-anthrazit-400 uppercase px-1">
                Wichtige Knotenpunkte ({isHamburg ? 'Hamburg' : 'Hannover'})
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {quickHubs.map((hub) => (
                  <button
                    key={hub.id}
                    onClick={() => {
                      onFlyToStation(hub.lat, hub.lng, hub.name);
                      onSelectStation({
                        id: hub.id,
                        name: hub.name,
                        lat: hub.lat,
                        lng: hub.lng,
                        type: 'Knotenpunkt'
                      });
                    }}
                    className="p-2.5 rounded-lg bg-anthrazit-900 hover:bg-anthrazit-850 border border-anthrazit-800 text-left flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-6 h-6 rounded bg-accent/15 border border-accent/40 text-accent flex items-center justify-center shrink-0">
                        <Train className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs text-anthrazit-200 truncate">{hub.name}</span>
                    </div>
                    <span className="text-[10px] text-accent font-bold">Abfahrten ➔</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
