// 테스트 전용: 메모리 안에서 도는 작은 Redis (api/account.js가 쓰는 명령만)
// api/account.js는 globalThis.__BYLINE_TEST_DB가 있으면 진짜 저장소 대신 이것을 쓴다.
export function fakeRedis() {
  const D = new Map(), EXP = new Map();
  const live = (k) => { if (EXP.has(k) && EXP.get(k) < Date.now()) { D.delete(k); EXP.delete(k); } return D.get(k); };
  const H = (k) => { let v = live(k); if (!(v instanceof Map) || v.__z) { v = new Map(); D.set(k, v); } return v; };
  const SS = (k) => { let v = live(k); if (!(v instanceof Set)) { v = new Set(); D.set(k, v); } return v; };
  const Z = (k) => { let z = live(k); if (!(z instanceof Map) || !z.__z) { z = new Map(); z.__z = 1; D.set(k, z); } return z; };
  const one = ([c, k, ...a]) => {
    c = String(c).toUpperCase();
    switch (c) {
      case 'PING': return 'PONG';
      case 'INCR': { const n = Number(live(k) || 0) + 1; D.set(k, String(n)); return n; }
      case 'DECR': { const n = Number(live(k) || 0) - 1; D.set(k, String(n)); return n; }
      case 'EXPIRE': if (a[1] === 'NX' && EXP.has(k)) return 0; EXP.set(k, Date.now() + Number(a[0]) * 1000); return 1;
      case 'GET': { const v = live(k); return typeof v === 'string' ? v : null; }
      case 'SET': D.set(k, String(a[0])); if (a[1] === 'EX') EXP.set(k, Date.now() + Number(a[2]) * 1000); else EXP.delete(k); return 'OK';
      case 'DEL': [k, ...a].forEach((x) => { D.delete(x); EXP.delete(x); }); return 1;
      case 'SADD': SS(k).add(a[0]); return 1;
      case 'SREM': SS(k).delete(a[0]); return 1;
      case 'SMEMBERS': return [...SS(k)];
      case 'HSETNX': { const h = H(k); if (h.has(a[0])) return 0; h.set(a[0], a[1]); return 1; }
      case 'HSET': { const h = H(k); for (let i = 0; i < a.length; i += 2) h.set(a[i], String(a[i + 1])); return 1; }
      case 'HGET': { const h = live(k); return h instanceof Map && !h.__z && h.has(a[0]) ? h.get(a[0]) : null; }
      case 'HMGET': { const h = live(k); return a.map((f) => (h instanceof Map && !h.__z && h.has(f) ? h.get(f) : null)); }
      case 'HDEL': { const h = live(k); if (h instanceof Map) a.forEach((f) => h.delete(f)); return 1; }
      case 'ZADD': Z(k).set(a[1], Number(a[0])); return 1;
      case 'ZSCORE': { const z = live(k); return z instanceof Map && z.__z && z.has(a[0]) ? String(z.get(a[0])) : null; }
      case 'ZREM': { const z = live(k); if (z instanceof Map) z.delete(a[0]); return 1; }
      case 'ZREVRANGE': { const z = live(k); if (!(z instanceof Map)) return []; const L = [...z.entries()].sort((x, y) => y[1] - x[1]); const e = Number(a[1]); const sl = L.slice(Number(a[0]), e < 0 ? L.length + e + 1 : e + 1); return a[2] === 'WITHSCORES' ? sl.flatMap(([m, s]) => [m, String(s)]) : sl.map((x) => x[0]); }
      case 'ZREMRANGEBYRANK': { const z = live(k); if (!(z instanceof Map)) return 0; const L = [...z.entries()].sort((x, y) => x[1] - y[1]); const n = L.length; let s0 = Number(a[0]), e0 = Number(a[1]); if (s0 < 0) s0 += n; if (e0 < 0) e0 += n; let c2 = 0; L.forEach(([m], i) => { if (i >= s0 && i <= e0) { z.delete(m); c2++; } }); return c2; }
      default: throw new Error('fake-redis: 모르는 명령 ' + c);
    }
  };
  return { D, async run(cmds) { return cmds.map(one); } };
}

// Vercel 함수(handler(req,res))를 Node http 없이 부르는 작은 도우미
export async function callApi(handler, { method = 'POST', body = {}, query = {}, headers = {}, ip = '10.0.0.1' } = {}) {
  let code = 200, out = null; const hdr = {};
  const req = { method, body, query, headers: { 'x-forwarded-for': ip, ...headers }, socket: { remoteAddress: ip } };
  const res = { setHeader(k, v) { hdr[k.toLowerCase()] = v; }, status(c) { code = c; return this; }, json(o) { out = o; return this; } };
  await handler(req, res);
  return { code, body: out, headers: hdr };
}
