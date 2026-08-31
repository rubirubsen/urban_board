# ⬡ HBOARD // Urban OSINT & Real-Time Traffic Command Center

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?style=flat-square)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?style=flat-square)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green.svg?style=flat-square)](https://leafletjs.com/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg?style=flat-square)](https://vitejs.dev/)

> **HBOARD** ist ein analytisches, datengetriebenes Open-Source Intelligence (OSINT) & Echtzeit-Verkehrsleitsystem für urbane Ballungsräume — aktuell optimiert für **Hannover** und **Hamburg**.

---

## 📸 Core Features

- **🗺️ Dual-Metropolen OSINT-Cockpit**: Nahtloser 1-Klick-Wechsel zwischen **Hannover** (GVH, VMZ NDS, NLWKN) und **Hamburg** (HVV, Port of Hamburg / HPA, BSH, BUKEA).
- **🚆 Präzise Fahrplan- & Takt-Engine**: 
  - Exakte Streckenführungen und Haltestellenketten für Stadtbahnen (1, 3, 4, 5, 6, 10), U-Bahnen (U1–U4), S-Bahnen (S1–S3, S4, S5) und HADAG-Hafenfähren (61, 62, 72).
  - Berechnung minutengenauer Live-Abfahrten je Haltestellen-Offset zur aktuellen Systemzeit.
- **📹 Live-Sensorik & Verkehrsfluss**:
  - Integration von Autobahn-Kameras (A1, A2, A7, A23, A24, A37, A352) mit Snapshot-Modal.
  - Echtzeit-Pegelstände (Leine Herrenhausen, Elbe St. Pauli) und Luftqualitäts-Telemetrie.
- **📱 Responsive & Dual-Screen Ready**:
  - **Smartphone / Phablet**: Mobile Bottom-Bar (`Karte`, `ÖPNV`, `Fahrplan`, `Layer`, `OPS`) mit Safe-Area Inset Support.
  - **Tablet & Foldable / Surface Duo**: Side-by-Side Dual-Screen Split (Karte links, Abfahrten/Fahrpläne rechts).
  - **Desktop**: 3-Spalten Workstation mit dockbarem Deck und MGRS/Karten-Gittern.
- **⚡ Integriertes Admin- & Ops-Dashboard**:
  - Passwortgeschützte Management-Maske (`Standard-PW: 4dm1n`, änderbar im UI).
  - Live API Health Monitor & Latency Ping-Test (HAFAS, Overpass, PegelOnline, Autobahn).
  - Datensatz-Vollständigkeitsprüfung für 156+ Haltestellen und 18 Linien.
  - Fertig generierte Nginx Reverse-Proxy-Konfiguration für Subdomains (`*.core-now.com`).

---

## 🎯 Vision & Roadmap

Das finale Kernziel von HBoard ist die **Live Animated Vehicle Position Engine („Fahrende Boxen“)**: Schienenfahrzeuge, Busse und Hafenfähren bewegen sich als stilisierte OSINT-Boxen flüssig entlang der Schienentrassen auf der OSM-Karte.

Detaillierte Meilensteine (M1 bis M5) und Datensätze findest du in der [**`ROADMAP.md`**](./ROADMAP.md).

---

## 🛠️ Tech Stack

| Schicht | Technologie |
| :--- | :--- |
| **Frontend Framework** | React 18 (Hooks, TypeScript) |
| **Styling & Theme** | Tailwind CSS (Dark/Anthrazit `#0f1114` mit `#ff8000` Accent) |
| **Karten & GIS** | Leaflet.js mit Esri Dark/Light, CARTO & OSM Tiles |
| **Icons & UI** | Lucide React |
| **Build & Tooling** | Vite 6, TypeScript Compiler |
| **API Endpoints** | HAFAS REST, Overpass Turbo (OSM), Autobahn OAPI, PegelOnline WSV |

---

## 🚀 Schnellstart

### 1. Repository klonen & Abhängigkeiten installieren
```bash
git clone https://github.com/rubirubsen/urban_board.git
cd urban_board
npm install
```

### 2. Lokalen Entwicklungsserver starten
```bash
npm run dev
```
Öffne anschließend [http://localhost:3000](http://localhost:3000) im Browser.

### 3. Produktions-Build erstellen
```bash
npm run build
```
Der optimierte statische Build liegt anschließend im Ordner `dist/`.

---

## 🌐 VPS & Reverse-Proxy Deployment (`*.core-now.com`)

Um CORS-Einschränkungen bei externen Datenquellen (z. B. Autobahn GmbH, HAFAS) zu umgehen, empfiehlt sich der Betrieb hinter einem Nginx Reverse Proxy:

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name hboard.core-now.com;

    ssl_certificate /etc/letsencrypt/live/hboard.core-now.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hboard.core-now.com/privkey.pem;

    location / {
        root /var/www/hboard/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/transport/ {
        proxy_pass https://v6.db.transport.rest/;
        proxy_set_header Host v6.db.transport.rest;
        proxy_ssl_server_name on;
    }

    location /api/autobahn/ {
        proxy_pass https://verkehr.autobahn.de/oapi/v1/;
        proxy_set_header Host verkehr.autobahn.de;
        proxy_ssl_server_name on;
    }
}
```
*(Die vollständige Konfiguration inkl. Overpass & WebSocket-Stream ist direkt im **`⚡ OPS`**-Dashboard hinterlegt.)*

---

## 🔒 Lizenz & Datenschutz

Entwickelt für urbane Open-Source Datenanalyse und zivile Lagebilderstellung.  
Alle Daten stammen aus frei zugänglichen Open-Data-Schnittstellen (OpenStreetMap, HVV, GVH, WSV PegelOnline, Autobahn GmbH).
