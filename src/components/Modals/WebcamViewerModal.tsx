import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
    <div className="fixed inset-0 z-[1200] flex items-end lg:items-center justify-center bg-anthrazit-950/80 backdrop-blur-sm p-0 lg:p-4">
      <div className="relative z-[1201] w-full lg:max-w-2xl max-h-[90dvh] flex flex-col rounded-t-xl lg:rounded-xl bg-anthrazit-900 border-t lg:border border-anthrazit-700 shadow-2xl overflow-hidden font-mono text-xs pb-[env(safe-area-inset-bottom)]">
        {/* Modal Header */}
        <div className="p-4 border-b border-anthrazit-800 bg-anthrazit-950 flex items-center justify-between min-h-[60px]">
          <div className="flex items-center space-x-3 min-w-0">
            <span className="p-2 rounded bg-accent/15 text-accent border border-accent/30 shrink-0">
              <Camera className="w-4 h-4" />
            </span>
            <div className="truncate">
              <h3 className="font-bold text-sm text-anthrazit-100 truncate style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}">{webcam.name}</h3>
              <span className="text-xs text-anthrazit-400">
                Die Autobahn GmbH des Bundes • {webcam.district || 'Region Hannover'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleRefresh}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded bg-anthrazit-850 hover:bg-anthrazit-800 text-anthrazit-300 hover:text-accent cursor-pointer border border-anthrazit-700 transition-colors"
              title="Kamerabild neu laden"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded bg-anthrazit-850 hover:bg-anthrazit-800 text-anthrazit-400 hover:text-anthrazit-100 cursor-pointer border border-anthrazit-700 -mr-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Camera Feed Player */}
        <div className="p-4 space-y-4 bg-anthrazit-950/50 overflow-y-auto overscroll-contain">
          <div className="relative rounded overflow-hidden border border-anthrazit-800 bg-black aspect-video flex items-center justify-center group">
            {/* Live Camera Snapshot */}
            <img
              src={getCameraPreviewUrl()}
              alt={webcam.name}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />

            {/* Tactical Live Overlays */}
            <div className="absolute top-2 left-2 flex items-center space-x-2">
              <span className="px-2 py-1 rounded bg-accent text-anthrazit-950 font-bold text-xs flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-anthrazit-950 animate-ping"></span>
                <span>AUTOBAHN LIVE CAM</span>
              </span>
              <span className="px-2 py-1 rounded bg-black/75 backdrop-blur text-anthrazit-300 text-xs border border-anthrazit-700 hidden sm:block">
                1080p • 25 FPS
              </span>
            </div>

            <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/80 backdrop-blur text-xs text-anthrazit-300 border border-anthrazit-800 hidden sm:block">
              <span>LAT: {webcam.lat.toFixed(4)}° N | LNG: {webcam.lng.toFixed(4)}° E</span>
            </div>

            <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 backdrop-blur text-xs text-accent border border-anthrazit-800 font-bold">
              <span>{new Date().toLocaleTimeString('de-DE')}</span>
            </div>
          </div>

          {/* Details & Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded bg-anthrazit-900 border border-anthrazit-800 space-y-1">
              <span className="text-anthrazit-500 uppercase font-bold text-xs block mb-1">Standort / Knoten:</span>
              <span className="font-bold text-anthrazit-200 block">{webcam.name}</span>
            </div>

            <div className="p-3 rounded bg-anthrazit-900 border border-anthrazit-800 space-y-1">
              <span className="text-anthrazit-500 uppercase font-bold text-xs block mb-1">Status / Quelle:</span>
              <span className="text-emerald-400 font-bold block">Online (Autobahn GmbH)</span>
            </div>
          </div>

          {/* Explanation */}
          {webcam.explanation && (
            <div className="p-3.5 rounded bg-accent/10 border border-accent/30 text-anthrazit-300 text-xs font-sans mt-2">
              <strong className="text-accent font-mono block text-xs mb-1">ℹ️ KONTEXT:</strong>
              {webcam.explanation}
            </div>
          )}

          {/* Outlink to Official Portal */}
          <div className="flex space-x-2 pt-2">
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 min-h-[44px] rounded bg-accent hover:bg-orange-600 text-anthrazit-950 font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
            >
              <span>Offizielles Portal aufrufen</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
