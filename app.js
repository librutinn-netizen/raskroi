/* Учёт раскроев — Mini App. Данные из бумажной тетради. */
const BUILD='20261005a';
if(window.BUILD&&window.BUILD!==BUILD){ try{ location.reload(); }catch{} }
const TG = window.Telegram?.WebApp; TG?.expand?.(); TG?.ready?.();
window.addEventListener('error',e=>{
  const msg='Ошибка: '+(e.message||'unknown');
  try{ toast(msg); }catch{}
  try{
    let d=document.querySelector('#errBox');
    if(!d){ d=document.createElement('div'); d.id='errBox'; d.style.cssText='position:fixed;bottom:10px;left:10px;right:10px;background:#b3261e;color:#fff;padding:10px;border-radius:10px;z-index:999;font-size:12px'; document.body.appendChild(d); }
    d.textContent=msg;
  }catch{}
});
// вкладка, восстановленная из кэша назад/вперёд — всегда перезагружаем свежо
window.addEventListener('pageshow',e=>{ if(e.persisted){ try{ location.reload(); }catch{} } });
const $ = s => document.querySelector(s);
const uid = () => Math.random().toString(36).slice(2,9);
const todayISO = () => new Date().toISOString().slice(0,10);

const PALETTE=['#1a9e54','#e8892b','#2f80ed','#9333ea','#e5484d','#0e9b8b','#d63384','#795548','#00acc1','#3f51b5','#c0ca33','#ff6f00','#607d8b','#ff4081','#7cb342','#5e35b1'];
function seed(){
  const t=todayISO();
  const y=(()=>{const d=new Date();d.setDate(d.getDate()-1);return d.toISOString().slice(0,10)})();
  const m=(n,size,qty,done,urgent,worker)=>({id:uid(),name:n,size:size||'2750 × 1830 мм',qty,unit:'л',done:!!done,urgent:!!urgent,skip:false,assignee:worker||''});
  return {
    raskroi:[
      {id:uid(),title:'Рек МКС 14.12НА',date:t,shop:'Цех 1',note:'Река МКС — как в тетради',
       materials:[m('Белый приф','2750 × 1830',3.5,true,false,'Илья'),m('Зелёный приф','2750 × 1830',9,true,false,'Илья'),m('МДФ 22','2750 × 1830',2,true,false,''),m('Кашемир','2750 × 1830',5,true,false,'Сергей'),m('ДВПО бел','2750 × 1830',4,false,true,'Сергей'),m('Шифер ДСП','2750 × 1830',2,false,false,'Андрей'),m('Кр. табак','2750 × 1830',1,false,false,'Павел')]},
      {id:uid(),title:'Белый прай',date:t,shop:'Цех 1',note:'',
       materials:[m('Белый приф','2750 × 1830',16,true,false,'Илья'),m('Графит приф','2750 × 1830',8.5,true,false,''),m('ДВПО бел','2750 × 1830',22,true,false,''),m('Дуб Буратти','2750 × 1830',4.5,false,true,'Андрей'),m('Табак','—',3,false,false,'Сергей')]},
      {id:uid(),title:'Стан 12.08',date:t,shop:'Цех 2',note:'Стан — полностью напилен',
       materials:[m('Белый приф','2750 × 1830',6,true,false,'Илья'),m('Кашемир приф','2750 × 1830',4,true,false,''),m('МДФ 16','2750 × 1830',2,true,false,''),m('МДФ 19','2750 × 1830',2.5,true,false,''),m('Орех 0729','2750 × 1830',0.5,true,false,''),m('Экспрессив песочный','2750 × 1830',2.5,true,false,''),m('Синий приф','2750 × 1830',1.5,true,false,''),m('Дуб Ойстер','2750 × 1830',1.5,true,false,'')]},
      {id:uid(),title:'ЛДСП 16мм',date:t,shop:'Цех 2',note:'',
       materials:[m('ЛДСП 16мм','2750 × 1830',3,false,true,'Илья'),m('Кромка ПВХ','19 × 0.4 мм',5,false,false,'Андрей'),m('Фурнитура','комплект',1,false,false,'Сергей'),m('Профиль алюминий','3000 мм',2,true,false,'Павел')]},
      {id:uid(),title:'Солянка 30.09 + ДОП',date:y,shop:'Цех 1',note:'Солянка — сборный раскрой',
       materials:[m('Белый приф','2750 × 1830',4,true,false,''),m('Графит приф','2750 × 1830',3,true,false,''),m('Кашемир','2750 × 1830',5,true,false,''),m('МДФ 16','2750 × 1830',3,true,false,''),m('МДФ 19','2750 × 1830',2,true,false,''),m('Табак','2750 × 1830',2,false,false,'')]},
      {id:uid(),title:'ЧЛ Река',date:y,shop:'Цех 2',note:'',
       materials:[m('Кашемир приф','2750 × 1830',2,false,false,''),m('Красный приф','2750 × 1830',1,false,false,''),m('МДФ 16 двухстор','2750 × 1830',2,false,false,''),m('Синий приф','2750 × 1830',3,false,false,'')]},
    ],
    dirs:[],
    accounts:[
      {id:uid(),name:'Илья',color:PALETTE[0]},
      {id:uid(),name:'Сергей',color:PALETTE[1]},
      {id:uid(),name:'Андрей',color:PALETTE[2]},
      {id:uid(),name:'Павел',color:PALETTE[3]},
    ]
  };
}

let DB;
const DB_KEY='raskroi_db_v2';
try{ DB = JSON.parse(localStorage.getItem(DB_KEY)) || null; }catch{ DB=null; }
if(!DB){ // миграция: забираем раскрои из старой версии, справочник начинаем пустым
  try{ const old=JSON.parse(localStorage.getItem('raskroi_db_v1')); if(old&&old.raskroi){ DB={raskroi:old.raskroi,dirs:[]}; } }catch{}
  if(!DB) DB=seed();
}
function saveLocal(){ try{localStorage.setItem(DB_KEY, JSON.stringify(DB));}catch{} try{TG?.CloudStorage?.setItem?.(DB_KEY, JSON.stringify(DB));}catch{} }
// ---------- аккаунты (активный — только на этом устройстве) ----------
function myId(){ try{ return localStorage.getItem('raskroi_me')||''; }catch{ return ''; } }
function setMyId(id){ try{ localStorage.setItem('raskroi_me', id); }catch{} }
function ensureAccounts(){
  if(!Array.isArray(DB.accounts)||!DB.accounts.length){
    DB.accounts=[
      {id:uid(),name:'Илья',color:PALETTE[0]},
      {id:uid(),name:'Сергей',color:PALETTE[1]},
      {id:uid(),name:'Андрей',color:PALETTE[2]},
      {id:uid(),name:'Павел',color:PALETTE[3]},
    ];
  }
  if(DB.currentAccountId) setMyId(DB.currentAccountId); // разовая миграция со старого формата
  delete DB.currentAccountId;
  if(!DB.accounts.some(a=>a.id===myId())) setMyId(DB.accounts[0].id);
}
ensureAccounts();
function dateVal(iso){ return Date.parse((iso||'')+'T00:00:00')||0; }
function ensureCreatedAt(){ DB.raskroi.forEach((r,i)=>{ if(typeof r.createdAt!=='number') r.createdAt=dateVal(r.date)-i; }); }
ensureCreatedAt();
function curAcc(){ return DB.accounts.find(a=>a.id===myId())||DB.accounts[0]; }
function accColorFor(mt){
  if(mt.by){ const a=DB.accounts.find(x=>x.id===mt.by); if(a) return a.color; }
  if(mt.assignee){ const a=DB.accounts.find(x=>x.name===mt.assignee); if(a) return a.color; }
  return '#1a9e54';
}
function accNameFor(mt){
  if(mt.by){ const a=DB.accounts.find(x=>x.id===mt.by); if(a) return a.name; }
  return mt.assignee||'';
}
function accStarterName(mt){
  if(mt.byStart){ const a=DB.accounts.find(x=>x.id===mt.byStart); if(a) return a.name; }
  return '';
}
function accColorById(id){
  const a=DB.accounts.find(x=>x.id===id); return a?a.color:'';
}
function workColor(mt){
  const c=accColorById(mt.byStart); if(c) return c;
  if(mt.assignee){ const a=DB.accounts.find(x=>x.name===mt.assignee); if(a) return a.color; }
  return '#d97e22';
}
// ---------- синхронизация: облако Supabase (если настроено) или свой сервер ---
const CFG = window.APP_CONFIG || {};
const CLOUD = !!(CFG.SUPABASE_URL && CFG.SUPABASE_KEY);
const SYNC_ON = location.protocol.indexOf('http') === 0;
let serverRev = 0, pushT = null, synced = false;
function save(){ saveLocal(); if(!SYNC_ON || !synced) return; clearTimeout(pushT); pushT = setTimeout(pushNow, 500); }
function sbHeaders(extra){
  return Object.assign({ apikey: CFG.SUPABASE_KEY, Authorization: 'Bearer ' + CFG.SUPABASE_KEY }, extra || {});
}
async function cloudGet(){
  try{
    const r = await fetch(CFG.SUPABASE_URL + '/rest/v1/app_state?id=eq.1&select=rev,data', { headers: sbHeaders(), cache: 'no-store' });
    if(!r.ok) return null;
    const j = await r.json();
    return (j && j[0]) ? j[0] : null;
  }catch{ return null; }
}
let cloudStatus = 0, warned401 = false;
async function cloudRev(){
  // лёгкая проверка: только номер ревизии, без скачивания всей базы
  try{
    const r = await fetch(CFG.SUPABASE_URL + '/rest/v1/app_state?id=eq.1&select=rev', { headers: sbHeaders(), cache: 'no-store' });
    cloudStatus = r.status;
    if(!r.ok) return null;
    const j = await r.json();
    return (j && j[0] && typeof j[0].rev === 'number') ? j[0].rev : null;
  }catch{ return null; }
}
async function cloudPut(){
  try{
    const cur = await cloudGet();
    const next = (cur && typeof cur.rev === 'number' ? cur.rev : 0) + 1;
    const body = JSON.stringify({ rev: next, data: DB, updated_at: new Date().toISOString() });
    if(cur){
      const pr = await fetch(CFG.SUPABASE_URL + '/rest/v1/app_state?id=eq.1', { method: 'PATCH', headers: sbHeaders({ 'Content-Type': 'application/json' }), body });
      if(!pr.ok) return null;
    } else {
      const ins = await fetch(CFG.SUPABASE_URL + '/rest/v1/app_state', { method: 'POST', headers: sbHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify({ id: 1, rev: 1, data: DB }) });
      if(!ins.ok) return null;
      return { rev: 1 };
    }
    return { rev: next };
  }catch{ return null; }
}
async function pushNow(){
  if(!SYNC_ON) return;
  try{
    if(CLOUD){ const s = await cloudPut(); if(s) serverRev = s.rev; return; }
    const r = await fetch('/api/state', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ data:DB }) });
    const s = await r.json();
    if(s && typeof s.rev === 'number') serverRev = s.rev;
  }catch{}
}
async function pullState(){
  if(!SYNC_ON) return;
  try{
    if(CLOUD){
      const rv = await cloudRev();
      if(rv === null){
        if(cloudStatus === 401 && !warned401){ warned401 = true; toast('Облако: нет доступа (401) — обнови страницу, не поможет — перетащи папку на сайт заново'); }
        pushNow(); return;
      } // облако пусто — залить локальное
      if(rv > serverRev){
        const s = await cloudGet();
        if(s && s.data && Array.isArray(s.data.raskroi)){
          serverRev = s.rev; DB = s.data; ensureAccounts(); ensureCreatedAt(); saveLocal(); rerender();
        }
      }
      return;
    }
    const r = await fetch('/api/state', { cache:'no-store' });
    if(r.status === 204){ pushNow(); return; } // сервер пуст — залить локальное
    const s = await r.json();
    if(s && typeof s.rev === 'number' && s.rev > serverRev && s.data && Array.isArray(s.data.raskroi)){
      serverRev = s.rev; DB = s.data; ensureAccounts(); ensureCreatedAt(); saveLocal(); rerender();
    }
  }catch{} finally{ synced = true; }
}
function rerender(){
  renderList(); renderDir();
  if(curView === 'detail') renderDetail();
  if(curView === 'acc') renderAcc();
}

let q='', matQ='', monthOff=0;
function shownMonthKey(){ const d=new Date(); d.setDate(1); d.setMonth(d.getMonth()+monthOff); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'); }
function shownMonthName(){ const d=new Date(); d.setDate(1); d.setMonth(d.getMonth()+monthOff); const s=d.toLocaleDateString('ru-RU',{month:'long',year:'numeric'}); return s.charAt(0).toUpperCase()+s.slice(1); }
let currentId=null, formMats=[];

// ---------- helpers ----------
function statusOf(r){
  const act=r.materials.filter(x=>!x.skip);
  const d=act.filter(x=>x.done).length;
  if(act.length===0) return 'new';
  if(d===0) return 'new';
  if(d===act.length) return 'done';
  return 'work';
}
const statusName={work:'В работе',done:'Готов',new:'Не начат'};
const statusCls={work:'work',done:'done',new:'new'};

// ---------- navigation ----------
let curView='list';
function show(name){
  curView=name;
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===name || (name==='detail'&&t.dataset.tab==='list') || (name==='new'&&t.dataset.tab==='list')));
  const map={list:'view-list',detail:'view-detail',new:'view-new',materials:'view-materials',acc:'view-acc'};
  $('#'+map[name]).classList.add('active');
  window.scrollTo(0,0);
  if(name==='materials') renderDir();
  if(name==='acc') renderAcc();
}
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{show(t.dataset.tab); if(t.dataset.tab==='list')renderList();});
document.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>{show('list');renderList();});
const qp=new URLSearchParams(location.search); if(qp.get('action')==='new'){ setTimeout(()=>openNew(),300); }

// ---------- list ----------
function renderList(){
  $('#todayLabel').textContent='Сегодня, '+new Date().toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'});
  const me=curAcc();
  const bm=$('#btnMe');
  if(bm) bm.innerHTML=`<span style="display:block;width:18px;height:18px;border-radius:50%;background:${me.color};margin:auto" title="${esc(me.name)}"></span>`;
  const month=shownMonthKey();
  let arr=[...DB.raskroi]
    .filter(r=>(r.date||'').slice(0,7)===month)
    .sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
  $('#listTitle').textContent=`Раскрои · ${shownMonthName()}`;
  const box=$('#raskroiList'); box.innerHTML='';
  if(!arr.length){ box.innerHTML='<div class="card"><b>📋 В этом месяце пока пусто</b><div class="card-meta"><span>Нажми «+», чтобы добавить раскрой</span></div></div>'; return; }
  arr.forEach(r=>{
    const act=r.materials.filter(x=>!x.skip);
    const el=document.createElement('div'); el.className='card';
    el.innerHTML=`<div class="card-top"><b>${esc(r.title)}</b><span class="badge ${statusCls[statusOf(r)]}">${statusName[statusOf(r)]}</span></div>
      ${barHTML(act,true)}
      <div class="card-meta"><span>📄 ${act.length} материалов</span><span class="cdots">${dotsHTML(act)}<span>${act.filter(x=>x.done).length}/${act.length}</span></span></div>
      ${noteHTML(r)}`;
    el.onclick=()=>openDetail(r.id);
    box.appendChild(el);
  });
}
function esc(s){return String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
// статус материала: todo (не напилено) / work (не закончен) / done (напилено)
function mst(mt){ if(mt.st!=='done'&&mt.st!=='work'&&mt.st!=='todo') mt.st=mt.done?'done':'todo'; return mt.st; }
function whoText(mt,s){
  if(s==='done'){
    const fin=accNameFor(mt), st=accStarterName(mt);
    if(fin&&st&&st!==fin) return `Пилили: ${esc(st)}, ${esc(fin)}`;
    if(fin) return `Пилил: ${esc(fin)}`;
    return 'Напилено';
  }
  if(s==='work'){
    const st=accStarterName(mt)||mt.assignee||'';
    return st?`Пилит: ${esc(st)}`:'Не закончен';
  }
  return 'Не напилено';
}
function cycleSt(mt){
  const me=curAcc().id, s=mst(mt);
  if(s==='todo'){ mt.st='work'; mt.done=false; mt.byStart=me; }
  else if(s==='work'){ mt.st='done'; mt.done=true; mt.by=me; if(!mt.byStart) mt.byStart=me; }
  else { mt.st='todo'; mt.done=false; mt.by=null; mt.byStart=null; }
}
function barHTML(act,slim){
  const n=act.length, d=act.filter(x=>mst(x)==='done').length, w=act.filter(x=>mst(x)==='work').length;
  const cls='progress'+(slim?' slim':'')+(n&&d===n?' blue':'');
  if(!n||d===n) return `<div class="${cls}"><i style="width:${n?100:0}%"></i></div>`;
  return `<div class="${cls} stack"><i style="width:${Math.round(d/n*100)}%"></i><em style="width:${Math.round(w/n*100)}%"></em></div>`;
}
function dotsHTML(act){
  return [...new Set(act.filter(x=>mst(x)==='done').map(x=>accColorFor(x)))].slice(0,6).map(c=>`<i class="pdot" style="background:${c}"></i>`).join('');
}
function noteHTML(r){
  const t=(r.note||'').trim().split('\n')[0].slice(0,60);
  return t?`<div class="card-note">📝 ${esc(t)}</div>`:'';
}

// ---------- фирменные попапы ----------
let amResolve=null;
function amShow({title,text,input,value,okText,suggest}){
  return new Promise(res=>{
    amResolve=res;
    $('#amTitle').textContent=title||'';
    $('#amText').textContent=text||'';
    $('#amText').classList.toggle('hidden',!text);
    const inp=$('#amInput');
    if(input){ inp.classList.remove('hidden'); inp.value=value||''; inp.oninput=suggest?renderPromptSuggest:null; inp.onfocus=suggest?renderPromptSuggest:null; }
    else inp.classList.add('hidden');
    $('#amCancel').classList.toggle('hidden',!input && !text);
    $('#amOk').textContent=okText||'ОК';
    $('#appModal').classList.remove('hidden');
    if(input){ $('#amSuggest').innerHTML=''; if(suggest) renderPromptSuggest(); setTimeout(()=>inp.focus(),120); }
  });
}
$('#amCancel').onclick=()=>{ $('#appModal').classList.add('hidden'); if(amResolve){amResolve(null);amResolve=null;} };
$('#amOk').onclick=()=>{ const inp=$('#amInput'); const v=inp.classList.contains('hidden')?true:inp.value; $('#appModal').classList.add('hidden'); if(amResolve){amResolve(v);amResolve=null;} };
$('#appModal').addEventListener('click',e=>{ if(e.target.id==='appModal'){ $('#appModal').classList.add('hidden'); if(amResolve){amResolve(null);amResolve=null;} } });
const appConfirm=(title,text,okText)=>amShow({title,text,okText}).then(v=>v===true);
const appPrompt=(title,def,suggest)=>amShow({title,input:true,value:def,suggest});
function renderPromptSuggest(){
  const box=$('#amSuggest'); if(!box) return;
  const inp=$('#amInput');
  const q=(inp.value||'').toLowerCase();
  const items=DB.dirs.filter(n=>n.toLowerCase().includes(q)).sort((a,b)=>a.localeCompare(b,'ru')).slice(0,7);
  box.innerHTML='';
  items.forEach(n=>{
    const b=document.createElement('button'); b.type='button'; b.textContent=n;
    b.onmousedown=e=>{ e.preventDefault(); inp.value=n; box.innerHTML=''; inp.focus(); };
    box.appendChild(b);
  });
}
let toastT=null;
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.remove('hidden'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.add('hidden'),2200); }
$('#searchInput').oninput=e=>{q=e.target.value;renderSearchDrop();};
function showSpot(){ $('#spot').classList.remove('hidden'); }
function hideSpot(){ $('#spot').classList.add('hidden'); }
$('#searchInput').addEventListener('focus',showSpot);
$('#searchInput').addEventListener('blur',()=>setTimeout(()=>{ if($('#searchDrop').classList.contains('hidden')) hideSpot(); },150));
$('#spot').onclick=()=>{ hideSpot(); $('#searchDrop').classList.add('hidden'); try{$('#searchInput').blur();}catch{} };
function monthOffFor(key){ const p=(key||'').split('-'); const y=+p[0], m=+p[1]; if(!y||!m) return 0; const n=new Date(); return (y-n.getFullYear())*12+((m-1)-n.getMonth()); }
function monthNameOf(key){ const p=(key||'').split('-'); const y=+p[0], m=+p[1]; if(!y||!m) return ''; const s=new Date(y,m-1,1).toLocaleDateString('ru-RU',{month:'long',year:'numeric'}); return s.charAt(0).toUpperCase()+s.slice(1); }
function renderSearchDrop(){
  const box=$('#searchDrop');
  const query=(q||'').trim().toLowerCase();
  if(!query){ box.classList.add('hidden'); box.innerHTML=''; return; }
  const hits=[...DB.raskroi].filter(r=>r.title.toLowerCase().includes(query)).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,8);
  if(!hits.length){ box.classList.add('hidden'); box.innerHTML=''; return; }
  box.innerHTML='';
  hits.forEach(r=>{
    const b=document.createElement('button'); b.type='button'; b.className='sr-item';
    b.innerHTML=`<span>${esc(r.title)}</span><small>${monthNameOf((r.date||'').slice(0,7))}</small>`;
    b.onmousedown=e=>{ e.preventDefault(); monthOff=monthOffFor((r.date||'').slice(0,7)); q=''; $('#searchInput').value=''; box.classList.add('hidden'); hideSpot(); renderList(); openDetail(r.id); };
    box.appendChild(b);
  });
  box.classList.remove('hidden'); showSpot();
}
document.addEventListener('click',e=>{ if(!e.target.closest('.search-wrap')){ $('#searchDrop').classList.add('hidden'); hideSpot(); } });
$('#mPrev').onclick=()=>{ monthOff--; renderList(); };
$('#mNext').onclick=()=>{ monthOff++; renderList(); };
function monthNameFor(off){ const d=new Date(); d.setDate(1); d.setMonth(d.getMonth()+off); const s=d.toLocaleDateString('ru-RU',{month:'long',year:'numeric'}); return s.charAt(0).toUpperCase()+s.slice(1); }
function monthKeyFor(off){ const d=new Date(); d.setDate(1); d.setMonth(d.getMonth()+off); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'); }
function openMonthMenu(){
  const menu=$('#mMonthMenu');
  const items=[];
  for(let k=-11;k<=1;k++){
    const key=monthKeyFor(k);
    items.push({key,name:monthNameFor(k),off:k,count:DB.raskroi.filter(r=>(r.date||'').slice(0,7)===key).length});
  }
  items.reverse();
  menu.innerHTML='';
  items.forEach(it=>{
    const b=document.createElement('button'); b.type='button';
    b.className='mm-item'+(shownMonthKey()===it.key?' sel':'');
    b.innerHTML=`<span>${it.name}</span><span class="mm-count">${it.count}</span>`;
    b.onclick=()=>{ monthOff=it.off; menu.classList.add('hidden'); renderList(); };
    menu.appendChild(b);
  });
  menu.classList.remove('hidden');
}
$('#mMonthBtn').onclick=e=>{ e.stopPropagation(); const m=$('#mMonthMenu'); m.classList.contains('hidden')?openMonthMenu():m.classList.add('hidden'); };
document.addEventListener('click',e=>{ if(!e.target.closest('.month-pick')) $('#mMonthMenu').classList.add('hidden'); });
$('#btnMe').onclick=()=>show('acc');
$('#fab').onclick=()=>openNew();

// ---------- detail ----------
function openDetail(id){ currentId=id; renderDetail(); show('detail'); }
function cur(){ return DB.raskroi.find(r=>r.id===currentId); }
function renderDetail(){
  const r=cur(); if(!r) return;
  if(quickOpen&&!$('#quickAddRow')) quickOpen=false;
  $('#detailTitle').textContent=r.title;
  const dn=$('#detailNote');
  if(r.note&&r.note.trim()){ dn.textContent=r.note; dn.classList.remove('hidden'); }
  else { dn.textContent=''; dn.classList.add('hidden'); }
  const act=r.materials.filter(x=>!x.skip), d=act.filter(x=>x.done).length;
  $('#detailCount').textContent=` ${act.length} материалов `; $('#detailFrac').textContent=`${d}/${act.length}`;
  $('#detailBarBox').innerHTML=barHTML(act,false);
  const box=$('#detailMats'); box.innerHTML='';
  r.materials.forEach(mt=>{
    const s=mst(mt);
    const col=s==='done'?accColorFor(mt):'';
    const byName=s==='done'?accNameFor(mt):'';
    const starter=accStarterName(mt);
    const wcol=s==='work'?workColor(mt):'';
    const scol=(s==='done'&&starter&&mt.byStart!==mt.by)?accColorById(mt.byStart):'';
    const el=document.createElement('div');
    el.className='mat'+(s==='done'?' done':'')+(s==='work'?' work':'')+(mt.skip?' skip':'');
    const pillHtml=`<span class="stxt dim">${whoText(mt,s)}</span>`;
    const rowInner=`<div class="mat-main"><div class="mat-line1"><span class="mat-group"><b>${esc(mt.name)}${mt.size?` <small>${esc(mt.size)}</small>`:''}</b>${mt.skip?'<span class="stxt dim">Пропуск</span>':pillHtml}${mt.assignee?`<span class="worker">👤 ${esc(mt.assignee)}</span>`:''}</span><div class="mat-x"><button title="Удалить из раскроя">×</button></div></div></div>`;
    if(col&&scol){
      el.setAttribute('style',`border:0;padding:2px;background:linear-gradient(to right,${scol} 50%,${col} 50%)`);
      el.innerHTML=`<div class="mat-in" style="background-image:linear-gradient(to right,${scol}22 50%,${col}22 50%),linear-gradient(var(--card),var(--card))">${rowInner}</div>`;
    }
    else if(s==='work'){
      el.setAttribute('style',`border:0;padding:2px;background:linear-gradient(to right,${wcol} 50%,transparent 50%)`);
      el.innerHTML=`<div class="mat-in" style="background-image:linear-gradient(to right,${wcol}22 50%,transparent 50%),linear-gradient(var(--card),var(--card))">${rowInner}</div>`;
    }
    else {
      if(col) el.setAttribute('style',`border-color:${col};background:${col}22`);
      el.innerHTML=rowInner;
    }
    el.onclick=()=>{ // тап = следующий статус: не напилено → не закончен → напилено
      if(!mt.skip){ cycleSt(mt); save(); renderDetail(); renderList(); TG?.HapticFeedback?.selectionChanged?.(); }
    };
    el.querySelector('.mat-x button').onclick=e=>{
      e.stopPropagation();
      r.materials=r.materials.filter(m=>m.id!==mt.id);
      save(); renderDetail(); renderList();
    };
    box.appendChild(el);
  });
}
let quickOpen=false;
$('#btnEditPlan').onclick=()=>startQuickAdd();
function startQuickAdd(){
  if(quickOpen||$('#quickAddRow')) return;
  if(!cur()) return;
  quickOpen=true;
  const box=$('#detailMats');
  const d=document.createElement('div'); d.className='fmat'; d.id='quickAddRow';
  d.innerHTML=`<div class="r"><input class="fm-n" placeholder="Название материала" autocomplete="off"><button class="fm-x btn" title="Отмена">×</button></div>`;
  box.appendChild(d);
  const inp=d.querySelector('input');
  const showQ=()=>{
    d.querySelectorAll('.suggest').forEach(s=>s.remove());
    const qv=(inp.value||'').toLowerCase();
    const items=DB.dirs.filter(n=>n.toLowerCase().includes(qv)).sort((a,b)=>a.localeCompare(b,'ru')).slice(0,7);
    if(!items.length) return;
    const bx=document.createElement('div'); bx.className='suggest';
    items.forEach(n=>{
      const b=document.createElement('button'); b.type='button'; b.textContent=n;
      b.onmousedown=e=>{ e.preventDefault(); inp.value=n; commitQuickAdd(); };
      bx.appendChild(b);
    });
    d.appendChild(bx);
  };
  inp.oninput=showQ; inp.onfocus=showQ;
  inp.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); commitQuickAdd(); } };
  inp.onblur=()=>setTimeout(()=>{ d.querySelectorAll('.suggest').forEach(s=>s.remove()); if(quickOpen) commitQuickAdd(); },150);
  d.querySelector('button').onclick=e=>{ e.stopPropagation(); cancelQuickAdd(); };
  setTimeout(()=>inp.focus(),60);
}
function cancelQuickAdd(){ quickOpen=false; const dd=$('#quickAddRow'); if(dd) dd.remove(); }
function commitQuickAdd(){
  if(!quickOpen) return;
  const inp=document.querySelector('#quickAddRow input');
  const v=inp?inp.value.trim():'';
  quickOpen=false;
  if(!v){ renderDetail(); return; }
  if(!DB.dirs.includes(v)) DB.dirs.unshift(v);
  cur().materials.push({id:uid(),name:v,size:'',qty:1,unit:'л',done:false,st:'todo',urgent:false,skip:false,assignee:''});
  save(); renderDetail(); renderList();
}
$('#btnDeleteR').onclick=async()=>{ if(await appConfirm('Удалить раскрой?','Действие нельзя отменить.','Удалить')){ DB.raskroi=DB.raskroi.filter(r=>r.id!==currentId); save(); show('list'); renderList(); }};
$('#detailMenu').onclick=async()=>{
  const r=cur();
  const a=await appPrompt('Переименовать раскрой',r.title); if(a&&a.trim()){r.title=a.trim();save();renderDetail();}
};

// ---------- новый раскрой ----------
function openNew(){
  formMats=[];
  $('#fTitle').value=''; $('#fNote').value='';
  renderFormMats(); show('new');
  setTimeout(()=>$('#fTitle')?.focus(),100);
}
function closeSuggest(){ document.querySelectorAll('.suggest').forEach(s=>s.remove()); }
document.addEventListener('click',e=>{ if(!e.target.closest('.fmat')) closeSuggest(); });
function showSuggest(input){
  closeSuggest();
  const i=+input.dataset.i;
  const q=(input.value||'').toLowerCase();
  const items=DB.dirs.filter(n=>n.toLowerCase().includes(q)).sort((a,b)=>a.localeCompare(b,'ru')).slice(0,8);
  if(!items.length) return;
  const box=document.createElement('div'); box.className='suggest';
  items.forEach(n=>{
    const b=document.createElement('button'); b.type='button'; b.textContent=n;
    b.onmousedown=e=>{ e.preventDefault(); formMats[i].name=n; input.value=n; closeSuggest(); };
    box.appendChild(b);
  });
  input.closest('.fmat').appendChild(box);
}
function renderFormMats(){
  closeSuggest();
  const box=$('#fMats'); box.innerHTML='';
  if(!formMats.length){ box.innerHTML='<p class="hint">Материалов пока нет — нажми «+ Добавить материал».</p>'; return; }
  formMats.forEach((m,i)=>{
    const d=document.createElement('div'); d.className='fmat';
    d.innerHTML=`<div class="r"><input data-i="${i}" class="fm-n" placeholder="Название материала" value="${esc(m.name)}" autocomplete="off"><button data-i="${i}" class="fm-x btn">×</button></div>`;
    box.appendChild(d);
  });
  box.querySelectorAll('.fm-n').forEach(s=>{
    s.oninput=e=>{ formMats[+e.target.dataset.i].name=e.target.value; showSuggest(e.target); };
    s.onfocus=e=>showSuggest(e.target);
    s.onchange=e=>{ formMats[+e.target.dataset.i].name=e.target.value; };
    s.onblur=()=>setTimeout(closeSuggest,150);
  });
  box.querySelectorAll('.fm-x').forEach(b=>b.onclick=e=>{formMats.splice(+e.target.dataset.i,1);renderFormMats();});
}
$('#btnAddMat').onclick=()=>{
  formMats.push({name:''});
  renderFormMats();
  const inputs=document.querySelectorAll('#fMats .fm-n');
  const last=inputs[inputs.length-1];
  if(last) last.focus();
};
$('#btnSave').onclick=()=>{
  const title=$('#fTitle').value.trim()||'Новый раскрой';
  const clean=formMats.map(m=>({name:(m.name||'').trim()})).filter(m=>m.name);
  if(!clean.length){ toast('Добавь хотя бы один материал'); return; }
  clean.forEach(m=>{ if(!DB.dirs.includes(m.name)) DB.dirs.unshift(m.name); });
  const shownKey=shownMonthKey();
  const rDate = shownKey===todayISO().slice(0,7) ? todayISO() : shownKey+'-01';
  const r={id:uid(),title,date:rDate,shop:'Цех 1',note:$('#fNote').value,createdAt:Date.now(),
    materials:clean.map(m=>({id:uid(),name:m.name,size:'',qty:1,unit:m.name.includes('Кромка')?'м.п.':m.name.includes('Фурнитура')?'компл.':'л',done:false,urgent:false,skip:false,assignee:''}))};
  DB.raskroi.unshift(r); save(); TG?.HapticFeedback?.notificationOccurred?.('success');
  show('list'); renderList(); openDetail(r.id);
};

// ---------- справочник ----------
function renderDir(){
  const box=$('#matDir'); box.innerHTML='';
  const list=DB.dirs.filter(n=>n.toLowerCase().includes(matQ.toLowerCase())).sort((a,b)=>a.localeCompare(b,'ru'));
  if(!list.length){ box.innerHTML='<div class="card">Справочник пуст. Добавь материал через поле выше — или он появится сам при сохранении раскроя.</div>'; return; }
  list.forEach(n=>{
    const d=document.createElement('div'); d.className='mat'; d.style.cursor='default';
    d.innerHTML=`<div><b>${esc(n)}</b></div><div class="mat-x"><button title="Удалить из справочника">×</button></div>`;
    d.querySelector('button').onclick=()=>{ DB.dirs=DB.dirs.filter(x=>x!==n); save(); renderDir(); };
    box.appendChild(d);
  });
}
$('#matSearch').oninput=e=>{matQ=e.target.value;renderDir();};
$('#btnNewMat').onclick=()=>{ const v=$('#newMatName').value.trim(); if(!v)return; DB.dirs.unshift(v); $('#newMatName').value=''; save(); renderDir(); };

// ---------- аккаунты ----------
function closeColorMenu(){ document.querySelectorAll('.color-menu').forEach(m=>m.remove()); }
function openColorMenu(anchor,acc,after){
  closeColorMenu();
  const r=anchor.getBoundingClientRect();
  const m=document.createElement('div'); m.className='color-menu';
  PALETTE.forEach(c=>{
    const b=document.createElement('button'); b.type='button';
    b.style.background=c; if(c===acc.color) b.classList.add('sel');
    b.onmousedown=e=>{ e.preventDefault(); e.stopPropagation(); acc.color=c; save(); if(after) after(); closeColorMenu(); };
    m.appendChild(b);
  });
  document.body.appendChild(m);
  const W=m.offsetWidth||166, H=m.offsetHeight||166;
  m.style.left=Math.max(8,Math.min(r.left,innerWidth-W-8))+'px';
  let y=r.bottom+6; if(y+H>innerHeight-8) y=Math.max(8,r.top-H-6);
  m.style.top=y+'px';
}
document.addEventListener('click',e=>{ if(!e.target.closest('.color-menu')&&!e.target.closest('.acc-dot')) closeColorMenu(); });
function renderAcc(){
  const box=$('#accList'); box.innerHTML='';
  const me=curAcc();
  DB.accounts.forEach(a=>{
    const d=document.createElement('div'); d.className='mat'+(a.id===me.id?' done':'');
    if(a.id===me.id) d.setAttribute('style',`border-left-color:${a.color}`);
    d.innerHTML=`<div style="display:flex;align-items:center;gap:10px"><span class="acc-dot" style="background:${a.color}" title="Сменить цвет"></span><div><b>${esc(a.name)}</b>${a.desc?`<span class="acc-desc">${esc(a.desc)}</span>`:''}</div></div>
      <div class="mat-right">${a.id===me.id?'<span class="me-badge">Я</span>':''}<button class="btn acc-edit" title="Редактировать">✏️</button><span class="mat-x"><button class="acc-del" title="Удалить">×</button></span></div>`;
    d.querySelector('.acc-dot').onclick=e=>{ e.stopPropagation(); openColorMenu(e.currentTarget,a,()=>{ renderAcc(); renderList(); }); };
    d.querySelector('.acc-edit').onclick=e=>{ e.stopPropagation(); openAccEdit(a.id); };
    d.querySelector('.acc-del').onclick=e=>{
      e.stopPropagation();
      if(DB.accounts.length<=1){ toast('Должен остаться хотя бы один'); return; }
      DB.accounts=DB.accounts.filter(x=>x.id!==a.id);
      if(myId()===a.id) setMyId(DB.accounts[0].id);
      save(); renderAcc(); renderList(); renderDetail();
    };
    d.onclick=()=>{ setMyId(a.id); renderAcc(); renderList(); toast('Пилишь как '+a.name); };
    box.appendChild(d);
  });
}
let editAccId=null;
function openAccEdit(id){
  const a=DB.accounts.find(x=>x.id===id); if(!a) return;
  editAccId=id;
  $('#accName').value=a.name; $('#accDesc').value=a.desc||'';
  $('#accModal').classList.remove('hidden');
  setTimeout(()=>$('#accName').focus(),120);
}
$('#accCancel').onclick=()=>$('#accModal').classList.add('hidden');
$('#accSave').onclick=()=>{
  const a=DB.accounts.find(x=>x.id===editAccId); if(!a) return;
  const n=$('#accName').value.trim();
  if(!n){ toast('Введи имя'); return; }
  a.name=n; a.desc=$('#accDesc').value.trim();
  save(); $('#accModal').classList.add('hidden'); renderAcc(); renderList();
};
$('#btnNewAcc').onclick=()=>{
  const v=$('#newAccName').value.trim();
  if(!v){ toast('Введи имя аккаунта'); $('#newAccName').focus(); return; }
  const used=DB.accounts.map(a=>a.color);
  const color=PALETTE.find(c=>!used.includes(c))||PALETTE[DB.accounts.length%PALETTE.length];
  DB.accounts.push({id:uid(),name:v,desc:'',color});
  setMyId(DB.accounts[DB.accounts.length-1].id);
  $('#newAccName').value=''; save(); renderAcc(); renderList();
};

// ---------- тема ----------
function applyTheme(t){
  const dark=t==='dark';
  document.body.classList.toggle('dark',dark);
  document.querySelectorAll('.btnTheme').forEach(b=>b.textContent=dark?'☀️':'🌙');
  try{localStorage.setItem('raskroi_theme',t);}catch{}
}
document.querySelectorAll('.btnTheme').forEach(b=>b.onclick=()=>applyTheme(document.body.classList.contains('dark')?'light':'dark'));

// init
saveLocal(); renderList(); renderDir();
applyTheme(localStorage.getItem('raskroi_theme') || (TG?.colorScheme==='dark'?'dark':'light'));
pullState(); setInterval(()=>{ if(!document.hidden) pullState(); }, CLOUD?5000:3000);
// мгновенная синхронизация через Realtime (если включена репликация таблицы)
try{
  if(CLOUD && window.supabase){
    const sb=window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_KEY);
    sb.channel('state').on('postgres_changes',{event:'*',schema:'public',table:'app_state'},()=>{ pullState(); })
      .subscribe();
  }
}catch{}
if('serviceWorker' in navigator){
  const updSW=()=>{ try{ navigator.serviceWorker.getRegistration().then(r=>{ if(r) r.update().catch(()=>{}); }); }catch{} };
  setInterval(updSW, 60*60*1000);
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) updSW(); });
}
