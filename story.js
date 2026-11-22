// MAYA · גלילה קולנועית (GSAP + ScrollTrigger)
(() => {
const M = window.MAYA;
const has = q => !!document.querySelector(q);
const byId = id => document.getElementById(id);
const ils = n => '₪' + Math.round(n).toLocaleString('he-IL');
const aed = n => 'AED ' + Math.round(n).toLocaleString('en-US');
const ilsShort = n => n >= 1e6 ? (n/1e6).toFixed(2).replace(/\.?0+$/,'') + ' מיליון ₪' : Math.round(n/1000) + ' אלף ₪';

// ---------- תוכן מ-content.js ----------
if (has('#projTrack')) byId('projTrack').innerHTML = M.projects.map((p, i) => `
  <div class="panel proj">
    <div class="bg"><img src="${p.img}" alt=""></div>
    ${p.placeholder ? '<span class="slot">מקום שמור · ממלאים ב-content.js</span>' : ''}
    <div class="in">
      <span class="k">${p.area}</span>
      ${p.real ? `<div class="name metal">${p.name}</div><div class="by">${p.by}</div>` : `<h3 class="display metal">${p.name}</h3>`}
      <p style="margin-top:16px">${p.line}</p>
      ${p.facts ? `<div class="facts">${p.facts.map(f => `<div><b class="metal" dir="ltr">${f[0]}</b><span>${f[1]}</span></div>`).join('')}</div>` : '<div style="height:30px"></div>'}
      <div class="btns">
        ${p.slug ? `<a class="btn btn-gold" href="project-${p.slug}.html">לעמוד הפרויקט ←</a>` : ''}
        <a class="btn ${p.slug ? 'btn-ghost' : 'btn-gold'}" href="#" data-wa="היי מאיה, אשמח לפרטים על ${p.name}.">מחירון ותנאים בוואטסאפ</a>
      </div>
    </div>
    <span class="idx">${String(i+1).padStart(2,'0')} / ${String(M.projects.length).padStart(2,'0')}</span>
  </div>`).join('');

if (has('#posts')) byId('posts').innerHTML = M.posts.map(p => `
  <a class="card up" href="${M.instagramBiz}" target="_blank" rel="noopener">
    <span class="tag">${p.tag}</span><h3>${p.title}</h3><p>${p.text}</p><span class="go">לפוסט באינסטגרם ←</span>
  </a>`).join('');

if (has('#quotes')) byId('quotes').innerHTML = M.testimonials.map(t => `
  <div class="quote up"><q>${t.quote}</q><div class="who"><b>${t.name}</b>${t.detail}</div></div>`).join('');

if (has('#ig1')) { byId('ig1').href = M.instagram; byId('ig2').href = M.instagramBiz; }

// ---------- מחשבון ----------
const cb = document.getElementById('calcBox'), $ = s => cb.querySelector(s);
const calc = () => {
  const P = +$('[name=price]').value, m = +$('[name=months]').value, sel = $('[name=plan]');
  const [d, c, h] = sel.value.split(',').map(Number), post = sel.selectedOptions[0].dataset.post === '1';
  const R = M.rate, now = (d/100 + .04) * P, during = P*c/100, hand = P*h/100, n = Math.max(1, Math.round(m/6));
  $('[data-o=price]').textContent = aed(P) + ' · ' + ilsShort(P*R);
  $('[data-o=months]').textContent = m + ' חודשים';
  $('[data-o=now]').textContent = ils(now*R);
  $('[data-o=tl]').innerHTML = `
    <div class="row"><div>ביום החתימה<span>מקדמה ${d}% ואגרת רישום 4%</span></div><div class="amt">${ils(now*R)}<small>${aed(now)}</small></div></div>
    <div class="row"><div>במהלך הבנייה<span>${c}% ב-${n} תשלומים, בערך כל חצי שנה</span></div><div class="amt">${ils(during*R/n)}<small>לתשלום · סה״כ ${ils(during*R)}</small></div></div>
    <div class="row"><div>${post ? 'אחרי המסירה' : 'בקבלת המפתח'}<span>${h}% ${post ? 'בפריסה, כשהדירה כבר מושכרת' : 'אפשר לממן במשכנתא מבנק מקומי'}</span></div><div class="amt">${ils(hand*R)}<small>${aed(hand)}</small></div></div>`;
};
cb.addEventListener('input', calc); calc();

// ---------- וואטסאפ ----------
const waOpen = msg => M.whatsapp
  ? window.open('https://wa.me/' + M.whatsapp + '?text=' + encodeURIComponent(msg), '_blank')
  : alert('הכפתור עובד. חסר רק המספר של מאיה בוואטסאפ (בקובץ content.js).\n\nההודעה שתישלח:\n' + msg);
document.addEventListener('click', e => { const a = e.target.closest('[data-wa]'); if (!a) return; e.preventDefault(); waOpen(a.dataset.wa || 'היי מאיה, אשמח לשמוע על השקעה בדובאי.'); });
document.getElementById('leadForm').addEventListener('submit', e => {
  e.preventDefault(); const f = new FormData(e.target);
  waOpen(`היי מאיה, אני ${f.get('name')} (${f.get('phone')}). ${f.get('budget')}. ${f.get('goal')}.`);
});

// ---------- אנימציות ----------
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!window.gsap || !window.ScrollTrigger || reduce) {
  document.querySelectorAll('.up').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  if (has('#introHead')) { byId('introHead').style.opacity = 1; byId('introMark').style.display = 'none'; }
  if (has('#revText')) { byId('revText').style.opacity = 1; byId('circle').style.clipPath = 'none'; }
  window.PAGE_FALLBACK && window.PAGE_FALLBACK();
  return;
}
gsap.registerPlugin(ScrollTrigger);

// פס התקדמות
gsap.to('#prog', { scaleY: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });

// סצנות ייחודיות לעמוד (נוצרות ראשונות, לפי סדר העמוד)
window.PAGE_TOP && window.PAGE_TOP();

if (has('#intro')) {

// 1 · פתיחה: הלוגו מתרחק, העיר מתקרבת, הכותרת עולה
gsap.timeline({ scrollTrigger: { trigger: '#intro', start: 'top top', end: '+=180%', scrub: 1, pin: true } })
  .to('#introCue', { opacity: 0, duration: .1 }, 0)
  .fromTo('#introBg img', { scale: 1.45 }, { scale: 1.05, ease: 'none', duration: 1 }, 0)
  .to('#introMark', { scale: .55, opacity: 0, y: -120, duration: .4 }, 0)
  .to('#introShade', { opacity: 1, duration: .4 }, 0)
  .to('#introBg img', { filter: 'brightness(.55)', duration: .4 }, .2)
  .fromTo('#introHead', { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: .4 }, .3)
  .to('#introHead', { opacity: 1, duration: .3 }, .7);

// כניסת הלוגו בטעינה
gsap.from('#introMark .mark', { opacity: 0, letterSpacing: '0.9em', duration: 2, ease: 'power3.out' });
gsap.from('#introMark .sub', { opacity: 0, y: 20, duration: 1.4, delay: .8 });
}

if (has('#stats')) {

// 2 · מספרים
const st = gsap.timeline({ scrollTrigger: { trigger: '#stats', start: 'top top', end: '+=120%', scrub: 1, pin: true } });
st.to('#stats .up', { opacity: 1, y: 0, stagger: .15, duration: .4 })
  .fromTo('[data-count]', { textContent: 0 }, { textContent: 6, snap: { textContent: 1 }, duration: .5 }, '<');

}

if (has('#maya')) {
// 3 · מאיה: התמונה נחשפת, השורות עולות אחת אחת
const mt = gsap.timeline({ scrollTrigger: { trigger: '#maya', start: 'top top', end: '+=200%', scrub: 1, pin: true } });
mt.fromTo('#mayaPhoto', { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: .5 })
  .fromTo('#mayaPhoto img', { scale: 1.3 }, { scale: 1, duration: 1 }, 0)
  .from('#maya h2', { opacity: 0, y: 60, duration: .3 }, .1)
  .from('#maya .lines p', { opacity: 0, x: 60, stagger: .18, duration: .25 }, .35);

}

// 4 + 6 · גלילה אופקית (מימין לשמאל)
function hscroll(sec){
  if (!sec) return;
  const track = sec.querySelector('.track');
  const panels = [...sec.querySelectorAll('.panel')], n = panels.length;
  const dist = () => track.scrollWidth - innerWidth;
  // בכל פאנל: הטקסט עולה כשהוא נכנס, הרקע זז לאט (פרלקסה). מחושב ידנית כי התנועה מימין לשמאל.
  const parts = panels.map(p => ({ bg: p.querySelector('.bg'), items: [...p.querySelectorAll('.in > *')] }));
  const paint = prog => {
    const pos = prog * (n - 1);
    parts.forEach((pt, i) => {
      const d = pos - i;                       // 0 = הפאנל במרכז, -1 = עוד לא נכנס
      gsap.set(pt.bg, { xPercent: gsap.utils.clamp(-8, 8, d * 8) });
      pt.items.forEach((el, k) => {
        const t = gsap.utils.clamp(0, 1, (d + 0.75 - k * 0.06) / 0.5);
        gsap.set(el, { opacity: t, y: (1 - t) * 50 });
      });
    });
  };
  gsap.to(track, { x: () => dist(), ease: 'none',
    scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), scrub: 1, pin: true, invalidateOnRefresh: true,
      onUpdate: self => paint(self.progress), onRefresh: self => paint(self.progress) } });
  paint(0);
}
hscroll(document.getElementById('pillars'));

if (has('#ptitle')) {
// 5 · "הפרויקטים שלי כרגע": טקסט ענק שמתכווץ למקום
gsap.timeline({ scrollTrigger: { trigger: '#ptitle', start: 'top top', end: '+=130%', scrub: 1, pin: true } })
  .fromTo('#ptText', { scale: 2.6, opacity: 0 }, { scale: 1, opacity: 1, duration: .6 })
  .fromTo('#ptBg img', { scale: 1.3, filter: 'brightness(.5)' }, { scale: 1, filter: 'brightness(.9)', duration: 1 }, 0);

}
hscroll(byId('projects'));
hscroll(byId('gallery'));

if (has('#reveal')) {
// 7 · חשיפה במעגל
gsap.timeline({ scrollTrigger: { trigger: '#reveal', start: 'top top', end: '+=160%', scrub: 1, pin: true } })
  .fromTo('#circle', { clipPath: 'circle(12% at 50% 50%)' }, { clipPath: 'circle(80% at 50% 50%)', duration: .6 })
  .fromTo('#circle img', { scale: 1.4 }, { scale: 1, duration: 1 }, 0)
  .to('#revShade', { opacity: 1, duration: .3 }, .4)
  .to('#revText', { opacity: 1, duration: .3 }, .55);

}

// 8 · קו המסלול
if (has('#pathLine')) gsap.to('#pathLine', { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '#steps', start: 'top 60%', end: 'bottom 70%', scrub: true } });

// חשיפות רגילות
gsap.utils.toArray('section:not(.pin) .up').forEach(el =>
  gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));

// סיום: רקע זז
if (has('#finBg')) gsap.fromTo('#finBg img', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '#final', start: 'top bottom', end: 'bottom bottom', scrub: true } });

// ניווט: מסמן את החלק הנוכחי
document.querySelectorAll('.nav a.l').forEach(a => {
  const t = document.querySelector(a.getAttribute('href'));
  t && ScrollTrigger.create({ trigger: t, start: 'top 50%', end: 'bottom 50%', onToggle: s => a.classList.toggle('on', s.isActive) });
});
addEventListener('load', () => ScrollTrigger.refresh());
// 0 · כניסה לווילה: רצף תמונות על קנבס (חלק יותר מקפיצה בתוך וידאו)
if (has('#villa')) {
  const cv = byId('villaCanvas'), ctx = cv.getContext('2d');
  const N = 310, set = innerWidth < innerHeight ? 'm' : 'd';
  const imgs = new Array(N), ok = new Uint8Array(N);
  const src = (i) => `film/${set}/${String(i + 1).padStart(4, '0')}.webp`;
  // סדר טעינה: קודם כל תמונה 16, אחר כך ממלאים. ככה אפשר לגלול מיד
  const order = [], seen = new Uint8Array(N);
  for (const st of [16, 8, 4, 2, 1]) for (let i = 0; i < N; i += st) if (!seen[i]) { seen[i] = 1; order.push(i); }
  let q = 0, dirty = true;
  const next = () => { if (q >= order.length) return; const i = order[q++]; const im = new Image(); im.decoding = 'async';
    im.onload = () => { imgs[i] = im; ok[i] = 1; dirty = true; next(); }; im.onerror = next; im.src = src(i); };
  for (let k = 0; k < 6; k++) next();
  const fit = () => { const d = Math.min(2, devicePixelRatio || 1); cv.width = Math.round(cv.clientWidth * d); cv.height = Math.round(cv.clientHeight * d); dirty = true; };
  addEventListener('resize', fit); fit();
  let target = 0, shown = 0, last = -1;
  const draw = (idx) => {
    let k = idx; for (let r = 0; r < N; r++) { if (ok[idx - r]) { k = idx - r; break; } if (ok[idx + r]) { k = idx + r; break; } }
    const im = imgs[k]; if (!im) return;
    const s = Math.max(cv.width / im.width, cv.height / im.height), w = im.width * s, h = im.height * s;
    ctx.drawImage(im, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
  };
  ScrollTrigger.create({
    trigger: '#villa', start: 'top top', end: 'bottom bottom',
    onUpdate: (st) => {
      target = st.progress;
      byId('villaCue').style.opacity = Math.max(0, 1 - st.progress * 8);
      const endIn = Math.min(1, Math.max(0, (st.progress - 0.86) / 0.1));
      byId('villaEnd').style.opacity = endIn;
      byId('villaEnd').style.transform = `translateY(${(1 - endIn) * 30}px)`;
      byId('villa').classList.toggle('done', endIn > 0.6);
    },
  });
  gsap.ticker.add(() => {
    shown += (target - shown) * 0.18;
    const idx = Math.round(shown * (N - 1));
    if (idx !== last || dirty) { draw(idx); last = idx; dirty = false; }
  });
}

})();
