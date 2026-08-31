import React, { useState, useEffect } from 'react';
import { WeatherTelemetry, IoTSensor } from '../../types';
import { 
  fetchLiveWeather, 
  fetchLivePegel, 
  fetchLiveOpenSenseMapSensors, 
  LiveIoTSensor 
} from '../../services/apiService';
import { 
  Radio, 
  RefreshCw, 
  Activity
} from 'lucide-react';

interface TelemetryWidgetProps {
  weather: WeatherTelemetry;
  sensors?: IoTSensor[];
  activeCity?: 'H' | 'HH';
}

export const TelemetryWidget: React.FC<TelemetryWidgetProps> = ({
  weather: initialWeather,
  activeCity = 'H'
}) => {
  const [weather, setWeather] = useState<WeatherTelemetry>(initialWeather);
  const [livePegel, setLivePegel] = useState<string>(activeCity === 'HH' ? '5.24' : '3.88');
  const [liveSenseBoxes, setLiveSenseBoxes] = useState<LiveIoTSensor[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAllRealData = async (city: 'H' | 'HH' = activeCity) => {
    setIsRefreshing(true);
    try {
      // 1. Real DWD Weather for active city
      const weatherRes = await fetchLiveWeather(city);
      if (weatherRes.success && weatherRes.weather) {
        setWeather({
          station: weatherRes.weather.station || (city === 'HH' ? 'DWD Hamburg-Fuhlsbüttel / City (Live)' : 'DWD Hannover-Flughafen / City (Live)'),
          temp: weatherRes.weather.temp,
          humidity: weatherRes.weather.humidity,
          windSpeed: weatherRes.weather.windSpeed,
          windGust: weatherRes.weather.windGust,
          pressure: weatherRes.weather.pressure,
          condition: weatherRes.weather.condition,
          warningLevel: initialWeather.warningLevel,
          warningText: initialWeather.warningText
        });
      }

      // 2. Real WSV Pegelonline for active city
      const pegelRes = await fetchLivePegel(city);
      if (pegelRes.success) {
        setLivePegel(pegelRes.value);
      }

      // 3. Real OpenSenseMap IoT Boxes for active city
      const senseBoxes = await fetchLiveOpenSenseMapSensors(city);
      setLiveSenseBoxes(senseBoxes);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllRealData(activeCity);
    const interval = setInterval(() => loadAllRealData(activeCity), 60000);
    return () => clearInterval(interval);
  }, [activeCity]);

  const pegelLabel = activeCity === 'HH' ? 'Elbe-Pegel (St. Pauli)' : 'Leine-Pegel (Herrenhausen)';
  const pegelSource = activeCity === 'HH' ? 'BSH / WSV Sturmflut' : 'NLWKN Pegelonline';
  const cityName = activeCity === 'HH' ? 'Hamburg' : 'Hannover';

  return (
    <div className="space-y-3 lg:space-y-4 font-mono text-xs w-full">
      {/* Weather Header Card (Real Live DWD) */}
      <div className="p-3 lg:p-4 rounded bg-anthrazit-900 border border-anthrazit-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-anthrazit-300">
            <Radio className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span className="font-bold text-xs text-anthrazit-200 uppercase truncate">
              {weather.station}
            </span>
          </div>
          <button
            onClick={() => loadAllRealData(activeCity)}
            disabled={isRefreshing}
            className="p-3 min-h-[44px] min-w-[44px] rounded hover:bg-anthrazit-800 text-anthrazit-400 hover:text-accent cursor-pointer transition-colors flex items-center justify-center"
            title="Live-Wetter aktualisieren"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Real Live Weather Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-anthrazit-100">
          <div className="p-3 lg:p-4 rounded bg-anthrazit-950 border border-anthrazit-850">
            <div className="text-xs text-anthrazit-400 uppercase">Temperatur</div>
            <div className="text-xl font-bold font-mono text-accent">
              {weather.temp}°C
            </div>
            <div className="text-xs text-anthrazit-400 truncate">{weather.condition}</div>
          </div>

          <div className="p-3 lg:p-4 rounded bg-anthrazit-950 border border-anthrazit-850">
            <div className="text-xs text-anthrazit-400 uppercase">Luftfeuchte</div>
            <div className="text-xl font-bold font-mono text-sky-400">
              {weather.humidity}%
            </div>
            <div className="text-xs text-anthrazit-400">rel. Feuchte</div>
          </div>

          <div className="p-3 lg:p-4 rounded bg-anthrazit-950 border border-anthrazit-850">
            <div className="text-xs text-anthrazit-400 uppercase">Wind (Böen)</div>
            <div className="text-sm font-bold font-mono text-anthrazit-200">
              {weather.windSpeed} km/h
            </div>
            <div className="text-xs text-accent">Böen: {weather.windGust} km/h</div>
          </div>

          <div className="p-3 lg:p-4 rounded bg-anthrazit-950 border border-anthrazit-850">
            <div className="text-xs text-anthrazit-400 uppercase truncate">{pegelLabel}</div>
            <div className="text-sm font-bold font-mono text-emerald-400">
              {livePegel} m
            </div>
            <div className="text-xs text-anthrazit-500">{pegelSource}</div>
          </div>
        </div>
      </div>

      {/* Real OpenSenseMap Live IoT Boxes */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs uppercase font-bold text-anthrazit-400">
            OpenSenseMap Live Sensoren ({cityName})
          </span>
          <span className="text-xs text-accent font-bold">
            {liveSenseBoxes.length > 0 ? `${liveSenseBoxes.length} SenseBoxes online` : 'Echtzeit-Verbindung'}
          </span>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto overscroll-contain">
          {liveSenseBoxes.map((box) => (
            <div
              key={box.id}
              className="p-3 lg:p-4 rounded bg-anthrazit-900 border border-anthrazit-800 hover:border-accent transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span className="font-bold text-xs text-anthrazit-100 truncate">{box.name}</span>
                  </div>
                  <span className="text-xs text-anthrazit-400 block mt-1">
                    Modell: {box.model} • {box.exposure}
                  </span>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold shrink-0 self-start mt-1">
                  {box.lastMeasurement}
                </span>
              </div>

              {/* Sensor Readings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {box.sensors.map((s, idx) => (
                  <div key={idx} className="p-2 rounded bg-anthrazit-950 border border-anthrazit-850 flex items-center justify-between">
                    <span className="text-anthrazit-400 truncate pr-1">{s.title}:</span>
                    <span className="font-bold text-accent font-mono shrink-0">
                      {s.value} {s.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {liveSenseBoxes.length === 0 && (
            <div className="p-4 rounded bg-anthrazit-900 border border-anthrazit-800 text-center text-anthrazit-400 space-y-2">
              <RefreshCw className="w-5 h-5 mx-auto text-accent animate-spin" />
              <p className="text-xs">Lade aktuelle SenseBox-Messstationen in {cityName}...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
