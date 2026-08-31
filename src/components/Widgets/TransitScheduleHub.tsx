import React, { useState, useMemo, useEffect } from 'react';
import { HANNOVER_SCHEDULES, HAMBURG_SCHEDULES, LineSchedule, generateStationTimetable, ScheduleStopItem } from '../../data/transitSchedules';
import { TransitLineRoute } from '../../data/transitRoutes';
import { fetchHvvPdfTimetables, HvvTimetablePdf } from '../../services/apiService';
import { 
  Route, 
  ArrowRightLeft, 
  Calendar,
  Table,
  ListOrdered,
  AlertTriangle,
  FileText
} from 'lucide-react';

import { TransitStop } from '../../services/apiService';

interface TransitScheduleHubProps {
  activeRoute?: TransitLineRoute | null;
  onSelectRoute?: (route: TransitLineRoute | null) => void;
  onSelectStationOnMap?: (lat: number, lng: number, name: string) => void;
  onSelectStationForLiveDepartures?: (station: TransitStop) => void;
  activeCity?: 'H' | 'HH';
}

export const TransitScheduleHub: React.FC<TransitScheduleHubProps> = ({
  activeRoute: _activeRoute,
  onSelectRoute,
  onSelectStationOnMap,
  onSelectStationForLiveDepartures,
  activeCity = 'H'
}) => {
  const isHamburg = activeCity === 'HH';
  const schedulesMap = isHamburg ? HAMBURG_SCHEDULES : HANNOVER_SCHEDULES;
  const linesList = Object.values(schedulesMap);

  const [selectedStammstrecke, setSelectedStammstrecke] = useState<string>(isHamburg ? 'U' : 'C');
  const [selectedLineRef, setSelectedLineRef] = useState<string>(isHamburg ? 'U3' : '6');
  const [selectedDirection, setSelectedDirection] = useState<'A' | 'B'>('A');

  // Hub View Mode: Timeline vs. Full Matrix Timetable
  const [hubViewMode, setHubViewMode] = useState<'timeline' | 'timetable'>('timeline');

  // Active Station selected for Timetable View
  const [activeStationName, setActiveStationName] = useState<string>(isHamburg ? 'Landungsbrücken' : 'Fenskestraße');
  const [selectedDayType, setSelectedDayType] = useState<'weekday' | 'saturday' | 'sunday'>('weekday');

  // Official HVV PDF Timetables from tbgl-search endpoint
  const [hvvPdfs, setHvvPdfs] = useState<HvvTimetablePdf[]>([]);

  useEffect(() => {
    if (isHamburg) {
      fetchHvvPdfTimetables(selectedLineRef).then(res => setHvvPdfs(res));
    } else {
      setHvvPdfs([]);
    }
  }, [selectedLineRef, isHamburg]);

  // Reset selection when activeCity switches
  useEffect(() => {
    if (activeCity === 'HH') {
      setSelectedStammstrecke('U');
      setSelectedLineRef('U3');
      setActiveStationName('Landungsbrücken');
    } else {
      setSelectedStammstrecke('C');
      setSelectedLineRef('6');
      setActiveStationName('Fenskestraße');
    }
    setSelectedDirection('A');
  }, [activeCity]);

  const filteredLines = selectedStammstrecke === 'ALL'
    ? linesList
    : linesList.filter(l => l.stammstrecke === selectedStammstrecke);

  const activeSchedule: LineSchedule = schedulesMap[selectedLineRef] || linesList[0];
  const activeDir = selectedDirection === 'A' ? activeSchedule.directionA : activeSchedule.directionB;

  // Find stop offset for active station
  const currentStopItem: ScheduleStopItem = useMemo(() => {
    return activeDir.stops.find(s => s.stopName.toLowerCase().includes(activeStationName.toLowerCase())) || activeDir.stops[0];
  }, [activeDir, activeStationName]);

  // Generate matrix timetable for this station
  const stationTimetable = useMemo(() => {
    return generateStationTimetable(currentStopItem.minuteOffset, activeSchedule.operatingHours.nightService);
  }, [currentStopItem, activeSchedule]);

  const handleSelectLine = (ref: string) => {
    setSelectedLineRef(ref);
    setSelectedDirection('A');
  };

  const handleDrawRouteOnMap = () => {
    import('../../data/transitRoutes').then(({ HANNOVER_TRANSIT_ROUTES, HAMBURG_TRANSIT_ROUTES }) => {
      const routes = isHamburg ? HAMBURG_TRANSIT_ROUTES : HANNOVER_TRANSIT_ROUTES;
      const match = routes[activeSchedule.lineRef];
      if (match) {
        onSelectRoute?.(match);
      }
    });
  };

  const stammstreckenOptions = isHamburg
    ? [
        { id: 'ALL', name: 'Alle', color: 'text-anthrazit-200' },
        { id: 'U', name: 'U-Bahn', color: 'text-blue-400' },
        { id: 'S', name: 'S-Bahn', color: 'text-emerald-400' },
        { id: 'F', name: 'HADAG', color: 'text-cyan-400' },
      ]
    : [
        { id: 'A', name: 'A-Achse', color: 'text-blue-400' },
        { id: 'B', name: 'B-Achse', color: 'text-orange-400' },
        { id: 'C', name: 'C-Achse', color: 'text-amber-400' },
        { id: 'D', name: 'D-Achse', color: 'text-emerald-400' },
        { id: 'S', name: 'S-Bahn', color: 'text-cyan-400' },
      ];

  return (
    <div className="space-y-3.5 text-xs font-mono select-none w-full max-w-full overflow-x-hidden">
      {/* Header Info Box */}
      <div className="p-3 rounded bg-anthrazit-900 border border-anthrazit-800 space-y-1 w-full">
        <div className="flex items-center justify-between">
          <span className="font-bold text-anthrazit-100 flex items-center space-x-1.5 uppercase text-[11px] truncate">
            <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="truncate">Soll-Fahrplan ({isHamburg ? 'HVV Hamburg' : 'ÜSTRA Hannover'})</span>
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/30 font-bold shrink-0 ml-1">
            Gültig 2025/2026
          </span>
        </div>
        <p className="text-[11px] font-sans text-anthrazit-400 leading-snug">
          Feste planmäßige Aushangfahrpläne (Soll-Zeiten) und vollständige Haltestellenabfolgen.
        </p>
      </div>

      {/* Stammstrecken Filter Bar */}
      <div className="space-y-1.5 w-full">
        <div className="text-[10px] uppercase font-bold text-anthrazit-400 flex items-center justify-between px-1">
          <span>Netz-Sektor wählen</span>
          <span className="text-[9px] text-anthrazit-500">{isHamburg ? 'U-/S-Bahn & Fähren' : 'Tunnel- & Stadtachsen'}</span>
        </div>

        <div className={`grid gap-1 text-[10px] w-full ${isHamburg ? 'grid-cols-4' : 'grid-cols-5'}`}>
          {stammstreckenOptions.map((st) => (
            <button
              key={st.id}
              onClick={() => {
                setSelectedStammstrecke(st.id);
                const firstInStamm = st.id === 'ALL' ? linesList[0] : linesList.find(l => l.stammstrecke === st.id);
                if (firstInStamm) setSelectedLineRef(firstInStamm.lineRef);
              }}
              className={`p-1.5 rounded flex flex-col items-center justify-center transition-all cursor-pointer border text-center ${
                selectedStammstrecke === st.id
                  ? 'bg-accent/15 border-accent text-accent font-bold shadow-panel'
                  : 'bg-anthrazit-950 border-anthrazit-800 text-anthrazit-400 hover:text-anthrazit-200'
              }`}
            >
              <span className={`truncate w-full font-bold ${st.color}`}>{st.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Line Selector Buttons */}
      <div className="flex flex-wrap gap-1.5 w-full">
        {filteredLines.map((line) => {
          const isSelected = activeSchedule.lineRef === line.lineRef;
          return (
            <button
              key={line.lineRef}
              onClick={() => handleSelectLine(line.lineRef)}
              className={`px-3 py-1.5 rounded text-[11px] font-bold font-mono transition-all cursor-pointer border flex items-center space-x-1.5 ${
                isSelected
                  ? 'bg-accent text-anthrazit-950 border-accent shadow-panel'
                  : 'bg-anthrazit-900 border-anthrazit-700 text-anthrazit-200 hover:border-accent'
              }`}
            >
              <span>{line.lineName}</span>
            </button>
          );
        })}
      </div>

      {/* Active Line Detail Card */}
      <div className="p-3 rounded bg-anthrazit-900 border border-anthrazit-800 space-y-3 w-full overflow-x-hidden">
        {/* Line Title & Direction Toggle */}
        <div className="space-y-2 pb-2 border-b border-anthrazit-800">
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-accent text-anthrazit-950 font-bold text-xs shrink-0">
                  {activeSchedule.lineRef}
                </span>
                <span className="font-bold text-sm text-anthrazit-100 truncate">{activeSchedule.lineName}</span>
              </div>
              <span className="text-[10px] text-anthrazit-400 block mt-0.5 truncate">
                {activeSchedule.corridorName}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              {hvvPdfs.length > 0 && (
                <a
                  href={hvvPdfs[0].pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded bg-anthrazit-950 hover:bg-anthrazit-850 border border-emerald-500/40 text-emerald-400 font-bold text-[10px] flex items-center space-x-1 transition-colors cursor-pointer"
                  title={`Offizielles HVV Linienfahrplan-PDF (${hvvPdfs[0].title} • ${hvvPdfs[0].size}) öffnen`}
                >
                  <FileText className="w-3 h-3" />
                  <span>PDF ({hvvPdfs[0].size})</span>
                </a>
              )}

              <button
                onClick={handleDrawRouteOnMap}
                className="px-2 py-1 rounded bg-anthrazit-950 hover:bg-anthrazit-850 border border-accent/40 text-accent font-bold text-[10px] flex items-center space-x-1 transition-colors cursor-pointer"
                title="Strecke auf der Karte visualisieren"
              >
                <Route className="w-3 h-3" />
                <span>Track</span>
              </button>
            </div>
          </div>

          {/* Special Notice (e.g. Bahnhof Nordstadt Baustelle) */}
          {activeSchedule.specialNotice && (
            <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] flex items-start space-x-1.5 font-sans">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{activeSchedule.specialNotice}</span>
            </div>
          )}

          {/* Direction Switcher */}
          <div className="flex items-center justify-between bg-anthrazit-950 p-1.5 rounded border border-anthrazit-800 w-full">
            <div className="truncate flex-1 pr-2">
              <span className="text-[9px] uppercase font-bold text-anthrazit-500 block">Fahrtrichtung:</span>
              <span className="text-xs font-bold text-anthrazit-100 truncate block">
                {activeDir.origin} ➔ {activeDir.destination}
              </span>
            </div>

            <button
              onClick={() => setSelectedDirection(selectedDirection === 'A' ? 'B' : 'A')}
              className="p-1.5 rounded hover:bg-anthrazit-800 text-accent flex items-center space-x-1 cursor-pointer border border-anthrazit-700 text-[10px] shrink-0"
              title="Gegenrichtung umschalten"
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span>Richtung</span>
            </button>
          </div>
        </div>

        {/* View Mode Toggle: Haltestellenfolge vs. Aushangfahrplan-Matrix */}
        <div className="flex rounded bg-anthrazit-950 p-1 border border-anthrazit-800 w-full">
          <button
            onClick={() => setHubViewMode('timeline')}
            className={`flex-1 py-1.5 rounded text-center transition-all cursor-pointer flex items-center justify-center space-x-1 text-[11px] truncate ${
              hubViewMode === 'timeline'
                ? 'bg-accent text-anthrazit-950 font-bold shadow-sm'
                : 'text-anthrazit-400 hover:text-anthrazit-200'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Haltestellenfolge ({activeDir.stops.length})</span>
          </button>

          <button
            onClick={() => setHubViewMode('timetable')}
            className={`flex-1 py-1.5 rounded text-center transition-all cursor-pointer flex items-center justify-center space-x-1 text-[11px] truncate ${
              hubViewMode === 'timetable'
                ? 'bg-accent text-anthrazit-950 font-bold shadow-sm'
                : 'text-anthrazit-400 hover:text-anthrazit-200'
            }`}
          >
            <Table className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Aushangfahrplan</span>
          </button>
        </div>
      </div>

      {/* --- MODE 1: HALTESTELLENFOLGE (TIMELINE) --- */}
      {hubViewMode === 'timeline' && (
        <div className="space-y-1.5 w-full">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] uppercase font-bold text-anthrazit-400">
              Haltestellen-Reihenfolge
            </span>
            <span className="text-[9px] text-anthrazit-500">Klick = Map-Focus & Fahrplan</span>
          </div>

          <div className="space-y-1 max-h-96 overflow-y-auto overflow-x-hidden pr-0.5 w-full">
            {activeDir.stops.map((stop, idx) => {
              const isOrigin = idx === 0;
              const isDestination = idx === activeDir.stops.length - 1;
              const isSelected = activeStationName === stop.stopName;

              const handleStopClick = async () => {
                setActiveStationName(stop.stopName);
                if (isHamburg) {
                  const { ALL_HAMBURG_STATIONS } = await import('../../data/hamburgStations');
                  const match = ALL_HAMBURG_STATIONS.find(s => 
                    s.name.toLowerCase().includes(stop.stopName.toLowerCase()) ||
                    stop.stopName.toLowerCase().includes(s.name.toLowerCase())
                  );
                  if (match) {
                    onSelectStationOnMap?.(match.lat, match.lng, match.name);
                    onSelectStationForLiveDepartures?.(match);
                  } else {
                    const fallbackStop: TransitStop = {
                      id: `hh-${stop.stopName.toLowerCase().replace(/\s+/g, '-')}`,
                      name: stop.stopName,
                      lat: 53.5511,
                      lng: 9.9937,
                      type: activeSchedule.lineName
                    };
                    onSelectStationForLiveDepartures?.(fallbackStop);
                  }
                } else {
                  const { ALL_HANNOVER_STATIONS } = await import('../../data/hannoverStations');
                  const match = ALL_HANNOVER_STATIONS.find(s => 
                    s.name.toLowerCase().includes(stop.stopName.toLowerCase()) ||
                    stop.stopName.toLowerCase().includes(s.name.toLowerCase())
                  );
                  if (match) {
                    onSelectStationOnMap?.(match.lat, match.lng, match.name);
                    onSelectStationForLiveDepartures?.(match);
                  } else {
                    const fallbackStop: TransitStop = {
                      id: `hn-${stop.stopName.toLowerCase().replace(/\s+/g, '-')}`,
                      name: stop.stopName,
                      lat: 52.3759,
                      lng: 9.7320,
                      type: activeSchedule.lineName
                    };
                    onSelectStationForLiveDepartures?.(fallbackStop);
                  }
                }
              };

              return (
                <div
                  key={stop.stopName + idx}
                  onClick={handleStopClick}
                  className={`p-2 rounded border transition-colors cursor-pointer flex items-center justify-between w-full group ${
                    isSelected
                      ? 'bg-accent/15 border-accent text-accent font-bold shadow-sm'
                      : isOrigin || isDestination
                      ? 'bg-anthrazit-950 border-anthrazit-700 text-anthrazit-100'
                      : 'bg-anthrazit-900 border-anthrazit-800 hover:border-anthrazit-700 text-anthrazit-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0 pr-1">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 font-bold ${
                      isSelected
                        ? 'bg-accent text-anthrazit-950'
                        : isOrigin || isDestination
                        ? 'bg-anthrazit-800 text-anthrazit-200'
                        : 'bg-anthrazit-950 text-anthrazit-400'
                    }`}>
                      {idx + 1}
                    </span>

                    <div className="truncate">
                      <span className="text-xs truncate block font-sans">
                        {stop.stopName}
                      </span>
                      {stop.notice && (
                        <span className="text-[9px] text-amber-400 block font-sans truncate">
                          ⚠️ {stop.notice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-1 flex flex-col items-end">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] font-mono font-bold text-accent">
                        +{stop.minuteOffset} Min.
                      </span>
                      <span className="text-[9px] px-1 py-0.5 rounded bg-accent/20 text-accent font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        ⏱️ Live
                      </span>
                    </div>
                    {stop.isHighPlatform === false ? (
                      <span className="text-[9px] text-amber-400 block" title="Nicht barrierefrei">
                        ♿ Nicht stufenlos
                      </span>
                    ) : (
                      <span className="text-[9px] text-emerald-400 block" title="Barrierefreier Hochbahnsteig">
                        ♿ Hochbahnst.
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- MODE 2: OFFIZIELLER AUSHANGFAHRPLAN (SOLL-ZEITEN MATRIX) --- */}
      {hubViewMode === 'timetable' && (
        <div className="space-y-3 w-full overflow-x-hidden">
          {/* Station & Day-Type Selector */}
          <div className="p-2.5 rounded bg-anthrazit-900 border border-anthrazit-800 space-y-2 w-full">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-anthrazit-400 uppercase font-bold">Haltestelle wählen:</span>
              <select
                value={activeStationName}
                onChange={(e) => setActiveStationName(e.target.value)}
                className="bg-anthrazit-950 border border-anthrazit-700 text-anthrazit-100 text-xs rounded px-2 py-1 focus:outline-none focus:border-accent max-w-[220px]"
              >
                {activeDir.stops.map((s) => (
                  <option key={s.stopName} value={s.stopName}>
                    {s.stopName} (+{s.minuteOffset} Min.)
                  </option>
                ))}
              </select>
            </div>

            {/* Day Type Tabs */}
            <div className="grid grid-cols-3 gap-1 text-[10px] w-full">
              {[
                { id: 'weekday', label: 'Montag – Freitag' },
                { id: 'saturday', label: 'Samstag' },
                { id: 'sunday', label: 'Sonn- / Feiertag' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDayType(d.id as any)}
                  className={`py-1.5 rounded font-bold transition-all cursor-pointer border text-center truncate ${
                    selectedDayType === d.id
                      ? 'bg-accent text-anthrazit-950 border-accent'
                      : 'bg-anthrazit-950 text-anthrazit-400 border-anthrazit-800 hover:text-anthrazit-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timetable Matrix Grid */}
          <div className="rounded bg-anthrazit-900 border border-anthrazit-800 overflow-hidden w-full">
            <div className="grid grid-cols-6 bg-anthrazit-950 p-2 border-b border-anthrazit-800 font-bold text-[10px] text-anthrazit-400 uppercase">
              <span className="col-span-1 text-center">Uhr</span>
              <span className="col-span-5 pl-2 truncate">Soll-Abfahrten ({currentStopItem.stopName})</span>
            </div>

            <div className="max-h-80 overflow-y-auto overflow-x-hidden divide-y divide-anthrazit-800/60 w-full">
              {stationTimetable.map((row) => {
                const mins = selectedDayType === 'weekday' 
                  ? row.minutesWeekday 
                  : selectedDayType === 'saturday' 
                  ? row.minutesSaturday 
                  : row.minutesSunday;

                if (mins.length === 0) return null;

                const isCurrentHour = new Date().getHours() === row.hour;

                return (
                  <div
                    key={row.hour}
                    className={`grid grid-cols-6 p-2 text-xs items-center w-full ${
                      isCurrentHour ? 'bg-accent/10 border-l-2 border-accent' : 'hover:bg-anthrazit-850'
                    }`}
                  >
                    <span className={`col-span-1 text-center font-bold font-mono ${
                      isCurrentHour ? 'text-accent' : 'text-anthrazit-200'
                    }`}>
                      {row.hour < 10 ? `0${row.hour}` : row.hour}
                    </span>

                    <div className="col-span-5 flex flex-wrap gap-1.5 pl-2">
                      {mins.map((m) => (
                        <span
                          key={m}
                          className={`px-1.5 py-0.5 rounded font-mono font-bold text-[11px] ${
                            isCurrentHour
                              ? 'bg-accent/20 text-accent border border-accent/40'
                              : 'bg-anthrazit-950 text-anthrazit-300 border border-anthrazit-700'
                          }`}
                        >
                          {m < 10 ? `0${m}` : m}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
