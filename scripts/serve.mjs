// 정적 파일 서버 (외부 패키지 없음). 사용: node scripts/serve.mjs <폴더> <포트>
// 음악(mp3)은 브라우저가 Range 요청으로 나눠 받으므로 206 응답을 지원한다.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const port = Number(process.argv[3] || process.env.PORT || 5173);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400); return res.end(); }
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(root, p);
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); return res.end(); }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }); return res.end('404 ' + p); }
    const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const base = { 'content-type': type, 'cache-control': 'no-cache', 'accept-ranges': 'bytes' };
    const range = req.headers.range && /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if (range) {
      let a = range[1] === '' ? st.size - Number(range[2]) : Number(range[1]);
      let b = range[1] === '' || range[2] === '' ? st.size - 1 : Number(range[2]);
      if (a < 0) a = 0; if (b >= st.size) b = st.size - 1;
      if (a > b) { res.writeHead(416, { 'content-range': `bytes */${st.size}` }); return res.end(); }
      res.writeHead(206, { ...base, 'content-range': `bytes ${a}-${b}/${st.size}`, 'content-length': b - a + 1 });
      if (req.method === 'HEAD') return res.end();
      return fs.createReadStream(file, { start: a, end: b }).pipe(res);
    }
    res.writeHead(200, { ...base, 'content-length': st.size });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
});
server.listen(port, () => console.log(`바이라인: http://localhost:${port}/  (폴더: ${root})  · 끄려면 Ctrl+C`));
