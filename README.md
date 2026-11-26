# mirror.

**This page already knows who you are.**

A single web page that reads what every website can read about your browser, builds a fingerprint ID from it, and then dares you to hide. No cookies, no login, nothing stored, nothing sent.

**Live:** https://leopardracer.github.io/mirror/

![mirror. preview](og.png)

## What happens when you open it

1. **Your ID.** The page reads 24 signals (graphics card, fonts, canvas and audio rendering, screen, time zone and more) and hashes them into a 16-character ID. It also builds a second **hardware ID** from signals that stay the same across browsers on one device.
2. **How much each signal gives away.** Every signal is shown in bits of identifying information, colored from weak to strong. Tap a row to see your own value and the line of JavaScript that reads it. The three signals that give you away most come with a fix.
3. **The profile a tracker builds.** A case file inferred only from browser signals: device, location, languages, software, hardware, with a confidence label on each line, an overall tracker confidence score, and example ads a profile like yours would be shown.
4. **How much you're worth.** A calculator for what ad networks earn from tracking you, based on pages per day, number of devices and an open-exchange display CPM of $2 (typical range $1–4, DoubleVerify 2025).
5. **What if you could turn signals off?** Toggle signals and watch your uniqueness change from "1 in septillions" down to a crowd. Presets approximate Chrome, Brave Strict, Firefox with resistFingerprinting and Tor Browser.
6. **Now try to hide.** Open the page in a private window or another browser and compare IDs. Scan the QR code with your phone: it opens the page with your ID attached and compares automatically.
7. **This is not a thought experiment.** Sourced numbers on how common fingerprinting is, and the companies named in research and regulator statements. Every number and every logo links to its source.
8. **How to look less unique.** Advice for the browser you're actually using, a table of what clearing cookies, a VPN, private mode and anti-fingerprint browsers really protect, and four practical tips.

Also: a **Tracker view** that replays your visit as a (clearly labeled, simulated) ad auction, an optional scan sound, share cards in 16:9, 1:1 and 9:16, and a full JSON report of everything the page read.

## Signals in the ID

GPU renderer and vendor, canvas hash, audio processing hash, emoji rendering hash, installed fonts, speech voices, time zone and locale, languages, screen size and pixel density, CPU threads and memory, OS, browser build, number of cameras/mics/speakers, touch and pointer type, display preferences, math engine quirks, WebGL extensions, WebGPU adapter, supported codecs, keyboard layout, timer precision, color gamut and HDR, number and date formatting, PDF viewer.

**Noise detection.** Canvas, audio and emoji are each read twice. If the two reads differ, the browser is adding anti-fingerprinting noise, so that signal is left out of the ID and the page tells you.

The hardware ID uses only time zone, screen, GPU maker, OS family, touch support, color gamut and primary language.

## Privacy

Everything runs in your tab. The ID is a SHA-256 hash computed locally and is never stored or sent. The page loads no third-party scripts, fonts or images. The counter in the header ("Sent to servers") watches every network request with a `PerformanceObserver` and stays at 0. The only network activity is loading the page's own files from GitHub Pages.

## Sources

- Iqbal, Englehardt & Shafiq, *Fingerprinting the Fingerprinters*, IEEE S&P 2021: fingerprinting on more than a quarter of the top 10,000 sites. https://arxiv.org/abs/2008.04480
- Luo, Ritter, Savage & Voelker, *Canvassing the Fingerprinters*, ACM IMC 2025: canvas fingerprinting on 12.7% of the top 20,000 sites. https://cseweb.ucsd.edu/~savage/papers/IMC25Canvas.pdf
- UK Information Commissioner's Office on Google's fingerprinting policy change (from 16 February 2025). https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2024/12/our-response-to-google-s-policy-change-on-fingerprinting/
- Eckersley, *How Unique Is Your Web Browser?* (EFF Panopticlick, 2010): 83.6% of browsers unique; bit values for fonts, browser, screen and time zone. https://www.eff.org/deeplinks/2010/05/every-browser-unique-results-fom-panopticlick
- Client-side and Server-side Tracking on Meta, PoPETs 2024. https://petsymposium.org/popets/2024/popets-2024-0086.php
- Neef, *Uncovering Fingerprinting Networks*, TU Berlin 2021: script networks traced to Google, Yandex, MaxMind, Sift and FingerprintJS. https://arxiv.org/abs/2210.11300
- Programmatic CPM benchmarks (open exchange $1–4, DoubleVerify 2025). https://owlclaw.com/benchmarks/programmatic-ads-benchmarks

Bit values other than the four Panopticlick figures are rough estimates, and the presets are approximations. Both are labeled on the page.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page |
| `app.js`, `app.css` | Source |
| `app.min.js`, `app.min.css` | Minified versions the page loads |
| `fonts/` | Inter Tight and Instrument Serif, self-hosted |
| `og.png` | Link preview image |

No frameworks, no dependencies, no build step beyond minifying.

## Run locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

After editing `app.js` or `app.css`, rebuild the minified files:

```bash
npx terser app.js -o app.min.js -c -m
npx clean-css-cli app.css -o app.min.css
```

Deploy anywhere static: GitHub Pages, Vercel, Netlify.

## Credits

Built with Claude. Inspired by the EFF's Cover Your Tracks and AmIUnique. Fonts: Inter Tight and Instrument Serif (SIL Open Font License).

MIT licensed.
