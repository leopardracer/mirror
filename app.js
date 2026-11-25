// mirror. shows what any website can read about your browser without cookies.
// Everything runs locally. Nothing is stored and nothing is sent anywhere.
const $ = s => document.querySelector(s);
const t0 = performance.now();
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let slept = 0;
const sleep = ms => { slept += ms; return new Promise(r => setTimeout(r, ms)); };
const mq = q => matchMedia(q).matches;
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

  R = { g, tz, scr, cv, au, em, fl, vl, dev, browser, os, quota, langs, off, hi, wg, cd, kb, tr, dc, it, noise: { canvas: cvNoise, audio: auNoise, emoji: emNoise } };

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
  $('#idmeta').textContent = `${stable} signals · ${ms} ms · computed only in this tab`;
  $('#nsig').textContent = stable; $('#ms').textContent = `${ms} ms`;
  $('#myid').textContent = fid; $('#hwid').textContent = hwid; $('#myhw').textContent = hwid; $('#d-id').textContent = fid.slice(0, 9); $('#d-short').textContent = '#' + fid.slice(0, 4);
  $('#tg1').textContent = '🖥 ' + shortGpu(g.renderer);
  $('#tg2').textContent = '🕓 ' + tz.timeZone;
  $('#tg3').textContent = `🔤 ${fl.length} fonts found`;
  $('#tg4').textContent = `🖵 ${scr.w}×${scr.h}`;

  drawPrint(hash); particles(); marquee(); bento(); dossier(); vsInit(); weights(); madeStats();
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
}

// ---------- share card ----------
const FMT = {
  x: { W: 1200, H: 675, ring: [985, 360, 1], ty: 96, pad: 70, fs: 1 },
  sq: { W: 1080, H: 1080, ring: [850, 235, .92], ty: 470, pad: 70, fs: 1 },
  story: { W: 1080, H: 1920, ring: [540, 560, 1.75], ty: 1080, pad: 80, fs: 1.22 }
};
async function shareCard(profile, fmt = 'x') {
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
  x.fillStyle = '#aab3ff'; x.font = F(600, 26); x.fillText(profile ? 'What a tracker knows about me' : 'This website recognized me in ' + R.ms + ' ms', P, Y);
  x.fillStyle = '#fff'; x.font = F(800, 64); x.fillText(profile ? 'No name. No cookies.' : 'No cookies. No login.', P, Y + 76 * k);
  x.font = F('italic', 70, '"Instrument Serif", serif'); const tg = x.createLinearGradient(P, 0, P + 630 * k, 0); tg.addColorStop(0, '#9d8fff'); tg.addColorStop(1, '#5fe0ff');
  x.fillStyle = tg; x.fillText('Still knew it was me.', P, Y + 154 * k);
  x.font = F(700, 44, 'ui-monospace, Menlo, monospace'); x.fillStyle = '#e8f1ff'; x.fillText(R.fid, P, Y + 244 * k);
  const rows = profile ? R.facts.slice(0, 5).map(f => `${f[0]}: ${f[1]}`) : [`GPU: ${shortGpu(R.g.renderer)}`, `${R.fl.length} fonts · ${R.scr.w}×${R.scr.h}`, `Time zone: ${R.tz.timeZone}`, `${R.nsig} signals read without asking`];
  x.font = F(500, 26); x.fillStyle = '#c8cff5';
  const maxc = fmt === 'x' ? 54 : 50;
  rows.forEach((t, i) => x.fillText(t.length > maxc ? t.slice(0, maxc - 1) + '…' : t, P, Y + 314 * k + i * 42 * k));
  x.fillStyle = '#7ee0ff'; x.font = F(700, 26); x.fillText(`Check yours → ${location.host || 'mirror'}`, P, H - 45);
  x.fillStyle = '#ffffff70'; x.font = F(600, 22); x.textAlign = 'right'; x.fillText('mirror.', W - 60, H - 45);
  c.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `${profile ? 'my-tracker-profile' : 'my-browser-fingerprint'}-${fmt === 'x' ? '16x9' : fmt === 'sq' ? '1x1' : '9x16'}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast('Card saved. Post it and see who else gets recognized.'); }, 'image/png');
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
    motion: M.n ? motionStats() : null
  };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(rep, null, 2)], { type: 'application/json' }));
  a.download = `mirror-report-${R.fid.replace(/ /g, '').slice(0, 8)}.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast('Full report saved as JSON.');
};

let shareProfile = false, lastFocus = null;
function openSheet(el) { lastFocus = document.activeElement; el.hidden = false; el.querySelector('button').focus(); }
function closeSheet(el) { el.hidden = true; lastFocus && lastFocus.focus(); }
$('#share1').onclick = () => { if (R.fid) { shareProfile = false; openSheet($('#fmt')); } };
$('#share2').onclick = () => { if (R.fid) { shareProfile = true; openSheet($('#fmt')); } };
document.querySelectorAll('.fbtn').forEach(b => b.onclick = () => { closeSheet($('#fmt')); shareCard(shareProfile, b.dataset.f); });
$('#fmt-x').onclick = () => closeSheet($('#fmt'));
$('#fmt').addEventListener('click', e => { if (e.target.id === 'fmt') closeSheet($('#fmt')); });
addEventListener('keydown', e => { if (e.key === 'Escape') { if (!$('#fmt').hidden) closeSheet($('#fmt')); if (!$('#tv').hidden) closeTV(); } });

// ---------- private-window comparison ----------
$('#otherid').addEventListener('input', e => {
  const v = e.target.value.toUpperCase().replace(/[^0-9A-F]/g, ''), me = (R.fid || '').replace(/ /g, ''), box = $('#verdict');
  document.body.classList.remove('caught');
  if (v.length < 16) { box.className = 'verdict'; box.textContent = v.length ? `${16 - v.length} more characters…` : 'Waiting for the second ID'; return; }
  if (v.slice(0, 16) === me) { box.className = 'verdict same'; box.textContent = 'Same ID. Private mode did not hide you.'; document.body.classList.add('caught'); chime(); }
  else if (v.slice(0, 16) === (R.hwid || '').replace(/ /g, '')) { box.className = 'verdict same'; box.textContent = 'Same hardware ID. Switching browsers did not hide your device.'; document.body.classList.add('caught'); chime(); }
  else { box.className = 'verdict diff'; box.textContent = 'Different ID. Your browser is resisting fingerprinting. Nice.'; }
});
$('#copyid').onclick = async () => {
  try { await navigator.clipboard.writeText(R.fid || ''); toast('ID copied. Now open this page in a private window.'); }
  catch (_) { toast('Select the ID and copy it manually'); }
};

// ---------- motion signature ----------
const M = { pts: [], n: 0, dist: 0, top: 0, turns: 0, pauses: 0, last: null, lastAng: null, moves: 0 };
const pad = $('#pad'), px = pad.getContext('2d');
function sizePad() { const r = pad.getBoundingClientRect(), d = devicePixelRatio || 1; pad.width = r.width * d; pad.height = r.height * d; px.setTransform(d, 0, 0, d, 0, 0); px.lineCap = 'round'; px.lineJoin = 'round'; }
sizePad(); addEventListener('resize', sizePad);
addEventListener('pointermove', () => { M.moves++; }, { passive: true });
setInterval(() => { $('#movecount').textContent = M.moves.toLocaleString(); }, 500);
function onPad(e) {
  const r = pad.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, t = e.timeStamp;
  $('#padhint').hidden = true;
  if (M.last) {
    const dx = x - M.last.x, dy = y - M.last.y, dt = Math.max(1, t - M.last.t), d = Math.hypot(dx, dy);
    if (d < 0.5) return;
    const v = d / dt * 1000;
    if (dt > 250) M.pauses++;
    else {
      M.dist += d; M.time = (M.time || 0) + dt; M.top = Math.max(M.top, v);
      const ang = Math.atan2(dy, dx);
      if (M.lastAng !== null && d > 2) { let da = Math.abs(ang - M.lastAng); if (da > Math.PI) da = 2 * Math.PI - da; if (da > Math.PI / 2) M.turns++; }
      if (d > 2) M.lastAng = ang;
      const hue = 250 - Math.min(1, v / 2500) * 70;
      px.strokeStyle = `hsl(${hue} 90% 62%)`; px.lineWidth = 2 + Math.min(5, v / 600);
      px.beginPath(); px.moveTo(M.last.x, M.last.y); px.lineTo(x, y); px.stroke();
    }
  }
  M.pts.push([x, y]); if (M.pts.length > 4000) M.pts.shift();
  M.last = { x, y, t }; M.n++;
  if (M.n % 6 === 0) showMotion();
}
pad.addEventListener('pointermove', onPad);
pad.addEventListener('pointerdown', e => { M.last = null; onPad(e); });
pad.addEventListener('pointerleave', () => { M.last = null; M.lastAng = null; });
function motionStats() {
  const P = M.pts; let chord = 0;
  if (P.length > 1) chord = Math.hypot(P[P.length - 1][0] - P[0][0], P[P.length - 1][1] - P[0][1]);
  const avg = M.time ? M.dist / M.time * 1000 : 0;
  return { avg_px_s: Math.round(avg), top_px_s: Math.round(M.top), sharp_turns: M.turns, hesitations: M.pauses, straightness: M.dist ? +(chord / M.dist).toFixed(2) : 0, samples: M.n };
}
function showMotion() {
  const s = motionStats();
  $('#m-speed').textContent = `${s.avg_px_s} px/s`; $('#m-top').textContent = `${s.top_px_s} px/s`;
  $('#m-turns').textContent = s.sharp_turns; $('#m-pauses').textContent = s.hesitations;
  $('#m-straight').textContent = `${Math.round(s.straightness * 100)}%`; $('#m-n').textContent = s.samples;
  const v = $('#m-verdict');
  if (s.samples < 40) { v.textContent = 'Keep moving…'; v.className = 'mverdict'; }
  else if (s.straightness > 0.97 && s.sharp_turns === 0) { v.textContent = 'Too straight and too smooth. A bot check would flag this.'; v.className = 'mverdict bot'; }
  else { v.textContent = 'Moves like a human. Wobbles, corrections and pauses are what bot checks look for.'; v.className = 'mverdict human'; }
}
$('#m-clear').onclick = () => { Object.assign(M, { pts: [], n: 0, dist: 0, time: 0, top: 0, turns: 0, pauses: 0, last: null, lastAng: null }); px.clearRect(0, 0, pad.width, pad.height); $('#padhint').hidden = false; ['#m-speed', '#m-top', '#m-turns', '#m-pauses', '#m-straight', '#m-n'].forEach(k => $(k).textContent = '–'); $('#m-verdict').textContent = 'Waiting for movement'; $('#m-verdict').className = 'mverdict'; };

// ---------- cookie vs fingerprint ----------
const VS = [
  ['Tracked', 'The site saves a small file in your browser with an ID.', 'Tracked', 'The site reads your device and computes an ID. Nothing is saved.'],
  ['Deleted', 'You clear cookies. The file and its ID are gone.', 'Untouched', 'There is nothing to clear. The ID was never stored.'],
  ['Lost you', 'The site sees a brand new visitor.', 'Still you', 'Same device, same ID. The site knows you are back.'],
];
let vsStep = 0, vsTimer = null, vsUser = false;
function vsSet(i) {
  vsStep = i; const g = $('#vsgrid'); g.dataset.s = i;
  document.querySelectorAll('.step').forEach(b => { const on = +b.dataset.s === i; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  $('#vs-st1').textContent = VS[i][0]; $('#vs-t1').textContent = VS[i][1]; $('#vs-st2').textContent = VS[i][2]; $('#vs-t2').textContent = VS[i][3];
}
function vsInit() {
  $('#vs-fp').textContent = R.fid.slice(0, 9);
  if (!mq('(prefers-reduced-motion: reduce)')) vsTimer = setInterval(() => { if (!vsUser) vsSet((vsStep + 1) % 3); }, 2600);
}
document.querySelectorAll('.step').forEach(b => b.onclick = () => { vsUser = true; clearInterval(vsTimer); vsSet(+b.dataset.s); });

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
  $('#bars').innerHTML = sorted.map(x => `<div class="bar${x.r < .5 ? ' off' : ''}"><span class="bn">${esc(x.name)}${x.studied ? ' <i title="Measured in EFF Panopticlick">●</i>' : ''}</span><span class="bt"><span style="--w:${(x.b / 14 * 100).toFixed(1)}%"></span></span><span class="bv">≈ ${x.b} bits</span></div>`).join('')
    + `<div class="bar total"><span class="bn">Plain sum</span><span class="bt"><span style="--w:100%"></span><i class="b33" style="left:${(33 / total * 100).toFixed(1)}%" title="33 bits: one person on Earth">33</i></span><span class="bv">≈ ${Math.round(total)} bits</span></div>`;
  const top = [...rows].sort((a, b) => b.score - a.score).slice(0, 3);
  $('#top3').innerHTML = top.map(x => `<li><b>${esc(x.name)}</b><span class="tw">${esc(x.why || '≈ ' + x.b + ' bits')}</span><p>${esc(TIPS[x.k] || 'Browsers with fingerprinting protection blur this signal.')}</p></li>`).join('');
  R.top3 = top.map(x => x.name);
}

// ---------- how it's made ----------
function madeStats() {
  const es = [...performance.getEntriesByType('navigation'), ...performance.getEntriesByType('resource')].filter(e => { try { return new URL(e.name).origin === location.origin; } catch (_) { return false; } });
  const bytes = es.reduce((a, e) => a + (e.encodedBodySize || e.transferSize || 0), 0);
  const files = new Set(es.map(e => new URL(e.name).pathname)).size;
  $('#mk-w').textContent = bytes ? `${Math.round(bytes / 1024)} KB` : '—'; $('#mk-f').textContent = files; $('#mk-s').textContent = R.nsig;
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

run().catch(e => { console.error(e); $('#scanstate').textContent = 'error'; $('#idmeta').textContent = e.message; });
