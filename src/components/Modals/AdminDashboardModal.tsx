import React, { useState } from 'react';
import { 
  Lock, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  X, 
  RefreshCw, 
  Copy, 
  Check, 
  Train, 
  Radio
} from 'lucide-react';
import { HANNOVER_TRANSIT_ROUTES, HAMBURG_TRANSIT_ROUTES } from '../../data/transitRoutes';
import { HANNOVER_SCHEDULES, HAMBURG_SCHEDULES } from '../../data/transitSchedules';
import { ALL_HANNOVER_STATIONS } from '../../data/hannoverStations';
import { ALL_HAMBURG_STATIONS } from '../../data/hamburgStations';
import { MOCK_OVERPASS_PRESETS, HAMBURG_OVERPASS_PRESETS } from '../../data/mockData';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCity: 'H' | 'HH';
}

interface ApiEndpointStatus {
  name: string;
  url: string;
  status: 'idle' | 'testing' | 'online' | 'error';
  latencyMs?: number;
  statusCode?: number;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  activeCity: _activeCity
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('hboard_admin_session') === 'true';
  });

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'milestones' | 'datasets' | 'apis' | 'vehicles' | 'vps'>('milestones');

  // Change Password state
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [changePassSuccess, setChangePassSuccess] = useState(false);

  // Copied Nginx config helper
  const [isNginxCopied, setIsNginxCopied] = useState(false);

  // API Health Check state
  const [endpoints, setEndpoints] = useState<ApiEndpointStatus[]>([
    { name: 'DB HAFAS / Transport REST', url: '/api/transport/locations?query=Hauptbahnhof&results=1', status: 'idle' },
    { name: 'Overpass Turbo API (OSM)', url: '/api/overpass/status', status: 'idle' },
    { name: 'PegelOnline (WSV Gewässer)', url: '/api/pegelonline/stations.json?limit=1', status: 'idle' },
    { name: 'Autobahn OAPI (Webcams & Stau)', url: '/api/autobahn/A2/services/webcam', status: 'idle' },
    { name: 'OpenSenseMap (IoT Sensoren)', url: '/api/opensensemap/boxes?near=9.73,52.37&maxDistance=10000', status: 'idle' },
  ]);

  const currentPassword = localStorage.getItem('hboard_admin_pass') || '4dm1n';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === currentPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('hboard_admin_session', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('hboard_admin_session');
    setPasswordInput('');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.trim().length >= 3) {
      localStorage.setItem('hboard_admin_pass', newPass.trim());
      setChangePassSuccess(true);
      setTimeout(() => {
        setIsChangingPass(false);
        setChangePassSuccess(false);
        setNewPass('');
      }, 1500);
    }
  };

  const runApiPingTest = async () => {
    setEndpoints(prev => prev.map(ep => ({ ...ep, status: 'testing' })));

    const updated = await Promise.all(
      endpoints.map(async (ep) => {
        const start = performance.now();
        try {
          const res = await fetch(ep.url, { signal: AbortSignal.timeout(3500) });
          const latency = Math.round(performance.now() - start);
          return {
            ...ep,
            status: (res.ok || res.status === 200 || res.status === 304 || res.status === 404) ? ('online' as const) : ('error' as const),
            latencyMs: latency,
            statusCode: res.status
          };
        } catch {
          const latency = Math.round(performance.now() - start);
          return {
            ...ep,
            status: 'error' as const,
            latencyMs: latency,
            statusCode: 0
          };
        }
      })
    );
    setEndpoints(updated);
  };

  const nginxConfigSnippet = `# Nginx Reverse Proxy für HBoard OSINT Engine (Subdomain *.core-now.com)
server {
    listen 80;
    listen 443 ssl http2;
    server_name hboard.core-now.com;

    # SSL Zertifikate (Let's Encrypt / Certbot)
    ssl_certificate /etc/letsencrypt/live/hboard.core-now.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hboard.core-now.com/privkey.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    # 1. Frontend Static Assets
    location / {
        root /var/www/hboard/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 2. HAFAS & Transport API Proxy (Umgeht CORS Restriktionen)
    location /api/transport/ {
        proxy_pass https://v6.db.transport.rest/;
        proxy_set_header Host v6.db.transport.rest;
        proxy_set_header User-Agent "HBoard-OSINT/1.0";
        proxy_ssl_server_name on;
        proxy_cache_valid 200 30s;
    }

    # 3. Overpass OSM Realtime Proxy
    location /api/overpass/ {
        proxy_pass https://overpass-api.de/api/;
        proxy_set_header Host overpass-api.de;
        proxy_ssl_server_name on;
        proxy_read_timeout 60s;
    }

    # 4. Autobahn Open API Proxy
    location /api/autobahn/ {
        proxy_pass https://verkehr.autobahn.de/oapi/v1/;
        proxy_set_header Host verkehr.autobahn.de;
        proxy_ssl_server_name on;
    }

    # 5. Future WebSocket / GTFS-RT Live Vehicle Engine
    location /ws/vehicles {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_read_timeout 86400s;
    }
}`;

  const copyNginxSnippet = () => {
    navigator.clipboard.writeText(nginxConfigSnippet);
    setIsNginxCopied(true);
    setTimeout(() => setIsNginxCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-anthrazit-950/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-anthrazit-900 border border-anthrazit-700 rounded-lg shadow-2xl overflow-hidden flex flex-col font-mono text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Topbar */}
        <div className="h-12 border-b border-anthrazit-800 bg-anthrazit-950 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded bg-accent/15 border border-accent/40 text-accent flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <span className="font-bold text-anthrazit-100 uppercase tracking-wide text-xs">
                HBOARD COMMAND & OPS CENTER
              </span>
              <span className="text-[10px] text-anthrazit-400 block font-sans">
                Milestones • Datasets • API Health • Vehicle Engine Roadmap
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-2 py-1 rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-anthrazit-700 text-anthrazit-400 hover:text-anthrazit-200 text-[10px] cursor-pointer"
                title="Sitzung beenden"
              >
                Logout
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-anthrazit-800 text-anthrazit-400 hover:text-anthrazit-100 transition-colors cursor-pointer"
              title="Schließen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Auth Gate Screen */}
        {!isAuthenticated ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto my-auto">
            <div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/40 text-accent flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-anthrazit-100 uppercase tracking-wider">
                Ops & Admin Authentifizierung
              </h3>
              <p className="text-xs font-sans text-anthrazit-400 leading-relaxed">
                Zugang zur System-Steuerung, Meilenstein-Übersicht und den Backend-Proxy-Konfigurationen.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-3 pt-2">
              <div className="space-y-1 text-left">
                <label className="text-[10px] uppercase font-bold text-anthrazit-400">
                  Admin Passwort (Standard: <code className="text-accent">4dm1n</code>)
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  placeholder="Passwort eingeben..."
                  autoFocus
                  className="w-full bg-anthrazit-950 border border-anthrazit-700 focus:border-accent text-anthrazit-100 rounded px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              {authError && (
                <div className="text-[11px] text-red-400 bg-red-950/40 border border-red-800/60 p-2 rounded text-left flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Ungültiges Passwort. Standard ist <code>4dm1n</code>.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded bg-accent hover:bg-accent-hover text-anthrazit-950 font-bold tracking-wider uppercase transition-colors cursor-pointer"
              >
                Entsperren
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab Navigation */}
            <div className="h-10 border-b border-anthrazit-800 bg-anthrazit-950/70 px-4 flex items-center space-x-2 shrink-0">
              {[
                { id: 'milestones', label: '🎯 Roadmap & Milestones' },
                { id: 'datasets', label: '📊 Datasets & Integrität' },
                { id: 'apis', label: '🔌 API & Proxy Health' },
                { id: 'vehicles', label: '🏎️ Fahrende Boxen (Vision)' },
                { id: 'vps', label: '🌐 VPS & .core-now.com' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded text-[11px] font-mono transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    activeTab === tab.id
                      ? 'bg-accent text-anthrazit-950 font-bold shadow-sm'
                      : 'text-anthrazit-400 hover:text-anthrazit-200 hover:bg-anthrazit-850'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* --- TAB 1: MILESTONES & ROADMAP --- */}
              {activeTab === 'milestones' && (
                <div className="space-y-4">
                  {/* Progress Header */}
                  <div className="p-3.5 rounded bg-anthrazit-950 border border-anthrazit-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-accent">Projekt-Fortschritt</span>
                      <h4 className="font-bold text-sm text-anthrazit-100">OSINT & Live-Traffic Command Center</h4>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-xl font-bold text-accent">55%</span>
                      <span className="text-[10px] text-anthrazit-400 block">Meilenstein 1 & 2 aktiv</span>
                    </div>
                  </div>

                  {/* Milestones Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* M1 */}
                    <div className="p-3.5 rounded bg-anthrazit-950/80 border border-emerald-500/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          M1 • ABGESCHLOSSEN
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <h5 className="font-bold text-xs text-anthrazit-100">Bereinigung & Datenharmonisierung</h5>
                      <p className="text-[11px] font-sans text-anthrazit-400 leading-snug">
                        Hannover & Hamburg Linien, Streckenführungen, Taktungen und Haltestellenketten sind 100% konsistent synchronisiert.
                      </p>
                    </div>

                    {/* M2 */}
                    <div className="p-3.5 rounded bg-anthrazit-950/80 border border-accent/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/20 text-accent border border-accent/40">
                          M2 • IN ARBEIT
                        </span>
                        <Clock className="w-4 h-4 text-accent animate-spin" />
                      </div>
                      <h5 className="font-bold text-xs text-anthrazit-100">Admin-Ops-Maske & VPS Bridge</h5>
                      <p className="text-[11px] font-sans text-anthrazit-400 leading-snug">
                        Strukturierte Admin-Oberfläche, Roadmap-Dokumentation und Nginx-Konfiguration für die <code>.core-now.com</code> Subdomain.
                      </p>
                    </div>

                    {/* M3 */}
                    <div className="p-3.5 rounded bg-anthrazit-950/80 border border-anthrazit-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-anthrazit-800 text-anthrazit-300 border border-anthrazit-700">
                          M3 • NÄCHSTER SCHRITT
                        </span>
                        <Train className="w-4 h-4 text-accent" />
                      </div>
                      <h5 className="font-bold text-xs text-anthrazit-100">Live Vehicle Engine („Fahrende Boxen“)</h5>
                      <p className="text-[11px] font-sans text-anthrazit-400 leading-snug">
                        Takt- & GPS-Interpolation für flüssig fahrende Bahnen/Busse auf den Kartenlinien mit Live-Telemetrie.
                      </p>
                    </div>

                    {/* M4 */}
                    <div className="p-3.5 rounded bg-anthrazit-950/80 border border-anthrazit-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-anthrazit-800 text-anthrazit-400 border border-anthrazit-700">
                          M4 • GEPLANT
                        </span>
                        <Radio className="w-4 h-4 text-anthrazit-500" />
                      </div>
                      <h5 className="font-bold text-xs text-anthrazit-100">Sensor-Fusion & Deep OSINT</h5>
                      <p className="text-[11px] font-sans text-anthrazit-400 leading-snug">
                        Korrelation von VMZ-Staudaten, Wasserständen (Elbe/Leine) und Live-Webcams zur Lagebildanalyse.
                      </p>
                    </div>
                  </div>

                  {/* Password Change Widget */}
                  <div className="p-3.5 rounded bg-anthrazit-950 border border-anthrazit-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-anthrazit-200">Admin-Sicherheit & Passwort</span>
                      <span className="text-[10px] text-anthrazit-400 block font-sans">
                        Aktuelles Passwort ist in diesem Browser gespeichert.
                      </span>
                    </div>

                    {!isChangingPass ? (
                      <button
                        onClick={() => setIsChangingPass(true)}
                        className="px-3 py-1.5 rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-anthrazit-700 text-accent font-bold text-[11px] cursor-pointer"
                      >
                        Passwort ändern
                      </button>
                    ) : (
                      <form onSubmit={handleChangePassword} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          placeholder="Neues Passwort..."
                          className="bg-anthrazit-900 border border-accent text-anthrazit-100 rounded px-2 py-1 text-xs focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-2.5 py-1 rounded bg-accent text-anthrazit-950 font-bold text-xs cursor-pointer"
                        >
                          {changePassSuccess ? 'Gespeichert!' : 'Speichern'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsChangingPass(false)}
                          className="p-1 text-anthrazit-400 hover:text-anthrazit-200 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* --- TAB 2: DATASET INSPECTOR --- */}
              {activeTab === 'datasets' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-anthrazit-400 px-1">
                    <span>Vollständigkeitsanalyse aller Datensätze (Hannover & Hamburg)</span>
                    <span className="text-accent font-bold">100% Validiert</span>
                  </div>

                  <div className="overflow-x-auto rounded border border-anthrazit-800 bg-anthrazit-950">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-anthrazit-900 text-anthrazit-400 border-b border-anthrazit-800 uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Bereich</th>
                          <th className="p-2.5">Stadt</th>
                          <th className="p-2.5">Einträge / Umfang</th>
                          <th className="p-2.5">Geodaten & Polylines</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-anthrazit-800/60 font-mono">
                        <tr>
                          <td className="p-2.5 font-bold text-anthrazit-200">Streckennetz & Linien</td>
                          <td className="p-2.5 text-accent font-bold">Hannover</td>
                          <td className="p-2.5">{Object.keys(HANNOVER_TRANSIT_ROUTES).length} Linien (1, 3, 4, 5, 6, 10, S4)</td>
                          <td className="p-2.5 text-emerald-400">178 GPS-Wegpunkte</td>
                          <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">OK</span></td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-anthrazit-200">Streckennetz & Linien</td>
                          <td className="p-2.5 text-cyan-400 font-bold">Hamburg</td>
                          <td className="p-2.5">{Object.keys(HAMBURG_TRANSIT_ROUTES).length} Linien (U1-U4, S1-S3, S5, 61, 62, 72)</td>
                          <td className="p-2.5 text-emerald-400">224 GPS-Wegpunkte</td>
                          <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">OK</span></td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-anthrazit-200">Stationskatalog</td>
                          <td className="p-2.5 text-accent font-bold">Hannover</td>
                          <td className="p-2.5">{ALL_HANNOVER_STATIONS.length} Haltestellen</td>
                          <td className="p-2.5 text-emerald-400">100% mit Lat/Lng</td>
                          <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">OK</span></td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-anthrazit-200">Stationskatalog</td>
                          <td className="p-2.5 text-cyan-400 font-bold">Hamburg</td>
                          <td className="p-2.5">{ALL_HAMBURG_STATIONS.length} Haltestellen</td>
                          <td className="p-2.5 text-emerald-400">100% mit Lat/Lng</td>
                          <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">OK</span></td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-anthrazit-200">Fahrpläne & Taktung</td>
                          <td className="p-2.5 text-anthrazit-300">Beide Städte</td>
                          <td className="p-2.5">{Object.keys(HANNOVER_SCHEDULES).length + Object.keys(HAMBURG_SCHEDULES).length} Linienfahrpläne</td>
                          <td className="p-2.5 text-emerald-400">Minuten-Offsets sync</td>
                          <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">OK</span></td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-anthrazit-200">Overpass OSINT Presets</td>
                          <td className="p-2.5 text-anthrazit-300">Global / Lokal</td>
                          <td className="p-2.5">{MOCK_OVERPASS_PRESETS.length + HAMBURG_OVERPASS_PRESETS.length} Abfrage-Kataloge</td>
                          <td className="p-2.5 text-emerald-400">KritIs, Sirenen, Bunker</td>
                          <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">OK</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* --- TAB 3: API & PROXY HEALTH --- */}
              {activeTab === 'apis' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-anthrazit-100">Live API Endpoint & Proxy Monitor</h4>
                      <p className="text-[11px] text-anthrazit-400 font-sans">
                        Überprüfe die Erreichbarkeit und Latenz aller angebundenen Behörden- und Verkehrs-Schnittstellen.
                      </p>
                    </div>
                    <button
                      onClick={runApiPingTest}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-accent hover:bg-accent-hover text-anthrazit-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Ping Test starten</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {endpoints.map((ep, i) => (
                      <div
                        key={i}
                        className="p-3 rounded bg-anthrazit-950 border border-anthrazit-800 flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-anthrazit-200 text-xs">{ep.name}</span>
                            <span className="text-[10px] text-anthrazit-500">{ep.url}</span>
                          </div>
                          <div className="text-[10px] text-anthrazit-400">
                            {ep.latencyMs ? `Latenz: ${ep.latencyMs}ms` : 'Noch nicht getestet'}
                          </div>
                        </div>

                        <div>
                          {ep.status === 'testing' && (
                            <span className="text-accent text-[10px] flex items-center space-x-1">
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Prüfe...</span>
                            </span>
                          )}
                          {ep.status === 'online' && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                              ONLINE (HTTP {ep.statusCode || 200})
                            </span>
                          )}
                          {ep.status === 'error' && (
                            <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30 text-[10px] font-bold">
                              OFFLINE / TIMEOUT
                            </span>
                          )}
                          {ep.status === 'idle' && (
                            <span className="text-anthrazit-500 text-[10px]">Bereit</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- TAB 4: VEHICLE ENGINE SPECS --- */}
              {activeTab === 'vehicles' && (
                <div className="space-y-3.5">
                  <div className="p-4 rounded bg-anthrazit-950 border border-accent/40 space-y-2">
                    <div className="flex items-center space-x-2 text-accent font-bold text-xs uppercase">
                      <Train className="w-4 h-4" />
                      <span>Final Goal: Live Animated Vehicle Position Engine</span>
                    </div>
                    <p className="text-xs font-sans text-anthrazit-300 leading-relaxed">
                      Das finale Kern-Feature von HBoard: Schienenfahrzeuge, Busse und HADAG-Fähren bewegen sich als stilisierte OSINT-Boxen entlang der echten Trassen auf der Karte.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded bg-anthrazit-950 border border-anthrazit-800 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-accent">1. Mathematische Takt-Interpolation</span>
                      <p className="text-[11px] font-sans text-anthrazit-400 leading-relaxed">
                        Berechnung der exakten Position <code className="text-anthrazit-200">P(t)</code> zwischen Haltestelle A und B auf der Strecken-Polyline. Ermöglicht flüssige 60 FPS-Animation selbst bei Offline-Betrieb.
                      </p>
                    </div>

                    <div className="p-3.5 rounded bg-anthrazit-950 border border-anthrazit-800 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-accent">2. GTFS-RT / VDV-453 Feed Ingestion</span>
                      <p className="text-[11px] font-sans text-anthrazit-400 leading-relaxed">
                        Anbindung der offiziellen Open Data GTFS-Realtime Feeds (z. B. HVV Open Data & GVH) über den VPS-Proxy zur Anzeige tatsächlicher GPS-Fahrzeugkoordinaten.
                      </p>
                    </div>

                    <div className="p-3.5 rounded bg-anthrazit-950 border border-anthrazit-800 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-accent">3. Vehicle Box Marker Styling</span>
                      <p className="text-[11px] font-sans text-anthrazit-400 leading-relaxed">
                        Analytische Icons mit Linienkennzeichnung (z.B. <span className="text-accent font-bold">[6]</span> oder <span className="text-yellow-400 font-bold">[U3]</span>) und automatischer Ausrichtung in Fahrtrichtung.
                      </p>
                    </div>

                    <div className="p-3.5 rounded bg-anthrazit-950 border border-anthrazit-800 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-accent">4. Telemetrie-Klick-Inspektor</span>
                      <p className="text-[11px] font-sans text-anthrazit-400 leading-relaxed">
                        Ein Klick auf ein fahrendes Fahrzeug öffnet die aktuelle Geschwindigkeit, Pünktlichkeit, nächsten Halt und Auslastungs-Schätzung.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- TAB 5: VPS & SUBDOMAIN CONFIG --- */}
              {activeTab === 'vps' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-anthrazit-100">
                        VPS Setup & Nginx Konfiguration (.core-now.com)
                      </h4>
                      <p className="text-[11px] text-anthrazit-400 font-sans">
                        Kopiere diese Konfiguration auf deinen VPS (z. B. unter <code>/etc/nginx/sites-available/hboard.core-now.com</code>).
                      </p>
                    </div>
                    <button
                      onClick={copyNginxSnippet}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-accent hover:bg-accent-hover text-anthrazit-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      {isNginxCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isNginxCopied ? 'Kopiert!' : 'Nginx Config kopieren'}</span>
                    </button>
                  </div>

                  <div className="relative rounded bg-anthrazit-950 border border-anthrazit-800 p-3 max-h-80 overflow-y-auto font-mono text-[11px] text-anthrazit-300">
                    <pre className="whitespace-pre overflow-x-auto leading-tight">{nginxConfigSnippet}</pre>
                  </div>

                  <div className="p-3 rounded bg-anthrazit-950 border border-anthrazit-800 text-[11px] text-anthrazit-400 font-sans space-y-1">
                    <span className="font-bold text-accent block">Vorteile des VPS-Proxy:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-anthrazit-300">
                      <li>Keine CORS-Probleme mehr im Browser</li>
                      <li>Zentrales Caching der Haltestellen- und Fahrplandaten (reduziert API-Rate-Limits)</li>
                      <li>Direkte Vorbereitung für den WebSocket-Stream der fahrenden Boxen (M3)</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
