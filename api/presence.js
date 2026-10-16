// 동시 접속자·누적 방문자·시작한 게임 수
// Upstash Redis(Vercel Marketplace) 환경 변수가 있으면 동작하고, 없으면 {online:null}을 돌려줘 화면에서 숨겨진다.
import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

const ONLINE = 'byline:online';     // 정렬 집합: 회원=방문자 id, 점수=마지막 신호 시각
const VISITORS = 'byline:visitors'; // HyperLogLog: 누적 고유 방문자
const GAMES = 'byline:games';       // 카운터: 새 게임 시작 횟수
const WINDOW_MS = 70_000;           // 30초마다 신호 → 70초 안에 신호가 있으면 접속 중

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).json({ error: 'method' });
  if (!redis) return res.status(200).json({ online: null, total: null, games: null });

  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const id = String(body.id || '').replace(/[^a-z0-9]/gi, '').slice(0, 40);
  const now = Date.now();

  try {
    if (req.method === 'POST' && id) {
      const p = redis.pipeline();
      p.zadd(ONLINE, { score: now, member: id });
      if (body.ev === 'open') p.pfadd(VISITORS, id);
      if (body.ev === 'start') p.incr(GAMES);
      await p.exec();
    }
    await redis.zremrangebyscore(ONLINE, 0, now - WINDOW_MS);
    const [online, total, games] = await Promise.all([
      redis.zcard(ONLINE), redis.pfcount(VISITORS), redis.get(GAMES)
    ]);
    return res.status(200).json({ online, total, games: Number(games || 0) });
  } catch (e) {
    return res.status(200).json({ online: null, total: null, games: null });
  }
}
