/* Gamifikasi Alfaqih – enjin game PAI Tingkatan 4 · @powered by alfaqih */
(function(){
'use strict';
const L = window.LESSON;
document.title = `${L.game} – P${L.no} ${L.title} | Gamifikasi Alfaqih`;
const root = document.documentElement;
if(L.theme){root.style.setProperty('--a',L.theme.a);root.style.setProperty('--b',L.theme.b)}
['https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Amiri:wght@400;700&family=Lexend:wght@400;600;700;800;900&display=swap'].forEach(h=>{const l=document.createElement('link');l.rel='stylesheet';l.href=h;document.head.appendChild(l)});

/* ---------- tetapan level (dalaman sahaja) ---------- */
const DIFF={
  1:{time:28,opts:3,lives:4,bubT:15,preview:5000,mult:1,decoy:false},
  2:{time:20,opts:4,lives:3,bubT:11,preview:3000,mult:1.5,decoy:false},
  3:{time:13,opts:4,lives:3,bubT:8,preview:1500,mult:2,decoy:true},
};
const TYPE_LABEL={mcq:'Kuiz Pantas',tf:'Benar / Salah',sort:'Asingkan',order:'Susun Tertib',match:'Padan Kad',chain:'Sambung Ayat',bubble:'Pecah Gelembung',pick:'Pilih Tepat',boss:'Pertarungan Bos'};
const TYPE_HOW={mcq:'Pilih jawapan yang tepat sebelum masa tamat.',tf:'Tentukan BENAR atau SALAH secepat mungkin.',sort:'Masukkan setiap kad ke kumpulan yang betul.',order:'Sentuh item mengikut tertib yang betul.',match:'Ingat kedudukan kad, kemudian padankan pasangannya.',chain:'Pilih sambungan bacaan yang betul.',bubble:'Pecahkan gelembung jawapan yang betul sebelum ia terlepas!',pick:'Pilih label yang tepat bagi setiap soalan.',boss:'Jawab dengan tepat untuk menumpaskan bos. Nyawa terhad!'};

/* ---------- keadaan ---------- */
const KEY='alfaqih_t4_'+L.id;
const fresh=()=>({name:'',lv:2,st:L.stages.map(()=>({stars:0,score:0}))});
let S=fresh();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const load=()=>{try{const v=JSON.parse(localStorage.getItem(KEY));if(v&&v.st&&v.st.length===L.stages.length)return v}catch(e){}return null};
let sound=true;

/* ---------- util ---------- */
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const totStars=()=>S.st.reduce((s,x)=>s+x.stars,0);
const totScore=()=>S.st.reduce((s,x)=>s+x.score,0);
const MAXS=L.stages.length*3;
const isAr=s=>/[؀-ۿ]/.test(s)&&!/[a-zA-Z]{3,}/.test(s);
const keys='ABCD';

/* ---------- bunyi ---------- */
let AC=null;
function sfx(t){if(!sound)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();
 const N={ok:[[660,.07,'triangle'],[990,.12,'triangle']],no:[[180,.16,'sawtooth'],[120,.2,'sawtooth']],win:[[523,.1,'square'],[659,.1,'square'],[784,.1,'square'],[1046,.35,'triangle']],tap:[[600,.04,'triangle']],star:[[1175,.12,'triangle']],pop:[[1300,.05,'sine'],[900,.06,'sine']],hit:[[150,.1,'sawtooth'],[70,.2,'square']],combo:[[880,.06,'square'],[1320,.12,'square']],tick:[[1500,.02,'square']]}[t]||[[440,.1,'sine']];
 let at=AC.currentTime;N.forEach(([f,d,w])=>{const o=AC.createOscillator(),g=AC.createGain();o.type=w;o.frequency.value=f;g.gain.setValueAtTime(.14,at);g.gain.exponentialRampToValueAtTime(.001,at+d);o.connect(g);g.connect(AC.destination);o.start(at);o.stop(at+d+.02);at+=d*.9})}catch(e){}}

/* ---------- fx ---------- */
let cv,cx,parts=[];
function confetti(n=140){const cols=['#22D3EE','#A78BFA','#FFC83D','#2EE59D','#FF4D6D','#fff'];const st=!parts.length;
 for(let i=0;i<n;i++)parts.push({x:innerWidth/2,y:innerHeight*.35,vx:(Math.random()-.5)*18,vy:Math.random()*-15-4,r:Math.random()*8+4,c:cols[i%cols.length],a:Math.random()*6,life:110+Math.random()*70});if(st)loop()}
function loop(){cx.clearRect(0,0,cv.width,cv.height);parts.forEach(p=>{p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.a+=.2;p.life--;cx.save();cx.translate(p.x,p.y);cx.rotate(p.a);cx.fillStyle=p.c;cx.fillRect(-p.r/2,-p.r/3,p.r,p.r*.6);cx.restore()});
 parts=parts.filter(p=>p.life>0&&p.y<cv.height+40);if(parts.length)requestAnimationFrame(loop);else cx.clearRect(0,0,cv.width,cv.height)}
function toast(t,c){const e=$('toast');e.textContent=t;e.style.color=c||'var(--a)';e.style.textShadow=`0 0 30px ${c||'var(--a)'}`;e.classList.remove('go');void e.offsetWidth;e.classList.add('go')}
function flash(){const p=$('play');if(!p)return;p.classList.remove('flash');void p.offsetWidth;p.classList.add('flash')}
let tmr=null,bubT=[],autoT=null;
function startTimer(sec,onEnd){stopTimer();const el=$('tm');const bar=el.querySelector('i');const t0=performance.now();let lastTick=0;
 tmr=setInterval(()=>{const left=sec-(performance.now()-t0)/1000;const p=Math.max(0,left/sec);bar.style.width=(p*100)+'%';el.classList.toggle('warn',p<.3);
  if(p<.3&&left>0&&Math.ceil(left)!==lastTick){lastTick=Math.ceil(left);sfx('tick')}
  if(left<=0){stopTimer();onEnd()}},80);
 return()=>Math.max(0,sec-(performance.now()-t0)/1000)}
function stopTimer(){if(tmr){clearInterval(tmr);tmr=null}}
function clearAll(){stopTimer();bubT.forEach(clearTimeout);bubT=[];if(autoT){clearTimeout(autoT);autoT=null}}

/* ---------- kerangka ---------- */
const BID={'Al-Quran':'📖','Hadis':'📜','Akidah':'☝️','Fiqh':'🕋','Sirah dan Tamadun Islam':'🏛️','Akhlak Islamiah':'💎'};
document.body.innerHTML=`
<canvas id="fx"></canvas><div class="toast" id="toast"></div>
<div class="wrap">
 <div class="hud glass" id="hud" style="display:none">
  <div class="who"><div class="ava">${L.theme&&L.theme.icon||'🎮'}</div><div><div id="hName" style="line-height:1.1">-</div><div style="font-size:.8rem;color:var(--mut);font-weight:600">P${L.no} · ${esc(L.game)}</div></div></div>
  <div class="pill lv" id="hLv">Level 2</div>
  <div class="pill">⭐ <span id="hStars">0</span>/${MAXS}</div>
  <div class="pill">⚡ <span id="hScore">0</span></div>
  <button class="ibtn" id="sndBtn">🔊</button><button class="ibtn" id="mapBtn">🗺️ Misi</button>
 </div>

 <section class="scr on" id="sSplash"><div class="glass splash">
  <div class="kicker">${BID[L.bidang]||'🎮'} ${esc(L.bidang)} · Pelajaran ${L.no}</div>
  <div class="emblem">${L.theme&&L.theme.icon||'🎮'}</div>
  <div class="gtitle">${esc(L.game)}</div>
  <div class="gsub">${esc(L.title)}</div>
  ${L.hero&&L.hero.ar?`<div class="ar hero-ar">${L.hero.ar}</div>`:''}
  ${L.hero&&L.hero.ms?`<div class="hero-ms">${esc(L.hero.ms)}</div>`:''}
  <div class="namebox"><label for="nameIn">NAMA PEMAIN</label><input id="nameIn" maxlength="22" autocomplete="off" placeholder="Taip nama anda"></div>
  <div class="levels" id="levels">${[1,2,3].map(n=>`<button class="lvl${n===2?' sel':''}" data-l="${n}"><span class="i">${['🥉','🥈','🥇'][n-1]}</span>Level ${n}<div class="bars">${[1,2,3].map(k=>`<i class="${k<=n?'f':''}"></i>`).join('')}</div></button>`).join('')}</div>
  <div class="row"><button class="btn gold" id="startBtn">▶ Mula Main</button></div>
  <div class="row mt"><button class="btn ghost sm" id="resumeBtn" style="display:none"></button></div>
 </div></section>

 <section class="scr" id="sMap">
  <div class="maphead"><div><h2>${L.theme&&L.theme.icon||'🎮'} Pilih Misi</h2><p>Lengkapkan misi untuk membuka misi seterusnya.</p></div>
   <div class="xpbar"><div class="t"><span>KEMAJUAN</span><span id="xpT">0/${MAXS} ⭐</span></div><div class="bar"><i id="xpB"></i></div></div></div>
  <div class="missions" id="missions"></div>
  <div class="mapbar"><button class="btn ghost sm" id="revBtn">📘 Nota Ringkas</button><button class="btn gold sm" id="certBtn" style="display:none">🏆 Sijil</button><button class="btn ghost sm" id="lbBtn">🏅 Papan Juara</button></div>
 </section>

 <section class="scr" id="sBrief"><div class="glass brief"><div class="ic" id="bIc"></div><div class="kicker" id="bNo"></div><h2 id="bNm"></h2><p id="bDesc"></p><div class="howto" id="bHow"></div>
  <div class="row"><button class="btn ghost" id="bBack">◀ Kembali</button><button class="btn gold" id="bGo">⚔️ Mula Misi</button></div></div></section>

 <section class="scr" id="sPlay"><div class="glass play" id="play"></div></section>

 <section class="scr" id="sRes"><div class="glass res"><h2 id="rT"></h2><div class="stars" id="rS"><span>★</span><span>★</span><span>★</span></div>
  <div class="bigscore">+<span id="rP">0</span></div><div class="stats" id="rStats"></div><div id="rB"></div><p class="msg" id="rM"></p>
  <div class="row"><button class="btn ghost" id="rRetry">↻ Main Semula</button><button class="btn gold" id="rNext">Teruskan ▶</button></div></div></section>

 <section class="scr" id="sCert"><div class="glass cert"><div class="emblem">🏆</div><div class="kicker">Pelajaran ${L.no} · ${esc(L.title)}</div>
  <h2>${esc(L.cert&&L.cert.title||'SIJIL PENCAPAIAN')}</h2><div style="font-weight:700;color:var(--mut)">Dengan ini diakui bahawa</div><div class="nm" id="cN"></div>
  <div style="font-weight:700;color:var(--mut)">telah menamatkan semua misi <b style="color:var(--txt)">${esc(L.game)}</b></div>
  <div class="rank mt" id="cR"></div><div class="stars" id="cS" style="font-size:2.6rem;letter-spacing:4px"></div><div class="bigscore" id="cP"></div><div id="cB"></div>
  ${L.cert&&L.cert.ar?`<div class="ar" style="font-size:1.8rem;margin-top:10px">${L.cert.ar}</div>`:''}${L.cert&&L.cert.ms?`<p class="msg">${esc(L.cert.ms)}</p>`:''}
  <div class="row mt"><button class="btn ghost" id="cMap">🗺️ Misi</button><button class="btn gold" id="cNew">🔁 Pemain Baharu</button></div></div></section>

 <div class="foot"><a href="../">🏠 Semua Game Tingkatan 4</a><span class="pw">@powered by alfaqih</span></div>
</div>
<div class="modal" id="mRev"><div class="glass"><div class="mh"><h2>📘 Nota Ringkas · P${L.no}</h2><button class="ibtn" data-close="mRev">✖</button></div><div class="rv" id="rvBody"></div></div></div>
<div class="modal" id="mLb"><div class="glass"><div class="mh"><h2>🏅 Papan Juara</h2><button class="ibtn" data-close="mLb">✖</button></div>
 <table class="lb"><thead><tr><th>#</th><th>Nama</th><th>Level</th><th>⭐</th><th>⚡</th></tr></thead><tbody id="lbBody"></tbody></table><p class="msg" style="font-size:.95rem">Disimpan dalam peranti ini sahaja.</p></div></div>`;
cv=$('fx');cx=cv.getContext('2d');const rs=()=>{cv.width=innerWidth;cv.height=innerHeight};addEventListener('resize',rs);rs();

/* ---------- navigasi ---------- */
function go(id){clearAll();document.querySelectorAll('.scr').forEach(s=>s.classList.remove('on'));$(id).classList.add('on');$('hud').style.display=id==='sSplash'?'none':'flex';if(id==='sMap')renderMap();hud();scrollTo({top:0,behavior:'smooth'})}
function hud(){$('hName').textContent=S.name||'-';$('hLv').textContent='Level '+S.lv;$('hStars').textContent=totStars();$('hScore').textContent=totScore()}
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).classList.remove('on'));
document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('on')}));
document.querySelectorAll('.lvl').forEach(b=>b.onclick=()=>{document.querySelectorAll('.lvl').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');S.lv=+b.dataset.l;sfx('tap')});
$('startBtn').onclick=()=>{const n=$('nameIn').value.trim();if(!n){$('nameIn').classList.add('shake');$('nameIn').focus();sfx('no');setTimeout(()=>$('nameIn').classList.remove('shake'),400);return}const lv=S.lv;S=fresh();S.name=n;S.lv=lv;save();sfx('win');go('sMap')};
$('nameIn').addEventListener('keydown',e=>{if(e.key==='Enter')$('startBtn').click()});
const old=load();if(old&&old.name){$('resumeBtn').style.display='inline-flex';$('resumeBtn').textContent='↻ Sambung sebagai '+old.name+' (Level '+old.lv+')';$('resumeBtn').onclick=()=>{S=old;go('sMap')}}
$('mapBtn').onclick=()=>go('sMap');
$('sndBtn').onclick=()=>{sound=!sound;$('sndBtn').textContent=sound?'🔊':'🔇'};
$('revBtn').onclick=()=>$('mRev').classList.add('on');
$('lbBtn').onclick=()=>{renderLb();$('mLb').classList.add('on')};
$('certBtn').onclick=showCert;$('cMap').onclick=()=>go('sMap');$('cNew').onclick=()=>{$('nameIn').value='';go('sSplash')};
$('bBack').onclick=()=>go('sMap');
$('rvBody').innerHTML=(L.review||[]).map(sec=>`<h3>${esc(sec.h)}</h3>${sec.ar?`<div class="ar">${sec.ar}</div>`:''}${sec.ms?`<p style="font-weight:600">${esc(sec.ms)}</p>`:''}${sec.items?`<ul>${sec.items.map(i=>`<li>${i}</li>`).join('')}</ul>`:''}`).join('');

/* ---------- peta ---------- */
const unlocked=i=>i===0||S.st[i-1].stars>0;
function renderMap(){
 $('missions').innerHTML=L.stages.map((g,i)=>{const st=S.st[i].stars,u=unlocked(i);return `<button class="mis ${st?'done':u?'open':'lock'}" data-i="${i}">
  ${u?'':'<span class="lockico">🔒</span>'}<div class="no">MISI ${i+1}</div><div class="ic">${g.emo}</div><div class="nm">${esc(g.name)}</div><div class="ty">${TYPE_LABEL[g.type]}</div>
  <div class="st">${[0,1,2].map(k=>`<span class="${k<st?'':'e'}">★</span>`).join('')}</div></button>`}).join('');
 $('missions').querySelectorAll('.mis').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(!unlocked(i)){b.classList.add('shake');sfx('no');setTimeout(()=>b.classList.remove('shake'),400);return}sfx('tap');brief(i)});
 $('xpT').textContent=`${totStars()}/${MAXS} ⭐`;setTimeout(()=>$('xpB').style.width=(totStars()/MAXS*100)+'%',60);
 $('certBtn').style.display=S.st.every(x=>x.stars>0)?'inline-flex':'none';
}
function brief(i){const g=L.stages[i];$('bIc').textContent=g.emo;$('bNo').textContent=`MISI ${i+1} · ${TYPE_LABEL[g.type]}`;$('bNm').textContent=g.name;$('bDesc').textContent=g.brief||'';$('bHow').textContent='🎯 '+TYPE_HOW[g.type];$('bGo').onclick=()=>{go('sPlay');RUN[g.type](g,i)};go('sBrief')}

/* ---------- komponen ---------- */
function head(title,{lives=0,max=0,boss=null}={}){return `<div class="phead"><span class="tag">${title}</span><div class="bar"><i id="pg"></i></div>
 ${max?`<span class="hearts" id="hearts">${'❤️'.repeat(lives)}${'🖤'.repeat(max-lives)}</span>`:''}<span class="combo" id="combo"></span><span class="score">⚡ <span id="ps">0</span></span></div>
 ${boss?`<div class="boss"><div class="face" id="bf">${boss.emo||'👹'}</div><div style="flex:1"><div class="nm">${esc(boss.name||'BOS')}</div><div class="hp"><i id="hp"></i></div></div></div>`:''}`}
const setPg=(a,b)=>{const p=$('pg');if(p)p.style.width=(a/b*100)+'%'};
function Score(){const d=DIFF[S.lv];return{score:0,ok:0,bad:0,streak:0,best:0,
 hit(left,max){this.ok++;this.streak++;this.best=Math.max(this.best,this.streak);const tb=Math.round((left||0)/(max||1)*80);const cb=this.streak>=3?40+this.streak*5:0;const g=Math.round((100+tb+cb)*d.mult);this.score+=g;this.ui();
  if(this.streak>=3){toast('🔥 COMBO x'+this.streak,'#FFC83D');sfx('combo')}else{toast(['HEBAT!','TEPAT!','POWER!','MANTAP!','SYABAS!'][Math.random()*5|0],'#2EE59D');sfx('ok')}return g},
 miss(){this.bad++;this.streak=0;this.ui();sfx('no');flash()},
 ui(){const c=$('combo');if(c)c.textContent=this.streak>=2?'🔥x'+this.streak:'';const p=$('ps');if(p)p.textContent=this.score}}}
function fbShow(good,html,next,label,auto){const f=$('fb');f.className='fb on '+(good?'good':'bad');f.innerHTML=html+`<div class="row mt"><button class="btn gold sm" id="nx">${label||'Seterusnya ▶'}</button></div>`;
 const b=$('nx');let done=false;const fire=()=>{if(done)return;done=true;if(autoT){clearTimeout(autoT);autoT=null}next()};b.onclick=fire;b.focus({preventScroll:true});if(auto)autoT=setTimeout(fire,auto);f.scrollIntoView({behavior:'smooth',block:'nearest'})}
const arWrap=s=>isAr(s)?`<span class="ar" style="font-size:1.5rem">${s}</span>`:esc(s);

/* ---------- enjin soalan generik ---------- */
function quiz(g,idx,o){
 const d=DIFF[S.lv];const sc=Score();let i=0,lives=o.lives||0,hp=100;const Q=o.qs;const dmg=o.boss?Math.ceil(100/Math.max(6,Math.round(Q.length*.8))):0;
 function draw(){
  const q=Q[i];
  $('play').innerHTML=head(`${g.emo} ${i+1}/${Q.length}`,{lives,max:o.lives||0,boss:o.boss?(g.boss||{}):null})+`<div class="timer" id="tm"><i></i></div>${o.render(q)}<div class="fb" id="fb"></div>`;
  if(o.boss)$('hp').style.width=hp+'%';sc.ui();setPg(i,Q.length);
  const left=startTimer(d.time,()=>ans(-1));
  document.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>ans(+b.dataset.o));
  function ans(ch){stopTimer();const right=ch===q.ans;
   document.querySelectorAll('[data-o]').forEach(b=>{b.disabled=true;const v=+b.dataset.o;if(o.ring){if(v===q.ans)b.classList.add('ring');else b.classList.add('dim')}else{if(v===q.ans)b.classList.add('ok');else if(v===ch)b.classList.add('no')}});
   const more=()=>i+1<Q.length&&!(o.lives&&lives<=0)&&!(o.boss&&hp<=0);
   if(right){const gain=sc.hit(left(),d.time);if(o.boss){hp=Math.max(0,hp-dmg-(sc.streak>=3?4:0));$('hp').style.width=hp+'%';const f=$('bf');f.classList.remove('hit');void f.offsetWidth;f.classList.add('hit');sfx('hit');if(hp<=0){f.textContent='💥';toast('BOS TUMPAS!','#FFC83D')}}
    fbShow(true,`✅ <b>Betul! +${gain}</b>${q.ex?'<br>'+q.ex:''}`,nxt,more()?'Seterusnya ▶':'Lihat Keputusan 🏁',q.ex?2600:1200)}
   else{sc.miss();if(o.lives){lives--;$('hearts').textContent='❤️'.repeat(lives)+'🖤'.repeat(o.lives-lives);if(lives<=0)toast('💔 NYAWA HABIS','#FF4D6D')}
    fbShow(false,`${ch===-1?'⏰ <b>Masa tamat!</b>':'❌ <b>Kurang tepat.</b>'} ${o.reveal?o.reveal(q):''}${q.ex?'<br>'+q.ex:''}`,nxt,more()?'Seterusnya ▶':'Lihat Keputusan 🏁')}
   function nxt(){i++;if(more2())draw();else finish()}
   function more2(){return i<Q.length&&!(o.lives&&lives<=0)&&!(o.boss&&hp<=0)}
  }
 }
 function finish(){const answered=sc.ok+sc.bad;let acc=sc.ok/Q.length;let note='';
  if(o.boss){if(hp<=0){acc=sc.ok/Math.max(answered,1);note='💥 Bos tumpas!'}else if(lives<=0)note='💔 Nyawa habis';else note=`Bos berbaki ${hp}%`}
  else if(o.lives&&lives<=0){note='💔 Nyawa habis'}
  result(idx,sc,acc,note)}
 draw();
}
function mcqItems(list,d){return list.map(q=>{let idxs=q.o.map((_,k)=>k);let wrong=shuf(idxs.filter(k=>k!==q.a)).slice(0,Math.min(d.opts,q.o.length)-1);const pick=shuf([q.a,...wrong]);return{...q,opts:pick.map(k=>q.o[k]),ans:pick.indexOf(q.a)}})}
function optHTML(q){const arAll=q.opts.every(isAr);return `<div class="opts ${arAll||q.opts.some(x=>x.length>60)?'one':''}">${q.opts.map((t,j)=>`<button class="opt ${isAr(t)?'ar':''}" data-o="${j}"><span class="k">${keys[j]}</span><span>${isAr(t)?t:esc(t)}</span></button>`).join('')}</div>`}
function qHTML(q){return `<div class="qcard"><div class="q">${q.q.includes('<')?q.q:esc(q.q)}</div>${q.ar?`<div class="ar qa">${q.ar}</div>`:''}${q.hint&&S.lv<3?`<div class="hint">💡 ${esc(q.hint)}</div>`:''}</div>`}
const take=(arr,n)=>shuf(arr).slice(0,Math.min(n,arr.length));
const nQ=(g,def)=>({1:Math.min(8,g.data.length||def),2:Math.min(10,g.data.length||def),3:Math.min(12,g.data.length||def)}[S.lv]);

const RUN={
 mcq(g,i){const d=DIFF[S.lv];quiz(g,i,{qs:mcqItems(take(g.data,nQ(g)),d),render:q=>qHTML(q)+optHTML(q)})},
 boss(g,i){const d=DIFF[S.lv];quiz(g,i,{boss:true,lives:d.lives,qs:mcqItems(take(g.data,10),d),render:q=>qHTML(q)+optHTML(q)})},
 tf(g,i){quiz(g,i,{ring:true,qs:take(g.data,nQ(g)).map(x=>({...x,ans:x.a?0:1})),render:q=>`<div class="scroll">${esc(q.t)}</div><div class="big2"><button class="bigb t" data-o="0"><span class="e">✔</span>BENAR</button><button class="bigb f" data-o="1"><span class="e">✖</span>SALAH</button></div>`})},
 sort(g,i){const bins=g.bins;quiz(g,i,{ring:true,qs:take(g.data,nQ(g)).map(x=>({...x,ans:x.b})),reveal:q=>`Jawapan: <b>${esc(bins[q.ans].name)}</b>`,
  render:q=>`<div class="scroll">${isAr(q.t)?`<span class="ar" style="font-size:2rem">${q.t}</span>`:esc(q.t)}</div><div class="${bins.length===3?'big3':'big2'}">${bins.map((b,j)=>`<button class="bigb c${b.c!==undefined?b.c:j}" data-o="${j}"><span class="e">${b.emo}</span>${esc(b.name)}</button>`).join('')}</div>`})},
 pick(g,i){const d=DIFF[S.lv];const labels=g.labels;quiz(g,i,{qs:take(g.data,nQ(g)).map(x=>{let opts=S.lv===1&&labels.length>4?shuf([x.a,...shuf(labels.filter(l=>l!==x.a)).slice(0,3)]):labels.slice();return{...x,opts,ans:opts.indexOf(x.a)}}),
  reveal:q=>`Jawapan: <b>${esc(q.opts[q.ans])}</b>`,render:q=>qHTML(q)+`<div class="opts" style="grid-template-columns:repeat(auto-fit,minmax(${labels.some(l=>l.length>14)?'240px':'150px'},1fr))">${q.opts.map((t,j)=>`<button class="opt" style="justify-content:center;text-align:center" data-o="${j}">${esc(t)}</button>`).join('')}</div>`})},
 chain(g,i){const d=DIFF[S.lv];const C=g.data;const qs=[];for(let j=1;j<C.length;j++){const right=C[j][0];const pool=shuf(C.filter((c,x)=>x!==j&&x!==j-1).map(c=>c[0])).slice(0,d.opts-1);const o=shuf([right,...pool]);qs.push({prev:C[j-1][0],lbl:C[j-1][1],opts:o,ans:o.indexOf(right),ex:`${C[j][1]?C[j][1]+': ':''}<span class="ar" style="font-size:1.4rem">${right}</span>`})}
  quiz(g,i,{qs,render:q=>`<div class="qcard"><div class="q">Apakah sambungan selepas potongan ini?${q.lbl?` <span style="color:var(--mut)">(${esc(q.lbl)})</span>`:''}</div><div class="ar qa">${q.prev} …</div></div>`+`<div class="opts one">${q.opts.map((t,j)=>`<button class="opt ar" data-o="${j}"><span class="k">${keys[j]}</span><span>${t}</span></button>`).join('')}</div>`})},
 order(g,idx){const d=DIFF[S.lv];const sc=Score();const R=take(g.data,S.lv===1?Math.min(2,g.data.length):S.lv===2?Math.min(3,g.data.length):g.data.length);let r=0,total=0;
  function draw(){const rd0=R[r];const rd=S.lv===1&&rd0.easy?{...rd0,items:rd0.easy}:rd0;const ar=rd.items.every(isAr);let pool=rd.items.concat(d.decoy&&rd.decoy?rd.decoy:[]);pool=shuf(pool);let pos=0;total+=rd.items.length;
   $('play').innerHTML=head(`${g.emo} ${r+1}/${R.length}`)+`<div class="qcard"><div class="q">${esc(rd.title)}</div>${rd.hint&&S.lv<3?`<div class="hint">💡 ${esc(rd.hint)}</div>`:''}</div>
    <div class="slots ${ar?'':'ltr'}" id="sl">${rd.items.map((_,k)=>`<div class="slot ${ar?'ar':''}">${ar?'':(k+1)+'.'}</div>`).join('')}</div>
    <div class="pool ${ar?'rtl':''}" id="pl">${pool.map((t,k)=>`<button class="tile ${ar?'ar':''}" data-k="${k}">${ar?t:esc(t)}</button>`).join('')}</div><div class="fb" id="fb"></div>`;
   sc.ui();setPg(r,R.length);const slots=[...$('sl').children];const t0=performance.now();
   $('pl').querySelectorAll('.tile').forEach(b=>b.onclick=()=>{const t=pool[+b.dataset.k];if(t===rd.items[pos]){slots[pos].innerHTML=(ar?'':`<b style="color:var(--ok);margin-right:8px">${pos+1}.</b>`)+(ar?t:esc(t));slots[pos].classList.add('fill');b.classList.add('used');pos++;sc.ok++;sc.streak++;sc.best=Math.max(sc.best,sc.streak);sc.score+=Math.round(60*d.mult);sc.ui();sfx('ok');
     if(pos===rd.items.length){const bonus=Math.round(Math.max(0,rd.items.length*6-(performance.now()-t0)/1000)*8*d.mult);sc.score+=bonus;sc.ui();sfx('win');confetti(50);$('pl').style.display='none';
      fbShow(true,`✅ <b>Tertib lengkap!</b> Bonus pantas +${bonus}${rd.note?'<br>'+esc(rd.note):''}`,()=>{r++;r<R.length?draw():result(idx,sc,sc.ok/(sc.ok+sc.bad||1),'')},r+1<R.length?'Seterusnya ▶':'Lihat Keputusan 🏁')}}
    else{sc.bad++;sc.streak=0;sc.score=Math.max(0,sc.score-Math.round(20*d.mult));sc.ui();sfx('no');flash();b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),450)}})}
  draw()},
 match(g,idx){const d=DIFF[S.lv];const sc=Score();const P=take(g.data,S.lv===1?4:6);let cards=[];P.forEach((p,k)=>{cards.push({k,v:p[0]});cards.push({k,v:p[1]})});cards=shuf(cards);let open=[],found=0,tries=0,lock=true;
  $('play').innerHTML=head(`${g.emo} Padan ${P.length} pasangan`)+`<div class="qcard" style="padding:12px"><div class="q" id="mmsg">👀 Ingat kedudukan kad…</div></div><div class="mgrid">${cards.map((c,j)=>`<button class="mc flip" data-j="${j}"><div class="in"><div class="f">${g.back||'✦'}</div><div class="b ${isAr(c.v)?'ar':''}">${isAr(c.v)?c.v:esc(c.v)}</div></div></button>`).join('')}</div><div class="fb" id="fb"></div>`;
  sc.ui();setPg(0,P.length);
  autoT=setTimeout(()=>{autoT=null;if(!$('mmsg'))return;document.querySelectorAll('.mc').forEach(c=>c.classList.remove('flip'));$('mmsg').textContent='Sentuh dua kad yang berpasangan';lock=false},d.preview);
  const t0=performance.now();
  document.querySelectorAll('.mc').forEach(el=>el.onclick=()=>{if(lock||el.classList.contains('flip'))return;el.classList.add('flip');sfx('tap');open.push(el);
   if(open.length===2){tries++;lock=true;const[a,b]=open.map(e=>cards[+e.dataset.j]);
    if(a.k===b.k){open.forEach(e=>e.classList.add('match'));found++;sc.hit(0,1);setPg(found,P.length);open=[];lock=false;
     if(found===P.length){const bonus=Math.round(Math.max(0,P.length*9-(performance.now()-t0)/1000)*6*d.mult);sc.score+=bonus;sc.ui();sfx('win');confetti(80);
      setTimeout(()=>{sc.bad=tries-P.length;result(idx,sc,Math.min(1,P.length/tries*1.4),`${tries} cubaan · bonus pantas +${bonus}`)},800)}}
    else{sc.streak=0;sc.ui();sfx('no');setTimeout(()=>{open.forEach(e=>e.classList.remove('flip'));open=[];lock=false},850)}}})},
 bubble(g,idx){const d=DIFF[S.lv];const sc=Score();const Q=take(g.data,8);let i=0;
  function draw(){bubT.forEach(clearTimeout);bubT=[];const q=Q[i];const nb=S.lv===1?2:S.lv===2?3:4;const words=shuf([q.a,...take(q.o,nb-1)]);const ar=isAr(q.a);
   $('play').innerHTML=head(`${g.emo} ${i+1}/${Q.length}`)+`<div class="qcard" style="margin-bottom:10px"><div class="q">${esc(q.q||'Pecahkan gelembung yang betul:')}</div>${q.pre!==undefined?`<div class="${ar?'ar qa':'q'}" style="${ar?'':'margin-top:8px;color:var(--a)'}">${ar?q.pre:esc(q.pre)} <span class="blank">${ar?'؟':'?'}</span> ${ar?(q.post||''):esc(q.post||'')}</div>`:''}</div><div class="sea" id="sea"></div><div class="fb" id="fb"></div>`;
   sc.ui();setPg(i,Q.length);const sea=$('sea');const W=sea.clientWidth;const T=d.bubT;let done=false;const t0=performance.now();const lanes=shuf(words.map((_,j)=>j));
   words.forEach((w,j)=>{const b=document.createElement('button');b.className='bub'+(isAr(w)?' ar':'');b.textContent=w;const n=words.length;b.style.left=Math.max(4,Math.min(W-152,(W/n)*lanes[j]+((W/n)-148)/2))+'px';b.style.animationDuration=T+'s';b.style.animationDelay=(j*.55)+'s';
    b.onclick=()=>{if(done)return;if(w===q.a)fin(true,b);else{b.classList.add('popno');fin(false,b)}};
    b.addEventListener('animationend',e=>{if(e.animationName==='rise'&&w===q.a&&!done)fin(false,null,true)});sea.appendChild(b)});
   const full=q.pre!==undefined?(ar?`<span class="ar" style="font-size:1.5rem">${q.pre} ${q.a} ${q.post||''}</span>`:`<b>${esc(q.pre)} ${esc(q.a)} ${esc(q.post||'')}</b>`):`<b>${arWrap(q.a)}</b>`;
   function fin(right,b,esc_){if(done)return;done=true;sea.querySelectorAll('.bub').forEach(x=>{x.style.animationPlayState='paused';if(x.textContent===q.a&&x!==b)x.style.boxShadow='0 0 0 6px #2EE59D'});
    const more=i+1<Q.length;const nx=()=>{i++;more?draw():result(idx,sc,sc.ok/Q.length,'')};
    if(right){b.classList.add('popok');sfx('pop');const g2=sc.hit(Math.max(0,T+1.2-(performance.now()-t0)/1000),T);fbShow(true,`✅ <b>+${g2}</b> ${full}${q.ex?'<br>'+q.ex:''}`,nx,more?'Seterusnya ▶':'Lihat Keputusan 🏁',q.ex?2600:1500)}
    else{sc.miss();fbShow(false,`${esc_?'💨 <b>Gelembung betul terlepas!</b>':'❌ <b>Gelembung salah.</b>'} Jawapan: ${full}${q.ex?'<br>'+q.ex:''}`,nx,more?'Seterusnya ▶':'Lihat Keputusan 🏁')}}}
  draw()},
};

/* ---------- keputusan ---------- */
function result(i,sc,acc,note){clearAll();acc=Math.max(0,Math.min(1,acc));const stars=acc>=.9?3:acc>=.7?2:acc>=.5?1:0;const g=L.stages[i];const prev=S.st[i];const first=stars>0&&!prev.stars;
 if(stars>prev.stars||(stars===prev.stars&&sc.score>prev.score))S.st[i]={stars:Math.max(stars,prev.stars),score:Math.max(sc.score,prev.score)};save();go('sRes');
 $('rT').textContent=stars===3?'🔥 SEMPURNA!':stars===2?'⚡ HEBAT!':stars===1?'✅ MISI LULUS':'💀 MISI GAGAL';
 $('rP').textContent=sc.score;
 $('rStats').innerHTML=`<div class="stat">${Math.round(acc*100)}%<small>Ketepatan</small></div><div class="stat">${sc.ok}<small>Betul</small></div><div class="stat">🔥 ${sc.best}<small>Combo terbaik</small></div>${note?`<div class="stat">${esc(note)}<small>Status</small></div>`:''}`;
 [...$('rS').children].forEach((s,k)=>{s.classList.remove('on');if(k<stars)setTimeout(()=>{s.classList.add('on');sfx('star')},350+k*380)});
 $('rB').innerHTML=stars?`<div class="badge"><span class="e">${g.emo}</span>Lencana: ${esc(g.badge||g.name)}${first?' · BAHARU!':''}</div>`:'';
 $('rM').textContent=stars===3?'Luar biasa! Anda menguasai misi ini sepenuhnya.':stars===2?'Sedikit lagi untuk 3 bintang. Cuba lagi!':stars===1?'Misi seterusnya telah dibuka. Ulang untuk bintang penuh!':'Perlukan sekurang-kurangnya 50% betul. Buka Nota Ringkas, kemudian cuba lagi.';
 if(stars)setTimeout(()=>confetti(stars*60),300);
 $('rRetry').onclick=()=>brief(i);const all=S.st.every(x=>x.stars>0);const nextI=i+1<L.stages.length&&unlocked(i+1)?i+1:-1;
 $('rNext').textContent=all&&first?'🏆 Lihat Sijil':nextI>=0&&stars?'Misi Seterusnya ▶':'🗺️ Ke Peta Misi';
 $('rNext').onclick=()=>all&&first?showCert():nextI>=0&&stars?brief(nextI):go('sMap');hud()}
function rank(){const p=totStars()/MAXS;const R=L.ranks||['Legenda','Pahlawan','Pejuang','Perintis'];return p>=.93?'👑 '+R[0]:p>=.73?'🥇 '+R[1]:p>=.53?'🥈 '+R[2]:'🥉 '+R[3]}
function showCert(){go('sCert');$('cN').textContent=S.name;$('cR').textContent=rank()+' · Level '+S.lv;$('cP').textContent='⚡ '+totScore();
 $('cS').innerHTML='<span class="on">★</span>'.repeat(totStars())+'<span>★</span>'.repeat(MAXS-totStars());
 $('cB').innerHTML=L.stages.map((g,i)=>`<div class="badge ${S.st[i].stars?'':'lock'}"><span class="e">${g.emo}</span>${esc(g.badge||g.name)}</div>`).join('');
 try{const k=KEY+'_lb';const lb=JSON.parse(localStorage.getItem(k)||'[]');const rec={n:S.name,l:S.lv,s:totStars(),p:totScore()};const j=lb.findIndex(r=>r.n===rec.n&&r.l===rec.l);if(j>=0){if(rec.p>lb[j].p)lb[j]=rec}else lb.push(rec);lb.sort((a,b)=>b.p-a.p);localStorage.setItem(k,JSON.stringify(lb.slice(0,20)))}catch(e){}
 confetti(240);sfx('win')}
function renderLb(){let lb=[];try{lb=JSON.parse(localStorage.getItem(KEY+'_lb')||'[]')}catch(e){}
 $('lbBody').innerHTML=lb.length?lb.map((r,i)=>`<tr><td>${['🥇','🥈','🥉'][i]||i+1}</td><td><b>${esc(r.n)}</b></td><td>Level ${r.l}</td><td>${r.s}</td><td><b>${r.p}</b></td></tr>`).join(''):'<tr><td colspan="5">Belum ada juara. Tamatkan semua misi untuk tersenarai!</td></tr>'}
window.__G={go,S:()=>S,setS:v=>{S=v},showCert,renderMap};
const shs=document.createElement('script');shs.src='../assets/share.js';document.body.appendChild(shs);
})();
