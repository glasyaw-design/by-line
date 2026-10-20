// 바이라인 동시 접속자 API (Vercel 서버리스 함수)
// - 게임 화면이 열려 있는 동안 브라우저가 10분마다 한 번 신호(POST)를 보낸다.
// - 최근 11분 안에 신호를 보낸 브라우저 수 = "지금 플레이 중"
// - 누적 고유 방문자(HyperLogLog), 새 게임 시작 횟수도 함께 센다.
// Upstash Redis 환경 변수가 없으면 {online:null}을 돌려주고, 화면에서는 접속자 표시가 숨겨진다.
import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

const ONLINE = 'byline:online';     // 정렬 집합: 회원 = 방문자 id, 점수 = 마지막 신호 시각(ms)
const VISITORS = 'byline:visitors'; // HyperLogLog: 누적 고유 방문자
const GAMES = 'byline:games';       // 카운터: 새 게임 시작 횟수
const BEAT_MS = 10 * 60 * 1000;     // 신호 간격 10분 (index.html과 맞춘다)
const WINDOW_MS = BEAT_MS + 60 * 1000; // 11분 안에 신호가 있으면 접속 중으로 본다
const EMPTY = { online: null, total: null, games: null };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).json({ error: 'method' });
  if (!redis) return res.status(200).json(EMPTY);

  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const id = String(body.id || '').replace(/[^a-z0-9]/gi, '').slice(0, 40);
  const ev = ['open', 'start', 'beat'].includes(body.ev) ? body.ev : 'beat';
  const now = Date.now();

  try {
    const p = redis.pipeline();
    if (req.method === 'POST' && id) {
      p.zadd(ONLINE, { score: now, member: id });
      if (ev === 'open') p.pfadd(VISITORS, id);
      if (ev === 'start') p.incr(GAMES);
    }
    p.zremrangebyscore(ONLINE, 0, now - WINDOW_MS);
    p.zcard(ONLINE);
    p.pfcount(VISITORS);
    p.get(GAMES);
    const r = await p.exec();
    const n = r.length;
    return res.status(200).json({ online: Number(r[n - 3] || 0), total: Number(r[n - 2] || 0), games: Number(r[n - 1] || 0), beat: BEAT_MS });
  } catch (e) {
    return res.status(200).json(EMPTY);
  }
}
