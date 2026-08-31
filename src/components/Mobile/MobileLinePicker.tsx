import React from 'react';
import { HANNOVER_SCHEDULES, HAMBURG_SCHEDULES } from '../../data/transitSchedules';
import { HANNOVER_TRANSIT_ROUTES, HAMBURG_TRANSIT_ROUTES, TransitLineRoute } from '../../data/transitRoutes';
import { X, Layers } from 'lucide-react';

interface MobileLinePickerProps {
  activeCity: 'H' | 'HH';
  activeRoute: TransitLineRoute | null;
  selectedLineRef: string | null;
  onSelectLine: (lineRef: string | null) => void;
}

export const MobileLinePicker: React.FC<MobileLinePickerProps> = ({
  activeCity,
  activeRoute: _activeRoute,
  selectedLineRef,
  onSelectLine
}) => {
  const isHamburg = activeCity === 'HH';
  const schedulesMap = isHamburg ? HAMBURG_SCHEDULES : HANNOVER_SCHEDULES;
  const routesMap = isHamburg ? HAMBURG_TRANSIT_ROUTES : HANNOVER_TRANSIT_ROUTES;
  const lines = Object.values(schedulesMap);

  const handleLineClick = (lineRef: string) => {
    if (selectedLineRef === lineRef) {
      onSelectLine(null);
    } else {
      onSelectLine(lineRef);
    }
  };

  return (
    <div 
      className="md:hidden absolute top-2.5 left-0 right-0 z-[1000] px-3 py-1 pointer-events-none"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1.5 pointer-events-auto backdrop-blur-md bg-anthrazit-950/80 rounded-full border border-anthrazit-800/80 px-2.5 shadow-2xl">
        {/* Reset / All Lines Button */}
        <button
          onClick={() => onSelectLine(null)}
          className={`shrink-0 min-h-[44px] px-4 rounded-full font-mono text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
            !selectedLineRef
              ? 'bg-accent text-anthrazit-950 shadow-sm'
              : 'bg-anthrazit-900/90 text-anthrazit-400 hover:text-anthrazit-200 border border-anthrazit-800'
          }`}
          title="Alle Linien / Filter zurücksetzen"
        >
          {!selectedLineRef ? <Layers className="w-4 h-4" /> : <X className="w-4 h-4" />}
          <span>Alle</span>
        </button>

        {/* Dynamic Line Badges */}
        {lines.map((line) => {
          const isSelected = selectedLineRef === line.lineRef;
          const hasRoute = Boolean(routesMap[line.lineRef]);

          return (
            <button
              key={line.lineRef}
              onClick={() => handleLineClick(line.lineRef)}
              className={`shrink-0 min-h-[44px] px-4 rounded-full font-mono text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 border ${
                isSelected
                  ? 'bg-accent text-anthrazit-950 border-accent shadow-accent-sm scale-105'
                  : 'bg-anthrazit-900/90 text-anthrazit-300 border-anthrazit-750 hover:border-anthrazit-600 hover:text-anthrazit-100'
              }`}
              style={
                isSelected
                  ? undefined
                  : { borderLeftColor: line.color, borderLeftWidth: '3px' }
              }
              title={`${line.lineName}: ${line.directionA.origin} ⇄ ${line.directionA.destination}`}
            >
              <span>{line.lineRef}</span>
              {hasRoute && isSelected && (
                <span className="w-2 h-2 rounded-full bg-anthrazit-950 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
