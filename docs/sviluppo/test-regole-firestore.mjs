import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore';
import fs from 'fs';
const rulesFile = process.argv[2];
const env = await initializeTestEnvironment({ projectId: 'demo-inlab', firestore: { rules: fs.readFileSync(rulesFile, 'utf8'), host: '127.0.0.1', port: 8080 } });
await env.clearFirestore();
await env.withSecurityRulesDisabled(async (c) => {
  const d = c.firestore();
  await setDoc(doc(d, 'admins/admin1'), { ok: true });
  await setDoc(doc(d, 'app/site_content'), { x: 1 });
  await setDoc(doc(d, 'app/settings'), { x: 1 });
  await setDoc(doc(d, 'blog_posts/pub'), { published: true, title: 't' });
  await setDoc(doc(d, 'blog_posts/draft'), { published: false, title: 't' });
  await setDoc(doc(d, 'leads/l1'), { email: 'x' });
  await setDoc(doc(d, 'analytics_events/e1'), { event_type: 'pageview' });
  await setDoc(doc(d, '_usage/u1'), { n: 1 });
  await setDoc(doc(d, '_ratelimits/r1'), { n: 1 });
  await setDoc(doc(d, 'chats/c1'), { n: 1 });
});
const anon = env.unauthenticatedContext().firestore();
const user = env.authenticatedContext('user1').firestore();
const admin = env.authenticatedContext('admin1').firestore();
const post = { title: 'T', excerpt: '', content: 'c', category: 'x', tags: [], author: 'a', date: '2026-11-24', cover: '', published: true, seoTitle: '', seoDescription: '', updatedAt: 1 };
const base = { session_id: 's1', user_agent: 'ua', device: 'mobile', path: '/' };
const ev = (o) => () => addDoc(collection(anon, 'analytics_events'), { ...base, ...o });
const cases = {
  'site_content read anon': () => getDoc(doc(anon, 'app/site_content')),
  'site_content write anon': () => setDoc(doc(anon, 'app/site_content'), { x: 2 }),
  'site_content write user': () => setDoc(doc(user, 'app/site_content'), { x: 2 }),
  'site_content write admin': () => setDoc(doc(admin, 'app/site_content'), { x: 2 }),
  'app/settings read anon': () => getDoc(doc(anon, 'app/settings')),
  'app/settings read admin': () => getDoc(doc(admin, 'app/settings')),
  'app/settings write admin': () => setDoc(doc(admin, 'app/settings'), { x: 3 }),
  'admins read self': () => getDoc(doc(user, 'admins/user1')),
  'admins read other': () => getDoc(doc(user, 'admins/admin1')),
  'admins write admin': () => setDoc(doc(admin, 'admins/x'), { ok: true }),
  'blog read pub anon': () => getDoc(doc(anon, 'blog_posts/pub')),
  'blog read draft anon': () => getDoc(doc(anon, 'blog_posts/draft')),
  'blog read draft admin': () => getDoc(doc(admin, 'blog_posts/draft')),
  'blog create admin': () => setDoc(doc(admin, 'blog_posts/nuovo-post'), post),
  'blog create anon': () => setDoc(doc(anon, 'blog_posts/nuovo-post2'), post),
  'blog bad slug admin': () => setDoc(doc(admin, 'blog_posts/Bad_Slug'), post),
  'blog delete admin': () => deleteDoc(doc(admin, 'blog_posts/draft')),
  'leads read anon': () => getDoc(doc(anon, 'leads/l1')),
  'leads read admin': () => getDoc(doc(admin, 'leads/l1')),
  'leads create anon': () => setDoc(doc(anon, 'leads/l2'), { email: 'x' }),
  'leads create admin': () => setDoc(doc(admin, 'leads/l3'), { email: 'x' }),
  'leads update admin': () => updateDoc(doc(admin, 'leads/l1'), { status: 'x' }),
  'chats read anon': () => getDoc(doc(anon, 'chats/c1')),
  'usage read admin': () => getDoc(doc(admin, '_usage/u1')),
  'ratelimits write anon': () => setDoc(doc(anon, '_ratelimits/r2'), { n: 1 }),
  'analytics read anon': () => getDoc(doc(anon, 'analytics_events/e1')),
  'analytics read admin': () => getDoc(doc(admin, 'analytics_events/e1')),
  'analytics update anon': () => updateDoc(doc(anon, 'analytics_events/e1'), { x: 1 }),
  'analytics delete admin': () => deleteDoc(doc(admin, 'analytics_events/e1')),
  'EV pageview serverTimestamp': ev({ event_type: 'pageview', created_at: serverTimestamp(), referrer: null }),
  'EV scroll 55 serverTimestamp': ev({ event_type: 'scroll', created_at: serverTimestamp(), scroll_depth: 55, section: 'hero' }),
  'EV session_end 120s': ev({ event_type: 'session_end', created_at: serverTimestamp(), duration: 120, scroll_depth: 100 }),
  'EV session_end 86400s': ev({ event_type: 'session_end', created_at: serverTimestamp(), duration: 86400, scroll_depth: 0 }),
  'EV click': ev({ event_type: 'click', created_at: serverTimestamp(), target: 'cta' }),
  'EV created_at 2000 (date client)': ev({ event_type: 'pageview', created_at: Timestamp.fromDate(new Date('2000-01-01')) }),
  'EV created_at now (date client)': ev({ event_type: 'pageview', created_at: Timestamp.now() }),
  'EV scroll 101': ev({ event_type: 'scroll', created_at: serverTimestamp(), scroll_depth: 101 }),
  'EV scroll -1': ev({ event_type: 'scroll', created_at: serverTimestamp(), scroll_depth: -1 }),
  'EV duration 1e9': ev({ event_type: 'session_end', created_at: serverTimestamp(), duration: 1e9 }),
  'EV duration -5': ev({ event_type: 'session_end', created_at: serverTimestamp(), duration: -5 }),
  'EV extra field': ev({ event_type: 'pageview', created_at: serverTimestamp(), evil: 1 }),
};
const out = {};
for (const [k, f] of Object.entries(cases)) { try { await f(); out[k] = 'ALLOW'; } catch (e) { out[k] = e.code === 'permission-denied' ? 'DENY' : 'ERR ' + e.code; } }
console.log(JSON.stringify(out));
await env.cleanup();
