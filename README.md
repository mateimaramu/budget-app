# 💰 Budget Personale — PWA

App per monitorare entrate e spese personali.
Funziona offline, installabile sulla home screen Android.

---

## 📁 Struttura file

```
budget-pwa/
├── index.html      ← App principale
├── manifest.json   ← Metadati installazione
└── sw.js           ← Service Worker (offline)
```

---

## 🚀 Come installare su Android

### Opzione 1 — GitHub Pages (gratuita, consigliata)

1. Vai su https://github.com e crea un account (se non ce l'hai)
2. Clicca **"New repository"** → dai un nome es. `budget-app`
3. Carica i 3 file: `index.html`, `manifest.json`, `sw.js`
4. Vai su **Settings → Pages → Source: main / root** → Salva
5. GitHub ti dà un URL tipo: `https://tuonome.github.io/budget-app/`
6. Apri quell'URL in **Chrome su Android**
7. Chrome mostrerà un banner "Aggiungi alla schermata Home" → tocca **Installa**

✅ L'app è ora sulla home screen e funziona completamente offline!

---

### Opzione 2 — Netlify Drop (ancor più semplice)

1. Vai su https://app.netlify.com/drop
2. Trascina l'intera cartella `budget-pwa` nella pagina
3. Netlify ti dà subito un URL pubblico HTTPS
4. Apri l'URL in Chrome su Android → installa

---

### Opzione 3 — Server locale (solo WiFi di casa)

Se hai un computer sulla stessa rete:
```bash
# Python 3
cd budget-pwa
python3 -m http.server 8080
```
Poi su Android apri: `http://IP_DEL_PC:8080`

> ⚠️ Il Service Worker richiede HTTPS o localhost.
> Per uso locale su rete WiFi usare le opzioni 1 o 2.

---

## ✨ Funzionalità

- ➕ Aggiungi entrate e spese con categoria, data, descrizione
- 📊 Grafico degli ultimi 6 mesi
- 🗂️ Breakdown spese per categoria
- 🗑️ Swipe a sinistra per eliminare un movimento
- 📅 Naviga tra i mesi
- 💾 Dati salvati in IndexedDB (sul dispositivo, privati)
- 📴 Funziona completamente offline dopo il primo caricamento

---

## 🔒 Privacy

Tutti i dati restano **solo sul tuo dispositivo**.
Nessun server, nessun cloud, nessun account richiesto.
