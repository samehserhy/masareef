// يُشغَّل بعد «npx cap add android» وبعد كل «npx cap sync»:
// يضيف الأذونات والأيقونات واسم التطبيق ورقم الإصدار. آمن لإعادة التشغيل أكثر من مرة.
import fs from 'fs'; import path from 'path';
const A = 'android', app = path.join(A, 'app'), res = path.join(app, 'src/main/res'), man = path.join(app, 'src/main/AndroidManifest.xml');
if (!fs.existsSync(A)) { console.error('مجلد android غير موجود — شغّل أولاً: npx cap add android'); process.exit(1); }
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')), [maj, min] = pkg.version.split('.').map(Number);
const versionName = `${maj}.${min}`, versionCode = maj * 100 + min;

// 1) الأذونات
let m = fs.readFileSync(man, 'utf8');
const perms = ['android.permission.INTERNET', 'android.permission.POST_NOTIFICATIONS', 'android.permission.SCHEDULE_EXACT_ALARM', 'android.permission.RECEIVE_BOOT_COMPLETED', 'android.permission.READ_CONTACTS'];
perms.forEach(p => { if (!m.includes(p)) m = m.replace('</manifest>', `    <uses-permission android:name="${p}" />\n</manifest>`); });
if (!/android:label="[^"]*"/.test(m) || true) m = m.replace(/(<application[^>]*?)android:label="[^"]*"/, '$1android:label="@string/app_name"');
fs.writeFileSync(man, m);

// 2) الاسم
const sx = path.join(res, 'values/strings.xml');
if (fs.existsSync(sx)) { let s = fs.readFileSync(sx, 'utf8'); s = s.replace(/(<string name="app_name">)[^<]*(<\/string>)/, '$1المصاريف$2').replace(/(<string name="title_activity_main">)[^<]*(<\/string>)/, '$1المصاريف$2'); fs.writeFileSync(sx, s); }

// 3) رقم الإصدار
const gp = path.join(app, 'build.gradle');
if (fs.existsSync(gp)) { let g = fs.readFileSync(gp, 'utf8'); g = g.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`).replace(/versionName\s+"[^"]*"/, `versionName "${versionName}"`); fs.writeFileSync(gp, g); }

// 4) الأيقونات
const src = 'resources/android'; let n = 0;
if (fs.existsSync(src)) for (const d of fs.readdirSync(src)) { const to = path.join(res, d); fs.mkdirSync(to, { recursive: true }); for (const f of fs.readdirSync(path.join(src, d))) { fs.copyFileSync(path.join(src, d, f), path.join(to, f)); n++; } }
const bg = path.join(res, 'values/ic_launcher_background.xml');
fs.mkdirSync(path.dirname(bg), { recursive: true });
fs.writeFileSync(bg, '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#0D9488</color>\n</resources>\n');
console.log(`✅ تم: أذونات + اسم + إصدار ${versionName} (code ${versionCode}) + ${n} ملف أيقونة`);
