# mirror.

A single page that shows what any website can read about your browser without cookies, logins or storage, and builds a fingerprint ID from it. Then it asks you to open the same page in a private window and compare.

Everything runs locally. The ID is a SHA-256 hash computed in your tab. Nothing is stored and nothing is sent: the counter in the header tracks requests to other servers and stays at 0.

## Signals it reads

GPU model (WebGL), WebGPU adapter, canvas and emoji rendering hashes, codecs, keyboard layout, timer precision, color gamut/HDR, number and date format, audio processing hash, installed fonts, text-to-speech voices, time zone and locale, languages, screen, CPU threads and memory, OS, browser build, number of cameras/mics/speakers, touch and pointer type, display preferences, math engine quirks, WebGL capabilities. Storage quota, connection, Do Not Track and window size are shown but not used in the ID, because private windows can change them.

## Also on the page

- Noise detection: canvas and audio are read twice. If the answers differ, the browser is adding anti-tracking noise, so those signals are left out of the ID.
- "How it's read": every signal shows the line of JavaScript that reads it.
- Motion signature: a pad that measures pointer speed, sharp turns, hesitations and straightness, the way bot checks do. Not used in the ID.
- Cookie vs fingerprint: a three-step animation of why clearing cookies doesn't help.
- Sourced numbers: Iqbal et al. (IEEE S&P 2021), UCSD/Mozilla (ACM IMC 2025), UK ICO on Google's 2025 policy change, EFF Panopticlick.
- Hardware ID: a second ID from signals every browser on the device shares, to show that switching browsers doesn't help.
- Signal weights in bits, plus the three signals that give this visitor away most, with a fix for each.
- Tracker view: a clearly labeled simulation of an ad auction built from the fingerprint.
- Optional scan sound, hold-to-rescan on the fingerprint (vibrates on phones), cursor lens, section color shifts.
- Downloads: share card in 16:9, 1:1 and 9:16 (2x resolution, 9:16 is 2160×3840) and a full JSON report.
- Follows the system dark mode. Lighthouse: accessibility, best practices and SEO 100.

## Run locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Deploy anywhere static (GitHub Pages, Vercel, Netlify).

## Credits

Inspired by research projects like the EFF's Cover Your Tracks and AmIUnique. MIT licensed.
