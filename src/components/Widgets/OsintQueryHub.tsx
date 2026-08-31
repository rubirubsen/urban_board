import React, { useState, useEffect } from 'react';
import { OverpassPreset, OverpassLiveElement } from '../../types';
import { MOCK_OVERPASS_PRESETS, HAMBURG_OVERPASS_PRESETS } from '../../data/mockData';
import { executeOverpassQuery } from '../../services/apiService';
import { Code2, Play, Copy, Check, ExternalLink, Camera, Zap, ShieldAlert, Radio, HelpCircle, Loader2 } from 'lucide-react';

interface OsintQueryHubProps {
  onLoadElementsOnMap?: (elements: OverpassLiveElement[]) => void;
  activeCity?: 'H' | 'HH';
  presets?: OverpassPreset[];
}

export const OsintQueryHub: React.FC<OsintQueryHubProps> = ({ onLoadElementsOnMap, activeCity = 'H', presets }) => {
  const currentPresets = presets || (activeCity === 'HH' ? HAMBURG_OVERPASS_PRESETS : MOCK_OVERPASS_PRESETS);
  const [selectedPreset, setSelectedPreset] = useState<OverpassPreset>(currentPresets[0]);
  const [customQuery, setCustomQuery] = useState<string>(currentPresets[0].query);
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadedCount, setLoadedCount] = useState<number | null>(null);

  useEffect(() => {
    const list = presets || (activeCity === 'HH' ? HAMBURG_OVERPASS_PRESETS : MOCK_OVERPASS_PRESETS);
    setSelectedPreset(list[0]);
    setCustomQuery(list[0].query);
    setLoadedCount(null);
  }, [activeCity, presets]);

  const handleSelectPreset = (preset: OverpassPreset) => {
    setSelectedPreset(preset);
    setCustomQuery(preset.query);
    setLoadedCount(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenExternal = () => {
    const encoded = encodeURIComponent(customQuery);
    window.open(`https://overpass-turbo.eu/?Q=${encoded}`, '_blank');
  };

  // Direct In-App Live Query Execution
  const handleExecuteLive = async () => {
    setLoading(true);
    setLoadedCount(null);
    try {
      const res = await executeOverpassQuery(customQuery);
      if (res.success && res.elements.length > 0) {
        setLoadedCount(res.elements.length);
        if (onLoadElementsOnMap) {
          onLoadElementsOnMap(res.elements);
        }
      } else {
        setLoadedCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera': return <Camera className="w-4 h-4 text-accent" />;
      case 'Zap': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'Radio': return <Radio className="w-4 h-4 text-blue-400" />;
      default: return <Code2 className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <div className="space-y-3 lg:space-y-4 font-mono text-xs w-full">
      {/* Intro & Guide */}
      <div className="p-3 lg:p-4 rounded bg-anthrazit-900 border border-anthrazit-800">
        <div className="flex items-center space-x-1.5 mb-1.5 text-accent font-bold">
          <Code2 className="w-4 h-4" />
          <span className="uppercase text-xs" style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}>Overpass Turbo: Was ist das?</span>
        </div>
        <p className="text-xs font-sans text-anthrazit-300 leading-relaxed mb-2" style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}>
          OpenStreetMap (OSM) ist nicht nur eine Karte, sondern eine riesige Open-Data-Datenbank. Mit <strong>Overpass QL</strong> können wir wie mit SQL gezielt nach Kameras, Leitungen, Umspannwerken oder Rettungswachen in Hannover suchen.
        </p>
        <div className="text-xs text-anthrazit-400 bg-anthrazit-950 p-3 rounded border border-anthrazit-850 flex items-center justify-between">
          <span>💡 <strong>Tipp:</strong> Klicke unten auf &quot;Auf Karte laden&quot;, um die echten OSM-Knoten direkt in diesem Dashboard einzublenden!</span>
        </div>
      </div>

      {/* Preset Selector Grid */}
      <div className="space-y-1.5">
        <div className="text-xs uppercase font-bold text-anthrazit-400 px-1">
          Wähle ein Suchmuster für Hannover:
        </div>
        <div className="grid grid-cols-1 gap-2">
          {MOCK_OVERPASS_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 min-h-[44px] rounded text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-anthrazit-850 border-accent text-anthrazit-100 shadow-sm'
                    : 'bg-anthrazit-900 border-anthrazit-800 text-anthrazit-300 hover:border-anthrazit-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {getIcon(preset.icon)}
                    <span className="font-bold text-xs text-anthrazit-200">{preset.title}</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-anthrazit-800 text-anthrazit-400">
                    {preset.category}
                  </span>
                </div>
                <p className="text-xs font-sans text-anthrazit-300 mb-2">
                  {preset.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {preset.keyTags.map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded bg-anthrazit-950 text-accent text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Beginner Explanation for active preset */}
      <div className="p-3 lg:p-4 rounded bg-accent/10 border border-accent/30 text-anthrazit-200 space-y-1.5 font-sans">
        <div className="flex items-center space-x-1.5 text-accent font-mono font-bold text-xs">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Wie funktioniert diese Abfrage?</span>
        </div>
        <p className="text-xs leading-relaxed text-anthrazit-300">
          {selectedPreset.howItWorks}
        </p>
      </div>

      {/* Query Actions & Direct Execution */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <span className="text-xs uppercase font-bold text-anthrazit-400">Overpass QL Code</span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-2 min-h-[44px] rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-anthrazit-700 text-xs text-anthrazit-200 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Kopiert' : 'Kopieren'}</span>
            </button>
            <button
              onClick={handleOpenExternal}
              className="flex items-center space-x-1 px-3 py-2 min-h-[44px] rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-anthrazit-700 text-xs text-anthrazit-200 cursor-pointer"
              title="Auf overpass-turbo.eu in neuem Tab öffnen"
            >
              <span>Overpass Web</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {/* Live Execution Button */}
        <button
          onClick={handleExecuteLive}
          disabled={loading}
          className="w-full py-3 px-3 min-h-[44px] rounded bg-accent hover:bg-accent-hover disabled:bg-anthrazit-800 text-anthrazit-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-accent-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-anthrazit-950" />
              <span>Query läuft gegen OSM Overpass Server...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>⚡ Live ausführen & Knoten auf Karte einblenden</span>
            </>
          )}
        </button>

        {loadedCount !== null && (
          <div className="p-3 rounded bg-anthrazit-850 border border-accent/40 text-accent text-center text-xs">
            {loadedCount > 0
              ? `✅ ${loadedCount} echte OSM-Knoten gefunden und auf der Karte als orange Punkte markiert!`
              : '⚠️ Keine Treffer in Hannover für diese Filterkriterien gefunden.'}
          </div>
        )}

        <textarea
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          className="w-full min-h-[128px] p-3 rounded bg-anthrazit-950 border border-anthrazit-800 text-anthrazit-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-accent resize-y selection:bg-accent selection:text-anthrazit-950"
          spellCheck={false}
        />
      </div>
    </div>
  );
};
