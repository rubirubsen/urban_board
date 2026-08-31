import { GeoLocation, TrafficIncident, IoTSensor, CyberAsset, OverpassPreset, WeatherTelemetry, GlossaryEntry } from '../types';

export const HANNOVER_COORDINATES: [number, number] = [52.3759, 9.7320];
export const HAMBURG_COORDINATES: [number, number] = [53.5511, 9.9937];

export const INITIAL_GEO_MARKERS: GeoLocation[] = [
  // VMZ / Traffic Cameras & Points
  {
    id: 'cam-01',
    name: 'VMZ Webcam: A2 Kreuz Hannover-Ost',
    lat: 52.4182,
    lng: 9.8732,
    category: 'traffic',
    type: 'Verkehrskamera',
    district: 'Misburg-Anderten',
    status: 'active',
    explanation: 'Öffentliche Verkehrskamera der Verkehrsmanagementzentrale Niedersachsen am Autobahnkreuz A2/A7. Zeigt Staus und Verkehrsfluss in Echtzeit.',
    sourceUrl: 'https://www.vmz-niedersachsen.de/',
    details: {
      'Auflösung': '1080p Stream',
      'Fahrtrichtung': 'Berlin / Dortmund',
      'FPS': '25',
      'Quelle': 'VMZ Niedersachsen'
    },
    timestamp: 'Live Stream'
  },
  {
    id: 'cam-02',
    name: 'VMZ Webcam: Messeschnellweg B3 / Pferdeturm',
    lat: 52.3689,
    lng: 9.7891,
    category: 'traffic',
    type: 'Verkehrskamera',
    district: 'Buchholz-Kleefeld',
    status: 'active',
    explanation: 'Hauptverkehrsader Hannover Messe/Süd. Wichtiger Engpass zu Messezeiten und im Berufsverkehr.',
    sourceUrl: 'https://www.vmz-niedersachsen.de/',
    details: {
      'Auslastung': 'Hohes Verkehrsaufkommen',
      'Quelle': 'VMZ Niedersachsen',
      'Status': 'Live Stream OK'
    },
    timestamp: 'Live Stream'
  },
  {
    id: 'cam-03',
    name: 'VMZ Webcam: Friederikenplatz / City-Ring',
    lat: 52.3695,
    lng: 9.7315,
    category: 'traffic',
    type: 'Verkehrskamera',
    district: 'Mitte',
    status: 'active',
    explanation: 'Zentraler City-Knotenpunkt vor dem Landtag und Ministerien. Ermöglicht Verkehrsüberwachung des Innenstadtrings.',
    sourceUrl: 'https://www.vmz-niedersachsen.de/',
    details: {
      'Knotenpunkt': 'Friederikenplatz / Lavesallee',
      'Quelle': 'VMZ Niedersachsen'
    },
    timestamp: 'Live Stream'
  },

  // IoT / Environmental Sensors (HIDD / NLWKN)
  {
    id: 'iot-01',
    name: 'Pegelmessstation Leine (Herrenhausen)',
    lat: 52.3912,
    lng: 9.6845,
    category: 'iot',
    type: 'Wasserpegel',
    district: 'Herrenhausen-Stöcken',
    status: 'warning',
    explanation: 'Offizieller Flusspegel des NLWKN. Die Leine entwässert das gesamte Stadtgebiet. Meldestufe 1 greift ab 3.80 m (Uferüberflutung beginnt).',
    sourceUrl: 'https://www.pegelonline.wsv.de/',
    details: {
      'Wasserstand': '3.92 m',
      'Meldestufe': 'Warnstufe 1 (ab 3.80 m)',
      'Normalstand': '2.10 m',
      'Quelle': 'NLWKN / PegelOnline WSV'
    },
    timestamp: '10:30'
  },
  {
    id: 'iot-02',
    name: 'Luftgüte & Feinstaub: Steintor',
    lat: 52.37532,
    lng: 9.73145,
    category: 'iot',
    type: 'Umweltsensor',
    district: 'Mitte',
    status: 'active',
    explanation: 'Sensor für Feinstaub (PM2.5 / PM10) und Stickoxide (NO2). Wichtig zur Identifikation lokaler Smog-, Verkehrs- oder Rauchbelastungen.',
    sourceUrl: 'https://hidd.hannover-region.de/',
    details: {
      'PM2.5': '14.2 µg/m³ (Gut)',
      'PM10': '26.8 µg/m³ (Mäßig)',
      'NO2': '32.1 µg/m³',
      'Quelle': 'HIDD Urban Data Platform'
    },
    timestamp: '10:40'
  },
  {
    id: 'iot-03',
    name: 'Pegelmessstation Ihme (Schwarzer Bär)',
    lat: 52.36652,
    lng: 9.71695,
    category: 'iot',
    type: 'Wasserpegel',
    district: 'Linden-Limmer',
    status: 'active',
    explanation: 'Flusspegel der Ihme in Linden. Mündet kurz hinter dem Küchengarten in die Leine. Maßgeblich für Hochwasserschutz in Linden und Calenberger Neustadt.',
    sourceUrl: 'https://www.pegelonline.wsv.de/',
    details: {
      'Wasserstand': '2.14 m',
      'Meldestufe': 'Normal',
      'Quelle': 'NLWKN'
    },
    timestamp: '10:35'
  },

  // Nextbike Hubs
  {
    id: 'bike-01',
    name: 'Nextbike Hub: Hannover Hbf (Ernst-August-Platz)',
    lat: 52.37682,
    lng: 9.74128,
    category: 'traffic',
    type: 'Mobility Hub',
    district: 'Mitte',
    status: 'active',
    explanation: 'Städtischer Leihrad-Knotenpunkt. Die GBFS-Schnittstelle liefert minütlich freie Räder und Docks (wichtig zur Erkennung von Mobilitätsströmen).',
    sourceUrl: 'https://www.nextbike.de/hannover/',
    details: {
      'Verfügbare Räder': '18',
      'Freie Docks': '6',
      'E-Bikes': '4',
      'Quelle': 'GBFS Live Feed'
    },
    timestamp: '10:42'
  },
  {
    id: 'bike-02',
    name: 'Nextbike Hub: Universität / Welfengarten',
    lat: 52.38245,
    lng: 9.71842,
    category: 'traffic',
    type: 'Mobility Hub',
    district: 'Nord',
    status: 'active',
    explanation: 'Fahrrad-Verleihstation am Hauptgebäude der Leibniz Universität. Hohe Auslastung zwischen 08:00 und 18:00 Uhr.',
    sourceUrl: 'https://www.nextbike.de/hannover/',
    details: {
      'Verfügbare Räder': '12',
      'Freie Docks': '12',
      'E-Bikes': '2',
      'Quelle': 'GBFS Live Feed'
    },
    timestamp: '10:42'
  },

  // Critical Infra & OSINT Nodes
  {
    id: 'infra-01',
    name: 'Umspannwerk & Schaltanlage Hannover-West',
    lat: 52.3789,
    lng: 9.6890,
    category: 'security',
    type: 'Kritische Infrastruktur',
    district: 'Linden-Limmer',
    status: 'active',
    explanation: '110kV/10kV Umspannstation für die westlichen Stadtteile und Industriekomplexe. Kritische Energieinfrastruktur nach KRITIS-Kriterien.',
    details: {
      'Spannungsebene': '110 kV / 10 kV',
      'Betreiber': 'enercity Netz GmbH',
      'OSM Node': 'node/491823901'
    },
    timestamp: '10:00'
  },
  {
    id: 'infra-02',
    name: 'Leibniz Universität Rechenzentrum (LUIS)',
    lat: 52.3831,
    lng: 9.7125,
    category: 'cyber',
    type: 'Rechenzentrum / AS680',
    district: 'Nord',
    status: 'active',
    explanation: 'Hauptrechenzentrum und DFN-Netzknotenpunkt (Deutsches Forschungsnetz). Verwaltet das Subnetz 130.75.0.0/16 mit über 1.400 exponierten Servern.',
    details: {
      'ASN': 'AS680 (DFN-Verein)',
      'Subnetz': '130.75.0.0/16',
      'DNS': 'dns1.luis.uni-hannover.de',
      'Shodan Hosts': '1,420 exposed'
    },
    timestamp: '10:15'
  },
  {
    id: 'infra-03',
    name: 'Fernmeldeturm Hannover (Telemoritz)',
    lat: 52.3783,
    lng: 9.7424,
    category: 'security',
    type: 'Funk- & Richtfunkknoten',
    district: 'Mitte',
    status: 'active',
    explanation: '141 Meter hoher ehemaliger Fernmeldeturm hinter dem Hauptbahnhof. Beherbergt Richtfunkantennen, BOS-Behördenfunk und Notfallkommunikation.',
    details: {
      'Höhe': '141 m',
      'Typ': 'Typenturm FMT 1',
      'Funkstellen': 'BOS / DMR / Richtfunk'
    },
    timestamp: '10:00'
  }
];

export const MOCK_TRAFFIC_INCIDENTS: TrafficIncident[] = [
  {
    id: 'inc-01',
    road: 'A2 Dortmund ➔ Hannover',
    location: 'Zwischen AK Hannover-Buchholz und Kreuz Hannover-Ost',
    type: 'Stau',
    delayMinutes: 28,
    lengthKm: 6.4,
    severity: 'high',
    direction: 'Ost (Berlin)',
    updatedAt: 'vor 3 Min.',
    details: 'Schwertransport mit Panne blockiert rechten Fahrstreifen. Rückstau bis Kreuz Buchholz.'
  },
  {
    id: 'inc-02',
    road: 'B3 Messeschnellweg',
    location: 'Höhe Weidetorkreisel / Anschlussstelle Podbielskistraße',
    type: 'Baustelle',
    delayMinutes: 12,
    lengthKm: 2.1,
    severity: 'medium',
    direction: 'Süd (Messe)',
    updatedAt: 'vor 8 Min.',
    details: 'Fahrbahnsanierung im Kurvenbereich. Einspurige Verkehrsführung eingerichtet.'
  },
  {
    id: 'inc-03',
    road: 'Friedrich-Ebert-Straße',
    location: 'Kaisergabel / B65 Richtung Ricklingen',
    type: 'Sperrung',
    delayMinutes: 15,
    lengthKm: 1.2,
    severity: 'medium',
    direction: 'Stadtauswärts',
    updatedAt: 'vor 14 Min.',
    details: 'Leitungsarbeiten der Stadtwerke. Umleitung über Frankfurter Allee ausgeschildert.'
  },
  {
    id: 'inc-04',
    road: 'A7 Hamburg ➔ Kassel',
    location: 'Zwischen Mellendorf und Kreuz Hannover-Nord',
    type: 'Gefahr',
    delayMinutes: 8,
    lengthKm: 1.8,
    severity: 'low',
    direction: 'Süd (Kassel)',
    updatedAt: 'vor 21 Min.',
    details: 'Verlorene Ladungsteile auf der Fahrbahn. Polizei vor Ort zur Sicherung.'
  }
];

export const MOCK_IOT_SENSORS: IoTSensor[] = [
  {
    id: 'sensor-pegel-herrenhausen',
    name: 'Leine Pegel Herrenhausen',
    location: 'Herrenhausen / Wasserkunst',
    metric: 'Wasserstand',
    value: 3.92,
    unit: 'm',
    threshold: { warn: 3.80, crit: 4.80 },
    trend: 'up',
    history: [3.45, 3.52, 3.61, 3.74, 3.82, 3.88, 3.92],
    updatedAt: '10:30',
    explanation: 'Misst die Pegelhöhe der Leine. Ab 3.80 m gilt Meldestufe 1 (Überflutung land- und forstwirtschaftlicher Flächen). Ab 4.80 m Meldestufe 2 (Gefahr für bebaute Grundstücke).',
    criticalInfo: 'Wasserstand steigt aktuell um ca. 3 cm pro Stunde.'
  },
  {
    id: 'sensor-luft-steintor',
    name: 'Feinstaub PM2.5 Steintor',
    location: 'Mitte / Steintorplatz',
    metric: 'Partikelbelastung',
    value: 14.2,
    unit: 'µg/m³',
    threshold: { warn: 25.0, crit: 50.0 },
    trend: 'stable',
    history: [18.1, 16.5, 15.0, 14.8, 14.0, 13.9, 14.2],
    updatedAt: '10:40',
    explanation: 'PM2.5 Partikel sind lungengängig (< 2.5 µm). Der WHO-Richtwert liegt bei 15 µg/m³ im 24h-Mittel. Aktuelle Werte liegen im tolerablen Bereich.',
  },
  {
    id: 'sensor-parken-city',
    name: 'Parkhaus-Belegung Innenstadt',
    location: 'Mitte / Ernst-August-Galerie & Oper',
    metric: 'Auslastung',
    value: 78.4,
    unit: '%',
    threshold: { warn: 85.0, crit: 95.0 },
    trend: 'up',
    history: [45.0, 52.3, 61.0, 68.9, 72.1, 75.0, 78.4],
    updatedAt: '10:41',
    explanation: 'Echtzeit-Auslastung der Parkleitsysteme der Landeshauptstadt Hannover. Zeigt die Dichte von PKW-Zuläufen im City-Kern an.',
  },
  {
    id: 'sensor-pegel-ihme',
    name: 'Ihme Pegel Schwarzer Bär',
    location: 'Linden-Süd / Benno-Ohnesorg-Brücke',
    metric: 'Wasserstand',
    value: 2.14,
    unit: 'm',
    threshold: { warn: 3.00, crit: 4.20 },
    trend: 'down',
    history: [2.30, 2.26, 2.22, 2.19, 2.16, 2.15, 2.14],
    updatedAt: '10:35',
    explanation: 'Pegel der Ihme in Linden. Wichtig für die Schleuse und den Wehrbetrieb am Schnellen Graben.',
  }
];

export const MOCK_CYBER_ASSETS: CyberAsset[] = [
  {
    id: 'as-01',
    target: 'portal.hannover-stadt.de',
    ip: '194.126.240.12',
    organization: 'Landeshauptstadt Hannover',
    openPorts: [80, 443],
    vulnerabilitiesCount: 0,
    tlsExpiry: 'in 82 Tagen',
    lastScanned: '2026-08-30 22:14',
    serviceType: 'Nginx / Cloudflare',
    explanation: 'Offizielles Bürger- und Verwaltungsportal. Ports 80 (HTTP) und 443 (HTTPS) sind Standard für Web-Gateways.'
  },
  {
    id: 'as-02',
    target: 'vpn.region-hannover.de',
    ip: '212.87.34.88',
    organization: 'Region Hannover Kommunalverband',
    openPorts: [443, 4433, 8443],
    vulnerabilitiesCount: 1,
    tlsExpiry: 'in 41 Tagen',
    lastScanned: '2026-08-31 01:20',
    serviceType: 'Fortinet FortiGate SSL-VPN',
    explanation: 'Mitarbeiter-VPN-Zugang für den Kommunalverband. SSL-VPN-Endpunkte sind häufige Angriffsziele für Brute-Force oder unvollständige Patches.'
  },
  {
    id: 'as-03',
    target: 'scada-gw01.enercity-infra.local',
    ip: '194.95.12.6',
    organization: 'enercity AG Substation Net',
    openPorts: [502, 102, 44818],
    vulnerabilitiesCount: 2,
    tlsExpiry: 'Nicht aktiv (Industrial Prot)',
    lastScanned: '2026-08-30 18:40',
    serviceType: 'Modbus TCP / Siemens S7',
    explanation: 'Industrielles SCADA/ICS-Steuerungsprotokoll (Port 502 = Modbus, Port 102 = Siemens S7). Sollte niemals ohne VPN aus dem Internet erreichbar sein!'
  },
  {
    id: 'as-04',
    target: 'auth.luis.uni-hannover.de',
    ip: '130.75.1.18',
    organization: 'Leibniz Universität Hannover',
    openPorts: [80, 443, 636, 8443],
    vulnerabilitiesCount: 0,
    tlsExpiry: 'in 214 Tagen',
    lastScanned: '2026-08-31 00:05',
    serviceType: 'Shibboleth IdP / Apache',
    explanation: 'Zentraler Single-Sign-On Authentifizierungsserver für Studenten und Professoren (Port 636 = LDAPS).'
  }
];

export const HAMBURG_CYBER_ASSETS: CyberAsset[] = [
  {
    id: 'hh-as-01',
    target: 'gateway.hamburg.de',
    ip: '193.159.224.18',
    organization: 'Freie und Hansestadt Hamburg (Dataport)',
    openPorts: [80, 443],
    vulnerabilitiesCount: 0,
    tlsExpiry: 'in 94 Tagen',
    lastScanned: '2026-08-30 23:10',
    serviceType: 'Nginx / Dataport Gateway',
    explanation: 'Zentrales Service-Portal der Freien und Hansestadt Hamburg, betrieben vom IT-Dienstleister Dataport AöR.'
  },
  {
    id: 'hh-as-02',
    target: 'vpn.hpa.hamburg.de',
    ip: '194.126.150.44',
    organization: 'Hamburg Port Authority (HPA)',
    openPorts: [443, 10443],
    vulnerabilitiesCount: 1,
    tlsExpiry: 'in 38 Tagen',
    lastScanned: '2026-08-31 02:15',
    serviceType: 'Cisco AnyConnect / ASA Gateway',
    explanation: 'Mitarbeiter- und Dienstleister-VPN für das Hafen- und Schleusenmanagement im Hamburger Hafen.'
  },
  {
    id: 'hh-as-03',
    target: 'scada-sub.stromnetz-hamburg.de',
    ip: '195.200.70.12',
    organization: 'Stromnetz Hamburg GmbH KRITIS',
    openPorts: [502, 2404, 8443],
    vulnerabilitiesCount: 2,
    tlsExpiry: 'Interne PKI (IEC 60870-5-104)',
    lastScanned: '2026-08-30 19:50',
    serviceType: 'IEC 104 / SCADA Telecontrol',
    explanation: 'Kritisches Fernwirkprotokoll für Hoch- und Mittelspannungsstationen (Port 2404 = IEC 60870-5-104). Höchste Schutzklasse.'
  },
  {
    id: 'hh-as-04',
    target: 'auth.uni-hamburg.de',
    ip: '134.100.32.10',
    organization: 'Universität Hamburg (RRZ)',
    openPorts: [80, 443, 636],
    vulnerabilitiesCount: 0,
    tlsExpiry: 'in 180 Tagen',
    lastScanned: '2026-08-31 04:00',
    serviceType: 'Shibboleth SSO / DFN-PKI',
    explanation: 'Zentraler Authentifizierungsserver des Regionalen Rechenzentrums der Universität Hamburg.'
  },
  {
    id: 'hh-as-05',
    target: 'cta-scada.hhla.de',
    ip: '194.138.88.22',
    organization: 'HHLA Hamburger Hafen und Logistik AG',
    openPorts: [443, 502, 102],
    vulnerabilitiesCount: 1,
    tlsExpiry: 'in 65 Tagen',
    lastScanned: '2026-08-30 21:30',
    serviceType: 'Siemens WinCC SCADA / AGV Control',
    explanation: 'Steuerungsschnittstelle für Containerbrücken und fahrerlose Transportfahrzeuge am Container Terminal Altenwerder.'
  }
];

export const HAMBURG_TRAFFIC_INCIDENTS: TrafficIncident[] = [
  {
    id: 'hh-inc-01',
    road: 'A7 Flensburg ➔ Hannover',
    location: 'Elbtunnel (Südröhre) bis AS Hamburg-Waltershof',
    type: 'Stau',
    delayMinutes: 32,
    lengthKm: 7.4,
    severity: 'high',
    direction: 'Süd (Hannover / Bremen)',
    updatedAt: 'vor 2 Min.',
    details: 'Blockabfertigung vor dem Elbtunnel nach defektem LKW. Rückstau bis AS Volkspark.'
  },
  {
    id: 'hh-inc-02',
    road: 'A1 Lübeck ➔ Bremen',
    location: 'Zwischen AK Hamburg-Süd und Norderelbbrücke',
    type: 'Baustelle',
    delayMinutes: 16,
    lengthKm: 3.2,
    severity: 'medium',
    direction: 'Süd / West',
    updatedAt: 'vor 9 Min.',
    details: 'Fahrbahninstandsetzung auf der Norderelbbrücke. Zwei verengte Fahrstreifen.'
  },
  {
    id: 'hh-inc-03',
    road: 'B4 Willy-Brandt-Straße',
    location: 'Zwischen Rödingsmarkt und Deichtortunnel',
    type: 'Baustelle',
    delayMinutes: 11,
    lengthKm: 1.8,
    severity: 'medium',
    direction: 'Ost (Hauptbahnhof)',
    updatedAt: 'vor 15 Min.',
    details: 'Fernwärmearbeiten im Bereich Große Reichenstraße. Einspurige Verkehrsführung.'
  },
  {
    id: 'hh-inc-04',
    road: 'Köhlbrandbrücke (K6)',
    location: 'Zufahrt Finkenwerder Straße / Roßdamm',
    type: 'Sperrung',
    delayMinutes: 24,
    lengthKm: 2.5,
    severity: 'high',
    direction: 'Hafen / A7',
    updatedAt: 'vor 5 Min.',
    details: 'Schwertransportbegleitung und Windwarnung auf der Brücke. Umleitung über Rethe-Klappbrücke.'
  }
];

export const HAMBURG_IOT_SENSORS: IoTSensor[] = [
  {
    id: 'sensor-pegel-stpauli',
    name: 'Elbe Pegel St. Pauli (Sturmflut)',
    location: 'Hamburg-Mitte / Landungsbrücken',
    metric: 'Wasserstand PNP',
    value: 5.24,
    unit: 'm',
    threshold: { warn: 5.00, crit: 6.50 },
    trend: 'up',
    history: [4.60, 4.75, 4.90, 5.05, 5.15, 5.20, 5.24],
    updatedAt: '10:45',
    explanation: 'Maßgeblicher Sturmflutpegel für Hamburg. MHW liegt bei ca. 2.10 m PNP. Ab 5.00 m PNP werden erste Hafenbereiche und der Fischmarkt überflutet.',
    criticalInfo: 'Auflaufendes Wasser mit Windunterstützung.'
  },
  {
    id: 'sensor-luft-habichtstr',
    name: 'Feinstaub PM2.5 Habichtstraße',
    location: 'Hamburg-Nord / Barmbek-Nord',
    metric: 'Partikelbelastung',
    value: 15.8,
    unit: 'µg/m³',
    threshold: { warn: 25.0, crit: 50.0 },
    trend: 'stable',
    history: [19.2, 18.0, 16.9, 16.2, 15.5, 15.6, 15.8],
    updatedAt: '10:40',
    explanation: 'Offizielle Messstation des Hamburger Luftmessnetzes an einem der verkehrsreichsten Knotenpunkte im Hamburger Norden.'
  },
  {
    id: 'sensor-parken-hh-city',
    name: 'Parkleitsystem City / HafenCity',
    location: 'Hamburg-Mitte / Jungfernstieg & Elbphilharmonie',
    metric: 'Auslastung',
    value: 84.2,
    unit: '%',
    threshold: { warn: 85.0, crit: 95.0 },
    trend: 'up',
    history: [55.0, 62.1, 71.4, 76.8, 80.2, 82.5, 84.2],
    updatedAt: '10:43',
    explanation: 'Echtzeit-Auslastung der Parkhäuser in der Innenstadt und HafenCity über die Urban Data Platform Hamburg.'
  },
  {
    id: 'sensor-pegel-alster',
    name: 'Alster Pegel Rathausschleuse',
    location: 'Hamburg-Mitte / Binnenalster & Fleete',
    metric: 'Wasserstand',
    value: 3.12,
    unit: 'm',
    threshold: { warn: 3.40, crit: 3.80 },
    trend: 'stable',
    history: [3.10, 3.11, 3.12, 3.12, 3.11, 3.12, 3.12],
    updatedAt: '10:35',
    explanation: 'Reguliert den Wasserstand der Binnen- und Außenalster sowie den Abfluss in die Elbefleete.'
  }
];

export const MOCK_OVERPASS_PRESETS: OverpassPreset[] = [
  {
    id: 'op-cctv',
    title: 'Überwachungskameras & CCTV',
    description: 'Findet alle in OpenStreetMap kartierten Überwachungskameras im Stadtgebiet Hannover.',
    howItWorks: 'Durchsucht OpenStreetMap nach Objekten mit dem Tag "man_made=surveillance" innerhalb der Stadtgrenze von Hannover. Zeigt öffentliche Kameras, Verkehrsüberwachung und Sicherheitskameras an.',
    keyTags: ['man_made=surveillance', 'surveillance:type=*', 'camera:type=*'],
    category: 'Sicherheit',
    icon: 'Camera',
    query: `[out:json][timeout:25];
area["name"="Hannover"]["admin_level"="6"]->.searchArea;
(
  node["man_made"="surveillance"](area.searchArea);
  way["man_made"="surveillance"](area.searchArea);
);
out body center;
>;
out skel qt;`
  },
  {
    id: 'op-power',
    title: 'Kritische Strominfrastruktur & Umspannwerke',
    description: 'Findet Umspannwerke, Generatoren, Transformatoren und Stromtrassen in Hannover.',
    howItWorks: 'Filtert nach "power=substation" (Umspannwerke) und "power=plant" (Kraftwerke/Heizkraftwerke z. B. Stöcken & Linden). Dient zur Analyse von Ausfallszenarien und Versorgungsnetzen.',
    keyTags: ['power=substation', 'power=plant', 'power=transformer'],
    category: 'Infrastruktur',
    icon: 'Zap',
    query: `[out:json][timeout:25];
area["name"="Hannover"]->.searchArea;
(
  node["power"="substation"](area.searchArea);
  way["power"="substation"](area.searchArea);
  node["power"="plant"](area.searchArea);
);
out body center;
>;
out skel qt;`
  },
  {
    id: 'op-emergency',
    title: 'Notfallinfrastruktur, BOS & Defibrillatoren',
    description: 'Findet Feuerwachen, Rettungswachen, Notaufnahmen und öffentlich zugängliche AEDs (Defibrillatoren).',
    howItWorks: 'Sucht nach Objekten mit "amenity=hospital" (Krankenhäuser), "amenity=fire_station" (Feuerwehren) und "emergency=defibrillator". Wichtig für zivile Lagebilder und Rettungsanalysen.',
    keyTags: ['amenity=hospital', 'amenity=fire_station', 'emergency=defibrillator'],
    category: 'BOS / Rettung',
    icon: 'ShieldAlert',
    query: `[out:json][timeout:25];
area["name"="Hannover"]->.searchArea;
(
  node["amenity"="hospital"](area.searchArea);
  node["amenity"="fire_station"](area.searchArea);
  node["emergency"="defibrillator"](area.searchArea);
);
out body center;
>;
out skel qt;`
  },
  {
    id: 'op-telecom',
    title: 'Telekommunikation, Masten & Antennen',
    description: 'Findet Funkmasten, Sendetürme und Telekom-Knoten im Stadtgebiet.',
    howItWorks: 'Sucht nach Antennenmasten ("man_made=mast") und Funktürmen ("tower:type=communication") für Richtfunk, Mobilfunk und BOS-Netze.',
    keyTags: ['man_made=mast', 'tower:type=communication'],
    category: 'Telekom',
    icon: 'Radio',
    query: `[out:json][timeout:25];
area["name"="Hannover"]->.searchArea;
(
  node["man_made"="mast"](area.searchArea);
  node["man_made"="tower"]["tower:type"="communication"](area.searchArea);
);
out body center;
>;
out skel qt;`
  }
];

export const HAMBURG_OVERPASS_PRESETS: OverpassPreset[] = [
  {
    id: 'hh-op-cctv',
    title: 'Überwachungskameras & Hafen-CCTV',
    description: 'Findet alle in OpenStreetMap kartierten Überwachungskameras im Stadtstaat Hamburg.',
    howItWorks: 'Durchsucht OpenStreetMap nach Objekten mit "man_made=surveillance" in Hamburg (Polizei, HPA-Hafenüberwachung, Hochbahn).',
    keyTags: ['man_made=surveillance', 'surveillance:type=*'],
    category: 'Sicherheit',
    icon: 'Camera',
    query: `[out:json][timeout:25];
area["name"="Hamburg"]["admin_level"="4"]->.searchArea;
(
  node["man_made"="surveillance"](area.searchArea);
  way["man_made"="surveillance"](area.searchArea);
);
out body center;
>;
out skel qt;`
  },
  {
    id: 'hh-op-power',
    title: 'Strominfrastruktur & Hafen-Umspannwerke',
    description: 'Findet Umspannwerke, Generatoren und Netzknoten von Stromnetz Hamburg.',
    howItWorks: 'Filtert nach "power=substation" und "power=plant" im Hamburger Stadtgebiet.',
    keyTags: ['power=substation', 'power=plant'],
    category: 'Infrastruktur',
    icon: 'Zap',
    query: `[out:json][timeout:25];
area["name"="Hamburg"]["admin_level"="4"]->.searchArea;
(
  node["power"="substation"](area.searchArea);
  way["power"="substation"](area.searchArea);
  node["power"="plant"](area.searchArea);
);
out body center;
>;
out skel qt;`
  },
  {
    id: 'hh-op-emergency',
    title: 'Notfallinfrastruktur & BOS Hamburg',
    description: 'Findet Berufsfeuerwachen, Notaufnahmen und Rettungswachen der Feuerwehr Hamburg.',
    howItWorks: 'Sucht nach "amenity=hospital", "amenity=fire_station" und "emergency=defibrillator" im Raum Hamburg.',
    keyTags: ['amenity=hospital', 'amenity=fire_station'],
    category: 'BOS / Rettung',
    icon: 'ShieldAlert',
    query: `[out:json][timeout:25];
area["name"="Hamburg"]["admin_level"="4"]->.searchArea;
(
  node["amenity"="hospital"](area.searchArea);
  node["amenity"="fire_station"](area.searchArea);
  node["emergency"="defibrillator"](area.searchArea);
);
out body center;
>;
out skel qt;`
  },
  {
    id: 'hh-op-maritime',
    title: 'Maritimer Hafen & Schleusen / Kaianlagen',
    description: 'Findet Schleusen, Terminals, Hafenkräne und Leuchtfeuer im Hamburger Hafen.',
    howItWorks: 'Sucht nach Hafen- und Wasserinfrastruktur ("waterway=lock_gate", "man_made=crane", "man_made=lighthouse").',
    keyTags: ['waterway=lock_gate', 'man_made=crane'],
    category: 'Hafen / Maritim',
    icon: 'Radio',
    query: `[out:json][timeout:25];
area["name"="Hamburg"]["admin_level"="4"]->.searchArea;
(
  node["waterway"="lock_gate"](area.searchArea);
  node["man_made"="crane"](area.searchArea);
  node["man_made"="lighthouse"](area.searchArea);
);
out body center;
>;
out skel qt;`
  }
];

export const MOCK_WEATHER_TELEMETRY: WeatherTelemetry = {
  station: 'DWD Hannover-Flughafen (10338)',
  temp: 18.4,
  humidity: 68,
  windSpeed: 22.5,
  windGust: 38.0,
  pressure: 1014.2,
  condition: 'Mäßig bewölkt / Schauerstaffel',
  warningLevel: 1,
  warningText: 'Amtliche Warnung vor Windböen (Bft 7) bis 20:00 Uhr'
};

export const HANNOVER_DISTRICTS = [
  'Alle Stadtbezirke',
  'Mitte',
  'Vahrenwald-List',
  'Bothfeld-Vahrenheide',
  'Buchholz-Kleefeld',
  'Misburg-Anderten',
  'Kirchrode-Bemerode-Wülferode',
  'Südstadt-Bult',
  'Döhren-Wülfel',
  'Ricklingen',
  'Linden-Limmer',
  'Ahlem-Badenstedt-Davenstedt',
  'Herrenhausen-Stöcken',
  'Nord'
];

export const HAMBURG_DISTRICTS = [
  'Alle Stadtbezirke',
  'Hamburg-Mitte',
  'Altona',
  'Eimsbüttel',
  'Hamburg-Nord',
  'Wandsbek',
  'Bergedorf',
  'Harburg',
  'HafenCity & St. Pauli'
];

export const HAMBURG_WEATHER_TELEMETRY: WeatherTelemetry = {
  station: 'DWD Hamburg-Fuhlsbüttel (10147)',
  temp: 17.2,
  humidity: 74,
  windSpeed: 28.4,
  windGust: 46.0,
  pressure: 1011.8,
  condition: 'Frische Brise / Bewölkt',
  warningLevel: 1,
  warningText: 'Amtliche Warnung vor Windböen (Bft 7) im Elberaum'
};

export const HAMBURG_GEO_MARKERS: GeoLocation[] = [
  // --- HAMBURG-MITTE & HAFENCITY ---
  {
    id: 'hh-cam-01',
    name: 'Live-Webcam: St. Pauli Landungsbrücken & Elbe',
    lat: 53.5458,
    lng: 9.9692,
    category: 'traffic',
    type: 'Verkehrskamera',
    district: 'Hamburg-Mitte',
    status: 'active',
    explanation: 'Zentraler maritimer Verkehrsknotenpunkt an den St. Pauli Landungsbrücken. Überwachung von Elbfähren (HADAG), Hafenschifffahrt und Flaniermeile.',
    sourceUrl: 'https://www.hamburg.de/webcam/',
    details: {
      'Standort': 'St. Pauli Landungsbrücken Brücke 3',
      'Gewässer': 'Norderelbe',
      'Quelle': 'HPA / Port of Hamburg'
    },
    timestamp: 'Live'
  },
  {
    id: 'hh-cam-02',
    name: 'Live-Webcam: Elbphilharmonie & Überseehafen',
    lat: 53.5413,
    lng: 9.9841,
    category: 'traffic',
    type: 'Verkehrskamera',
    district: 'HafenCity & St. Pauli',
    status: 'active',
    explanation: 'Aussicht auf Elbphilharmonie, Sandtorhafen und HafenCity. Schlüsselposition für maritime Lageerkennung.',
    sourceUrl: 'https://www.hamburg.de/webcam/',
    details: {
      'Knoten': 'Kaispeicher A / Sandtorhöft',
      'Status': 'Online',
      'Quelle': 'Hamburg Tourismus'
    },
    timestamp: 'Live'
  },
  {
    id: 'hh-cam-03',
    name: 'Live-Webcam: Köhlbrandbrücke (Hafenautobahn)',
    lat: 53.5218,
    lng: 9.9372,
    category: 'traffic',
    type: 'Verkehrskamera',
    district: 'Hamburg-Mitte',
    status: 'active',
    explanation: 'Hauptverkehrsader des Hamburger Hafens (K6/A7 Zubringer). Überwachung von Schwerlastverkehr und Brückenwinden.',
    sourceUrl: 'https://www.hamburg.de/webcam/',
    details: {
      'Verkehrslage': 'Dichter LKW-Fluss',
      'Höhe': '53m Durchfahrtshöhe',
      'Quelle': 'HPA Hamburg Port Authority'
    },
    timestamp: 'Live'
  },
  {
    id: 'hh-cam-04',
    name: 'Live-Webcam: Binnenalster & Jungfernstieg',
    lat: 53.5532,
    lng: 9.9926,
    category: 'traffic',
    type: 'Verkehrskamera',
    district: 'Hamburg-Mitte',
    status: 'active',
    explanation: 'Zentraler City-Knotenpunkt Jungfernstieg, Reesendammbrücke und Alster-Fähranleger.',
    sourceUrl: 'https://www.hamburg.de/webcam/',
    details: {
      'Ort': 'Binnenalster / Jungfernstieg',
      'Quelle': 'City Hamburg Cam'
    },
    timestamp: 'Live'
  },
  {
    id: 'hh-iot-01',
    name: 'Pegelmessstation St. Pauli (Elbe & Sturmflut)',
    lat: 53.5451,
    lng: 9.9678,
    category: 'iot',
    type: 'Wasserpegel',
    district: 'Hamburg-Mitte',
    status: 'warning',
    explanation: 'Wichtigster Sturmflutpegel Deutschlands (BSH / HPA). Mittleres Hochwasser MHW ~+2.10 mPNP. Sturmflutwarnung ab +1.50 m über MHW.',
    sourceUrl: 'https://www.pegelonline.wsv.de/',
    details: {
      'Wasserstand': '5.24 m PNP (+1.4m über MHW)',
      'Tendenz': 'Auflaufend (Flut)',
      'Meldestufe': 'Erhöhte Aufmerksamkeit',
      'Quelle': 'WSV / BSH Sturmflutwarndienst'
    },
    timestamp: 'Live'
  },
  {
    id: 'hh-transit-01',
    name: 'Hamburg Hauptbahnhof',
    lat: 53.5531,
    lng: 10.0067,
    category: 'traffic',
    type: 'Haltestelle',
    district: 'Hamburg-Mitte',
    status: 'active',
    explanation: 'Meistfrequentierter Fern- und Nahverkehrsbahnhof Deutschlands (~550.000 Reisende/Tag). Zentraler Knoten für ICE, Regionalverkehr, S-Bahn (S1/S2/S3/S5) und U-Bahn (U1/U2/U3/U4).',
    details: {
      'Knoten': 'Hamburg Hbf (ZOB & Bahnhöfe Süd/Nord)',
      'Gleise': '14 Fern-/Regionalgleise + 4 S-Bahn',
      'Quelle': 'HVV / DB InfraGO'
    },
    timestamp: 'Live'
  },
  {
    id: 'hh-transit-02',
    name: 'Jungfernstieg (U/S-Bahn)',
    lat: 53.5534,
    lng: 9.9930,
    category: 'traffic',
    type: 'Haltestelle',
    district: 'Hamburg-Mitte',
    status: 'active',
    explanation: 'Großer unterirdischer Kreuzungsbahnhof unter der Binnenalster. Direkte Verbindung aller Haupt-U-Bahnlinien (U1, U2, U3, U4) und City-S-Bahntunnel.',
    details: {
      'Linien': 'U1, U2, U3, U4, S1, S3',
      'Quelle': 'HVV'
    },
    timestamp: 'Live'
  },
  {
    id: 'hh-bike-01',
    name: 'StadtRAD Hamburg: Hauptbahnhof / Glockengießerwall',
    lat: 53.5538,
    lng: 10.0055,
    category: 'traffic',
    type: 'Mobility Hub',
    district: 'Hamburg-Mitte',
    status: 'active',
    explanation: 'Städtisches Leihradsystem StadtRAD Hamburg. Hohe Fluktuationsrate am Glockengießerwall.',
    details: {
      'Verfügbare Räder': '24',
      'Freie Docks': '8',
      'Quelle': 'StadtRAD Hamburg GBFS'
    },
    timestamp: 'Live'
  },

  // --- ALTONA ---
  {
    id: 'hh-infra-02',
    name: 'DESY (Deutsches Elektronen-Synchrotron)',
    lat: 53.5772,
    lng: 9.8795,
    category: 'security',
    type: 'Kritische Infrastruktur',
    district: 'Altona',
    status: 'active',
    explanation: 'Forschungszentrum für Teilchenbeschleuniger (PETRA III, European XFEL). Kritische Hochleistungs-IT und wissenschaftliche Netzinfrastruktur.',
    details: {
      'Standort': 'Hamburg-Bahrenfeld',
      'Netzanbindung': 'DFN 100G Backbone',
      'Klassifikation': 'Wissenschaftliche Spitzeninfrastruktur'
    },
    timestamp: '10:00'
  },
  {
    id: 'hh-cam-05',
    name: 'Live-Webcam: Altonaer Fischmarkt & Elbe',
    lat: 53.5452,
    lng: 9.9535,
    category: 'traffic',
    type: 'Verkehrskamera',
    district: 'Altona',
    status: 'active',
    explanation: 'Blick auf Fischauktionshalle und Norderelbe. Relevant für Pegelüberwachung bei Sturmfluten.',
    sourceUrl: 'https://www.hamburg.de/webcam/',
    details: {
      'Standort': 'Große Elbstraße',
      'Quelle': 'Port of Hamburg Cam'
    },
    timestamp: 'Live'
  },
  {
    id: 'hh-transit-03',
    name: 'Bahnhof Hamburg-Altona',
    lat: 53.5527,
    lng: 9.9352,
    category: 'traffic',
    type: 'Haltestelle',
    district: 'Altona',
    status: 'active',
    explanation: 'Wichtiger Kopfbahnhof für Fern-, Regional- und S-Bahnverkehr (S1, S2, S3) im Hamburger Westen.',
    details: {
      'Linien': 'ICE, RE, S1, S2, S3',
      'Quelle': 'HVV'
    },
    timestamp: 'Live'
  },

  // --- EIMSBÜTTEL ---
  {
    id: 'hh-transit-04',
    name: 'Knotenpunkt Schlump (U2 / U3)',
    lat: 53.5678,
    lng: 9.9698,
    category: 'traffic',
    type: 'Haltestelle',
    district: 'Eimsbüttel',
    status: 'active',
    explanation: 'Zentraler Turmbahnhof zur Verbindung der U2 und U3 im Bezirk Eimsbüttel nahe dem Universitätsviertel.',
    details: {
      'Ebenen': 'U2 tief, U3 hoch',
      'Quelle': 'Hamburger Hochbahn'
    },
    timestamp: 'Live'
  },
  {
    id: 'hh-infra-03',
    name: 'NDR Fernsehzentrum Lokstedt (Kritische Medien)',
    lat: 53.5995,
    lng: 9.9582,
    category: 'security',
    type: 'Kritische Infrastruktur',
    district: 'Eimsbüttel',
    status: 'active',
    explanation: 'Zentrale Produktionsstätte von ARD-aktuell (Tagesschau / Tagesthemen). Kritischer Rundfunk- und Informationsstandort.',
    details: {
      'Sektor': 'Medien & Kultur KRITIS',
      'Standort': 'Hugh-Greene-Weg',
      'Quelle': 'BOS / KRITIS Register'
    },
    timestamp: '10:00'
  },

  // --- HAMBURG-NORD ---
  {
    id: 'hh-iot-02',
    name: 'Luftmessnetz Station Habichtstraße',
    lat: 53.5912,
    lng: 10.0489,
    category: 'iot',
    type: 'Umweltsensor',
    district: 'Hamburg-Nord',
    status: 'active',
    explanation: 'Permanente Feinstaub- und Stickstoffdioxid-Messung (Luftmessnetz Hamburg). Hotspot-Überwachung an stark befahrenen Verkehrsachsen.',
    sourceUrl: 'https://luft.hamburg.de/',
    details: {
      'PM2.5': '15.8 µg/m³',
      'NO2': '38.4 µg/m³',
      'Quelle': 'Behörde für Umwelt, Klima, Energie und Agrarwirtschaft (BUKEA)'
    },
    timestamp: 'Live'
  },
  {
    id: 'hh-infra-04',
    name: 'Flughafen Hamburg Helmut Schmidt (HAM)',
    lat: 53.6304,
    lng: 9.9882,
    category: 'security',
    type: 'Kritische Infrastruktur',
    district: 'Hamburg-Nord',
    status: 'active',
    explanation: 'Internationaler Verkehrsflughafen in Fuhlsbüttel. Kritische Luftfahrtinfrastruktur und S-Bahn Endpunkt (S1).',
    details: {
      'IATA / ICAO': 'HAM / EDDH',
      'Passagiere': '~14 Mio./Jahr',
      'Quelle': 'Flughafen Hamburg GmbH'
    },
    timestamp: 'Live'
  },

  // --- WANDSBEK ---
  {
    id: 'hh-transit-05',
    name: 'Wandsbek Markt (ZOB & U1)',
    lat: 53.5718,
    lng: 10.0682,
    category: 'traffic',
    type: 'Haltestelle',
    district: 'Wandsbek',
    status: 'active',
    explanation: 'Größter Bus- und U-Bahn-Umsteigeknoten im Hamburger Osten mit 24 Bussteigen und U1-Bahnsteig.',
    details: {
      'Linien': 'U1, Metrobusse 8, 9, 10, 23, 26',
      'Quelle': 'HVV'
    },
    timestamp: 'Live'
  },
  {
    id: 'hh-infra-05',
    name: 'Bundeswehrkrankenhaus Hamburg (BOS-Klinik)',
    lat: 53.5935,
    lng: 10.0862,
    category: 'security',
    type: 'Notfallinfrastruktur',
    district: 'Wandsbek',
    status: 'active',
    explanation: 'Zentrales Traumazentrum und Notfallklinik mit Hubschrauberlandeplatz (Christoph 29).',
    details: {
      'Hubschrauber': 'Christoph 29 (BMI)',
      'Standort': 'Lesserstraße / Wandsbek',
      'Quelle': 'Feuerwehr Hamburg'
    },
    timestamp: '10:00'
  },

  // --- HARBURG ---
  {
    id: 'hh-infra-01',
    name: 'HHLA Container Terminal Altenwerder (CTA SCADA)',
    lat: 53.5042,
    lng: 9.9324,
    category: 'security',
    type: 'Kritische Infrastruktur',
    district: 'Harburg',
    status: 'active',
    explanation: 'Hochautomatisierter Containerterminal mit AGVs (Fahrerlose Transportfahrzeuge) und automatischen Portalkranen. KRITIS-Knotenpunkt von europäischer Bedeutung.',
    details: {
      'Betreiber': 'Hamburger Hafen und Logistik AG (HHLA)',
      'KRITIS-Sektor': 'Transport & Logistik / Hafen',
      'Automatisierungsgrad': 'Vollautomatisiert'
    },
    timestamp: '10:00'
  },
  {
    id: 'hh-transit-06',
    name: 'Bahnhof Hamburg-Harburg',
    lat: 53.4562,
    lng: 9.9912,
    category: 'traffic',
    type: 'Haltestelle',
    district: 'Harburg',
    status: 'active',
    explanation: 'Südlicher Hauptknotenpunkt für Fern- und Regionalzüge sowie S-Bahnlinie S3/S5 südlich der Elbe.',
    details: {
      'Linien': 'ICE, RE, Metronom, S3, S5',
      'Quelle': 'HVV'
    },
    timestamp: 'Live'
  },

  // --- BERGEDORF ---
  {
    id: 'hh-transit-07',
    name: 'Bahnhof Hamburg-Bergedorf (ZOB / S-Bahn)',
    lat: 53.4892,
    lng: 10.2085,
    category: 'traffic',
    type: 'Haltestelle',
    district: 'Bergedorf',
    status: 'active',
    explanation: 'Zentraler Verkehrsknoten für den Südosten der Metropolregion mit S-Bahn S2 und Regionalzügen nach Berlin/Schwerin.',
    details: {
      'Linien': 'S2, RE1, Regionalbusse',
      'Quelle': 'HVV'
    },
    timestamp: 'Live'
  },
  {
    id: 'hh-iot-03',
    name: 'Pegelmessstation Dove Elbe (Kraueler Schleuse)',
    lat: 53.4185,
    lng: 10.2215,
    category: 'iot',
    type: 'Wasserpegel',
    district: 'Bergedorf',
    status: 'active',
    explanation: 'Pegel- und Schleusenstation der Vier- und Marschlande zur Entwässerung des Bergedorfer Raums.',
    details: {
      'Wasserstand': '1.85 m PNP',
      'Status': 'Normaler Schleusenbetrieb',
      'Quelle': 'HPA / WPV'
    },
    timestamp: 'Live'
  }
];

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    term: 'OSINT (Open Source Intelligence)',
    category: 'OSINT',
    shortDef: 'Nachrichtengewinnung aus frei zugänglichen Quellen.',
    detailedExplanation: 'Systematisches Sammeln und Analysieren von öffentlich verfügbaren Daten (Open Data, Geodaten, Live-Sensoren, Webcams, Netzwerk-Scanner), um ein umfassendes Lagebild einer Stadt oder Infrastruktur zu erstellen.',
    example: 'Kombination von VMZ-Staudaten mit Pegelständen und Social-Media-Meldungen bei Hochwasser.'
  },
  {
    term: 'Overpass Turbo & Overpass QL',
    category: 'GIS',
    shortDef: 'Abfrage-Engine für die OpenStreetMap-Geodatenbank.',
    detailedExplanation: 'Mit der Overpass Query Language (QL) können gezielt bestimmte Geodaten gefiltert werden, z. B. alle Überwachungskameras, Umspannwerke oder Feuerwehrhäuser in Hannover, ohne die gesamte Weltkarte herunterladen zu müssen.',
    example: 'area["name"="Hannover"] -> node["man_made"="surveillance"]'
  },
  {
    term: 'Shodan / Censys Recon',
    category: 'Cyber',
    shortDef: 'Suchmaschinen für mit dem Internet verbundene Geräte und Server.',
    detailedExplanation: 'Shodan und Censys scannen kontinuierlich das gesamte IPv4/IPv6-Internet und erfassen offene Ports, SSL-Zertifikate, Webserver-Banner und industrielle Steuerungssysteme (SCADA).',
    example: 'Suche nach "city:Hannover port:502" findet offene Modbus-Industriesteuerungen in Hannover.'
  },
  {
    term: 'Pegelstände & Meldestufen (NLWKN)',
    category: 'IoT',
    shortDef: 'Messung von Wasserständen an Flüssen (Leine, Ihme).',
    detailedExplanation: 'Der Niedersächsische Landesbetrieb für Wasserwirtschaft, Küsten- und Naturschutz (NLWKN) definiert Meldestufen: Stufe 1 = beginnende Uferüberflutung; Stufe 2 = Gefahr für Grundstücke; Stufe 3 = Gefahr für bebaute Ortslagen.',
    example: 'Leine Herrenhausen: Normalstand ~2.10 m, Warnstufe 1 ab 3.80 m, Warnstufe 2 ab 4.80 m.'
  },
  {
    term: 'GBFS (General Bikeshare Feed Specification)',
    category: 'Verkehr',
    shortDef: 'Standardisiertes Datenformat für Shared-Mobility-Dienste.',
    detailedExplanation: 'Echtzeit-Schnittstelle, die von Leihrad- und E-Scooter-Anbietern (wie Nextbike oder Voi) bereitgestellt wird. Liefert GPS-Koordinaten aller verfügbaren Räder und freier Parkstationen.',
    example: 'Nextbike GBFS API Hannover liefert minütlich freie Räder am Kröpcke & Hauptbahnhof.'
  },
  {
    term: 'SCADA / ICS (Modbus, Siemens S7)',
    category: 'Cyber',
    shortDef: 'Supervisory Control and Data Acquisition (Industrielle Steuerung).',
    detailedExplanation: 'Protokolle zur Fernüberwachung und Steuerung kritischer Infrastrukturen (Wasserwerke, Umspannstationen, Kläranlagen, Verkehrssignalanlagen). Diese dürfen aus Sicherheitsgründen niemals direkt ohne VPN im Internet erreichbar sein.',
    example: 'Port 502 (Modbus TCP) oder Port 102 (Siemens S7).'
  },
  {
    term: 'NINA / Katwarn / MoWaS',
    category: 'OSINT',
    shortDef: 'Modulares Warnsystem des Bundesamts für Bevölkerungsschutz (BBK).',
    detailedExplanation: 'Offizielles deutsches Zivilschutz-Warnsystem für Gefahrenlagen wie Großbrände, Schadstoffaustritte, Bombenentschärfungen, Hochwasser und extreme Unwetter.',
    example: 'Warnmeldung für Region Hannover: "Bombenfund im Stadtteil Misburg – Evakuierungsradius 1000m".'
  }
];
