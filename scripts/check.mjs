// 정적 검사 (외부 패키지 없음): 문법 · index.html의 파일 참조 · 코드 속 리소스 경로
// 사용: node scripts/check.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const r = p => path.join(ROOT, p);
const index = fs.readFileSync(r('index.html'), 'utf8');
const scripts = [...index.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
const styles = [...index.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map(m => m[1]);
let bad = 0;
const fail = (...a) => { bad++; console.error('✗', ...a); };

// 1) 문법: 각 파일을 일반 script로 파싱
for (const f of scripts) {
  if (!fs.existsSync(r(f))) { fail('없는 script', f); continue; }
  try { execFileSync(process.execPath, ['--check', r(f)], { stdio: 'pipe' }); } catch (e) { fail('문법 오류', f, String(e.stderr).split('\n').slice(0, 4).join(' ')); }
}
for (const f of styles) if (!fs.existsSync(r(f))) fail('없는 CSS', f);

// 2) 코드와 CSS가 가리키는 리소스가 실제로 있는가
const refs = new Set();
for (const f of scripts) for (const m of fs.readFileSync(r(f), 'utf8').matchAll(/assets\/(images|fonts)\/[A-Za-z0-9_\-]+\.(webp|woff)/g)) refs.add(m[0]);
for (const f of styles) for (const m of fs.readFileSync(r(f), 'utf8').matchAll(/\.\.\/(assets\/[A-Za-z0-9_\-/]+\.(webp|woff))/g)) refs.add(m[1]);
for (const ref of refs) if (!fs.existsSync(r(ref))) fail('없는 리소스', ref);
const audio = ['theme', 'daily', 'night', 'deadline', 'crisis', 'power', 'rise', 'ending'].map(k => `assets/audio/bgm_${k}.mp3`);
for (const a of audio) if (!fs.existsSync(r(a))) fail('없는 음악', a);

// 3) 리소스 해시: tools/assets-manifest.json과 같은 바이너리인가
const man = JSON.parse(fs.readFileSync(r('tools/assets-manifest.json'), 'utf8'));
const { createHash } = await import('node:crypto');
for (const m of man) { if (!fs.existsSync(r(m.file))) { fail('목록에 있는데 파일 없음', m.file); continue; } const h = createHash('sha256').update(fs.readFileSync(r(m.file))).digest('hex'); if (h !== m.sha256) fail('해시 다름', m.file); }

console.log(bad ? `\n문제 ${bad}건` : `정적 검사 통과 — script ${scripts.length}개 · CSS ${styles.length}개 · 리소스 참조 ${refs.size}개 · 목록 ${man.length}개 해시 일치`);
process.exit(bad ? 1 : 0);
