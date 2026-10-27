// 계정 API 테스트 (브라우저·네트워크 없이, 메모리 Redis로): npm run test:api
// api/account.js의 가입 · 로그인 · 클라우드 저장 · 기록실 · 명예의 전당 · 비밀번호 변경 · 계정 삭제 · 시도 횟수 제한을 확인한다.
import { fakeRedis, callApi } from './lib/fake-redis.mjs';

const DB = fakeRedis();
globalThis.__BYLINE_TEST_DB = DB;
const { default: handler } = await import('../api/account.js');

let fails = 0, n = 0;
const ok = (cond, msg, extra) => { n++; if (cond) console.log('  ✓', msg); else { fails++; console.log('  ✗', msg, extra !== undefined ? JSON.stringify(extra).slice(0, 300) : ''); } };
const call = (a, data = {}, opt = {}) => callApi(handler, { body: { a, ...data }, ...opt });
const auth = (tok) => ({ headers: { authorization: 'Bearer ' + tok } });
const keys = () => [...DB.D.keys()];

console.log('▶ 연결 점검');
{ const r = await callApi(handler, { method: 'GET', query: { debug: '1' } }); ok(r.code === 200 && r.body.ok === true && r.body.write === true, 'debug=1 → 저장소에 읽고 쓸 수 있다', r.body); ok(!JSON.stringify(r.body).match(/KV_|UPSTASH|REDIS_/), 'debug 응답에 환경 변수 이름이 없다'); }
{ const r = await callApi(handler, { method: 'GET' }); ok(r.code === 405, 'debug 없는 GET은 405'); }
{ const r = await callApi(handler, { method: 'POST', body: { a: 'register' } }); ok(r.headers['cache-control'] === 'no-store', '응답은 캐시하지 않는다'); }

console.log('▶ 가입');
{ const r = await call('register', { id: 'AB', pw: '123456' }); ok(r.code === 400, '짧은 아이디 거절'); }
{ const r = await call('register', { id: 'tester_1', pw: '123' }); ok(r.code === 400, '짧은 비밀번호 거절'); }
const reg = await call('register', { id: 'tester_1', pw: 'pass1234', nick: '<b>홍기자</b>' });
ok(reg.code === 200 && /^[a-f0-9]{48}$/.test(reg.body.token), '가입하면 토큰을 준다', reg.body);
ok(reg.body.user && !/[<>]/.test(reg.body.user.nick), '닉네임의 꺾쇠는 지운다', reg.body.user);
{ const r = await call('register', { id: 'tester_1', pw: 'other123' }, { ip: '10.0.0.9' }); ok(r.code === 409, '같은 아이디는 다시 가입할 수 없다'); }
{ const h = DB.D.get('byline:acc:u:tester_1'); ok(h && h.get('pw') && h.get('pw') !== 'pass1234' && h.get('salt'), '비밀번호는 해시로만 저장된다'); ok(!JSON.stringify([...DB.D.values()].map(v => v instanceof Map ? [...v.values()] : String(v))).includes('pass1234'), '저장소 어디에도 원래 비밀번호가 없다'); }
{ let last; for (let i = 0; i < 6; i++) last = await call('register', { id: 'spam_' + i, pw: 'pass1234' }, { ip: '10.9.9.9' }); ok(last.code === 429, '한 IP에서 한 시간에 5번 넘게 가입하면 막는다', last.code); }

console.log('▶ 로그인');
{ const r = await call('login', { id: 'tester_1', pw: 'wrong' }); ok(r.code === 401, '틀린 비밀번호는 401'); }
{ const r = await call('login', { id: 'nobody_x', pw: 'pass1234' }); ok(r.code === 401, '없는 아이디도 같은 401 (아이디가 있는지 알려 주지 않는다)'); }
const lg = await call('login', { id: 'TESTER_1', pw: 'pass1234' });
ok(lg.code === 200 && lg.body.token, '대문자로 써도 로그인된다');
const T = lg.body.token;
{ const r = await call('me', {}, auth(T)); ok(r.code === 200 && r.body.user.id === 'tester_1', '토큰으로 내 정보를 본다'); }
{ const r = await call('me', {}, auth('f'.repeat(48))); ok(r.code === 401, '가짜 토큰은 401'); }

console.log('▶ 클라우드 저장');
const Z = Buffer.from('게임 저장 '.repeat(50)).toString('base64');
{ const r = await call('put', { slot: '1', label: '1슬롯', t: 123, z: Z }, auth(T)); ok(r.code === 200, '슬롯 1에 올린다'); }
{ const r = await call('put', { slot: '9', z: Z }, auth(T)); ok(r.code === 400, '없는 슬롯은 거절'); }
{ const r = await call('put', { slot: '2', z: 'not base64!' }, auth(T)); ok(r.code === 413, 'base64가 아니면 거절'); }
{ const r = await call('put', { slot: '2', z: 'A'.repeat(800 * 1024 + 4) }, auth(T)); ok(r.code === 413, '800KB보다 크면 거절'); }
{ const r = await call('list', {}, auth(T)); const s1 = r.body.slots.find(s => s.slot === '1'); ok(s1 && s1.t === 123 && s1.label === '1슬롯' && !('z' in s1), '목록에는 내용 없이 이름·시각만'); }
{ const r = await call('get', { slot: '1' }, auth(T)); ok(r.code === 200 && r.body.z === Z, '내려받으면 올린 그대로'); }
{ const r = await call('get', { slot: '3' }, auth(T)); ok(r.code === 404, '빈 슬롯은 404'); }
{ const r = await call('put', { slot: '1', z: Z }); ok(r.code === 401, '로그인 없이 올릴 수 없다'); }

console.log('▶ 기록실');
{ await call('meta-put', { z: Z }, auth(T)); const r = await call('meta-get', {}, auth(T)); ok(r.body.z === Z && r.body.t > 0, '기록실을 올리고 받는다'); }

console.log('▶ 명예의 전당');
{ const r = await call('hall-put', { run: { nm: '홍길동<script>', rn: '편집국장', o: '대한일보', yrs: 30, sc: 99999, ex: 20, aw: 5, best: '[단독] 시발 테스트 http://x.com' } }, auth(T)); ok(r.code === 200, '판 기록을 올린다'); }
{ const r = await call('hall-top', { scope: 'all' }); const e = r.body.list[0];
  ok(e && !/[<>]/.test(e.nm), '이름의 꺾쇠는 지운다', e);
  ok(e && e.sc <= 7 * 14 + 60 + 40 + 20 * 2 + 5 * 6, '점수는 게임이 낼 수 있는 최대치로 자른다', e && e.sc);
  ok(e && e.best === '', '욕설·주소가 든 대표 기사 제목은 지운다', e && e.best);
  ok(e && !('uid' in e) && !JSON.stringify(e).includes('tester_1'), '순위표에 아이디가 나가지 않는다', e); }
{ const r = await call('hall-top', { scope: 'month' }); ok(r.body.list.length === 1, '이달 순위에도 오른다'); }

console.log('▶ 비밀번호 바꾸기');
const T2 = (await call('login', { id: 'tester_1', pw: 'pass1234' }, { ip: '10.0.0.2' })).body.token;
{ const r = await call('password', { pw: 'wrong', npw: 'newpass99' }, auth(T)); ok(r.code === 401, '지금 비밀번호가 틀리면 못 바꾼다'); }
const pwc = await call('password', { pw: 'pass1234', npw: 'newpass99' }, auth(T));
ok(pwc.code === 200 && pwc.body.token, '바꾸면 새 토큰을 준다');
{ const r = await call('me', {}, auth(T2)); ok(r.code === 401, '다른 기기의 예전 토큰은 끊긴다'); }
{ const r = await call('login', { id: 'tester_1', pw: 'newpass99' }, { ip: '10.0.0.3' }); ok(r.code === 200, '새 비밀번호로 로그인된다'); }

console.log('▶ 로그인 시도 제한');
{ let last; for (let i = 0; i < 11; i++) last = await call('login', { id: 'tester_1', pw: 'bad' + i }, { ip: '10.1.1.' + i }); ok(last.code === 429, '한 아이디에 10분 동안 10번 넘게 틀리면 막는다 (IP를 바꿔도)', last.code); }

console.log('▶ 계정 삭제');
const T3 = pwc.body.token;
{ const r = await call('delete', { pw: 'nope' }, auth(T3)); ok(r.code === 401 || r.code === 429, '비밀번호가 틀리면 지우지 않는다'); }
// 시도 제한 창을 비운다 (테스트에서만)
for (const k of keys()) if (k.startsWith('byline:acc:rl:')) DB.D.delete(k);
{ const r = await call('delete', { pw: 'newpass99' }, auth(T3)); ok(r.code === 200, '계정을 지운다'); }
{ const left = keys().filter(k => k.includes('tester_1') && !k.includes(':rl:')); ok(left.length === 0, '아이디가 들어간 키가 하나도 남지 않는다 (시도 횟수 기록은 10분 뒤 저절로 사라진다)', left); }
{ const r = await call('hall-top', { scope: 'all' }); ok(!r.body.list.length, '명예의 전당에서도 빠진다', r.body.list); }
{ const r = await call('hall-top', { scope: 'month' }); ok(!r.body.list.length, '이달 순위에서도 빠진다'); }
{ const r = await call('me', {}, auth(T3)); ok(r.code === 401, '토큰도 끊긴다'); }

console.log(`\n${fails ? '✗ 실패 ' + fails + '건' : '✓ 모두 통과'} (${n}개 확인)`);
process.exit(fails ? 1 : 0);
