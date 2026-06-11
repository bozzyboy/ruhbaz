/* eslint-disable no-console */
// Dev-client baglanti QR'i uretir.
//
// NEDEN: dev-client'in KENDI "Scan QR Code" tarayicisi Android 13'te
// "cannot read QR code" ile takilabiliyor (expo-dev-launcher native sorunu).
// Bu script, KURULU APK'nin gercek semasiyla bir derin-baglanti QR'i basar;
// telefonun NORMAL KAMERA uygulamasiyla taranir -> Android dogrudan uygulamayi
// acar -> baglanir. Boylece dev-client'in bozuk tarayicisina hic girilmez.
//
// Calistir:  cd mobile && node scripts/qr.js   (veya npm run qr)
const fs = require('fs');
const path = require('path');
const os = require('os');
const qrcode = require('qrcode-terminal');

const PORT = process.env.PORT || '8081';

// 1. KURULU APK'nin semasini AndroidManifest'ten oku (exp+mobile / exp+ruhbaz...).
//    android/ prebuild ile uretildigi icin guncel semayi tasir.
let scheme = 'exp+mobile';
try {
  const manifestPath = path.resolve(__dirname, '..', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
  const manifest = fs.readFileSync(manifestPath, 'utf8');
  const match = manifest.match(/android:scheme="(exp\+[^"]+)"/);
  if (match) scheme = match[1];
} catch {
  // android/ yoksa varsayilan exp+mobile ile devam.
}

// 2. PC'nin LAN IP'sini bul.
let ip = '127.0.0.1';
const ifaces = os.networkInterfaces();
for (const name of Object.keys(ifaces)) {
  for (const net of ifaces[name] || []) {
    if (net.family === 'IPv4' && !net.internal && (net.address.startsWith('192.168.') || net.address.startsWith('10.'))) {
      ip = net.address;
    }
  }
}

const metroUrl = `http://${ip}:${PORT}`;
const deepLink = `${scheme}://expo-development-client/?url=${encodeURIComponent(metroUrl)}`;

console.log('');
console.log('============================================================');
console.log('  RUHBAZ KONAGI - dev-client baglanti QR');
console.log('============================================================');
console.log('  Bunu TELEFONUN NORMAL KAMERA uygulamasiyla tara.');
console.log('  (dev-client icindeki "Scan QR Code" tarayicisini DEGIL --');
console.log('   o Android 13\'te takiliyor.)');
console.log('  Cikan baglantiya dokun -> uygulama acilir -> baglanir.');
console.log('============================================================');
console.log('');

qrcode.generate(deepLink, { small: false });

console.log('');
console.log('  Sema (kurulu APK): ' + scheme);
console.log('  Metro adresi      : ' + metroUrl);
console.log('  QR okunmazsa elle : uygulamada "Enter URL manually" -> ' + metroUrl);
console.log('');
