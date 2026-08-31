import React, { useState } from 'react';
import { X, Search, BookOpen, Lightbulb } from 'lucide-react';
import { GLOSSARY_ENTRIES } from '../../data/mockData';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = ['all', 'OSINT', 'GIS', 'IoT', 'Cyber', 'Verkehr'];

  const filtered = GLOSSARY_ENTRIES.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.detailedExplanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-anthrazit-950/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-lg bg-anthrazit-900 border border-anthrazit-700 shadow-2xl overflow-hidden font-mono">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-anthrazit-800 bg-anthrazit-950">
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold tracking-wider text-anthrazit-100 uppercase">
              OSINT & Urban Data Glossar / Einsteiger-Hilfe
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-anthrazit-800 text-anthrazit-400 hover:text-anthrazit-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Search */}
        <div className="p-4 border-b border-anthrazit-800 bg-anthrazit-900 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-anthrazit-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Begriffe durchsuchen (z. B. Overpass, Shodan, Pegel, GBFS, SCADA)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-anthrazit-950 border border-anthrazit-700 rounded text-xs text-anthrazit-100 focus:outline-none focus:border-accent"
              autoFocus
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-accent text-anthrazit-950 font-bold'
                    : 'bg-anthrazit-850 text-anthrazit-400 hover:text-anthrazit-200'
                }`}
              >
                {cat === 'all' ? 'Alle Begriffe' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Entries List */}
        <div className="p-5 overflow-y-auto space-y-4">
          {filtered.map((item) => (
            <div
              key={item.term}
              className="p-4 rounded bg-anthrazit-850 border border-anthrazit-750 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-anthrazit-100">{item.term}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-accent/15 border border-accent/30 text-accent font-bold">
                  {item.category}
                </span>
              </div>

              <div className="text-xs font-semibold text-anthrazit-200 font-sans">
                {item.shortDef}
              </div>

              <p className="text-xs text-anthrazit-300 font-sans leading-relaxed">
                {item.detailedExplanation}
              </p>

              <div className="p-2.5 rounded bg-anthrazit-900 border border-anthrazit-800 text-[11px] text-anthrazit-300 font-sans flex items-start space-x-2">
                <Lightbulb className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-accent font-mono">Beispiel / Relevanz: </strong>
                  {item.example}
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-anthrazit-400 text-xs">
              Keine Begriffe für &quot;{searchQuery}&quot; gefunden.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-anthrazit-800 bg-anthrazit-950 flex items-center justify-between text-[11px] text-anthrazit-500">
          <span>HBOARD Wissensbasis Hannover</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-anthrazit-800 hover:bg-anthrazit-700 text-anthrazit-200 rounded text-xs cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
