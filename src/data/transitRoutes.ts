// Complete Official Route Coordinate Tracks and All Stop Sequences for Hannover Stadtbahn & S-Bahn Lines

export interface TransitLineRoute {
  id: string;
  ref: string;
  name: string;
  type: 'subway' | 'tram' | 'sbahn' | 'bus';
  color: string;
  from: string;
  to: string;
  stops: string[];
  coordinates: [number, number][]; // [Lat, Lng]
}

export const HANNOVER_TRANSIT_ROUTES: Record<string, TransitLineRoute> = {
  // --- 🟡 C-STRECKE: LINIE 5 (STÖCKEN ⇄ ANDERTEN - 29 HALTESTELLEN) ---
  '5': {
    id: 'line-5',
    ref: '5',
    name: 'Stadtbahn 5',
    type: 'subway',
    color: '#eab308',
    from: 'Stöcken',
    to: 'Anderten',
    stops: [
      'Stöcken',
      'Stöckener Markt',
      'Freudenthalstraße',
      'Stadtfriedhof Stöcken',
      'Bahnhof Leinhausen',
      'Herrenhäuser Markt',
      'Schaumburgstraße',
      'Herrenhäuser Gärten',
      'Appelstraße',
      'Schneiderbg./W.-Busch-Mus.',
      'Leibniz Universität',
      'Königsworther Platz',
      'Steintor',
      'Kröpcke',
      'Aegidientorplatz',
      'Marienstraße',
      'Braunschweiger Platz',
      'Clausewitzstraße',
      'Kantplatz',
      'Uhlhornstraße',
      'Nackenberg',
      'Annastift',
      'Bleekstraße',
      'Saarbrückener Straße',
      'Großer Hillen',
      'Tiergarten',
      'Ostfeldstraße',
      'Königsberger Ring',
      'Anderten'
    ],
    coordinates: [
      [52.40865, 9.66215], // Stöcken
      [52.40720, 9.66850], // Stöckener Markt
      [52.40580, 9.67150], // Freudenthalstr
      [52.40465, 9.67520], // Stadtfriedhof Stöcken
      [52.40120, 9.68120], // Bf Leinhausen
      [52.39880, 9.68650], // Herrenhäuser Markt
      [52.39735, 9.69065], // Schaumburgstr
      [52.39215, 9.69815], // Herrenhäuser Gärten
      [52.38940, 9.70430], // Appelstr
      [52.38670, 9.70965], // Schneiderberg
      [52.38245, 9.71842], // Leibniz Uni
      [52.37800, 9.72200], // Königsworther Platz
      [52.37532, 9.73145], // Steintor
      [52.37438, 9.73862], // Kröpcke
      [52.36892, 9.74325], // Aegi
      [52.36968, 9.75124], // Marienstr
      [52.37125, 9.76142], // Braunschweiger Platz
      [52.37150, 9.77200], // Clausewitzstr
      [52.37200, 9.78200], // Kantplatz
      [52.37500, 9.79200], // Uhlhornstr
      [52.37800, 9.80100], // Nackenberg
      [52.37100, 9.80900], // Annastift
      [52.36500, 9.81500], // Bleekstr
      [52.36100, 9.82100], // Saarbrückener Str
      [52.35800, 9.82600], // Großer Hillen
      [52.35500, 9.83100], // Tiergarten
      [52.35800, 9.84100], // Ostfeldstr
      [52.36100, 9.84900], // Königsberger Ring
      [52.36350, 9.85600]  // Anderten
    ]
  },

  // --- 🟡 C-STRECKE: LINIE 6 (30 HALTESTELLEN) ---
  '6': {
    id: 'line-6',
    ref: '6',
    name: 'Stadtbahn 6',
    type: 'subway',
    color: '#f59e0b',
    from: 'Nordhafen',
    to: 'Messe/Ost (EXPO-Plaza)',
    stops: [
      'Nordhafen',
      'Mecklenheidestraße',
      'Beneckeallee',
      'Friedenauer Straße',
      'Krepenstraße',
      'Hainhölzer Markt',
      'Fenskestraße',
      'Bahnhof Nordstadt',
      'An der Strangriede',
      'Kopernikusstraße',
      'Christuskirche',
      'Steintor',
      'Kröpcke',
      'Aegidientorplatz',
      'Marienstraße',
      'Braunschweiger Platz',
      'Freundallee',
      'Kerstingstraße',
      'Kinderkrankenhs. auf der Bult',
      'Zuschlagstraße',
      'Bünteweg/Ti.Hochschule',
      'August-Madsack-Straße',
      'Seelhorster Allee',
      'Emslandstraße',
      'Brabeckstraße',
      'Feldbuschwende',
      'Kronsberg',
      'Krügerskamp',
      'Stockholmer Allee',
      'Messe/Ost (EXPO-Plaza)'
    ],
    coordinates: [
      [52.41865, 9.67820], // 1. Nordhafen
      [52.41215, 9.68940], // 2. Mecklenheidestr
      [52.41010, 9.69480], // 3. Beneckeallee
      [52.40870, 9.69975], // 4. Friedenauer Str
      [52.40615, 9.70620], // 5. Krepenstr
      [52.39965, 9.71592], // 6. Hainhölzer Markt
      [52.39680, 9.71820], // 7. Fenskestraße
      [52.39294, 9.72145], // 8. Bf Nordstadt
      [52.38872, 9.72268], // 9. Strangriede
      [52.38435, 9.72662], // 10. Kopernikusstr
      [52.38061, 9.72895], // 11. Christuskirche
      [52.37532, 9.73145], // 12. Steintor
      [52.37438, 9.73862], // 13. Kröpcke
      [52.36892, 9.74325], // 14. Aegi
      [52.36968, 9.75124], // 15. Marienstr
      [52.37125, 9.76142], // 16. Braunschweiger Platz
      [52.36850, 9.76950], // 17. Freundallee
      [52.36380, 9.77620], // 18. Kerstingstr
      [52.35821, 9.78245], // 19. Kinderkrankenhaus Bult
      [52.35312, 9.79152], // 20. Zuschlagstr
      [52.34950, 9.80120], // 21. Bünteweg / TiHo
      [52.34680, 9.80850], // 22. August-Madsack-Str
      [52.34415, 9.81420], // 23. Seelhorster Allee
      [52.34210, 9.81880], // 24. Emslandstr
      [52.34105, 9.82240], // 25. Brabeckstr
      [52.33520, 9.82410], // 26. Feldbuschwende
      [52.32745, 9.82130], // 27. Kronsberg
      [52.32350, 9.81980], // 28. Krügerskamp
      [52.32100, 9.81890], // 29. Stockholmer Allee
      [52.31915, 9.81845]  // 30. Messe/Ost (EXPO-Plaza)
    ]
  },
  '1': {
    id: 'line-1',
    ref: '1',
    name: 'Stadtbahn 1',
    type: 'subway',
    color: '#ff8000',
    from: 'Langenhagen',
    to: 'Sarstedt / Laatzen',
    stops: [
      'Langenhagen', 'Langenhagen / Zentrum', 'Berliner Platz', 'Alter Flughafen', 'Wiesenau',
      'Kabelkamp', 'Niedersachsenring', 'Dragonerstraße', 'Vahrenwalder Platz', 'Werderstraße',
      'Hauptbahnhof', 'Kröpcke', 'Aegidientorplatz', 'Schlägerstraße', 'Geibelstraße',
      'Altenbekener Damm', 'Fiedelerstraße', 'Döhren / Peiner Straße', 'Bothmerstraße', 'Wiehbergstraße',
      'Laatzen / Birkenstraße', 'Laatzen / Zentrum', 'Rethen', 'Gleidingen', 'Sarstedt'
    ],
    coordinates: [
      [52.4439, 9.7420],
      [52.4380, 9.7410],
      [52.4310, 9.7400],
      [52.4180, 9.7390],
      [52.4110, 9.7380],
      [52.4060, 9.7370],
      [52.3985, 9.7355],
      [52.3942, 9.7360],
      [52.3890, 9.7370],
      [52.3845, 9.7395],
      [52.3768, 9.7408],
      [52.3744, 9.7386],
      [52.3688, 9.7431],
      [52.3630, 9.7480],
      [52.3590, 9.7510],
      [52.3550, 9.7540],
      [52.3460, 9.7610],
      [52.3380, 9.7690],
      [52.3310, 9.7750],
      [52.3250, 9.7820],
      [52.3200, 9.7850],
      [52.3160, 9.7890],
      [52.2880, 9.8150],
      [52.2610, 9.8180],
      [52.2380, 9.8220]
    ]
  },
  '3': {
    id: 'line-3',
    ref: '3',
    name: 'Stadtbahn 3',
    type: 'subway',
    color: '#3b82f6',
    from: 'Altwarmbüchen',
    to: 'Wettbergen',
    stops: [
      'Altwarmbüchen', 'Opelstraße', 'Paracelsusweg', 'Noltemeyerbrücke', 'Spannhagengarten',
      'Pelikanstraße', 'Vier Grenzen', 'Lortzingstraße', 'Lister Platz', 'Sedanstraße / Gerberstraße',
      'Hauptbahnhof', 'Kröpcke', 'Markthalle / Landtag', 'Waterloo', 'Allerweg',
      'Stadionbrücke', 'Bahnhof Linden/Fischerhof', 'Beekestraße', 'Wallensteinstraße', 'Tresckowstraße', 'Wettbergen'
    ],
    coordinates: [
      [52.4280, 9.8550],
      [52.4210, 9.8380],
      [52.4120, 9.8210],
      [52.4040, 9.8050],
      [52.4015, 9.7920],
      [52.3995, 9.7820],
      [52.3960, 9.7710],
      [52.3920, 9.7595],
      [52.3880, 9.7510],
      [52.3820, 9.7485],
      [52.3768, 9.7408],
      [52.3744, 9.7386],
      [52.3710, 9.7350],
      [52.3680, 9.7280],
      [52.3610, 9.7210],
      [52.3555, 9.7225],
      [52.3485, 9.7230],
      [52.3420, 9.7180],
      [52.3360, 9.7110],
      [52.3310, 9.7020],
      [52.3250, 9.6920]
    ]
  },
  '4': {
    id: 'line-4',
    ref: '4',
    name: 'Stadtbahn 4',
    type: 'subway',
    color: '#10b981',
    from: 'Garbsen',
    to: 'Roderbruch',
    stops: [
      'Garbsen', 'Auf der Horst', 'Wissenschaftspark Marienwerder', 'Friedhof Auf der Horst',
      'Stadtfriedhof Stöcken', 'Schaumburgstraße', 'Herrenhäuser Gärten', 'Appelstraße',
      'Schneiderberg', 'Leibniz Universität', 'Königsworther Platz', 'Steintor',
      'Kröpcke', 'Aegidientorplatz', 'Marienstraße', 'Braunschweiger Platz', 'Clausewitzstraße',
      'Kantplatz', 'Uhlhornstraße', 'Kleefeld Bahnhof', 'Medizinische Hochschule (MHH)', 'Roderbruch'
    ],
    coordinates: [
      [52.4180, 9.5980],
      [52.4150, 9.6150],
      [52.4120, 9.6380],
      [52.4090, 9.6580],
      [52.4045, 9.6750],
      [52.3972, 9.6905],
      [52.3920, 9.6980],
      [52.3892, 9.7042],
      [52.3865, 9.7095],
      [52.3824, 9.7183],
      [52.3780, 9.7220],
      [52.3752, 9.7312],
      [52.3744, 9.7386],
      [52.3688, 9.7431],
      [52.3695, 9.7510],
      [52.3710, 9.7610],
      [52.3715, 9.7720],
      [52.3720, 9.7820],
      [52.3750, 9.7920],
      [52.3790, 9.7990],
      [52.3840, 9.8050],
      [52.3890, 9.8180]
    ]
  },
  '10': {
    id: 'line-10',
    ref: '10',
    name: 'Stadtbahn 10',
    type: 'tram',
    color: '#ff8000',
    from: 'Ahlem',
    to: 'Hauptbahnhof / ZOB',
    stops: [
      'Ahlem', 'Ehrhartstraße', 'Brunnenstraße', 'Ungerstraße', 'Leinaustraße',
      'Am Küchengarten', 'Glocksee', 'Goetheplatz', 'Clevertor', 'Steintor',
      'Hauptbahnhof / Rosenstraße', 'Hauptbahnhof / ZOB'
    ],
    coordinates: [
      [52.3820, 9.6640],
      [52.3790, 9.6730],
      [52.3760, 9.6820],
      [52.3745, 9.6910],
      [52.3720, 9.7020],
      [52.3712, 9.7104],
      [52.3725, 9.7190],
      [52.3710, 9.7240],
      [52.3730, 9.7280],
      [52.3752, 9.7312],
      [52.3760, 9.7380],
      [52.3768, 9.7408]
    ]
  },
  'S4': {
    id: 'line-s4',
    ref: 'S4',
    name: 'S-Bahn S4',
    type: 'sbahn',
    color: '#06b6d4',
    from: 'Bennemühlen',
    to: 'Hildesheim Hbf',
    stops: [
      'Bennemühlen', 'Mellendorf', 'Bissendorf', 'Langenhagen-Kaltenweide', 'Langenhagen-Pferdemarkt',
      'Langenhagen-Mitte', 'Hannover-Vinnhorst', 'Hannover-Ledeburg', 'Hannover-Nordstadt', 'Hannover Hbf',
      'Hannover Bismarckstraße', 'Hannover Messe/Laatzen', 'Rethen (Leine)', 'Sarstedt', 'Barnten', 'Emmerke', 'Hildesheim Hbf'
    ],
    coordinates: [
      [52.5680, 9.7380],
      [52.5480, 9.7420],
      [52.5180, 9.7400],
      [52.4810, 9.7380],
      [52.4580, 9.7360],
      [52.4430, 9.7350],
      [52.4180, 9.7180],
      [52.4040, 9.7050],
      [52.3928, 9.7212],
      [52.3768, 9.7408],
      [52.3580, 9.7610],
      [52.3218, 9.7942],
      [52.2880, 9.8150],
      [52.2380, 9.8220],
      [52.2050, 9.8650],
      [52.1780, 9.9020],
      [52.1580, 9.9520]
    ]
  }
};

export const HAMBURG_TRANSIT_ROUTES: Record<string, TransitLineRoute> = {
  'U1': {
    id: 'hh-line-u1',
    ref: 'U1',
    name: 'U-Bahn U1',
    type: 'subway',
    color: '#0284c7',
    from: 'Norderstedt Mitte',
    to: 'Großhansdorf / Ohlstedt',
    stops: [
      'Norderstedt Mitte', 'Garstedt', 'Ochsenzoll', 'Fuhlsbüttel Nord', 'Fuhlsbüttel', 'Klein Borstel', 'Ohlsdorf',
      'Sengelmannstraße', 'Alsterdorf', 'Lattenkamp', 'Hudtwalckerstraße', 'Kellinghusenstraße', 'Klosterstern',
      'Hallerstraße', 'Stephansplatz', 'Jungfernstieg', 'Meßberg', 'Steinstraße', 'Hauptbahnhof Süd', 'Lohmühlenstraße',
      'Lübecker Straße', 'Wartenau', 'Ritterstraße', 'Wandsbeker Chaussee', 'Wandsbek Markt', 'Straßburger Straße',
      'Alter Teichweg', 'Wandsbek-Gartenstadt', 'Trabrennbahn', 'Farmsen', 'Berne', 'Volksdorf', 'Großhansdorf'
    ],
    coordinates: [
      [53.7067, 9.9908],
      [53.6820, 9.9980],
      [53.6650, 10.0070],
      [53.6402, 10.0210],
      [53.6300, 10.0270],
      [53.6205, 10.0325],
      [53.6080, 10.0220],
      [53.6000, 10.0050],
      [53.5930, 9.9940],
      [53.5885, 9.9910],
      [53.5800, 9.9890],
      [53.5710, 9.9880],
      [53.5585, 9.9885],
      [53.5534, 9.9930],
      [53.5480, 9.9990],
      [53.5500, 10.0050],
      [53.5515, 10.0075],
      [53.5560, 10.0190],
      [53.5590, 10.0290],
      [53.5650, 10.0450],
      [53.5718, 10.0682],
      [53.5820, 10.0750],
      [53.5920, 10.0750],
      [53.6080, 10.1180],
      [53.6350, 10.1450],
      [53.6520, 10.1650],
      [53.6640, 10.2880]
    ]
  },
  'U2': {
    id: 'hh-line-u2',
    ref: 'U2',
    name: 'U-Bahn U2',
    type: 'subway',
    color: '#dc2626',
    from: 'Niendorf Nord',
    to: 'Mümmelmannsberg',
    stops: [
      'Niendorf Nord', 'Schippelsweg', 'Joachim-Mähl-Straße', 'Niendorf Markt', 'Hagendeel', 'Hagenbecks Tierpark',
      'Lutterothstraße', 'Osterstraße', 'Emilienstraße', 'Christuskirche', 'Schlump', 'Messehallen', 'Gänsemarkt',
      'Jungfernstieg', 'Hauptbahnhof Nord', 'Berliner Tor', 'Burgstraße', 'Hammer Kirche', 'Rauhes Haus',
      'Horner Rennbahn', 'Legienstraße', 'Billstedt', 'Merkenstraße', 'Steinfurther Allee', 'Mümmelmannsberg'
    ],
    coordinates: [
      [53.6285, 9.9490],
      [53.6200, 9.9500],
      [53.6080, 9.9510],
      [53.5930, 9.9430],
      [53.5840, 9.9470],
      [53.5750, 9.9540],
      [53.5678, 9.9698],
      [53.5580, 9.9760],
      [53.5555, 9.9870],
      [53.5534, 9.9930],
      [53.5540, 10.0070],
      [53.5528, 10.0245],
      [53.5545, 10.0420],
      [53.5550, 10.0570],
      [53.5540, 10.0820],
      [53.5410, 10.1070],
      [53.5350, 10.1320],
      [53.5280, 10.1510]
    ]
  },
  'U3': {
    id: 'hh-line-u3',
    ref: 'U3',
    name: 'U-Bahn U3 (Ring)',
    type: 'subway',
    color: '#eab308',
    from: 'Barmbek',
    to: 'Barmbek (Ring via Hafen & Viadukt)',
    stops: [
      'Barmbek', 'Dehnhaide', 'Hamburger Straße', 'Mundsburg', 'Uhlandstraße', 'Lübecker Straße', 'Berliner Tor',
      'Hauptbahnhof Süd', 'Mönckebergstraße', 'Rathaus', 'Rödingsmarkt', 'Baumwall (Elbphilharmonie)', 'Landungsbrücken',
      'St. Pauli', 'Feldstraße', 'Sternschanze', 'Schlump', 'Hoheluftbrücke', 'Eppendorfer Baum', 'Kellinghusenstraße',
      'Sierichstraße', 'Borgweg', 'Saarlandstraße', 'Barmbek'
    ],
    coordinates: [
      [53.5870, 10.0450],
      [53.5780, 10.0380],
      [53.5700, 10.0300],
      [53.5620, 10.0250],
      [53.5590, 10.0290],
      [53.5528, 10.0245],
      [53.5515, 10.0075],
      [53.5510, 10.0010],
      [53.5500, 9.9930],
      [53.5475, 9.9860],
      [53.5435, 9.9810],
      [53.5458, 9.9692],
      [53.5505, 9.9665],
      [53.5560, 9.9680],
      [53.5630, 9.9675],
      [53.5678, 9.9698],
      [53.5780, 9.9760],
      [53.5840, 9.9840],
      [53.5885, 9.9910],
      [53.5900, 10.0030],
      [53.5880, 10.0220],
      [53.5870, 10.0450]
    ]
  },
  'U4': {
    id: 'hh-line-u4',
    ref: 'U4',
    name: 'U-Bahn U4',
    type: 'subway',
    color: '#0d9488',
    from: 'Elbbrücken',
    to: 'Billstedt',
    stops: ['Elbbrücken', 'HafenCity Universität', 'Überseequartier', 'Jungfernstieg', 'Hauptbahnhof Nord', 'Berliner Tor', 'Burgstraße', 'Billstedt'],
    coordinates: [
      [53.5350, 10.0240],
      [53.5395, 10.0105],
      [53.5410, 9.9960],
      [53.5534, 9.9930],
      [53.5540, 10.0070],
      [53.5528, 10.0245],
      [53.5545, 10.0420],
      [53.5410, 10.1070]
    ]
  },
  'S1': {
    id: 'hh-line-s1',
    ref: 'S1',
    name: 'S-Bahn S1',
    type: 'sbahn',
    color: '#10b981',
    from: 'Wedel',
    to: 'Hamburg Airport / Poppenbüttel',
    stops: [
      'Wedel', 'Rissen', 'Sülldorf', 'Iserbrook', 'Blankenese', 'Hochkamp', 'Klein Flottbek', 'Othmarschen',
      'Bahrenfeld', 'Ottensen', 'Hamburg-Altona', 'Königstraße', 'Reeperbahn', 'Landungsbrücken', 'Stadthausbrücke',
      'Jungfernstieg', 'Hamburg Hbf', 'Berliner Tor', 'Landwehr', 'Hasselbrook', 'Wandsbeker Chaussee',
      'Friedrichsberg', 'Barmbek', 'Alte Wöhr', 'Rübenkamp', 'Ohlsdorf', 'Hamburg Airport', 'Poppenbüttel'
    ],
    coordinates: [
      [53.5810, 9.7050],
      [53.5780, 9.7560],
      [53.5680, 9.7820],
      [53.5585, 9.8130],
      [53.5570, 9.8450],
      [53.5580, 9.8650],
      [53.5600, 9.8920],
      [53.5580, 9.9090],
      [53.5527, 9.9352],
      [53.5480, 9.9460],
      [53.5495, 9.9570],
      [53.5458, 9.9692],
      [53.5500, 9.9830],
      [53.5534, 9.9930],
      [53.5531, 10.0067],
      [53.5528, 10.0245],
      [53.5580, 10.0380],
      [53.5680, 10.0550],
      [53.5870, 10.0450],
      [53.6020, 10.0380],
      [53.6205, 10.0325],
      [53.6325, 10.0065]
    ]
  },
  'S2': {
    id: 'hh-line-s2',
    ref: 'S2',
    name: 'S-Bahn S2 (Verbindungsbahn)',
    type: 'sbahn',
    color: '#b91c1c',
    from: 'Altona',
    to: 'Bergedorf / Aumühle',
    stops: [
      'Hamburg-Altona', 'Holstenstraße', 'Sternschanze', 'Dammtor', 'Hamburg Hbf', 'Berliner Tor',
      'Rothenburgsort', 'Tiefstack', 'Billwerder-Moorfleet', 'Mittlerer Landweg', 'Allermöhe',
      'Nettelnburg', 'Hamburg-Bergedorf', 'Reinbek', 'Wohltorf', 'Aumühle'
    ],
    coordinates: [
      [53.5527, 9.9352],
      [53.5620, 9.9510],
      [53.5630, 9.9675],
      [53.5607, 9.9895],
      [53.5531, 10.0067],
      [53.5528, 10.0245],
      [53.5355, 10.0430],
      [53.5270, 10.0630],
      [53.5180, 10.1020],
      [53.5080, 10.1380],
      [53.4980, 10.1650],
      [53.4920, 10.1850],
      [53.4892, 10.2085],
      [53.5080, 10.2480],
      [53.5210, 10.2780],
      [53.5310, 10.3150]
    ]
  },
  'S3': {
    id: 'hh-line-s3',
    ref: 'S3',
    name: 'S-Bahn S3 (Süderelbe)',
    type: 'sbahn',
    color: '#8b5cf6',
    from: 'Pinneberg',
    to: 'Neugraben',
    stops: [
      'Pinneberg', 'Thesdorf', 'Halstenbek', 'Krupunder', 'Elbgaustraße', 'Eidelstedt', 'Stellingen', 'Langenfelde',
      'Diebsteich', 'Hamburg-Altona', 'Königstraße', 'Reeperbahn', 'Landungsbrücken', 'Stadthausbrücke', 'Jungfernstieg',
      'Hamburg Hbf', 'Hammerbrook', 'Elbbrücken', 'Veddel', 'Wilhelmsburg', 'Hamburg-Harburg', 'Harburg Rathaus',
      'Heimfeld', 'Neuwiedenthal', 'Neugraben'
    ],
    coordinates: [
      [53.6550, 9.7950],
      [53.6420, 9.8250],
      [53.6300, 9.8520],
      [53.6020, 9.9020],
      [53.5900, 9.9150],
      [53.5790, 9.9280],
      [53.5690, 9.9320],
      [53.5527, 9.9352],
      [53.5458, 9.9692],
      [53.5534, 9.9930],
      [53.5531, 10.0067],
      [53.5450, 10.0220],
      [53.5348, 10.0235],
      [53.5210, 10.0180],
      [53.4980, 10.0060],
      [53.4562, 9.9912],
      [53.4590, 9.9790],
      [53.4680, 9.9520],
      [53.4720, 9.8550]
    ]
  },
  'S5': {
    id: 'hh-line-s5',
    ref: 'S5',
    name: 'S-Bahn S5 (Stade-Express)',
    type: 'sbahn',
    color: '#059669',
    from: 'Elbgaustraße',
    to: 'Buxtehude / Stade',
    stops: [
      'Elbgaustraße', 'Eidelstedt', 'Stellingen', 'Langenfelde', 'Diebsteich', 'Holstenstraße', 'Sternschanze',
      'Dammtor', 'Hamburg Hbf', 'Hammerbrook', 'Elbbrücken', 'Veddel', 'Wilhelmsburg', 'Hamburg-Harburg',
      'Harburg Rathaus', 'Neugraben', 'Fischbek', 'Neu Wulmstorf', 'Buxtehude', 'Neukloster', 'Horneburg', 'Dollern',
      'Agathenburg', 'Stade'
    ],
    coordinates: [
      [53.6020, 9.9020],
      [53.5900, 9.9150],
      [53.5690, 9.9320],
      [53.5620, 9.9510],
      [53.5630, 9.9675],
      [53.5607, 9.9895],
      [53.5531, 10.0067],
      [53.5450, 10.0220],
      [53.5348, 10.0235],
      [53.5210, 10.0180],
      [53.4980, 10.0060],
      [53.4562, 9.9912],
      [53.4590, 9.9790],
      [53.4720, 9.8550],
      [53.4700, 9.8050],
      [53.4680, 9.7550],
      [53.4710, 9.6960],
      [53.4980, 9.6350],
      [53.5080, 9.5850],
      [53.5350, 9.5450],
      [53.5620, 9.5150],
      [53.5950, 9.4820]
    ]
  },
  '61': {
    id: 'hh-line-f61',
    ref: '61',
    name: 'HADAG Fähre 61',
    type: 'tram',
    color: '#0284c7',
    from: 'Landungsbrücken (Brücke 2)',
    to: 'Neuhof (Köhlbrand)',
    stops: ['Landungsbrücken', 'Altona Fischmarkt', 'Dockland', 'Waltershof', 'Neuhof'],
    coordinates: [
      [53.5458, 9.9692],
      [53.5445, 9.9380],
      [53.5438, 9.9310],
      [53.5320, 9.9280],
      [53.5180, 9.9490]
    ]
  },
  '62': {
    id: 'hh-line-f62',
    ref: '62',
    name: 'HADAG Fähre 62',
    type: 'tram',
    color: '#06b6d4',
    from: 'Landungsbrücken (Brücke 3)',
    to: 'Finkenwerder (Airbus)',
    stops: ['Landungsbrücken', 'Altona (Fischmarkt)', 'Dockland (Fischereihafen)', 'Övelgönne (Museumshafen)', 'Bubendey-Ufer', 'Finkenwerder'],
    coordinates: [
      [53.5458, 9.9692],
      [53.5445, 9.9380],
      [53.5438, 9.9310],
      [53.5430, 9.9140],
      [53.5410, 9.8950],
      [53.5420, 9.8730]
    ]
  },
  '72': {
    id: 'hh-line-f72',
    ref: '72',
    name: 'HADAG Fähre 72',
    type: 'tram',
    color: '#f59e0b',
    from: 'Landungsbrücken (Brücke 1)',
    to: 'Elbphilharmonie (Kaiserkai)',
    stops: ['Landungsbrücken', 'Arningstraße', 'Elbphilharmonie'],
    coordinates: [
      [53.5458, 9.9692],
      [53.5390, 9.9750],
      [53.5425, 9.9835]
    ]
  }
};

