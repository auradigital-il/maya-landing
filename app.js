// MAYA · קוד משותף לכל העמודים

// מספר הוואטסאפ של מאיה, בפורמט בינלאומי בלי + (למשל 971500000000). להחליף כשנקבל.
const WA = '';
const RATE = 0.92; // שער דירהם-שקל לדוגמה
const DLD_FEE = 0.04; // אגרת רישום במחלקת המקרקעין בדובאי

// SHIONE: נתונים אמיתיים מהפוסט של מאיה. מחיר ותוכנית תשלומים: עוד לא פורסמו.
// השאר: דוגמה בלבד, יוחלפו בפרויקטים שמאיה עובדת איתם.
const PROJECTS = [
  {slug:'shione', name:'SHIONE', dev:'BEYOND · OMNIYAT', area:'דובאי איילנדס', img:'img/shione-aerial.jpg', badge:'NEW LAUNCH', priceAED:null, plan:null, hand:null, real:true},
  {name:'פרויקט לדוגמה א׳', dev:'יזם מוביל', area:'ג׳ומיירה וילג׳ סירקל', priceAED:950000, plan:'10/70/20', hand:2027},
  {name:'פרויקט לדוגמה ב׳', dev:'יזם מוביל', area:'דובאי הילס', priceAED:2100000, plan:'20/50/30', hand:2028},
  {name:'פרויקט לדוגמה ג׳', dev:'יזם מוביל', area:'ביזנס ביי', priceAED:1450000, plan:'20/40/40', hand:2028},
  {name:'פרויקט לדוגמה ד׳', dev:'יזם מוביל', area:'האי יאס, אבו דאבי', priceAED:1250000, plan:'10/40/50', hand:2029},
  {name:'פרויקט לדוגמה ה׳', dev:'יזם מוביל', area:'דובאי קריק הארבור', priceAED:3400000, plan:'20/50/30', hand:2029},
];

const ils = n => '₪' + Math.round(n).toLocaleString('he-IL');
const aed = n => 'AED ' + Math.round(n).toLocaleString('en-US');
const ilsShort = n => n >= 1e6 ? (n/1e6).toFixed(2).replace(/\.?0+$/,'') + ' מיליון ₪' : Math.round(n/1000) + ' אלף ₪';
const entryOf = p => p.priceAED * (Number(p.plan.split('/')[0])/100 + DLD_FEE) * RATE;

// כותרת שמתמלאת בגלילה
const topBar = document.querySelector('.top');
const onScroll = () => topBar && topBar.classList.toggle('solid', scrollY > 60);
addEventListener('scroll', onScroll, {passive:true}); onScroll();

// חשיפה בגלילה
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.12});
document.querySelectorAll('.rv').forEach(el => io.observe(el));

// מחשבון תשלומים
function initCalc(root, preset){
  if (!root) return;
  const $ = s => root.querySelector(s);
  const price=$('[name=price]'), plan=$('[name=plan]'), months=$('[name=months]');
  if (preset){ price.value = preset.price; if (preset.plan) plan.value = preset.plan; }
  const run = () => {
    const P=+price.value, m=+months.value, [d,c,h]=plan.value.split(',').map(Number);
    $('[data-o=price]').textContent = aed(P) + ' · ' + ilsShort(P*RATE);
    $('[data-o=months]').textContent = m + ' חודשים';
    const now=(d/100+DLD_FEE)*P, during=P*c/100, hand=P*h/100, n=Math.max(1,Math.round(m/6));
    const post = plan.selectedOptions[0].dataset.post === '1';
    $('[data-o=now]').textContent = ils(now*RATE);
    $('[data-o=tl]').innerHTML = `
      <div class="row"><i></i><div><b>ביום החתימה</b><span>מקדמה ${d}% ואגרת רישום 4%</span></div><div class="amt">${ils(now*RATE)}<small>${aed(now)}</small></div></div>
      <div class="row"><i></i><div><b>במהלך הבנייה</b><span>${c}% ב-${n} תשלומים, בערך כל חצי שנה</span></div><div class="amt">${ils(during*RATE/n)}<small>לתשלום · סה״כ ${ils(during*RATE)}</small></div></div>
      <div class="row"><i></i><div><b>${post?'אחרי המסירה':'בקבלת המפתח'}</b><span>${h}% ${post?'בפריסה אחרי שהדירה כבר מושכרת':'אפשר לממן במשכנתא מבנק מקומי'}</span></div><div class="amt">${ils(hand*RATE)}<small>${aed(hand)}</small></div></div>`;
  };
  root.addEventListener('input', run); run();
  return run;
}

// פנייה בוואטסאפ
function waOpen(msg){
  if (WA) window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank');
  else alert('הכפתור עובד. חסר רק המספר של מאיה בוואטסאפ.\n\nההודעה שתישלח:\n' + msg);
}
document.addEventListener('click', e => {
  const a = e.target.closest('[data-wa]'); if (!a) return;
  e.preventDefault(); waOpen(a.dataset.wa || 'היי מאיה, אשמח לשמוע על פרויקטים בדובאי.');
});
const form = document.querySelector('#leadForm');
form && form.addEventListener('submit', e => {
  e.preventDefault(); const f = new FormData(form);
  waOpen(`היי מאיה, אני ${f.get('name')} (${f.get('phone')}). ${f.get('budget')}. ${f.get('goal')}.${f.get('project')?' מתעניין/ת ב-'+f.get('project')+'.':''}`);
});

// תמונה בגדול
const lb = document.querySelector('.lightbox');
if (lb){
  document.querySelectorAll('.gallery figure, .gallery-row figure').forEach(f => f.addEventListener('click', () => { lb.querySelector('img').src = f.querySelector('img').src; lb.classList.add('on'); }));
  lb.addEventListener('click', () => lb.classList.remove('on'));
  addEventListener('keydown', e => e.key === 'Escape' && lb.classList.remove('on'));
}
