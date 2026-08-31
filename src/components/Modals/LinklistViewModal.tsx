import React, { useState } from 'react';
import { X, ExternalLink, Bookmark, Search, Database, Car, Cpu, ShieldAlert } from 'lucide-react';

interface LinklistViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCity?: 'H' | 'HH';
}

interface LinkCategory {
  title: string;
  icon: any;
  items: {
    title: string;
    url: string;
    desc: string;
    city?: 'H' | 'HH' | 'ALL';
  }[];
}

const LINKLIST_DATA: LinkCategory[] = [
  {
    title: 'Offene Daten & Portale',
    icon: Database,
    items: [
      {
        title: 'Transparenzportal Hamburg (Open Data)',
        url: 'https://transparenz.hamburg.de/',
        desc: 'Offizielles Open-Data-Portal der Freien und Hansestadt Hamburg für Geo- und Verwaltungsdaten.',
        city: 'HH'
      },
      {
        title: 'Masterportal / Geoportal Hamburg (LGV)',
        url: 'https://geoportal-hamburg.de/masterportal/',
        desc: 'Umfassendes Kartenportal für Geobasisdaten, 3D-Stadtmodelle und Bebauungspläne.',
        city: 'HH'
      },
      {
        title: 'OGD Hannover (Open Data Portal)',
        url: 'https://open.hannover-stadt.de/',
        desc: 'Offizielles Portal für georeferenzierte Daten, Stadtkarten, Luftbilder und städtische Statistiken.',
        city: 'H'
      },
      {
        title: 'Geodatenportal Region Hannover',
        url: 'https://www.hannover.de/Region-Hannover/Themen/Umwelt-Natur/GIS-Geodaten',
        desc: 'Kartenmaterial, Umwelt- und Planungsdaten des Umlands.',
        city: 'H'
      },
      {
        title: 'OpenStreetMap (OSM)',
        url: 'https://www.openstreetmap.org/',
        desc: 'Frei editierbare Vektorkarte (ideal für Overpass-Turbo GIS Mining).',
        city: 'ALL'
      }
    ]
  },
  {
    title: 'Verkehr & Mobilität (APIs & Live-Daten)',
    icon: Car,
    items: [
      {
        title: 'Hamburg Port Authority (HPA) Hafen & Schleusen',
        url: 'https://www.hamburg-port-authority.de/',
        desc: 'Verkehrsmanagement im Hamburger Hafen, Brücken- und Schleusenzeiten, AIS-Schiffsradar.',
        city: 'HH'
      },
      {
        title: 'HVV Geodaten & GTFS / HAFAS',
        url: 'https://www.hvv.de/de/geodaten',
        desc: 'Echtzeit-Fahrplandaten, Soll-Fahrpläne und Haltestellenkoordinaten des Hamburger Verkehrsverbunds.',
        city: 'HH'
      },
      {
        title: 'StadtRAD Hamburg (DB Connect API)',
        url: 'https://stadtrad.hamburg.de/',
        desc: 'Stationen und Verfügbarkeit des Hamburger Leihradsystems.',
        city: 'HH'
      },
      {
        title: 'VMZ Niedersachsen',
        url: 'https://www.vmz-niedersachsen.de/',
        desc: 'Verkehrslage, Baustellen, Webcams und Staudaten für den Großraum Hannover.',
        city: 'H'
      },
      {
        title: 'ÜSTRA Fahrplanauskunft & GTFS',
        url: 'https://www.uestra.de/',
        desc: 'Öffentliche Fahrpläne und Echtzeitdaten-Schnittstellen des Nahverkehrs Hannover.',
        city: 'H'
      },
      {
        title: 'Nextbike Hannover',
        url: 'https://www.nextbike.de/hannover/',
        desc: 'Standort- und Verfügbarkeits-API für das städtische Leihradsystem Hannover.',
        city: 'H'
      }
    ]
  },
  {
    title: 'IoT, Smart City & Pegel/Umwelt',
    icon: Cpu,
    items: [
      {
        title: 'Urban Data Hub Hamburg / BUKEA',
        url: 'https://www.hamburg.de/bukea/',
        desc: 'Umwelt- und Luftmessnetz Hamburg (Habichtstraße, Veddel) sowie Elbe-Sturmflutwarndienst (WADI).',
        city: 'HH'
      },
      {
        title: 'HIDD (Hannover Urban Data Platform)',
        url: 'https://hidd.hannover-region.de/',
        desc: 'Dashboard für IoT-Sensordaten, Umweltmesswerte und urbane Infrastruktur.',
        city: 'H'
      },
      {
        title: 'Deutscher Wetterdienst (DWD) Open Data',
        url: 'https://www.dwd.de/',
        desc: 'Live-Wetterdaten, Warnungen und Radar-Messwerte der Stationen Hamburg und Hannover.',
        city: 'ALL'
      },
      {
        title: 'WSV Pegelonline (Elbe & Leine)',
        url: 'https://pegelonline.wsv.de/',
        desc: 'Bundesweites Pegeldatenportal für Schifffahrts- und Sturmflutpegel.',
        city: 'ALL'
      }
    ]
  },
  {
    title: 'Sicherheitsrecherche & OSINT-Tools',
    icon: ShieldAlert,
    items: [
      {
        title: 'Shodan',
        url: 'https://www.shodan.io/',
        desc: 'Suchmaschine für mit dem Internet verbundene Geräte, SCADA/ICS und IP-Netze in HH & H.',
        city: 'ALL'
      },
      {
        title: 'Censys Search',
        url: 'https://search.censys.io/',
        desc: 'Zertifikats- und Port-Scanning städtischer IT-Infrastrukturen.',
        city: 'ALL'
      },
      {
        title: 'Overpass Turbo',
        url: 'https://overpass-turbo.eu/',
        desc: 'Werkzeug für Abfragen und Mining von OpenStreetMap-Elementen (Kameras, Umspannwerke, BOS).',
        city: 'ALL'
      }
    ]
  }
];

export const LinklistViewModal: React.FC<LinklistViewModalProps> = ({ isOpen, onClose, activeCity = 'H' }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredCategories = LINKLIST_DATA.map((cat) => {
    const items = cat.items.filter(
      (item) =>
        (item.city === 'ALL' || !item.city || item.city === activeCity) &&
        (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return { ...cat, items };
  }).filter((cat) => cat.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-anthrazit-950/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-lg bg-anthrazit-900 border border-anthrazit-700 shadow-2xl overflow-hidden font-mono">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-anthrazit-800 bg-anthrazit-950">
          <div className="flex items-center space-x-2.5">
            <Bookmark className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold tracking-wider text-anthrazit-100 uppercase">
              {activeCity === 'HH' ? 'Hamburg OSINT Datenquellen & Linkliste' : 'Hannover OSINT Datenquellen & Linkliste'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-anthrazit-800 text-anthrazit-400 hover:text-anthrazit-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-anthrazit-800 bg-anthrazit-900">
          <div className="relative">
            <Search className="w-4 h-4 text-anthrazit-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Datenquellen durchsuchen (z. B. Shodan, VMZ, HIDD)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-anthrazit-950 border border-anthrazit-700 rounded text-xs text-anthrazit-100 focus:outline-none focus:border-accent"
              autoFocus
            />
          </div>
        </div>

        {/* Content List */}
        <div className="p-5 overflow-y-auto space-y-6">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.title} className="space-y-2.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-accent uppercase tracking-wider">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.title}</span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {cat.items.map((item) => (
                    <a
                      key={item.title}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded bg-anthrazit-850 hover:bg-anthrazit-800 border border-anthrazit-750 hover:border-accent/60 transition-all block group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-anthrazit-100 group-hover:text-accent flex items-center space-x-1.5">
                          <span>{item.title}</span>
                          <ExternalLink className="w-3 h-3 text-anthrazit-400 group-hover:text-accent" />
                        </span>
                        <span className="text-[10px] text-anthrazit-500 truncate max-w-xs">
                          {item.url}
                        </span>
                      </div>
                      <p className="text-[11px] font-sans text-anthrazit-300 leading-normal">
                        {item.desc}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredCategories.length === 0 && (
            <div className="text-center py-12 text-anthrazit-400 text-xs">
              Keine Quellen für &quot;{searchQuery}&quot; gefunden.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-anthrazit-800 bg-anthrazit-950 flex items-center justify-between text-[11px] text-anthrazit-500">
          <span>Gespeichert in linklist_hannover.md</span>
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
