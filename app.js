// mirror. shows what any website can read about your browser without cookies.
// Everything runs locally. Nothing is stored and nothing is sent anywhere.
const $ = s => document.querySelector(s) || document.createElement('span');
const t0 = performance.now();
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let slept = 0;
const sleep = ms => { slept += ms; return new Promise(r => setTimeout(r, ms)); };
const mq = q => matchMedia(q).matches;
const RM = () => mq('(prefers-reduced-motion: reduce)');
// smooth number tween; calls cb(value) every frame, final call gets exactly `to`
function tween(from, to, dur, cb) {
  if (RM() || dur <= 0) { cb(to); return; }
  const t0 = performance.now();
  const step = now => { const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3); cb(p < 1 ? from + (to - from) * e : to); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function onceVisible(el, fn, threshold = .25) {
  if (!el || !el.isConnected) return;
  const o = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { o.disconnect(); fn(); } }), { threshold });
  o.observe(el);
}
async function sha256(str) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}

// ---------- collectors ----------
function gpu() {
  const c = document.createElement('canvas');
  const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
  if (!gl) return { renderer: 'WebGL blocked', vendor: '', exts: 0, maxTex: 0 };
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  return {
    renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
    vendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
    exts: (gl.getSupportedExtensions() || []).length, maxTex: gl.getParameter(gl.MAX_TEXTURE_SIZE)
  };
}
async function canvasPrint() {
  const c = document.createElement('canvas'); c.width = 300; c.height = 80;
  const x = c.getContext('2d');
  x.textBaseline = 'top'; x.font = '16px Arial';
  const g = x.createLinearGradient(0, 0, 300, 0); g.addColorStop(0, '#f60'); g.addColorStop(1, '#09f');
  x.fillStyle = g; x.fillRect(10, 10, 200, 30);
  x.fillStyle = '#069'; x.fillText('mirror ✓ Cwm fjordbank glyphs vext quiz 😃', 4, 46);
  x.globalCompositeOperation = 'multiply';
  x.fillStyle = 'rgba(255,0,180,.6)'; x.beginPath(); x.arc(240, 40, 30, 0, Math.PI * 2); x.fill();
  const url = c.toDataURL();
  return { url, hash: (await sha256(url)).slice(0, 8) };
}
async function audioPrint() {
  const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!Ctx) return { sum: 'not available', data: null };
  const ctx = new Ctx(1, 5000, 44100);
  const osc = ctx.createOscillator(); osc.type = 'triangle'; osc.frequency.value = 10000;
  const comp = ctx.createDynamicsCompressor();
  [['threshold', -50], ['knee', 40], ['ratio', 12], ['attack', 0], ['release', .25]].forEach(([k, v]) => comp[k] && comp[k].setValueAtTime(v, ctx.currentTime));
  osc.connect(comp); comp.connect(ctx.destination); osc.start(0);
  const buf = await ctx.startRendering();
  const d = buf.getChannelData(0); let s = 0;
  for (let i = 4500; i < 5000; i++) s += Math.abs(d[i]);
  return { sum: s.toFixed(10), data: d.slice(4760, 4880) };
}
const FONTS = ['Arial', 'Arial Black', 'Arial Narrow', 'Avenir', 'Avenir Next', 'Baskerville', 'Bahnschrift', 'Book Antiqua', 'Bookman Old Style', 'Calibri', 'Cambria', 'Candara', 'Century Gothic', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Didot', 'DejaVu Sans', 'Franklin Gothic Medium', 'Futura', 'Garamond', 'Geneva', 'Georgia', 'Gill Sans', 'Helvetica', 'Helvetica Neue', 'Hoefler Text', 'Impact', 'Lucida Console', 'Lucida Grande', 'Lucida Sans Unicode', 'Liberation Sans', 'Menlo', 'Microsoft Sans Serif', 'Monaco', 'Noto Sans', 'Optima', 'Palatino', 'Palatino Linotype', 'Rockwell', 'Roboto', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'SF Pro Display', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Ubuntu', 'Verdana', 'Wingdings', 'Myriad Pro', 'Minion Pro', 'Adobe Garamond Pro', 'Source Sans Pro', 'Open Sans', 'Lato', 'Montserrat', 'Fira Code', 'JetBrains Mono', 'Cascadia Code', 'Inter', 'Poppins', 'Raleway', 'Oswald', 'Playfair Display', 'Merriweather', 'IBM Plex Sans', 'Arial Unicode MS', 'MS Gothic', 'Meiryo', 'PingFang SC', 'Microsoft YaHei', 'Malgun Gothic', 'Nirmala UI', 'Leelawadee UI', 'Ebrima', 'Gadugi', 'Javanese Text', 'Papyrus', 'Chalkboard', 'Marker Felt', 'Noteworthy', 'Copperplate', 'American Typewriter', 'Apple Chancery', 'Brush Script MT', 'Snell Roundhand', 'Zapfino'];
function fonts() {
  const x = document.createElement('canvas').getContext('2d');
  const txt = 'mmmmmmmmmmlli1WwQ@#', bases = ['monospace', 'sans-serif', 'serif'];
  const base = bases.map(b => { x.font = `72px ${b}`; return x.measureText(txt).width; });
  return FONTS.filter(f => bases.some((b, i) => { x.font = `72px "${f}", ${b}`; return x.measureText(txt).width !== base[i]; }));
}
function voices() {
  return new Promise(ok => {
    if (!('speechSynthesis' in window)) return ok([]);
    const get = () => speechSynthesis.getVoices();
    if (get().length) return ok(get());
    speechSynthesis.onvoiceschanged = () => ok(get());
    setTimeout(() => ok(get()), 900);
  });
}
async function media() {
  try {
    const d = await navigator.mediaDevices.enumerateDevices();
    const n = k => d.filter(x => x.kind === k).length;
    return { cams: n('videoinput'), mics: n('audioinput'), spk: n('audiooutput') };
  } catch (_) { return null; }
}
function mathPrint() {
  return [Math.tan(-1e300), Math.sinh(1), Math.expm1(1), Math.cbrt(100), Math.log1p(10), Math.atanh(0.5)].map(n => n.toString().slice(-6)).join('·');
}
function shortGpu(r) {
  const s = String(r).replace(/ANGLE \((.*)\)/, '$1').replace(/\(TM\)|\(R\)|Direct3D1\d.*|vs_\S+|ps_\S+|OpenGL.*|Metal.*|, Unspecified Version|\(0x[0-9a-f]+\)/gi, '').split(',').map(x => x.trim()).filter(Boolean);
  return (s.find(x => /apple|nvidia|geforce|radeon|amd|intel|adreno|mali|llvmpipe|swiftshader/i.test(x)) || s.pop() || 'GPU').slice(0, 40);
}

async function webgpu() {
  try {
    if (!navigator.gpu) return 'not supported';
    const a = await Promise.race([navigator.gpu.requestAdapter(), new Promise(r => setTimeout(() => r(null), 900))]);
    if (!a) return 'no adapter';
    const i = a.info || (a.requestAdapterInfo ? await a.requestAdapterInfo() : {});
    return [i.vendor, i.architecture, i.device, i.description].filter(Boolean).join(' ') || 'available';
  } catch (_) { return 'blocked'; }
}
const CODECS = [['H.264', 'video/mp4; codecs="avc1.42E01E"'], ['HEVC', 'video/mp4; codecs="hvc1.1.6.L93.B0"'], ['VP9', 'video/webm; codecs="vp9"'], ['AV1', 'video/mp4; codecs="av01.0.05M.08"'], ['AAC', 'audio/mp4; codecs="mp4a.40.2"'], ['Opus', 'audio/ogg; codecs="opus"'], ['FLAC', 'audio/flac'], ['HLS', 'application/vnd.apple.mpegurl'], ['MKV', 'video/x-matroska']];
function codecs() {
  const v = document.createElement('video');
  return CODECS.filter(([, t]) => { const r = v.canPlayType(t); return r === 'probably' || r === 'maybe' || (window.MediaSource && MediaSource.isTypeSupported && MediaSource.isTypeSupported(t)); }).map(c => c[0]);
}
async function keyboard() {
  try {
    if (!navigator.keyboard || !navigator.keyboard.getLayoutMap) return 'hidden by this browser';
    const m = await navigator.keyboard.getLayoutMap();
    const row = ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY'].map(k => m.get(k) || '?').join('');
    const name = /^qwerty/i.test(row) ? 'QWERTY' : /^azerty/i.test(row) ? 'AZERTY' : /^qwertz/i.test(row) ? 'QWERTZ' : /^йцукен/i.test(row) ? 'ЙЦУКЕН' : 'Custom';
    return `${name} (${row})`;
  } catch (_) { return 'hidden by this browser'; }
}
async function emojiPrint() {
  const c = document.createElement('canvas'); c.width = 240; c.height = 44;
  const x = c.getContext('2d'); x.font = '30px sans-serif'; x.textBaseline = 'top';
  x.fillText('😀👍🏽🇺🇦🧑‍💻❤️‍🔥🦊', 2, 4);
  const url = c.toDataURL();
  return { url, hash: (await sha256(url)).slice(0, 8) };
}
function timerRes() {
  let min = Infinity, a = performance.now();
  for (let i = 0; i < 4000; i++) { const b = performance.now(); if (b > a) { min = Math.min(min, b - a); a = b; } }
  if (!isFinite(min)) return 'unknown';
  return min >= 0.9 ? '1 ms' : min >= 0.09 ? '0.1 ms' : min >= 0.009 ? '0.01 ms' : '< 0.01 ms';
}
function displayCaps() {
  const g = mq('(color-gamut: rec2020)') ? 'Rec.2020' : mq('(color-gamut: p3)') ? 'P3 wide color' : 'sRGB';
  return `${g}${mq('(dynamic-range: high)') ? ' · HDR' : ''}${mq('(forced-colors: active)') ? ' · forced colors' : ''}${mq('(inverted-colors: inverted)') ? ' · inverted' : ''}`;
}
function intlPrint() {
  const o = Intl.DateTimeFormat().resolvedOptions();
  let hc = ''; try { hc = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hourCycle || ''; } catch (_) {}
  return `${new Intl.NumberFormat().format(1234567.89)} · ${new Date(Date.UTC(2026, 0, 31, 12)).toLocaleDateString()} · ${hc || '?'} · ${o.calendar}/${o.numberingSystem}`;
}
function gpuFamily(r) { r = String(r); return /apple/i.test(r) ? 'apple' : /nvidia|geforce|rtx|gtx/i.test(r) ? 'nvidia' : /radeon|amd/i.test(r) ? 'amd' : /intel/i.test(r) ? 'intel' : /adreno/i.test(r) ? 'adreno' : /mali/i.test(r) ? 'mali' : /powervr/i.test(r) ? 'powervr' : 'other'; }

// ---------- sound (off by default) ----------
let AC = null, soundOn = false;
function tone(f, d = .05, v = .05, type = 'square') {
  if (!soundOn || !AC) return;
  const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime;
  o.type = type; o.frequency.setValueAtTime(f, t); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + d + .02);
}
const click = () => tone(1800 + Math.random() * 900, .025, .03);
const chime = () => { tone(880, .25, .05, 'sine'); setTimeout(() => tone(1320, .35, .05, 'sine'), 110); setTimeout(() => tone(1760, .5, .04, 'sine'), 230); };

// ---------- scan log ----------
const logEl = $('#log'), LOG = [];
async function logLine(label, value) {
  const li = document.createElement('li');
  li.innerHTML = `<b>✓</b> ${esc(label)} <span>${esc(value)}</span>`; LOG.push([label, value]); click();
  logEl.appendChild(li);
  while (logEl.children.length > 6) logEl.firstChild.remove();
  await sleep(110 + Math.random() * 90);
}

// ---------- run ----------
let R = {};
async function run() {
  const g = gpu();                              await logLine('graphics card', shortGpu(g.renderer));
  const tz = Intl.DateTimeFormat().resolvedOptions(); await logLine('time zone', tz.timeZone);
  const scr = { w: screen.width, h: screen.height, dpr: devicePixelRatio, depth: screen.colorDepth };
  await logLine('screen', `${scr.w}×${scr.h} @${scr.dpr}x`);
  // read canvas and audio twice: a real device answers the same both times,
  // a browser that adds anti-tracking noise does not
  const cv = await canvasPrint(), cv2 = await canvasPrint();
  const cvNoise = cv.hash !== cv2.hash;          await logLine('canvas', cvNoise ? 'randomized · skipped' : cv.hash);
  const au = await audioPrint(), au2 = await audioPrint();
  const auNoise = au.sum !== au2.sum;            await logLine('audio stack', auNoise ? 'randomized · skipped' : au.sum.slice(0, 9));
  const fl = fonts();                           await logLine('fonts', `${fl.length} installed`);
  const em = await emojiPrint(), em2 = await emojiPrint();
  const emNoise = em.hash !== em2.hash;          await logLine('emoji', emNoise ? 'randomized · skipped' : em.hash);
  const vl = await voices();                    await logLine('speech voices', `${vl.length} found`);
  const wg = await webgpu();                    await logLine('WebGPU', wg.slice(0, 28));
  const cd = codecs();                          await logLine('codecs', `${cd.length} supported`);
  const kb = await keyboard();                  await logLine('keyboard', kb.split(' ')[0]);
  const tr = timerRes(), dc = displayCaps(), it = intlPrint();
  await logLine('display', dc);
  const dev = await media();                    await logLine('cameras & mics', dev ? `${dev.cams} / ${dev.mics}` : 'hidden');
  let hi = null;
  try { hi = navigator.userAgentData && await navigator.userAgentData.getHighEntropyValues(['platformVersion', 'architecture', 'bitness', 'fullVersionList', 'model']); } catch (_) {}
  const browser = hi?.fullVersionList?.filter(b => !/Not.?A.?Brand|Chromium/i.test(b.brand)).map(b => `${b.brand} ${b.version.split('.')[0]}`).join(', ') || uaBrowser();
  const os = hi ? `${navigator.userAgentData.platform} ${hi.platformVersion || ''} ${hi.architecture || ''}${hi.bitness ? ' ' + hi.bitness + '-bit' : ''}`.trim() : uaOS();
  await logLine('system', os);
  let quota = null; try { quota = (await navigator.storage.estimate()).quota; } catch (_) {}
  const langs = navigator.languages?.length ? [...navigator.languages] : [navigator.language];
  const off = -new Date().getTimezoneOffset() / 60;

  // WebRTC local IP (item 10)
  let rtcIP = 'hidden';
  try {
    const pc = new RTCPeerConnection({iceServers:[]});
    pc.createDataChannel('');
    const offer = await pc.createOffer(); await pc.setLocalDescription(offer);
    await new Promise(r => { pc.onicecandidate = e => { if (!e.candidate) r(); else { const m = e.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/); if (m && !m[1].startsWith('0.')) rtcIP = m[1]; } }; setTimeout(r, 1200); });
    pc.close();
  } catch(_){}
  // Battery (item 11)
  let battery = 'not available';
  try { if (navigator.getBattery) { const b = await navigator.getBattery(); battery = `${Math.round(b.level*100)}%${b.charging ? ' · charging' : ''}`; } } catch(_){}
  // Connection (item 12)
  let conn = 'not available';
  try { const c = navigator.connection || navigator.mozConnection; if (c) conn = `${c.effectiveType || '?'}${c.downlink ? ' · ' + c.downlink + ' Mbps' : ''}${c.rtt ? ' · ' + c.rtt + 'ms RTT' : ''}`; } catch(_){}

  R = { g, tz, scr, cv, au, em, fl, vl, dev, browser, os, quota, langs, off, hi, wg, cd, kb, tr, dc, it, rtcIP, battery, conn, noise: { canvas: cvNoise, audio: auNoise, emoji: emNoise } };

  // stable signals only, so a private window produces the same ID
  const idParts = [
    ['gpu', g.renderer + g.vendor], ['canvas', cvNoise ? 'noise' : cv.hash], ['audio', auNoise ? 'noise' : au.sum], ['fonts', fl.join(',')],
    ['voices', vl.map(v => v.name + v.lang).join(',')], ['tz', tz.timeZone + tz.locale], ['lang', langs.join(',')],
    ['screen', `${scr.w}x${scr.h}x${scr.dpr}x${scr.depth}`], ['hw', `${navigator.hardwareConcurrency}/${navigator.deviceMemory}/${g.maxTex}`],
    ['os', os], ['browser', browser], ['media', dev ? `${dev.cams}${dev.mics}${dev.spk}` : '-'],
    ['input', `${navigator.maxTouchPoints}${mq('(pointer:fine)')}${mq('(hover:hover)')}`],
    ['prefs', `${mq('(prefers-color-scheme: dark)')}${mq('(prefers-reduced-motion: reduce)')}${mq('(prefers-contrast: more)')}`],
    ['math', mathPrint()], ['gl', g.exts],
    ['emoji', emNoise ? 'noise' : em.hash], ['webgpu', wg], ['codecs', cd.join(',')], ['keyboard', kb],
    ['timer', tr], ['display', dc], ['intl', it], ['pdf', String(navigator.pdfViewerEnabled)]
  ];
  const noisy = [cvNoise && 'Canvas', auNoise && 'Audio', emNoise && 'Emoji'].filter(Boolean);
  if (noisy.length) { $('#noisewhat').textContent = noisy.join(' and ') + ' output'; $('#noise').hidden = false; }
  if (cvNoise) $('#cvnoise').hidden = false;
  const stable = idParts.filter(p => p[1] !== 'noise').length;
  const hash = (await sha256(idParts.map(p => p.join('=')).join('|'))).toUpperCase();
  const fid = hash.slice(0, 16).match(/.{4}/g).join(' ');
  // hardware-only ID: things every browser on this device reports the same way
  const osFam = /iPhone|iPad/.test(navigator.userAgent) ? 'ios' : /Android/.test(navigator.userAgent) ? 'android' : /Mac/.test(navigator.userAgent) ? 'mac' : /Win/.test(navigator.userAgent) ? 'win' : 'linux';
  const hwParts = [tz.timeZone, `${scr.w}x${scr.h}x${scr.dpr}x${scr.depth}`, gpuFamily(g.renderer), osFam, navigator.maxTouchPoints > 0, dc.split(' ')[0], (langs[0] || '').split('-')[0]];
  const hwid = (await sha256(hwParts.join('|'))).toUpperCase().slice(0, 16).match(/.{4}/g).join(' ');
  R.hwid = hwid; R.hwParts = ['time zone', 'screen', 'GPU maker', 'OS', 'touch', 'color gamut', 'language'];
  const ms = Math.max(1, Math.round(performance.now() - t0 - slept)); // real collection time, without the log animation pauses
  R.fid = fid; R.ms = ms; R.nsig = stable; R.idParts = idParts.map(p => p[0]).filter((_, i) => idParts[i][1] !== 'noise'); window.__fid = fid;

  await logLine('fingerprint', 'locked');
  scramble($('#fid'), fid);
  setTimeout(() => $('#idcard').classList.add('flash'), 900);
  $('#scanstate').innerHTML = '<i class="spin"></i>match ready'; $('#scanstate').classList.add('done');
  tween(0, 1, 1400, p => { $('#idmeta').textContent = `${Math.round(stable * p)} signals · ${Math.round(ms * p)} ms · computed only in this tab`; });
  tween(0, stable, 1200, v => { $('#nsig').textContent = Math.round(v); });
  $('#myid').textContent = fid; $('#hwid').textContent = hwid; $('#myhw').textContent = hwid; $('#d-id').textContent = fid.slice(0, 9); $('#d-short').textContent = '#' + fid.slice(0, 4);
  $('#tg1').textContent = '🖥 ' + shortGpu(g.renderer);
  $('#tg2').textContent = '🕓 ' + tz.timeZone;
  $('#tg3').textContent = `🔤 ${fl.length} fonts found`;
  $('#tg4').textContent = `🖵 ${scr.w}×${scr.h}`;

  const steps = [burstIn, () => drawPrint(hash), particles, marquee, dossier, weights, worthCalc, whatifInit, incogInit, qrGen, compareFromHash, adsInit, youTip, motionInit];
  const idle = window.requestIdleCallback || (f => setTimeout(f, 1));
  await new Promise(done => { const next = () => { const f = steps.shift(); if (!f) return done(); f(); idle(next, { timeout: 120 }); }; next(); });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}
function uaBrowser() { const u = navigator.userAgent; return (u.match(/(Firefox|Edg|OPR|Chrome|Version)\/(\d+)/) || [, 'Browser', ''])[1].replace('Edg', 'Edge').replace('Version', 'Safari') + ' ' + ((u.match(/(Firefox|Edg|OPR|Chrome|Version)\/(\d+)/) || [])[2] || ''); }
function uaOS() { const u = navigator.userAgent; return /iPhone|iPad/.test(u) ? 'iOS' : /Android/.test(u) ? 'Android' : /Mac OS X/.test(u) ? 'macOS' : /Windows/.test(u) ? 'Windows' : /Linux/.test(u) ? 'Linux' : navigator.platform; }

// ---------- hero visuals ----------
function drawPrint(hash) {
  let seed = parseInt(hash.slice(0, 8), 16) || 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const g = $('#ridges'); g.innerHTML = '';
  const cx = 100, cy = 112;
  for (let r = 8, i = 0; r < 118; r += 9.5, i++) {
    const segs = 1 + Math.floor(rnd() * 2), gap = 0.35 + rnd() * 0.5;
    let a = Math.PI * (0.35 + rnd() * 0.3);
    const total = Math.PI * 2 - gap * segs;
    for (let s = 0; s < segs; s++) {
      const span = Math.min(total / segs * (0.85 + rnd() * 0.3), Math.PI * 1.96);
      const rx = r * 0.82, ry = r * (1.05 + i * 0.006);
      const pt = t => [cx + rx * Math.cos(t), cy + ry * Math.sin(t)];
      const [x0, y0] = pt(a), [x1, y1] = pt(a + span);
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', `M${x0.toFixed(1)} ${y0.toFixed(1)} A${rx.toFixed(1)} ${ry.toFixed(1)} 0 ${span > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`);
      g.appendChild(p);
      p.style.setProperty('--len', p.getTotalLength()); p.style.setProperty('--d', (i * 0.06 + s * 0.05) + 's');
      a += span + gap;
    }
  }
  $('#ridges2').innerHTML = g.innerHTML;
  setTimeout(() => g.classList.add('live'), 2600);
}
function particles() {
  const box = $('#particles');
  const vals = [shortGpu(R.g.renderer), R.tz.timeZone, `${R.scr.w}×${R.scr.h}`, `${R.fl.length} fonts`, R.langs[0], `${navigator.hardwareConcurrency} threads`, R.cv.hash, R.au.sum.slice(0, 7), R.os.split(' ')[0], `${R.vl.length} voices`, `UTC${R.off >= 0 ? '+' : ''}${R.off}`, R.browser.split(',')[0]];
  box.innerHTML = vals.map(v => String(v).slice(0, 18)).map((v, i) => {
    const ang = (i / vals.length) * Math.PI * 2 + 0.3, rad = 40;
    const x = 50 + Math.cos(ang) * rad, y = 50 + Math.sin(ang) * rad * 0.92;
    return `<span class="pt" style="left:${x}%;top:${y}%;--dx:${(50 - x) * 4.6}px;--dy:${(50 - y) * 4.6}px;--t:${3.4 + (i % 4) * 0.5}s;--dl:${(i * 0.45).toFixed(2)}s">${esc(v)}</span>`;
  }).join('');
}
const art = $('#art');
addEventListener('pointermove', e => {
  if (mq('(prefers-reduced-motion: reduce)')) return;
  const r = art.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
  art.style.setProperty('--ry', (x * 14).toFixed(1) + 'deg'); art.style.setProperty('--rx', (-y * 14).toFixed(1) + 'deg');
}, { passive: true });
function scramble(el, target) {
  const chars = '0123456789ABCDEF'; let f = 0;
  const tick = () => {
    f++;
    el.textContent = [...target].map((c, i) => c === ' ' ? ' ' : (f > 6 + i * 1.6 ? c : chars[Math.floor(Math.random() * 16)])).join('');
    if (f < 6 + target.length * 1.6 + 2) requestAnimationFrame(tick); else el.textContent = target;
  };
  tick();
}
function marquee() {
  const items = [shortGpu(R.g.renderer), R.tz.timeZone, `${R.scr.w}×${R.scr.h} @${R.scr.dpr}x`, `${R.fl.length} fonts`, R.langs.join(' · '), `${navigator.hardwareConcurrency} CPU threads`, `canvas ${R.cv.hash}`, `audio ${R.au.sum.slice(0, 9)}`, R.os, R.browser, `${R.vl.length} voices`, mq('(prefers-color-scheme: dark)') ? 'dark mode' : 'light mode'];
  const html = items.map(i => `<span>${esc(i)}</span>`).join('');
  $('#mq').innerHTML = html + html;
}

// ---------- bento ----------
const LV = { hi: 'very identifying', md: 'identifying', lo: 'adds a little' };
function bento() {
  const { g, fl, cv, au, tz, scr } = R;
  $('#v-gpu').textContent = shortGpu(g.renderer);
  $('#v-gpu2').textContent = `${g.renderer}${g.vendor ? ' · ' + g.vendor : ''}`;
  const pins = $('#pins'); let s = '';
  for (let i = 0; i < 6; i++) { const p = 30 + i * 12; s += `<path d="M${p} 10v12M${p} 98v12M10 ${p}h12M98 ${p}h12"/>`; }
  pins.innerHTML = s;

  $('#v-fontn').textContent = fl.length;
  $('#fontwall').style.setProperty('--fs', fl.length < 25 ? '30px' : fl.length < 50 ? '24px' : '20px');
  $('#fontwall').innerHTML = fl.length ? fl.map(f => `<span style="font-family:'${f.replace(/'/g, '')}',monospace">${esc(f)}</span>`).join('') : '<span>No extra fonts detected</span>';

  $('#v-canvas').src = cv.url; $('#v-canvash').textContent = R.noise.canvas ? `hash ${cv.hash} · changes every read` : `hash ${cv.hash}`;
  $('#v-audio').textContent = R.noise.audio ? `signal ${au.sum} · changes every read` : `signal ${au.sum}`;
  if (au.data) {
    const c = $('#v-wave'), k = Math.max(2, devicePixelRatio || 1); c.width = 600 * k; c.height = 160 * k;
    const x = c.getContext('2d'), W = c.width, H = c.height; x.lineWidth = 3 * k;
    const gr = x.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, '#7b6cff'); gr.addColorStop(1, '#22c3ee');
    x.strokeStyle = gr; x.lineWidth = 3 * k; x.lineJoin = 'round'; x.beginPath();
    let m = 0; for (const v of au.data) m = Math.max(m, Math.abs(v));
    au.data.forEach((v, i) => { const px = i / au.data.length * W, py = H / 2 - v / (m || 1) * H * 0.4; i ? x.lineTo(px, py) : x.moveTo(px, py); });
    x.stroke();
  }

  $('#v-tz').textContent = tz.timeZone.split('/').pop().replace(/_/g, ' ');
  $('#v-tz2').textContent = `${tz.timeZone} · UTC${R.off >= 0 ? '+' : ''}${R.off} · ${tz.locale}`;
  globe(R.off);

  const ratio = scr.w / scr.h, dw = Math.min(220, 150 * ratio), dh = dw / ratio;
  Object.assign($('#device').style, { width: dw + 'px', height: Math.min(dh, 200) + 'px' });
  $('#v-screen').textContent = `${scr.w}×${scr.h}`;
  $('#v-screen2').textContent = `@${scr.dpr}x pixel density · ${scr.depth}-bit color · window ${innerWidth}×${innerHeight}`;

  const dev = R.dev;
  const smalls = [
    ['Languages', R.langs.join(', '), 'md', 'The order of your preferred languages is surprisingly personal.', 'navigator.languages'],
    ['CPU & memory', `${navigator.hardwareConcurrency || '?'} threads · ${navigator.deviceMemory ? navigator.deviceMemory + ' GB+ RAM' : 'RAM hidden'}`, 'md', 'How powerful your machine is.', 'navigator.hardwareConcurrency\nnavigator.deviceMemory'],
    ['System', R.os, 'md', 'OS, version and chip architecture.', "navigator.userAgentData\n  .getHighEntropyValues(['platformVersion', 'architecture'])"],
    ['Browser', R.browser, 'lo', 'Exact browser build.', "navigator.userAgentData\n  .getHighEntropyValues(['fullVersionList'])"],
    ['Speech voices', R.vl.length ? `${R.vl.length}: ${R.vl.slice(0, 3).map(v => v.name).join(', ')}${R.vl.length > 3 ? '…' : ''}` : 'none exposed', 'md', 'Depends on OS version and installed languages.', 'speechSynthesis.getVoices()'],
    ['Cameras & mics', dev ? `${dev.cams} cam · ${dev.mics} mic · ${dev.spk} speaker` : 'hidden', 'md', 'Counted without any permission prompt.', 'navigator.mediaDevices.enumerateDevices()'],
    ['Touch & pointer', `${navigator.maxTouchPoints} touch points · ${mq('(pointer:fine)') ? 'mouse/trackpad' : 'touch'}`, 'lo', 'Phone, laptop or touchscreen PC.', "navigator.maxTouchPoints\nmatchMedia('(pointer: fine)')"],
    ['Display prefs', `${mq('(prefers-color-scheme: dark)') ? 'dark' : 'light'} mode · motion ${mq('(prefers-reduced-motion: reduce)') ? 'reduced' : 'full'}`, 'lo', 'Settings you chose once, readable everywhere.', "matchMedia('(prefers-color-scheme: dark)')"],
    ['Math quirks', mathPrint(), 'lo', 'Last digits of math functions differ by engine.', 'Math.tan(-1e300)\nMath.sinh(1)  // last digits vary'],
    ['WebGL features', `${R.g.exts} extensions · max texture ${R.g.maxTex}`, 'lo', 'Driver capabilities.', 'gl.getSupportedExtensions()\ngl.getParameter(gl.MAX_TEXTURE_SIZE)'],
    ['Emoji rendering', R.noise.emoji ? `hash ${R.em.hash} · randomized` : `hash ${R.em.hash}`, 'md', 'Emoji are drawn by your OS. Versions and skin tones render slightly differently.', "ctx.fillText('😀👍🏽🇺🇦🧑‍💻', 2, 4);\nsha256(canvas.toDataURL())"],
    ['WebGPU', R.wg, 'md', 'The newest graphics API, with its own description of your chip.', 'await navigator.gpu.requestAdapter()\nadapter.info.architecture'],
    ['Video & audio codecs', R.cd.length ? R.cd.join(' · ') : 'none reported', 'lo', 'Which formats your system can decode in hardware.', "video.canPlayType('video/mp4; codecs=\"hvc1\"')"],
    ['Keyboard layout', R.kb, 'md', 'Reveals the layout you type with, and often your country.', "const m = await navigator.keyboard.getLayoutMap();\nm.get('KeyQ')  // 'q', 'a' or 'й'"],
    ['Timer precision', R.tr, 'lo', 'Browsers blur clocks by different amounts.', 'performance.now()  // smallest tick'],
    ['Display', R.dc, 'lo', 'Wide-color and HDR screens are less common.', "matchMedia('(color-gamut: p3)')\nmatchMedia('(dynamic-range: high)')"],
    ['Number & date format', R.it, 'md', 'Your regional settings, readable without asking.', 'new Intl.NumberFormat().format(1234567.89)'],
    ['WebRTC local IP', R.rtcIP || 'hidden', 'md', 'Your local network address, readable without permission in some browsers. Not used in your ID.', "new RTCPeerConnection()\n.onicecandidate → local IP"],
    ['Battery', R.battery || 'not available', 'lo', 'Level and charging state hint at your device type. Not used in your ID.', 'navigator.getBattery()\n.then(b => b.level)'],
    ['Connection', R.conn || 'not available', 'lo', 'Network type and speed. Not used in your ID.', 'navigator.connection.effectiveType'],
    ['Storage quota', R.quota ? `${(R.quota / 1e9).toFixed(1)} GB` : 'hidden', 'md', 'Hints at free disk space. Not used in your ID.', 'navigator.storage.estimate()'],
    ['Do Not Track', navigator.doNotTrack === '1' ? 'on' : 'off', 'lo', 'Ironically, turning it on makes you rarer. Not used in your ID.', 'navigator.doNotTrack'],
  ];
  $('#smalls').innerHTML = smalls.map(([t, v, l, w, c]) => `<article class="tile reveal"><div class="tile-h"><h3>${esc(t)}</h3><span class="lvl ${l}">${LV[l]}</span></div><div class="val">${esc(v)}</div><p class="why">${esc(w)}</p><details class="how"><summary>How it's read</summary><pre><code>${esc(c)}</code></pre></details></article>`).join('');
}
function globe(off) {
  const lon = off * 15; let s = '<defs><radialGradient id="gg" cx=".35" cy=".3"><stop offset="0" stop-color="#eef2ff"/><stop offset="1" stop-color="#c9d3ff"/></radialGradient></defs><circle cx="60" cy="60" r="52" fill="url(#gg)" stroke="#aab6f0"/>';
  for (let m = -150; m <= 180; m += 30) { const k = Math.sin((m - lon) * Math.PI / 180); if (Math.cos((m - lon) * Math.PI / 180) < 0) continue; s += `<ellipse cx="60" cy="60" rx="${Math.abs(k * 52).toFixed(1)}" ry="52" fill="none" stroke="#b5c0f0" stroke-width=".8"/>`; }
  for (const la of [-60, -30, 0, 30, 60]) { const y = 60 - Math.sin(la * Math.PI / 180) * 52, rx = Math.cos(la * Math.PI / 180) * 52; s += `<ellipse cx="60" cy="${y.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${(rx * 0.12).toFixed(1)}" fill="none" stroke="#b5c0f0" stroke-width=".8"/>`; }
  s += '<path d="M53 9.5 Q60 60 53 110.5 L67 110.5 Q60 60 67 9.5Z" fill="#4f8bff" opacity=".35"/><line x1="60" y1="8" x2="60" y2="112" stroke="#4f8bff" stroke-width="2.5"/>';
  s += `<text x="60" y="64" text-anchor="middle" font-size="11" font-weight="800" fill="#1a1e48" font-family="Inter Tight,sans-serif">UTC${off >= 0 ? '+' : ''}${off}</text>`;
  $('#globe').innerHTML = s;
}

// ---------- dossier ----------
function dossier() {
  const { g, fl, tz, scr, langs, dev } = R;
  const r = String(g.renderer), ua = navigator.userAgent, F = [];
  let device = 'Unknown device', dc = 'guess';
  if (/iPhone/.test(ua)) { device = 'iPhone'; dc = 'sure'; }
  else if (/iPad/.test(ua) || (/Mac/.test(ua) && navigator.maxTouchPoints > 1)) { device = 'iPad'; dc = 'likely'; }
  else if (/Android/.test(ua)) { device = `Android ${/Mobile/.test(ua) ? 'phone' : 'tablet'}${/Adreno|Mali|PowerVR/i.test(r) ? ' · ' + shortGpu(r) : ''}`; dc = 'likely'; }
  else if (/Apple M\d/i.test(r)) { device = `Mac with ${r.match(/Apple M\d\s?\w*/i)[0].trim()} chip`; dc = 'sure'; }
  else if (/Apple/i.test(r) || /Mac/.test(ua)) { device = 'Mac'; dc = 'likely'; }
  else if (/NVIDIA|GeForce|RTX|GTX/i.test(r)) { device = `PC with ${shortGpu(r)}`; dc = 'sure'; }
  else if (/Radeon|AMD/i.test(r)) { device = `PC with ${shortGpu(r)}`; dc = 'sure'; }
  else if (/Intel/i.test(r)) { device = /Windows/.test(ua) ? 'Windows laptop with Intel graphics' : 'Laptop with Intel graphics'; dc = 'likely'; }
  F.push(['Device', device, dc]);
  const city = tz.timeZone.split('/').pop().replace(/_/g, ' ');
  F.push(['Location', `Probably in or near the ${city} time zone`, 'likely']);
  let names = langs; try { const dn = new Intl.DisplayNames(['en'], { type: 'language' }); names = langs.map(l => dn.of(l)); } catch (_) {}
  F.push(['Speaks', [...new Set(names)].join(', '), 'sure']);
  const now = new Date(), hh = now.getHours();
  F.push(['Online at', `${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} local time${hh < 5 ? ' · night owl' : hh < 9 ? ' · early riser' : ''}`, 'sure']);
  const hints = [];
  if (fl.some(f => /Myriad Pro|Minion Pro|Adobe Garamond/i.test(f))) hints.push('Adobe apps (design work)');
  if (fl.some(f => /Calibri|Cambria|Candara|Constantia|Corbel/i.test(f)) && !/Windows/.test(ua)) hints.push('Microsoft Office');
  if (fl.some(f => /Fira Code|JetBrains Mono|Cascadia Code/i.test(f))) hints.push('coding fonts (developer)');
  if (fl.some(f => /Montserrat|Poppins|Playfair Display|Raleway|Oswald|Lato|Open Sans/i.test(f))) hints.push('web/brand fonts');
  F.push(['Software', hints.length ? hints.join(' · ') : `${fl.length} fonts, nothing unusual`, hints.length ? 'likely' : 'guess']);
  const th = navigator.hardwareConcurrency || 0;
  F.push(['Machine', th >= 10 ? `High-end (${th} threads)` : th >= 6 ? `Mid-range (${th} threads)` : `Entry-level (${th || '?'} threads)`, 'likely']);
  F.push(['Display', `${scr.w}×${scr.h}${scr.dpr >= 2 ? ' · high-DPI / Retina' : ''} · ${mq('(prefers-color-scheme: dark)') ? 'dark mode' : 'light mode'}`, 'sure']);
  if (dev) F.push(['Hardware', `${dev.cams} camera${dev.cams === 1 ? '' : 's'} · ${dev.mics} mic${dev.mics === 1 ? '' : 's'}`, 'sure']);
  const nz = [R.noise.canvas && 'canvas', R.noise.audio && 'audio', R.noise.emoji && 'emoji'].filter(Boolean);
  F.push(['Protection', nz.length ? `Noise added to ${nz.join(' and ')}, still identifiable` : /blocked/i.test(g.renderer) ? 'Some signals blocked' : 'No fingerprint protection detected', nz.length ? 'sure' : 'guess']);
  F.push(['On return', 'Recognized again, even after clearing cookies', 'sure']);
  const CL = { sure: 'certain', likely: 'likely', guess: 'guess' };
  $('#facts').innerHTML = F.map(([k, v, c]) => `<li><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span><span class="c ${c}">${CL[c]}</span></li>`).join('');
  R.facts = F;
  // avatar glyph for the detected device
  const fam = /iPhone|iPad|Mac/.test(ua) ? 'apple' : /Android/.test(ua) ? 'android' : /Win/.test(ua) ? 'win' : 'linux';
  const AV = {
    apple: '<path d="M40.6 33.4c0-4.6 3.8-6.8 4-6.9-2.2-3.2-5.6-3.6-6.8-3.7-2.9-.3-5.6 1.7-7.1 1.7s-3.7-1.7-6.1-1.6c-3.1 0-6 1.8-7.6 4.6-3.3 5.7-.8 14.1 2.4 18.7 1.6 2.3 3.4 4.8 5.8 4.7 2.3-.1 3.2-1.5 6-1.5s3.6 1.5 6.1 1.4c2.5 0 4.1-2.3 5.6-4.6 1.8-2.6 2.5-5.1 2.5-5.2-.1 0-4.8-1.8-4.8-7.6zM36 19.6c1.3-1.6 2.2-3.7 1.9-5.9-1.9.1-4.1 1.3-5.5 2.8-1.2 1.4-2.3 3.6-2 5.7 2.1.2 4.3-1.1 5.6-2.6z" fill="url(#avg)"/>',
    win: '<g fill="url(#avg)"><rect x="15" y="15" width="16" height="16" rx="2"/><rect x="33" y="15" width="16" height="16" rx="2"/><rect x="15" y="33" width="16" height="16" rx="2"/><rect x="33" y="33" width="16" height="16" rx="2"/></g>',
    android: '<rect x="20" y="10" width="24" height="44" rx="5" fill="none" stroke="url(#avg)" stroke-width="3.5"/><circle cx="32" cy="47" r="2.4" fill="url(#avg)"/><path d="M28 15h8" stroke="url(#avg)" stroke-width="3" stroke-linecap="round"/>',
    linux: '<rect x="12" y="15" width="40" height="34" rx="6" fill="none" stroke="url(#avg)" stroke-width="3.5"/><path d="M20 27l6 5-6 5M30 38h12" stroke="url(#avg)" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
  };
  $('#avatar').innerHTML = `<svg viewBox="0 0 64 64"><defs><linearGradient id="avg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7b6cff"/><stop offset="1" stop-color="#22c3ee"/></linearGradient></defs>${AV[fam]}</svg>`;
  // how sure a tracker would be overall
  const W = { sure: 1, likely: .7, guess: .35 };
  const conf = Math.round(F.reduce((a, f) => a + W[f[2]], 0) / F.length * 100);
  R.conf = conf;
  onceVisible($('#dossier .file'), () => {
    $('#conf-fill').style.width = conf + '%';
    tween(0, conf, 1300, v => { $('#conf').textContent = Math.round(v) + '%'; });
  });
}

// ---------- share card ----------
const FMT = {
  x: { W: 1200, H: 675, ring: [985, 360, 1], ty: 96, pad: 70, fs: 1 },
  sq: { W: 1080, H: 1080, ring: [850, 235, .92], ty: 470, pad: 70, fs: 1 },
  story: { W: 1080, H: 1920, ring: [540, 560, 1.75], ty: 1080, pad: 80, fs: 1.22 }
};
async function shareCard(mode, fmt = 'x') {
  const profile = mode === 'profile', uniq = mode === 'uniq';
  await document.fonts.ready;
  const L = FMT[fmt], { W, H } = L, S = 2, c = document.createElement('canvas'); c.width = W * S; c.height = H * S;
  const x = c.getContext('2d'); x.scale(S, S);
  const P = L.pad, Y = L.ty, k = L.fs;
  const bg = x.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#1b1f50'); bg.addColorStop(.6, '#11143a'); bg.addColorStop(1, '#0d2a46');
  x.fillStyle = bg; x.fillRect(0, 0, W, H);
  const glow = x.createRadialGradient(L.ring[0], L.ring[1] - 240 * L.ring[2], 0, L.ring[0], L.ring[1] - 240 * L.ring[2], 420 * L.ring[2]); glow.addColorStop(0, '#4f8bff66'); glow.addColorStop(1, '#4f8bff00');
  x.fillStyle = glow; x.fillRect(0, 0, W, H);
  // fingerprint rings
  x.save(); x.translate(L.ring[0], L.ring[1]); x.scale(L.ring[2], L.ring[2]); x.globalAlpha = .9;
  const rg = x.createLinearGradient(-150, -150, 150, 150); rg.addColorStop(0, '#7b6cff'); rg.addColorStop(1, '#22c3ee');
  x.strokeStyle = rg; x.lineWidth = 7; x.lineCap = 'round';
  let seed = parseInt(R.fid.replace(/ /g, '').slice(0, 8), 16) || 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let r = 14; r < 190; r += 16) { const a = Math.PI * (0.4 + rnd() * 0.3); x.beginPath(); x.ellipse(0, 0, r * .82, r * 1.05, 0, a, a + Math.PI * (1.55 + rnd() * .3)); x.stroke(); }
  x.restore();
  const F = (w, sz, fam = '"Inter Tight", sans-serif') => `${w} ${Math.round(sz * k)}px ${fam}`;
  x.fillStyle = '#aab3ff'; x.font = F(600, 26); x.fillText(uniq ? 'How unique my browser is' : profile ? 'What a tracker knows about me' : 'This website recognized me in ' + R.ms + ' ms', P, Y);
  x.fillStyle = '#fff'; x.font = F(800, 64); x.fillText(uniq ? WI.label : profile ? 'No name. No cookies.' : 'No cookies. No login.', P, Y + 76 * k);
  x.font = F('italic', 70, '"Instrument Serif", serif'); const tg = x.createLinearGradient(P, 0, P + 630 * k, 0); tg.addColorStop(0, '#9d8fff'); tg.addColorStop(1, '#5fe0ff');
  x.fillStyle = tg; x.fillText(uniq ? 'Without a single cookie.' : 'Still knew it was me.', P, Y + 154 * k);
  x.font = F(700, 44, 'ui-monospace, Menlo, monospace'); x.fillStyle = '#e8f1ff'; x.fillText(R.fid, P, Y + 244 * k);
  const rows = uniq ? [`${WI.bits.toFixed(1)} bits of identifying information`, `Gives me away most: ${(R.top3 || []).slice(0, 2).join(' and ')}`, WI.preset ? `Simulated as: ${WI.preset}` : `${R.nsig} signals read without asking`, `Browser: ${R.browser.split(',')[0]} on ${R.os.split(' ')[0]}`] : profile ? R.facts.slice(0, 5).map(f => `${f[0]}: ${f[1]}`) : [`GPU: ${shortGpu(R.g.renderer)}`, `${R.fl.length} fonts · ${R.scr.w}×${R.scr.h}`, `Time zone: ${R.tz.timeZone}`, `${R.nsig} signals read without asking`];
  x.font = F(500, 26); x.fillStyle = '#c8cff5';
  const maxc = fmt === 'x' ? 54 : 50;
  rows.forEach((t, i) => x.fillText(t.length > maxc ? t.slice(0, maxc - 1) + '…' : t, P, Y + 314 * k + i * 42 * k));
  x.fillStyle = '#7ee0ff'; x.font = F(700, 26); x.fillText(`Check yours → ${location.host || 'mirror'}`, P, H - 45);
  x.fillStyle = '#ffffff70'; x.font = F(600, 22); x.textAlign = 'right'; x.fillText('mirror.', W - 60, H - 45);
  c.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `${uniq ? 'my-uniqueness' : profile ? 'my-tracker-profile' : 'my-browser-fingerprint'}-${fmt === 'x' ? '16x9' : fmt === 'sq' ? '1x1' : '9x16'}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast('Card saved. Post it and see who else gets recognized.'); }, 'image/png');
}
// ---------- full JSON report ----------
$('#json').onclick = () => {
  if (!R.fid) return;
  const rep = {
    tool: 'mirror.', generated: new Date().toISOString(), note: 'Computed locally in your browser. Nothing was sent anywhere.',
    fingerprint: R.fid, signals_in_id: R.idParts, collection_ms: R.ms,
    anti_fingerprinting_noise: R.noise,
    signals: {
      gpu: { renderer: R.g.renderer, vendor: R.g.vendor, webgl_extensions: R.g.exts, max_texture: R.g.maxTex },
      canvas_hash: R.cv.hash, audio_signal: R.au.sum,
      fonts: R.fl, speech_voices: R.vl.map(v => `${v.name} (${v.lang})`),
      time_zone: R.tz.timeZone, locale: R.tz.locale, utc_offset: R.off, languages: R.langs,
      screen: R.scr, window: { w: innerWidth, h: innerHeight },
      cpu_threads: navigator.hardwareConcurrency || null, memory_gb: navigator.deviceMemory || null,
      os: R.os, browser: R.browser, media_devices: R.dev,
      touch_points: navigator.maxTouchPoints, pointer_fine: mq('(pointer:fine)'),
      dark_mode: mq('(prefers-color-scheme: dark)'), reduced_motion: mq('(prefers-reduced-motion: reduce)'),
      math: mathPrint(), storage_quota_bytes: R.quota, do_not_track: navigator.doNotTrack
    },
    inferred_profile: Object.fromEntries(R.facts.map(([k, v, c]) => [k, { value: v, confidence: c }])),
  };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(rep, null, 2)], { type: 'application/json' }));
  a.download = `mirror-report-${R.fid.replace(/ /g, '').slice(0, 8)}.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast('Full report saved as JSON.');
};

let shareMode = 'id', lastFocus = null;
function openSheet(el) { lastFocus = document.activeElement; el.hidden = false; el.querySelector('button').focus(); }
function closeSheet(el) { el.hidden = true; lastFocus && lastFocus.focus(); }
$('#share1').onclick = () => { if (R.fid) { shareMode = 'id'; openSheet($('#fmt')); } };
$('#share2').onclick = () => { if (R.fid) { shareMode = 'profile'; openSheet($('#fmt')); } };
$('#share3').onclick = () => { if (R.fid) { shareMode = 'uniq'; openSheet($('#fmt')); } };
document.querySelectorAll('.fbtn').forEach(b => b.onclick = () => { closeSheet($('#fmt')); shareCard(shareMode, b.dataset.f); });
$('#fmt-x').onclick = () => closeSheet($('#fmt'));
$('#fmt').addEventListener('click', e => { if (e.target.id === 'fmt') closeSheet($('#fmt')); });
addEventListener('keydown', e => { if (e.key === 'Escape') { if (!$('#fmt').hidden) closeSheet($('#fmt')); if (!$('#tv').hidden) closeTV(); } });

// ---------- private-window comparison ----------
$('#otherid').addEventListener('input', e => {
  const v = e.target.value.toUpperCase().replace(/[^0-9A-F]/g, ''), me = (R.fid || '').replace(/ /g, ''), box = $('#verdict');
  document.body.classList.remove('caught');
  if (v.length < 16) { box.className = 'verdict'; box.textContent = v.length ? `${16 - v.length} more characters…` : 'Waiting for the second ID'; return; }
  if (v.slice(0, 16) === me) { box.className = 'verdict same'; box.textContent = 'Same ID. Private mode did not hide you.'; document.body.classList.add('caught'); chime(); caughtWave(); }
  else if (v.slice(0, 16) === (R.hwid || '').replace(/ /g, '')) { box.className = 'verdict same'; box.textContent = 'Same hardware ID. Switching browsers did not hide your device.'; document.body.classList.add('caught'); chime(); caughtWave(); }
  else { box.className = 'verdict diff'; box.textContent = 'Different ID. Your browser is resisting fingerprinting. Nice.'; }
});
function compareFromHash() {
  const m = location.hash.match(/compare=([0-9A-Fa-f]{16})/);
  if (!m) return;
  const inp = $('#otherid');
  inp.value = m[1].toUpperCase().match(/.{4}/g).join(' ');
  inp.dispatchEvent(new Event('input'));
  setTimeout(() => $('#test').scrollIntoView({ behavior: RM() ? 'auto' : 'smooth' }), 600);
}
addEventListener('hashchange', compareFromHash);
$('#copyid').onclick = async () => {
  try { await navigator.clipboard.writeText(R.fid || ''); toast('ID copied. Now open this page in a private window.'); }
  catch (_) { toast('Select the ID and copy it manually'); }
};

// ---------- weight of each signal ----------
// ● = measured in EFF Panopticlick (2010); others are rough estimates
const WT = { fonts: [13.9, 'Installed fonts', 1], browser: [10, 'Browser build', 1], screen: [4.8, 'Screen', 1], tz: [3, 'Time zone', 1],
  canvas: [8, 'Hidden canvas'], gpu: [6, 'Graphics card'], lang: [5, 'Languages'], audio: [5, 'Audio stack'], voices: [4, 'Speech voices'],
  emoji: [3, 'Emoji rendering'], hw: [3, 'CPU & memory'], os: [2.5, 'System'], keyboard: [2, 'Keyboard layout'], webgpu: [2, 'WebGPU'],
  intl: [2, 'Number & date format'], gl: [2, 'WebGL features'], codecs: [1.5, 'Codecs'], media: [1.5, 'Cameras & mics'],
  display: [1, 'Display'], timer: [1, 'Timer precision'], input: [1, 'Touch & pointer'], prefs: [1, 'Display prefs'], math: [1, 'Math quirks'], pdf: [.3, 'PDF viewer'] };
const TIPS = {
  fonts: 'Remove fonts you no longer use. Safari and Firefox in strict mode hide most of them.',
  browser: 'Stay on the newest version. The latest build is the most common one.',
  canvas: 'Brave and Firefox with resistFingerprinting add noise to canvas reads.',
  screen: 'Hard to change. Tor and Firefox resistFingerprinting report a standard size.',
  gpu: 'Firefox resistFingerprinting and Tor hide your exact GPU model.',
  lang: 'Keep one or two languages in browser settings instead of a long list.',
  tz: 'A VPN does not change this. Tor reports UTC for everyone.',
  audio: 'Brave adds noise to audio processing.',
  voices: 'Remove speech voices you do not use in your system settings.',
  hw: 'Brave and Tor report a common value instead of your real core count.',
  keyboard: 'Firefox and Safari do not expose the keyboard layout API.',
  emoji: 'Keep your OS updated so your emoji look like everyone else\'s.',
};
const COMMON_SCREENS = ['1920x1080', '1366x768', '1536x864', '1440x900', '1280x720', '2560x1440', '1280x800', '390x844', '393x873', '414x896', '375x812', '1680x1050', '1512x982'];
const BIG_TZ = ['America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Europe/Paris', 'Asia/Kolkata', 'Asia/Shanghai', 'Asia/Tokyo'];
function rarity(k) {
  const { fl, g, scr, langs, tz, vl, noise, kb } = R;
  if ((k === 'canvas' && noise.canvas) || (k === 'audio' && noise.audio) || (k === 'emoji' && noise.emoji)) return [.2, 'randomized by your browser'];
  switch (k) {
    case 'fonts': return fl.length > 60 ? [1.5, `${fl.length} fonts is far more than usual`] : fl.length > 35 ? [1.2, `${fl.length} fonts detected`] : fl.length < 8 ? [.8, 'very few fonts exposed'] : [1, `${fl.length} fonts detected`];
    case 'gpu': return /Apple GPU|llvmpipe|SwiftShader|blocked/i.test(g.renderer) ? [.7, 'generic GPU name'] : [1.4, `exact model: ${shortGpu(g.renderer)}`];
    case 'screen': return COMMON_SCREENS.includes(`${scr.w}x${scr.h}`) ? [.8, `${scr.w}×${scr.h} is common`] : [1.4, `${scr.w}×${scr.h} is uncommon`];
    case 'lang': return langs.length > 2 ? [1.5, `${langs.length} languages in a specific order`] : langs.length > 1 ? [1.25, `${langs.join(', ')}`] : [.8, langs[0]];
    case 'tz': return BIG_TZ.includes(tz.timeZone) ? [.8, tz.timeZone] : [1.25, `${tz.timeZone} is a smaller crowd`];
    case 'voices': return vl.length > 30 ? [1.3, `${vl.length} voices installed`] : vl.length ? [1, `${vl.length} voices`] : [.4, 'none exposed'];
    case 'hw': return (navigator.hardwareConcurrency || 0) >= 12 ? [1.3, `${navigator.hardwareConcurrency} threads is high-end`] : [1, `${navigator.hardwareConcurrency || '?'} threads`];
    case 'keyboard': return /hidden/.test(kb) ? [.3, 'hidden'] : /QWERTY/.test(kb) ? [.8, kb] : [1.4, kb];
    case 'webgpu': return /not supported|blocked|no adapter/.test(R.wg) ? [.5, R.wg] : [1, R.wg];
    default: return [1, ''];
  }
}
function weights() {
  const keys = R.idParts.filter(k => WT[k]);
  const rows = keys.map(k => { const [b, name, studied] = WT[k]; const [r, why] = rarity(k); return { k, name, b, studied, r, why, score: b * r }; });
  const sorted = [...rows].sort((a, b) => b.b - a.b);
  const total = rows.reduce((a, x) => a + x.b, 0);
  // green for weak signals, red for the ones that single you out
  const hue = b => Math.round(145 - Math.min(1, b / 14) * 145);
  $('#bars').innerHTML = sorted.map(x => `<div class="barw"><button class="bar${x.r < .5 ? ' off' : ''}" aria-expanded="false" data-k="${x.k}"><span class="bn"><i class="chev" aria-hidden="true">›</i>${esc(x.name)}${x.studied ? ' <i title="Measured in EFF Panopticlick">●</i>' : ''}</span><span class="bt"><span style="--w:${(x.b / 14 * 100).toFixed(1)}%;background:linear-gradient(90deg,hsl(${hue(x.b) + 25} 80% 52%),hsl(${hue(x.b)} 78% 50%))"></span></span><span class="bv">≈ ${x.b} bits</span></button><div class="bar-x" hidden><div class="bx-v"><span>Your value</span><b>${esc(sigValue(x.k))}</b></div><pre><code>${esc(SIGCODE[x.k] || '')}</code></pre></div></div>`).join('')
    + `<div class="bar total"><span class="bn">Plain sum</span><span class="bt"><span style="--w:100%"></span><i class="b33" style="left:${(33 / total * 100).toFixed(1)}%" title="33 bits: one person on Earth">33</i></span><span class="bv">≈ <b id="bitsum">0</b> bits</span></div>`;
  $('#bars').querySelectorAll('button.bar').forEach(b => b.onclick = () => {
    const x = b.nextElementSibling, open = x.hidden; x.hidden = !open; b.setAttribute('aria-expanded', open); b.classList.toggle('open', open); click();
  });
  onceVisible($('#bars'), () => tween(0, total, 1600, v => { $('#bitsum').textContent = Math.round(v); }), .4);
  const top = [...rows].sort((a, b) => b.score - a.score).slice(0, 3);
  $('#top3').innerHTML = top.map(x => `<li><b>${esc(x.name)}</b><span class="tw">${esc(x.why || '≈ ' + x.b + ' bits')}</span><p>${esc(TIPS[x.k] || 'Browsers with fingerprinting protection blur this signal.')}</p><button class="fix" data-k="${x.k}">Fix this →</button></li>`).join('');
  $('#top3').querySelectorAll('.fix').forEach(b => b.onclick = () => fixThis(b.dataset.k));
  R.top3 = top.map(x => x.name);
}

// ---------- tracker view (simulation) ----------
function segments() {
  const S = [], f = Object.fromEntries((R.facts || []).map(x => [x[0], x[1]]));
  if (/Mac|iPhone|iPad/.test(f.Device || '')) S.push('apple_owner');
  if (/High-end/.test(f.Machine || '') || R.scr.dpr >= 2) S.push('premium_device');
  if (/developer/.test(f.Software || '')) S.push('software_developer');
  if (/Adobe/.test(f.Software || '')) S.push('creative_pro');
  if (R.langs.length > 1) S.push('multilingual');
  const h = new Date().getHours(); S.push(h < 5 || h >= 23 ? 'night_owl' : h < 9 ? 'early_riser' : 'daytime_browser');
  if (mq('(prefers-color-scheme: dark)')) S.push('dark_mode_user');
  if (navigator.maxTouchPoints > 0 && !mq('(pointer:fine)')) S.push('mobile_first'); else S.push('desktop_worker');
  S.push('region:' + R.tz.timeZone.split('/')[0].toLowerCase());
  return S;
}
let tvTimer = null;
function closeTV() { $('#tv').hidden = true; clearTimeout(tvTimer); document.body.style.overflow = ''; lastFocus && lastFocus.focus(); }
function openTV() {
  if (!R.fid) return;
  lastFocus = document.activeElement; $('#tv').hidden = false; document.body.style.overflow = 'hidden'; $('#tv-x').focus();
  let seed = parseInt(R.fid.replace(/ /g, '').slice(8, 16), 16) || 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const seg = segments(), prem = seg.includes('premium_device') ? 1.6 : 1;
  const bidders = ['Google DV360 · display', 'Meta Audience Network · social', 'Amazon DSP · retail', 'Criteo · retargeting', 'The Trade Desk · programmatic', 'Yandex Direct · CIS'].map(n => [n, +((0.2 + rnd() * 3.2) * prem).toFixed(2)]);
  const sorted = [...bidders].sort((a, b) => b[1] - a[1]), clear = +(sorted[1][1] + 0.01).toFixed(2);
  const L = [
    ['dim', '> incoming page view'],
    ['', `device_id     ${R.fid}`], ['', `hardware_id   ${R.hwid}`], ['', `cookies       none  (not needed)`],
    ['dim', '> enrich from fingerprint'],
    ['', `device        ${(R.facts.find(f => f[0] === 'Device') || [, '?'])[1]}`],
    ['', `location      ${R.tz.timeZone}  (UTC${R.off >= 0 ? '+' : ''}${R.off})`],
    ['', `languages     ${R.langs.join(', ')}`],
    ['', `seen_before   ${Math.floor(rnd() * 40) + 3} visits on partner sites  (simulated)`],
    ['dim', '> segments'], ...seg.map(x => ['seg', `  + ${x}`]),
    ['dim', `> bid request sent to ${bidders.length} bidders`],
    ...bidders.map(([n, p]) => ['bid', `  ${n.padEnd(24)} $${p.toFixed(2)} CPM`]),
    ['win', `> winner ${sorted[0][0]}  pays $${clear.toFixed(2)} CPM (second price)`],
    ['big', `> this visit sold for $${(clear / 1000).toFixed(5)}`],
    ['dim', '> you were never asked.']
  ];
  const pre = $('#tv-log'); pre.innerHTML = '';
  const fast = mq('(prefers-reduced-motion: reduce)'); let i = 0;
  const step = () => {
    if (i >= L.length || $('#tv').hidden) return;
    const [c, t] = L[i++], line = document.createElement('span'); line.className = 'tl ' + c; line.textContent = t + '\n'; pre.appendChild(line); pre.scrollTop = pre.scrollHeight;
    click(); if (c === 'big') chime();
    tvTimer = setTimeout(step, fast ? 0 : c === 'bid' ? 160 : c === 'dim' ? 380 : 120);
  };
  step();
}
$('#tvbtn').onclick = openTV; $('#tv-x').onclick = closeTV;
$('#tv').addEventListener('click', e => { if (e.target.id === 'tv') closeTV(); });

// ---------- sound toggle + replay ----------
async function replayScan() {
  if (!R.fid) return;
  logEl.innerHTML = ''; $('#fid').textContent = '•••• •••• •••• ••••'; $('#scanstate').innerHTML = '<i class="spin"></i>scanning'; $('#scanstate').classList.remove('done');
  for (const [l, v] of LOG) { const li = document.createElement('li'); li.innerHTML = `<b>✓</b> ${esc(l)} <span>${esc(v)}</span>`; logEl.appendChild(li); while (logEl.children.length > 6) logEl.firstChild.remove(); click(); await new Promise(r => setTimeout(r, 70)); }
  scramble($('#fid'), R.fid); chime();
  $('#scanstate').innerHTML = '<i class="spin"></i>match ready'; $('#scanstate').classList.add('done');
  $('#idcard').classList.remove('flash'); void $('#idcard').offsetWidth; $('#idcard').classList.add('flash');
}
$('#snd').onclick = () => {
  soundOn = !soundOn;
  if (soundOn && !AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {} }
  if (AC && AC.state === 'suspended') AC.resume();
  $('#snd').innerHTML = soundOn ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>' : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6M16 9l6 6"/></svg>'; $('#snd').setAttribute('aria-pressed', soundOn); $('#snd').setAttribute('aria-label', soundOn ? 'Turn sound off' : 'Turn sound on');
  if (soundOn) { toast('Sound on. Replaying the scan.'); replayScan(); }
};

// ---------- section tint ----------
const tint = $('#tint');
const tio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) tint.dataset.z = e.target.id || 'hero'; }), { rootMargin: '-45% 0px -45% 0px' });
document.querySelectorAll('main > section').forEach(s => tio.observe(s));

// ---------- scanner lens + hold to rescan ----------
const pw = document.querySelector('.print-wrap'), pi = document.querySelector('.pi');
const coarse = mq('(pointer: coarse)');
$('#holdhint').textContent = coarse ? 'Hold your finger on the print' : 'Hold the print to rescan';
pw.addEventListener('pointermove', e => { const r = pi.getBoundingClientRect(); pi.style.setProperty('--mx', (e.clientX - r.left) + 'px'); pi.style.setProperty('--my', (e.clientY - r.top) + 'px'); pi.classList.add('lit'); });
pw.addEventListener('pointerleave', () => pi.classList.remove('lit'));
let hold = null;
function endHold() { if (hold) { cancelAnimationFrame(hold.raf); hold = null; } pw.classList.remove('holding'); pw.style.setProperty('--p', 0); }
pw.addEventListener('pointerdown', e => {
  if (!R.fid) return; e.preventDefault();
  pw.setPointerCapture && pw.setPointerCapture(e.pointerId);
  pw.classList.add('holding'); const t0h = performance.now(); let lastTick = 0;
  const loop = now => {
    const p = Math.min(1, (now - t0h) / 1200); pw.style.setProperty('--p', p);
    if (now - lastTick > 90) { click(); lastTick = now; }
    if (p >= 1) { endHold(); navigator.vibrate && navigator.vibrate([30, 40, 60]); toast(`Read. ${R.fid}`); replayScan(); return; }
    hold.raf = requestAnimationFrame(loop);
  };
  hold = { raf: requestAnimationFrame(loop) };
});
['pointerup', 'pointercancel'].forEach(ev => pw.addEventListener(ev, endHold));
pw.addEventListener('contextmenu', e => e.preventDefault());

// ---------- reveal on scroll ----------
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- live proof: requests to other servers ----------
let netc = 0;
try {
  new PerformanceObserver(list => {
    for (const e of list.getEntries()) { try { if (new URL(e.name).origin !== location.origin) netc++; } catch (_) {} }
    $('#netcount').textContent = netc;
  }).observe({ type: 'resource', buffered: true });
} catch (_) {}

let tt;
function toast(m) { const t = $('#toast'); t.textContent = m; t.hidden = false; clearTimeout(tt); tt = setTimeout(() => t.hidden = true, 3400); }


// ---------- worth calculator ----------
function worthCalc() {
  const sl = $('#w-pages'), dv = $('#w-dev'), CPM = 2;
  let shown = 0;
  const money = v => '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function calc(first) {
    const p = +sl.value, d = +dv.value;
    $('#w-pv').textContent = p; $('#w-dv').textContent = d;
    // fill the track up to the thumb
    [sl, dv].forEach(r => r.style.setProperty('--pct', ((r.value - r.min) / (r.max - r.min) * 100) + '%'));
    const yr = p * CPM / 1000 * 365 * d;
    $('#w-cmp').textContent = `≈ ${Math.round(yr / 4)} cups of coffee · ${(yr / 15.49).toFixed(1)} months of Netflix`;
    $('#w-note').innerHTML = `That's what ad networks earn from tracking <em>one person</em> across <em>${d} device${d > 1 ? 's' : ''}</em> in a year.`;
    const from = shown;
    tween(from, yr, first ? 1400 : 450, v => { shown = v; $('#w-num').textContent = Math.round(v).toLocaleString('en-US'); $('#w-year').textContent = money(v); });
  }
  sl.oninput = () => calc(); dv.oninput = () => calc();
  onceVisible($('#worth .worth-calc'), () => calc(true));
  [sl, dv].forEach(r => r.style.setProperty('--pct', ((r.value - r.min) / (r.max - r.min) * 100) + '%'));
}

// ---------- what if: toggle signals ----------
const PRESETS = {
  chrome: [],
  brave: ['canvas', 'audio', 'fonts', 'hw', 'voices', 'emoji'],
  firefox: ['canvas', 'audio', 'fonts', 'tz', 'screen', 'hw', 'gpu', 'webgpu', 'keyboard'],
  tor: null // everything off except a few standardized low-bit signals
};
const TOR_KEEP = ['input', 'prefs', 'math'];
const WI = { bits: 0, label: '', preset: '' };
const PRESET_NAMES = { chrome: '', brave: 'Brave Strict', firefox: 'Firefox RFP', tor: 'Tor Browser' };
function presetBits(p) { const keys = R.idParts.filter(k => WT[k]); return keys.reduce((a, k) => a + ((p === 'tor' ? TOR_KEEP.includes(k) : !PRESETS[p].includes(k)) ? WT[k][0] : 0), 0); }
const BIGN = [[1e24, 'septillion'], [1e21, 'sextillion'], [1e18, 'quintillion'], [1e15, 'quadrillion'], [1e12, 'trillion'], [1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']];
function bigName(n) {
  if (n < 1000) return Math.max(1, Math.round(n)).toLocaleString('en-US');
  for (const [v, w] of BIGN) if (n >= v) { const x = n / v; return `${x >= 100 ? Math.round(x) : x.toFixed(1)} ${w}`; }
}
function whatifInit() {
  const keys = R.idParts.filter(k => WT[k]);
  const box = $('#wi-toggles'), state = {};
  let shownBits = 0;
  keys.forEach(k => { state[k] = true; });
  box.innerHTML = keys.map(k => {
    const [b, name] = WT[k];
    return `<label class="wi-tog"><input type="checkbox" class="sw-in" data-k="${k}" checked><span class="sw" aria-hidden="true"></span><span class="wi-name">${esc(name)}</span><span class="wi-bits">${b}b</span></label>`;
  }).join('');
  const inputs = [...box.querySelectorAll('input')];
  inputs.forEach(cb => cb.onchange = () => { state[cb.dataset.k] = cb.checked; setPreset(null); update(); });
  function update() {
    let bits = 0;
    keys.forEach(k => { if (state[k]) bits += WT[k][0]; });
    inputs.forEach(cb => { cb.checked = state[cb.dataset.k]; cb.closest('.wi-tog').classList.toggle('off', !cb.checked); });
    $('#wi-fill').style.width = Math.min(100, bits / 84 * 100).toFixed(1) + '%';
    $('#wi-fill').classList.toggle('safe', bits < 33);
    WI.bits = bits; WI.label = 'I\'m 1 in ' + bigName(Math.pow(2, bits)) + '.';
    $('#wi-uniq').classList.remove('bump'); void $('#wi-uniq').offsetWidth; $('#wi-uniq').classList.add('bump');
    tween(shownBits, bits, 650, v => {
      shownBits = v;
      $('#wi-uniq').textContent = '1 in ' + bigName(Math.pow(2, v));
      $('#wi-bitsum').textContent = `${v.toFixed(1)} bits · ${v >= 33 ? 'unique among everyone on Earth' : 'you blend into a crowd'}`;
    });
  }
  function setPreset(p) {
    WI.preset = p ? PRESET_NAMES[p] : '';
    document.querySelectorAll('.pre').forEach(b => { const on = b.dataset.p === p; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  }
  document.querySelectorAll('.pre').forEach(b => b.onclick = () => {
    const p = b.dataset.p, offs = PRESETS[p];
    keys.forEach(k => { state[k] = p === 'tor' ? TOR_KEEP.includes(k) : !offs.includes(k); });
    setPreset(p); update();
    if (!RM()) inputs.forEach((cb, i) => { const l = cb.closest('.wi-tog'); l.classList.remove('flip'); setTimeout(() => { void l.offsetWidth; l.classList.add('flip'); }, i * 25); });
  });
  update();
}

// ---------- incognito comparison ----------
function incogInit() {
  const el1 = $('#inc-id1'), el2 = $('#inc-id2'), id = R.fid || '';
  el1.textContent = el2.textContent = RM() ? id : '';
  onceVisible($('.incog-compare'), () => {
    if (RM()) return;
    let i = 0;
    [el1, el2].forEach(e => e.classList.add('typing'));
    const t = setInterval(() => {
      i++; el1.textContent = el2.textContent = id.slice(0, i);
      if (i % 2) click();
      if (i >= id.length) { clearInterval(t); [el1, el2].forEach(e => e.classList.remove('typing')); $('.incog-compare').classList.add('matched'); }
    }, 55);
  }, .5);
  onceVisible($('.inc-table'), () => $('.inc-table').classList.add('in'), .5);
}

// ---------- QR code (real encoder: byte mode, ECC level M, versions 1-10) ----------
const QR = (() => {
  const ECC = [0, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26], BLK = [0, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5];
  const ALIGN = [0, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];
  const mul = (x, y) => { let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z; };
  const rawModules = v => { let r = (16 * v + 128) * v + 64; if (v >= 2) { const n = Math.floor(v / 7) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36; } return r; };
  const dataCw = v => Math.floor(rawModules(v) / 8) - ECC[v] * BLK[v];
  function rsDivisor(deg) { const r = new Array(deg).fill(0); r[deg - 1] = 1; let root = 1; for (let i = 0; i < deg; i++) { for (let j = 0; j < r.length; j++) { r[j] = mul(r[j], root); if (j + 1 < r.length) r[j] ^= r[j + 1]; } root = mul(root, 2); } return r; }
  function rsRem(data, div) { const r = div.map(() => 0); for (const b of data) { const f = b ^ r.shift(); r.push(0); div.forEach((c, i) => r[i] ^= mul(c, f)); } return r; }
  return function encode(text) {
    const bytes = [...new TextEncoder().encode(text)];
    let ver = 1; while (ver <= 10 && 4 + (ver < 10 ? 8 : 16) + bytes.length * 8 > dataCw(ver) * 8) ver++;
    if (ver > 10) throw new Error('QR: text too long');
    const bits = [], put = (v, n) => { for (let i = n - 1; i >= 0; i--) bits.push((v >>> i) & 1); };
    put(4, 4); put(bytes.length, ver < 10 ? 8 : 16); bytes.forEach(b => put(b, 8));
    const cap = dataCw(ver) * 8;
    put(0, Math.min(4, cap - bits.length)); put(0, (8 - bits.length % 8) % 8);
    for (let p = 0xEC; bits.length < cap; p ^= 0xEC ^ 0x11) put(p, 8);
    const data = []; for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((a, b) => a << 1 | b, 0));
    // split into blocks, add error correction, interleave
    const nb = BLK[ver], ecl = ECC[ver], raw = Math.floor(rawModules(ver) / 8), nShort = nb - raw % nb, shortLen = Math.floor(raw / nb), div = rsDivisor(ecl), blocks = [];
    for (let i = 0, k = 0; i < nb; i++) { const d = data.slice(k, k + shortLen - ecl + (i < nShort ? 0 : 1)); k += d.length; const e = rsRem(d, div); if (i < nShort) d.push(0); blocks.push(d.concat(e)); }
    const cw = []; for (let i = 0; i < blocks[0].length; i++) blocks.forEach((b, j) => { if (i !== shortLen - ecl || j >= nShort) cw.push(b[i]); });
    // module grid
    const N = ver * 4 + 17, M = [...Array(N)].map(() => Array(N).fill(false)), F = [...Array(N)].map(() => Array(N).fill(false));
    const set = (x, y, d) => { M[y][x] = d; F[y][x] = true; };
    for (let i = 0; i < N; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    for (const [cx, cy] of [[3, 3], [N - 4, 3], [3, N - 4]]) for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const x = cx + dx, y = cy + dy, d = Math.max(Math.abs(dx), Math.abs(dy)); if (x >= 0 && x < N && y >= 0 && y < N) set(x, y, d !== 2 && d !== 4); }
    const al = ALIGN[ver], L = al.length;
    for (let i = 0; i < L; i++) for (let j = 0; j < L; j++) { if ((i === 0 && j === 0) || (i === 0 && j === L - 1) || (i === L - 1 && j === 0)) continue; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(al[i] + dx, al[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); }
    const format = mask => {
      const d = (0 << 3) | mask; let r = d; for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
      const b = ((d << 10) | r) ^ 0x5412, g = i => ((b >>> i) & 1) === 1;
      for (let i = 0; i <= 5; i++) set(8, i, g(i));
      set(8, 7, g(6)); set(8, 8, g(7)); set(7, 8, g(8));
      for (let i = 9; i < 15; i++) set(14 - i, 8, g(i));
      for (let i = 0; i < 8; i++) set(N - 1 - i, 8, g(i));
      for (let i = 8; i < 15; i++) set(8, N - 15 + i, g(i));
      set(8, N - 8, true);
    };
    format(0);
    if (ver >= 7) { let r = ver; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25); const b = ver << 12 | r; for (let i = 0; i < 18; i++) { const bit = ((b >>> i) & 1) === 1, a = N - 11 + i % 3, c = Math.floor(i / 3); set(a, c, bit); set(c, a, bit); } }
    let k = 0;
    for (let right = N - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let v = 0; v < N; v++) for (let j = 0; j < 2; j++) {
        const x = right - j, up = ((right + 1) & 2) === 0, y = up ? N - 1 - v : v;
        if (!F[y][x] && k < cw.length * 8) { M[y][x] = ((cw[k >>> 3] >>> (7 - (k & 7))) & 1) === 1; k++; }
      }
    }
    const MASKS = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, x => x % 3 === 0, (x, y) => (x + y) % 3 === 0, (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => x * y % 2 + x * y % 3 === 0, (x, y) => (x * y % 2 + x * y % 3) % 2 === 0, (x, y) => ((x + y) % 2 + x * y % 3) % 2 === 0];
    const applyMask = m => { for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!F[y][x] && MASKS[m](x, y)) M[y][x] = !M[y][x]; };
    const penalty = () => {
      let p = 0, dark = 0;
      for (let a = 0; a < 2; a++) for (let i = 0; i < N; i++) { let run = 1; for (let j = 1; j <= N; j++) { const cur = j < N && (a ? M[j][i] : M[i][j]), prev = a ? M[j - 1][i] : M[i][j - 1]; if (j < N && cur === prev) run++; else { if (run >= 5) p += run - 2; run = 1; } } }
      for (let y = 0; y < N - 1; y++) for (let x = 0; x < N - 1; x++) { const c = M[y][x]; if (c === M[y][x + 1] && c === M[y + 1][x] && c === M[y + 1][x + 1]) p += 3; }
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (M[y][x]) dark++;
      return p + Math.floor(Math.abs(dark * 20 - N * N * 10) / (N * N)) * 10;
    };
    let best = 0, bestP = Infinity;
    for (let m = 0; m < 8; m++) { applyMask(m); format(m); const pn = penalty(); if (pn < bestP) { bestP = pn; best = m; } applyMask(m); }
    applyMask(best); format(best);
    return M;
  };
})();
function qrGen() {
  const c = $('#qr'); if (!c.getContext) return;
  const base = location.href.replace(/#.*/, '');
  const url = `${base}#compare=${(R.fid || '').replace(/ /g, '')}`;
  let M; try { M = QR(url); } catch (_) { M = QR(base); }
  const N = M.length, q = 4, k = Math.max(2, devicePixelRatio || 1), css = 232, cell = css / (N + q * 2);
  c.width = css * k; c.height = css * k;
  const x = c.getContext('2d'); x.scale(k, k);
  x.fillStyle = '#fff'; x.fillRect(0, 0, css, css);
  x.fillStyle = '#0c1030';
  for (let r = 0; r < N; r++) for (let col = 0; col < N; col++) if (M[r][col]) x.fillRect((col + q) * cell, (r + q) * cell, cell + .35, cell + .35);
  c.dataset.url = url;
}

// ---------- weight → fix this ----------
const FIXMAP = { fonts: 2, voices: 2, emoji: 2, keyboard: 2, lang: 3, browser: 1, canvas: 1, audio: 1, gpu: 1, hw: 1, screen: 1, tz: 4, webgpu: 1 };
function fixThis(k) {
  const tip = $('#tip-' + (FIXMAP[k] || 1));
  $('#hide').scrollIntoView({ behavior: RM() ? 'auto' : 'smooth', block: 'start' });
  setTimeout(() => {
    [tip, $('#cmp')].forEach(el => { el.classList.remove('hl'); void el.offsetWidth; el.classList.add('hl'); });
    setTimeout(() => [tip, $('#cmp')].forEach(el => el.classList.remove('hl')), 2600);
  }, RM() ? 0 : 700);
}

// ---------- comparison table: column hover ----------
(() => {
  const t = document.querySelector('.cmp table'); if (!t) return;
  const cells = [...t.querySelectorAll('th,td')];
  const clear = () => cells.forEach(c => c.classList.remove('col'));
  t.addEventListener('mouseover', e => {
    const c = e.target.closest('th,td'); if (!c || c.cellIndex === 0) return clear();
    clear(); t.querySelectorAll('tr').forEach(r => r.cells[c.cellIndex] && r.cells[c.cellIndex].classList.add('col'));
  });
  t.addEventListener('mouseleave', clear);
})();

// ---------- scroll progress ----------
(() => {
  const bar = $('#prog'); let raf = 0;
  const upd = () => { raf = 0; const h = document.documentElement, max = h.scrollHeight - h.clientHeight; bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`; };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
  upd();
})();


// ---------- ads a tracker would show (example) ----------
const ADMAP = { apple_owner: ['AirPods & Apple accessories', '🎧'], premium_device: ['High-end laptops', '💻'], software_developer: ['Cloud hosting & dev tools', '⌨️'], creative_pro: ['Design software & stock photos', '🎨'], multilingual: ['Language apps & flights abroad', '✈️'], night_owl: ['Late-night food delivery', '🍕'], early_riser: ['Fitness apps & coffee subscriptions', '☕'], daytime_browser: ['Productivity software', '📈'], dark_mode_user: ['Gaming gear', '🎮'], mobile_first: ['Mobile games', '📱'], desktop_worker: ['Office chairs & monitors', '🖥️'] };
function adsInit() {
  const seg = segments(), out = [];
  seg.forEach(s => { if (ADMAP[s] && out.length < 4) out.push(ADMAP[s]); });
  const reg = seg.find(s => s.startsWith('region:'));
  if (reg && out.length < 5) out.push([`Deals near ${R.tz.timeZone.split('/').pop().replace(/_/g, ' ')}`, '📍']);
  $('#ads').innerHTML = out.map(([t, e], i) => `<span class="ad" style="--i:${i}"><i aria-hidden="true">${e}</i>${esc(t)}</span>`).join('');
  onceVisible($('.ads'), () => $('.ads').classList.add('in'), .4);
}

// ---------- personal advice for this browser ----------
function youTip() {
  const ua = navigator.userAgent, os = R.os.split(' ')[0];
  const isBrave = !!navigator.brave, isFF = /Firefox\//.test(ua), isEdge = /Edg\//.test(ua), isSafari = /Safari\//.test(ua) && !/Chrome|Chromium|Edg|OPR/.test(ua), isChrome = /Chrome\//.test(ua) && !isEdge && !isBrave;
  const keys = R.idParts.filter(k => WT[k]), now = keys.reduce((a, k) => a + WT[k][0], 0);
  const fmt = b => '1 in ' + bigName(Math.pow(2, b));
  let name, h, p, preset;
  if (isBrave) { name = 'Brave'; preset = 'tor'; h = `You're on Brave on ${os}. Good start.`; p = `Set Shields to "Strict" fingerprinting protection. For the strongest protection, Tor Browser would take you from ${fmt(presetBits('brave'))} to about ${fmt(presetBits('tor'))}.`; }
  else if (isFF) { name = 'Firefox'; preset = 'firefox'; h = `You're on Firefox on ${os}.`; p = `Turn on privacy.resistFingerprinting in about:config, or use Mullvad Browser. That would take you from ${fmt(now)} to about ${fmt(presetBits('firefox'))}.`; }
  else if (isSafari) { name = 'Safari'; preset = 'brave'; h = `You're on Safari on ${os}.`; p = `Safari's Private Browsing adds Advanced Fingerprinting Protection. For everyday browsing, Brave in strict mode would take you from ${fmt(now)} to about ${fmt(presetBits('brave'))}.`; }
  else { name = isEdge ? 'Edge' : isChrome ? 'Chrome' : 'this browser'; preset = 'brave'; h = `You're on ${name} on ${os}, with no fingerprint protection.`; p = `Switching to Brave with strict fingerprinting protection would take you from ${fmt(now)} to about ${fmt(presetBits('brave'))}. Tor Browser would get you close to ${fmt(presetBits('tor'))}.`; }
  $('#yt-h').textContent = h; $('#yt-p').textContent = p; $('#yt-ico').textContent = name[0];
  $('#you-tip').hidden = false;
  $('#yt-try').onclick = () => {
    $('#whatif').scrollIntoView({ behavior: RM() ? 'auto' : 'smooth' });
    setTimeout(() => { const b = document.querySelector(`.pre[data-p="${preset}"]`); b && b.click(); }, RM() ? 0 : 650);
  };
}

// ---------- send the compare link to another device ----------
$('#sendphone').onclick = async () => {
  const url = $('#qr').dataset.url || location.href;
  try {
    if (navigator.share) { await navigator.share({ title: 'mirror. compare my ID', url }); return; }
    await navigator.clipboard.writeText(url); toast('Link copied. Open it on your phone, it compares automatically.');
  } catch (e) { if (e && e.name !== 'AbortError') toast('Copy this link: ' + url); }
};

// ---------- extra motion inside sections ----------
function countUp(el) {
  const m = el.textContent.match(/^([^\d]*)([\d.,]+)(.*)$/); if (!m) return;
  const target = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length;
  tween(0, target, 1400, v => { el.textContent = m[1] + v.toFixed(dec) + m[3]; });
}
function motionInit() {
  // dossier facts appear one by one
  onceVisible($('#facts'), () => $('#facts').classList.add('in'), .2);
  // stat numbers count up
  document.querySelectorAll('.stat b:not(.d)').forEach(b => { if (!RM()) onceVisible(b, () => countUp(b), .6); });
  // comparison rows slide in
  onceVisible($('#cmp'), () => $('#cmp').classList.add('in'), .3);
  // tips: 3D tilt toward the pointer
  if (!RM() && mq('(hover:hover)')) document.querySelectorAll('.tips article, .stat, .you-tip').forEach(card => {
    card.addEventListener('pointermove', e => { const r = card.getBoundingClientRect(); card.style.setProperty('--tx', ((e.clientY - r.top) / r.height - .5) * -6 + 'deg'); card.style.setProperty('--ty', ((e.clientX - r.left) / r.width - .5) * 8 + 'deg'); card.classList.add('tilt'); });
    card.addEventListener('pointerleave', () => card.classList.remove('tilt'));
  });
  // worth: the dollar figure pulses as it changes
  ['#w-pages', '#w-dev'].forEach(id => $(id).addEventListener('input', () => { const d = $('#w-dollar'); d.classList.remove('bump'); void d.offsetWidth; d.classList.add('bump'); }));
  // weight bars: one shimmer pass after they grow
  onceVisible($('#bars'), () => setTimeout(() => $('#bars').classList.add('shine'), 1200), .3);
}

// ---------- your own value for each signal ----------
const SIGCODE = {
  fonts: "ctx.font = '72px \"Calibri\", monospace';\nctx.measureText('mmmmlli1WwQ').width  // differs → installed",
  browser: "navigator.userAgentData.getHighEntropyValues(['fullVersionList'])",
  canvas: "ctx.fillText('Cwm fjordbank glyphs 😃', 4, 46);\nsha256(canvas.toDataURL())",
  gpu: "gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)",
  lang: "navigator.languages",
  audio: "new OfflineAudioContext(1, 5000, 44100)  // oscillator → compressor\nsum(|samples|)",
  screen: "screen.width; screen.height; devicePixelRatio; screen.colorDepth",
  voices: "speechSynthesis.getVoices()",
  tz: "Intl.DateTimeFormat().resolvedOptions().timeZone",
  hw: "navigator.hardwareConcurrency; navigator.deviceMemory",
  emoji: "ctx.fillText('😀👍🏽🇺🇦🧑‍💻', 2, 4); sha256(canvas.toDataURL())",
  os: "navigator.userAgentData.getHighEntropyValues(['platformVersion', 'architecture'])",
  keyboard: "(await navigator.keyboard.getLayoutMap()).get('KeyQ')",
  webgpu: "(await navigator.gpu.requestAdapter()).info",
  intl: "new Intl.NumberFormat().format(1234567.89)",
  gl: "gl.getSupportedExtensions(); gl.getParameter(gl.MAX_TEXTURE_SIZE)",
  codecs: "video.canPlayType('video/mp4; codecs=\"hvc1\"')",
  media: "navigator.mediaDevices.enumerateDevices()  // counted, no prompt",
  display: "matchMedia('(color-gamut: p3)'); matchMedia('(dynamic-range: high)')",
  timer: "performance.now()  // smallest tick",
  input: "navigator.maxTouchPoints; matchMedia('(pointer: fine)')",
  prefs: "matchMedia('(prefers-color-scheme: dark)')",
  math: "Math.tan(-1e300); Math.sinh(1)  // last digits vary",
  pdf: "navigator.pdfViewerEnabled"
};
function sigValue(k) {
  const d = R.dev;
  switch (k) {
    case 'fonts': return `${R.fl.length} found: ${R.fl.slice(0, 10).join(', ')}${R.fl.length > 10 ? '…' : ''}`;
    case 'browser': return R.browser;
    case 'canvas': return `hash ${R.cv.hash}${R.noise.canvas ? ' (randomized)' : ''}`;
    case 'gpu': return R.g.renderer;
    case 'lang': return R.langs.join(', ');
    case 'audio': return `signal ${R.au.sum}${R.noise.audio ? ' (randomized)' : ''}`;
    case 'screen': return `${R.scr.w}×${R.scr.h} @${R.scr.dpr}x · ${R.scr.depth}-bit color`;
    case 'voices': return R.vl.length ? `${R.vl.length}: ${R.vl.slice(0, 4).map(v => v.name).join(', ')}${R.vl.length > 4 ? '…' : ''}` : 'none exposed';
    case 'tz': return `${R.tz.timeZone} · UTC${R.off >= 0 ? '+' : ''}${R.off}`;
    case 'hw': return `${navigator.hardwareConcurrency || '?'} threads · ${navigator.deviceMemory ? navigator.deviceMemory + ' GB+ RAM' : 'RAM hidden'}`;
    case 'emoji': return `hash ${R.em.hash}`;
    case 'os': return R.os;
    case 'keyboard': return R.kb;
    case 'webgpu': return R.wg;
    case 'intl': return R.it;
    case 'gl': return `${R.g.exts} extensions · max texture ${R.g.maxTex}`;
    case 'codecs': return R.cd.join(' · ') || 'none reported';
    case 'media': return d ? `${d.cams} cameras · ${d.mics} mics · ${d.spk} speakers` : 'hidden';
    case 'display': return R.dc;
    case 'timer': return R.tr;
    case 'input': return `${navigator.maxTouchPoints} touch points · ${mq('(pointer:fine)') ? 'mouse/trackpad' : 'touch'}`;
    case 'prefs': return `${mq('(prefers-color-scheme: dark)') ? 'dark' : 'light'} mode · motion ${RM() ? 'reduced' : 'full'}`;
    case 'math': return mathPrint();
    case 'pdf': return String(navigator.pdfViewerEnabled);
    default: return '';
  }
}

// ---------- hero: your values fly in and become the print ----------
function burstIn() {
  if (RM()) return;
  const box = $('#burst');
  const vals = [shortGpu(R.g.renderer), R.tz.timeZone, `${R.scr.w}×${R.scr.h}`, `${R.fl.length} fonts`, R.langs[0], `${navigator.hardwareConcurrency} threads`, 'canvas ' + R.cv.hash, R.os.split(' ')[0], R.browser.split(',')[0], `UTC${R.off >= 0 ? '+' : ''}${R.off}`, R.kb.split(' ')[0], `${R.vl.length} voices`, R.dc.split(' ')[0], 'audio ' + R.au.sum.slice(0, 6)];
  box.innerHTML = vals.map((v, i) => {
    const ang = (i / vals.length) * Math.PI * 2 + .2, r = 62 + (i % 3) * 8;
    const sx = Math.cos(ang) * r, sy = Math.sin(ang) * r;
    return `<span class="bp" style="--sx:${sx.toFixed(1)}vmin;--sy:${sy.toFixed(1)}vmin;--d:${(i * 70)}ms">${esc(String(v).slice(0, 20))}</span>`;
  }).join('');
  box.classList.add('go');
  setTimeout(() => { document.querySelector('.print').classList.add('absorb'); }, 900 + vals.length * 70);
  setTimeout(() => { box.innerHTML = ''; box.classList.remove('go'); }, 2600 + vals.length * 70);
}

// ---------- caught: one red scan sweeps the screen ----------
let caughtDone = false;
function caughtWave() {
  if (RM() || caughtDone) return; caughtDone = true;
  const c = $('#catch'); c.classList.remove('go'); void c.offsetWidth; c.classList.add('go');
  navigator.vibrate && navigator.vibrate([60, 40, 120]);
}

// logo sources show in a caption line under the marquee
(() => {
  const cap = $('#co-cap'), def = cap.textContent;
  document.querySelectorAll('a.co').forEach(a => {
    const on = () => { cap.textContent = a.querySelector('b').textContent + ': ' + a.title + ' ↗'; cap.classList.add('on'); };
    const off = () => { cap.textContent = def; cap.classList.remove('on'); };
    a.addEventListener('mouseenter', on); a.addEventListener('focus', on);
    a.addEventListener('mouseleave', off); a.addEventListener('blur', off);
  });
})();

run().catch(e => { console.error(e); $('#scanstate').textContent = 'error'; $('#idmeta').textContent = e.message; });
