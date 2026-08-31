export type ThemeMode = 'dark' | 'light';

export type MapTileProvider = 'esri-dark' | 'esri-light' | 'osm-standard' | 'esri-sat';

export type CategoryType = 'all' | 'traffic' | 'gis' | 'iot' | 'cyber' | 'security' | 'links' | 'nina';

export interface GeoLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: CategoryType;
  type: string;
  district?: string;
  details?: Record<string, string | number | boolean>;
  status?: 'active' | 'warning' | 'alert' | 'offline';
  timestamp?: string;
  sourceUrl?: string;
  explanation?: string;
}

export interface OverpassLiveElement {
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
  type: string;
}

export interface TrafficIncident {
  id: string;
  road: string;
  location: string;
  type: 'Stau' | 'Baustelle' | 'Sperrung' | 'Gefahr';
  delayMinutes: number;
  lengthKm: number;
  severity: 'low' | 'medium' | 'high';
  direction: string;
  updatedAt: string;
  details?: string;
}

export interface IoTSensor {
  id: string;
  name: string;
  location: string;
  metric: string;
  value: number;
  unit: string;
  threshold: {
    warn: number;
    crit: number;
  };
  trend: 'up' | 'down' | 'stable';
  history: number[];
  updatedAt: string;
  explanation: string;
  criticalInfo?: string;
}

export interface CyberAsset {
  id: string;
  target: string;
  ip: string;
  organization: string;
  openPorts: number[];
  vulnerabilitiesCount: number;
  tlsExpiry?: string;
  lastScanned: string;
  serviceType: string;
  explanation: string;
}

export interface OverpassPreset {
  id: string;
  title: string;
  description: string;
  query: string;
  category: string;
  icon: string;
  howItWorks: string;
  keyTags: string[];
}

export interface WeatherTelemetry {
  station: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  windGust: number;
  pressure: number;
  condition: string;
  warningText?: string;
  warningLevel: 0 | 1 | 2 | 3;
}

export interface GlossaryEntry {
  term: string;
  category: 'OSINT' | 'GIS' | 'IoT' | 'Cyber' | 'Verkehr';
  shortDef: string;
  detailedExplanation: string;
  example: string;
}
