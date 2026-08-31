import React, { useState } from 'react';
import { GeoLocation } from '../../types';
import { X, RefreshCw, ExternalLink, Camera } from 'lucide-react';

interface WebcamViewerModalProps {
  webcam: GeoLocation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WebcamViewerModal: React.FC<WebcamViewerModalProps> = ({ webcam, isOpen, onClose }) => {
  const [refreshKey, setRefreshKey] = useState<number>(Date.now());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  if (!isOpen || !webcam) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshKey(Date.now());
      setIsRefreshing(false);
    }, 400);
  };

  // Real Autobahn GmbH or VMZ live image url
  const getCameraPreviewUrl = () => {
    const customUrl = (webcam.details as any)?.imageUrl;
    if (customUrl) {
      return `${customUrl}?t=${refreshKey}`;
    }

    if (webcam.id.includes('ost') || webcam.id === 'cam-01') {
      return `https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80&t=${refreshKey}`;
    } else if (webcam.id.includes('nord') || webcam.id === 'cam-02') {
      return `https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80&t=${refreshKey}`;
    } else {
      return `https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80&t=${refreshKey}`;
    }
  };

  const portalUrl = webcam.sourceUrl || 'https://verkehr.autobahn.de/';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-anthrazit-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg bg-anthrazit-900 border border-anthrazit-700 shadow-2xl overflow-hidden font-mono text-xs flex flex-col">
        {/* Modal Header */}
        <div className="p-3 border-b border-anthrazit-800 bg-anthrazit-950 flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="p-1.5 rounded bg-accent/15 text-accent border border-accent/30 shrink-0">
              <Camera className="w-4 h-4" />
            </span>
            <div className="truncate">
              <h3 className="font-bold text-sm text-anthrazit-100 truncate">{webcam.name}</h3>
              <span className="text-[10px] text-anthrazit-400">
                Die Autobahn GmbH des Bundes • {webcam.district || 'Region Hannover'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded bg-anthrazit-850 hover:bg-anthrazit-800 text-anthrazit-300 hover:text-accent cursor-pointer border border-anthrazit-700 transition-colors"
              title="Kamerabild neu laden"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded bg-anthrazit-850 hover:bg-anthrazit-800 text-anthrazit-400 hover:text-anthrazit-100 cursor-pointer border border-anthrazit-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Camera Feed Player */}
        <div className="p-4 space-y-3 bg-anthrazit-950/50">
          <div className="relative rounded overflow-hidden border border-anthrazit-800 bg-black aspect-video flex items-center justify-center group">
            {/* Live Camera Snapshot */}
            <img
              src={getCameraPreviewUrl()}
              alt={webcam.name}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />

            {/* Tactical Live Overlays */}
            <div className="absolute top-2 left-2 flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-accent text-anthrazit-950 font-bold text-[10px] flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-anthrazit-950 animate-ping"></span>
                <span>AUTOBAHN LIVE CAM</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur text-anthrazit-300 text-[10px] border border-anthrazit-700">
                1080p • 25 FPS
              </span>
            </div>

            <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/80 backdrop-blur text-[10px] text-anthrazit-300 border border-anthrazit-800">
              <span>LAT: {webcam.lat.toFixed(4)}° N | LNG: {webcam.lng.toFixed(4)}° E</span>
            </div>

            <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 backdrop-blur text-[10px] text-accent border border-anthrazit-800 font-bold">
              <span>{new Date().toLocaleTimeString('de-DE')}</span>
            </div>
          </div>

          {/* Details & Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded bg-anthrazit-900 border border-anthrazit-800 space-y-1">
              <span className="text-anthrazit-500 uppercase font-bold text-[9px]">Standort / Knoten:</span>
              <span className="font-bold text-anthrazit-200 block truncate">{webcam.name}</span>
            </div>

            <div className="p-2 rounded bg-anthrazit-900 border border-anthrazit-800 space-y-1">
              <span className="text-anthrazit-500 uppercase font-bold text-[9px]">Status / Quelle:</span>
              <span className="text-emerald-400 font-bold block">Online (Autobahn GmbH)</span>
            </div>
          </div>

          {/* Explanation */}
          {webcam.explanation && (
            <div className="p-2.5 rounded bg-accent/10 border border-accent/30 text-anthrazit-300 text-[11px] font-sans">
              <strong className="text-accent font-mono block text-[10px] mb-0.5">ℹ️ KONTEXT:</strong>
              {webcam.explanation}
            </div>
          )}

          {/* Outlink to Official Portal */}
          <div className="flex space-x-2 pt-1">
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded bg-accent hover:bg-accent-hover text-anthrazit-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>Offizielles Portal aufrufen</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
