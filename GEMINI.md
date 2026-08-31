# Project & System Guidelines

## 1. UI & Design System
- **Akzentfarbe**: `#ff8000` (Orange – feste und einzige primäre Akzentfarbe für Interaktionen, Highlights, aktive Layer und Callouts).
- **Basisfarben**: Anthrazit (dunkle Grau-/Slate-/Zinc-Töne für Dark Mode & Container), Weiß (für Light Mode & kontrastreichen Text) sowie stimmige, neutrale Zwischentöne.
- **Verbotene Farben**:
  - Kein Pink / Magenta.
  - Kein Neon (kein Neon-Cyan, Neon-Grün oder überstrahlende Glow-Effekte).
- **Ästhetik & Gestaltungsprinzipien**:
  - Analytischer OSINT-/Behörden-Look: Professionell, sachlich, datengetrieben, klar strukturiert.
  - Keine typischen KI-Design-Elemente (keine lila/violetten Farbverläufe, keine Sparkle-/Zauberstab-Icons, keine Neonglows oder Glasmorphismus-Blobs).

## 2. Agenten- & Delegations-Hierarchie
- **Haupt-Agent**:
  - Ist allein autorisiert, Aufgaben zu koordinieren und an Subagenten zu delegieren.
  - Definiert bei Bedarf Subagenten stets mit `enable_subagent_tools: false` (sofern nicht anders vorgegeben).
- **Sub-Agenten**:
  - Haben **kein Recht**, eigenständig weitere Subagenten zu spawnen oder Arbeiten weiterzudelegieren.
  - Sollten sie zusätzliche Assistenz oder Werkzeuge benötigen, melden sie diesen Bedarf an den Haupt-Agenten zurück.
