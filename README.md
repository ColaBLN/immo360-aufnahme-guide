# Immo360° Aufnahme-Guide

Schulungs-Web-App für Makler und Marketingassistenten von Immo360°: Termin vor Ort, Highlights, Foto-Basics, Matterport Pro2, Magicplan, Smartphone-Fotos, Wohnflächenberechnung – mit Checklisten und Abschluss-Protokoll als PDF.

## Aufbau
- `public/` – die App (statisches HTML, Bilder), `lock.html` = Sperrbildschirm
- `middleware.js` – lässt nur angemeldete Nutzer an die Inhalte
- `api/login.js`, `api/logout.js` – PIN-Prüfung auf dem Server, Sitzung 12 Stunden
- `lib/session.js` – signierte Sitzungs-Cookies

## Einstellungen in Vercel (Environment Variables)
- `APP_PIN` – die PIN für den Sperrbildschirm (6 Ziffern)
- `SESSION_SECRET` – geheimer Schlüssel für die Sitzungen (lange Zufallszeichenkette)

PIN ändern: In Vercel → Projekt → Settings → Environment Variables `APP_PIN` ändern und neu deployen.
