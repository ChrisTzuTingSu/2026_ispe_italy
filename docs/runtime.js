const app=document.getElementById('app');
const fileInput=document.getElementById('fileInput');
const installBtn=document.getElementById('installBtn');
const titles={today:'今天',timeline:'完整行程',tickets:'票券錢包',guides:'城市與景點導覽',more:'旅行工具箱'};
let currentView='today',selectedDay=0,guideFilter='all',moreTab='profile',foodFilter='all',souvenirFilter='all',uploadTarget=null,deferredInstall=null;

function esc(value=''){
  return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function condVisible(cond){
  if(!cond)return true;
  return Object.entries(cond).every(([key,value])=>profile[key]==='all'||profile[key]===value);
}
function condBadge(cond){
  if(!cond)return '';
  const [key,value]=Object.entries(cond)[0];
  return `<span class="badge branch">${esc(conditionLabels[`${key}:${value}`]||value)}</span>`;
}
function appleMap(place){return `https://maps.apple.com/?q=${encodeURIComponent(place)}`}
function googleMap(place){return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`}
function walkingRoute(places=[]){
  if(places.length<2)return googleMap(places[0]||'Italy');
  const origin=encodeURIComponent(places[0]),destination=encodeURIComponent(places.at(-1));
  const waypoints=places.slice(1,-1).map(encodeURIComponent).join('%7C');
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking${waypoints?`&waypoints=${waypoints}`:''}`;
}
function external(url,label,cls=''){
  return `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`;
}
function dayIndexForNow(){
  const now=new Date(),iso=now.toLocaleDateString('en-CA',{timeZone:'Europe/Rome'});
  const found=days.findIndex(x=>x.date===iso);
  if(found>=0)return found;
  return now<tripStart?0:days.length-1;
}
selectedDay=dayIndexForNow();

function profileSummary(){
  return `<div class="profile-pills">${Object.entries(profile).map(([key,value])=>`<span class="${value==='all'?'pending':''}">${esc(optionLabels[key][value])}</span>`).join('')}</div>`;
}
function eventCard(event){
  const typeLabel={fixed:'固定時間',warn:'待確認',move:'交通',stay:'住宿',food:'用餐',flex:'可調整'}[event.type]||'可調整';
  return `<div class="event">
    <div class="time">${esc(event.time)}</div>
    <div><h3>${esc(event.title)}</h3><p>${esc(event.note)}</p>
      <div class="badges"><span class="badge ${event.type==='fixed'?'fixed':event.type==='warn'?'warn':''}">${typeLabel}</span>${condBadge(event.cond)}</div>
      ${event.place?`<div class="actions">${external(appleMap(event.place),' 地圖')}${external(googleMap(event.place),'Google')}</div>`:''}
    </div>
  </div>`;
}
function stayCards(day){
  let relevant=[];
  if(day.date<='2026-08-24')relevant=stays.filter(x=>x.id==='rome');
  else if(day.date<='2026-08-28')relevant=stays.filter(x=>x.id==='florence');
  else if(day.date<'2026-09-03')relevant=stays.filter(x=>['vigliani','oroblu'].includes(x.id));
  else if(day.date==='2026-09-03')relevant=stays.filter(x=>['vigliani','oroblu','venice-mestre'].includes(x.id));
  else if(day.date==='2026-09-04')relevant=stays.filter(x=>['mxp','venice-mestre'].includes(x.id));
  else if(day.date==='2026-09-05')relevant=stays.filter(x=>x.id==='porta-romana');
  relevant=relevant.filter(x=>condVisible(x.cond));
  if(!relevant.length)return '';
  return `<div class="section-head"><h2>當晚住宿</h2></div>${relevant.map(x=>`<article class="card stay-card ${x.source==='待確認'?'pending-card':''}">
    <div class="stay-line"><div><span class="kicker">${esc(x.city)} · ${esc(x.dates)}</span><h3>${esc(x.name)}</h3></div>${condBadge(x.cond)}</div>
    <p>${esc(x.address)}</p><p class="muted">${esc(x.note)}</p>
    ${x.address==='尚未收到住宿憑證'?'':`<div class="actions">${external(appleMap(x.address),'導航到住宿','strong')}${external(googleMap(x.address),'Google Maps')}</div>`}
  </article>`).join('')}`;
}

function renderToday(){
  const idx=dayIndexForNow(),day=days[idx],now=new Date();
  let label='旅程進行中',counter='';
  if(now<tripStart){const n=Math.ceil((tripStart-now)/86400000);label='出發倒數';counter=`${n} 天後出發`;}
  else if(now>tripEnd){label='旅程已結束';counter='回顧行程與導覽';}
  else counter=`${day.d} · ${day.city}`;
  const events=day.events.filter(x=>condVisible(x.cond));
  app.innerHTML=`<section class="hero"><div class="date">${label}</div><h2>${esc(day.city)}</h2><p>${esc(day.subtitle)}</p><div class="countdown">${esc(counter)}</div></section>
  <button class="profile-summary card" data-action="more" data-tab="profile"><b>我的分組</b><span>點這裡選擇，每支 iPhone 各自儲存</span>${profileSummary()}</button>
  <div class="section-head"><h2>${now<tripStart?'第一天關鍵時間':'今日時間軸'}</h2><button data-action="view" data-view="timeline">看全部</button></div>
  <section class="card">${events.slice(0,5).map(eventCard).join('')}</section>
  ${stayCards(day)}
  <div class="notice"><b>憑證優先</b><br>若 App 與電子票的日期、時間或集合點不同，一律以最新正式憑證為準。</div>`;
}
function renderTimeline(){
  const day=days[selectedDay],events=day.events.filter(x=>condVisible(x.cond));
  app.innerHTML=`<div class="date-strip" aria-label="日期">${days.map((x,i)=>`<button class="date-chip ${i===selectedDay?'active':''}" data-action="day" data-day="${i}"><small>${x.dow}</small><b>${x.d.split('/')[1]}</b><small>${x.city.split(' ')[0]}</small></button>`).join('')}</div>
  <div class="day-title"><span class="kicker">${esc(day.date)} · ${esc(day.dow)}</span><h2>${esc(day.city)}</h2><p>${esc(day.subtitle)}</p></div>
  ${Object.values(profile).includes('all')?'<div class="notice compact"><b>目前顯示所有分流</b><br>到「更多 → 我的分組」選擇後，這裡只留你自己的行程。</div>':''}
  <section class="card timeline-card">${events.length?events.map(eventCard).join(''):'<div class="empty">這個分組今天沒有單獨項目。</div>'}</section>
  ${stayCards(day)}`;
  requestAnimationFrame(()=>document.querySelector('.date-chip.active')?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'}));
}

function openDB(){
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open('italia-2026-ticket-vault',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('tickets',{keyPath:'id'});
    request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
  });
}
function oldDb(){return new Promise(resolve=>{const r=indexedDB.open('italia-2026-vault',1);r.onupgradeneeded=()=>r.result.createObjectStore('files');r.onsuccess=()=>resolve(r.result);r.onerror=()=>resolve(null)});}
async function oldDbAll(){const db=await oldDb();if(!db)return[];return new Promise(resolve=>{const store=db.transaction('files').objectStore('files'),keys=store.getAllKeys(),values=store.getAll();values.onsuccess=()=>resolve(values.result.map((x,i)=>({id:keys.result[i],file:x.data,name:x.name,type:x.type,updated:x.updated})));values.onerror=()=>resolve([])});}
async function dbGet(id){const db=await openDB();const current=await new Promise((resolve,reject)=>{const r=db.transaction('tickets').objectStore('tickets').get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});if(current)return current;return (await oldDbAll()).find(x=>x.id===id);}
async function dbAll(){const db=await openDB();const current=await new Promise((resolve,reject)=>{const r=db.transaction('tickets').objectStore('tickets').getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)}),old=await oldDbAll(),ids=new Set(current.map(x=>x.id));return current.concat(old.filter(x=>!ids.has(x.id)));}
async function dbPut(value){const db=await openDB();return new Promise((resolve,reject)=>{const r=db.transaction('tickets','readwrite').objectStore('tickets').put(value);r.onsuccess=resolve;r.onerror=()=>reject(r.error)});}
async function dbDelete(id){const db=await openDB();await new Promise((resolve,reject)=>{const r=db.transaction('tickets','readwrite').objectStore('tickets').delete(id);r.onsuccess=resolve;r.onerror=()=>reject(r.error)});const legacy=await oldDb();if(legacy)await new Promise(resolve=>{const r=legacy.transaction('files','readwrite').objectStore('files').delete(id);r.onsuccess=resolve;r.onerror=resolve});}

async function renderTickets(){
  app.innerHTML='<div class="empty">正在讀取這支 iPhone 的私人票券…</div>';
  let saved=[];try{saved=await dbAll()}catch(error){console.warn(error)}
  const savedIds=new Set(saved.map(x=>x.id));
  const visible=tickets.filter(x=>condVisible(x.cond));
  app.innerHTML=`<div class="privacy"><b>私人本機票夾</b><br>PDF／圖片只存在這支裝置的 Safari，不會上傳 GitHub。清除網站資料會連票券一起刪除，原檔仍需備份。</div>
  <div class="section-head"><h2>我的票券</h2><span class="small-count">${savedIds.size} 張已存</span></div>
  ${visible.map(t=>`<article class="card ticket ${savedIds.has(t.id)?'saved':''}">
    <div class="ticket-top"><div><div class="badges">${savedIds.has(t.id)?'<span class="badge">已離線儲存</span>':`<span class="badge ${t.pending?'warn':''}">${t.pending?'待補票／確認':'尚未存檔'}</span>`}${condBadge(t.cond)}</div><h3>${esc(t.title)}</h3></div><div class="ticket-date">${esc(t.date)}</div></div>
    <p>${esc(t.note)}</p>
    <div class="actions">${savedIds.has(t.id)?`<button class="strong" data-action="open-ticket" data-id="${t.id}">開啟票券</button><button data-action="upload" data-id="${t.id}">更換</button><button class="danger-text" data-action="delete-ticket" data-id="${t.id}">刪除</button>`:`<button class="strong" data-action="upload" data-id="${t.id}">存入 PDF／圖片</button>`}</div>
  </article>`).join('')}`;
}

function guideRoute(g){return g.route||g.routePlaces||[]}
function renderGuides(){
  const filtered=guides.filter(g=>guideFilter==='all'||g.kind===guideFilter);
  app.innerHTML=`<div class="intro"><p>每條路線先有一篇可連續閱讀的完整中文導覽，再附現場「30 秒看懂」與觀察卡。可在搭車或排隊時先讀長文，到作品前再用速查卡。</p></div>
  <div class="filter-row"><button class="filter-chip ${guideFilter==='all'?'active':''}" data-action="filter" data-filter="all">全部 ${guides.length}</button><button class="filter-chip ${guideFilter==='walk'?'active':''}" data-action="filter" data-filter="walk">城市漫遊</button><button class="filter-chip ${guideFilter==='museum'?'active':''}" data-action="filter" data-filter="museum">博物館／景點</button></div>
  ${filtered.map(g=>`<article class="card guide-card"><div class="guide-cover ${g.class||''}"><div><span class="kicker light">${g.city} · ${g.kind==='walk'?'漫遊':'導覽'} · ${esc(g.time)}</span><h3>${esc(g.title)}</h3></div></div><div class="guide-body"><p>${esc(g.summary)}</p><div class="route">${guideRoute(g).map((x,i)=>`${i?'<i>›</i>':''}<span>${esc(x)}</span>`).join('')}</div><button class="primary wide" data-action="guide" data-id="${g.id}">開始這條導覽</button></div></article>`).join('')}`;
}
function showGuide(id){
  const g=guides.find(x=>x.id===id);if(!g)return;
  const narrative=guideNarratives[id];
  const route=g.routePlaces?`<div class="actions sticky-actions">${external(walkingRoute(g.routePlaces),'開啟 Google 步行路線','strong')}${external(appleMap(g.routePlaces[0]),' 從第一站開始')}</div>`:'';
  const longGuide=narrative?`<section class="long-guide"><div class="long-guide-head"><div><span class="kicker">完整中文導覽</span><h3>先讀懂整條故事線</h3></div><span>${esc(narrative.readTime)}</span></div><p class="long-guide-lead">${esc(narrative.lead)}</p>${narrative.chapters.map((chapter,i)=>`<details class="guide-chapter" ${i===0?'open':''}><summary><span>${String(i+1).padStart(2,'0')}</span>${esc(chapter.title)}</summary><div>${chapter.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div></details>`).join('')}</section>`:'';
  const modal=document.createElement('div');modal.className='modal';modal.dataset.modal='guide';
  modal.innerHTML=`<section class="sheet guide-detail" role="dialog" aria-modal="true" aria-label="${esc(g.title)}"><div class="grabber"></div><button class="close" data-action="close" aria-label="關閉">×</button><span class="kicker">${g.city} · ${esc(g.time)}${g.distance?` · ${esc(g.distance)}`:''}</span><h2>${esc(g.title)}</h2><p>${esc(g.summary)}</p>${route}
  <div class="plan-grid">${g.plans.map(p=>`<div><b>${esc(p[0])}</b><span>${esc(p[1])}</span></div>`).join('')}</div>
  ${longGuide}<div class="section-head"><h2>沿路觀看速查</h2></div>${g.stops.map((s,i)=>`<article class="card stop" data-n="${i+1}"><h3>${esc(s.title)}</h3><div class="quick"><b>30 秒看懂</b><p>${esc(s.quick)}</p></div><div class="look"><b>現場找這個</b><p>${esc(s.look)}</p></div><details><summary>補充背景</summary><p>${esc(s.deep)}</p></details>${s.place?`<div class="actions">${external(appleMap(s.place),' 開啟位置')}${external(googleMap(s.place),'Google')}</div>`:''}</article>`).join('')}
  <div class="source-box"><b>官方資料</b>${g.sources.map(s=>external(s[1],s[0])).join('')}</div></section>`;
  document.body.appendChild(modal);document.body.classList.add('modal-open');
}

function settingSelect(key,label){
  return `<label class="setting"><span>${esc(label)}</span><select data-profile="${key}">${Object.entries(optionLabels[key]).map(([value,text])=>`<option value="${value}" ${profile[key]===value?'selected':''}>${esc(text)}</option>`).join('')}</select></label>`;
}
function renderProfile(){
  return `<div class="privacy"><b>這不是共用帳號</b><br>每個人開同一個網址，但分組、勾選清單與上傳票券都只存在各自的 iPhone。你的操作不會改掉別人的 App。</div>
  <section class="card settings-card"><h2>我的分組</h2>${settingSelect('lodging','8/28–9/4 米蘭住宿')}${settingSelect('wine','8/26 下午')}${settingSelect('course','8/29–30')}${settingSelect('return','返程日')}<button class="link-button reset-profile" data-action="reset-profile">重設為顯示所有分流</button></section>
  <section class="card"><h2>住宿一覽</h2>${stays.filter(x=>condVisible(x.cond)).map(x=>`<div class="mini-stay"><b>${esc(x.dates)} · ${esc(x.city)}</b><span>${esc(x.name)}</span><small>${esc(x.address)}</small>${x.address.includes('尚未')?'':external(appleMap(x.address),'導航')}</div>`).join('')}</section>`;
}
function renderSafety(){
  return `<div class="emergency-grid"><a href="tel:112"><b>112</b><span>警察／救護／消防</span></a><a href="tel:+393668066434"><b>+39 366 806 6434</b><span>駐義台北代表處急難</span></a></div>
  <article class="card safety-card"><h2>花式不重要，斷開接觸才重要</h2><p>「踩畫」、簽名募款、幫忙買票、手環、假警察、擠上地鐵乘機翻包，核心都是讓你停下、分心或暴露財物。</p><ol><li>不停、不辯論、不接任何東西，直接說「No, grazie」往店家或群眾移動。</li><li>有人碰你時，一手壓住包、一手與人保持距離，大聲說「Non mi tocchi!」</li><li>不與對方拉扯或追逐；先離開包圍，再求助 112。</li></ol></article>
  <article class="card safety-card"><h2>地鐵與人潮</h2><ul><li>進站前就把手機收好，不在門邊打開錢包找票。</li><li>包在身體前面並拉鍊；手機不放屁股口袋或餐桌邊。</li><li>有人擠、擋路、丟東西或在扶梯突然停下，立即注意包和同伴。</li><li>主卡、備用卡、現金分三處；護照放貼身內袋。</li></ul></article>
  <article class="card safety-card"><h2>現金與付款</h2><p>建議每人總備 <b>€80–150</b> 小鈔，每日身上只放 <b>€30–50</b>。主要消費用卡／Apple Pay；ATM 與刷卡機若問要用 TWD 還是 EUR，選 <b>EUR</b>。米蘭 ATM 交通感應付款時，同一趟路線使用同一張實體卡或同一台裝置，且一卡只能算一人。</p></article>
  <article class="card safety-card"><h2>8 月暑熱</h2><p>12:00–18:00 盡量用室內景點、用餐與交通切斷曝曬；不等口渴才喝水。出現意識改變、無法行走、熱但不出汗時直接叫 112。</p></article>
  <div class="notice"><b>報警後</b><br>先凍結卡片、保留報案證明與購物單據，再聯絡保險。若護照遺失，聯絡駐義台北代表處。</div>`;
}
function renderChecklist(){
  const groups=[...new Set(purchaseItems.map(x=>x.group))];
  const done=purchaseItems.filter(x=>checklist[x.id]).length;
  return `<div class="check-progress"><b>${done} / ${purchaseItems.length}</b><span>已完成。勾選只存這支 iPhone。</span><div><i style="width:${Math.round(done/purchaseItems.length*100)}%"></i></div></div>
  ${groups.map(group=>`<div class="section-head"><h2>${esc(group)}</h2></div>${purchaseItems.filter(x=>x.group===group).map(x=>`<label class="card check-item ${checklist[x.id]?'done':''}"><input type="checkbox" data-check="${x.id}" ${checklist[x.id]?'checked':''}><span><b>${esc(x.title)}</b><small>${esc(x.note)}</small>${x.url?external(x.url,'官方網站'):''}</span></label>`).join('')}`).join('')}
  <div class="notice"><b>不建議先買</b><br>沒必要為了「省事」先買全城景點通票。你們最難買的場次大多已有獨立票，交通也不一定能靠通票回本；必買項目優先用官方渠道。</div>`;
}
function renderPhrases(){
  return `<div class="privacy"><b>按播放聽義大利語</b><br>發音使用 iPhone 系統語音；羅馬字只是幫忙起步，以播放聲音為準。</div>${phrases.map((p,i)=>`<article class="card phrase"><button class="speak" data-action="speak" data-index="${i}" aria-label="播放 ${esc(p[0])}">▶</button><div><h3>${esc(p[0])}</h3><p>${esc(p[1])}</p><small>${esc(p[2])}</small></div></article>`).join('')}`;
}
function renderFood(){
  const cities=['all',...new Set(foodSpots.map(x=>x.city))];
  const visible=foodSpots.filter(x=>foodFilter==='all'||x.city===foodFilter);
  return `<div class="privacy"><b>行程附近，不做必吃打卡壓力</b><br>推薦按你們已排景點整理；營業時間、價格與休業可能改變，當天仍以店家官方資訊為準。€ 是平價，€€€€ 是體驗／高價。</div>
  <div class="filter-row food-filters">${cities.map(city=>`<button class="filter-chip ${foodFilter===city?'active':''}" data-action="food-filter" data-filter="${esc(city)}">${city==='all'?'全部':esc(city)}</button>`).join('')}</div>
  ${visible.map(x=>`<article class="card food-card"><div class="food-top"><div><span class="kicker">${esc(x.city)} · ${esc(x.near)}</span><h3>${esc(x.name)}</h3></div><span class="price-tag">${esc(x.budget)}</span></div><div class="food-kind">${esc(x.kind)}</div><p><b>建議點：</b>${esc(x.try)}</p><p class="muted">${esc(x.note)}</p><div class="actions">${external(appleMap(x.place),' 導航','strong')}${external(x.url,'官方／參考')}</div></article>`).join('')}
  <div class="section-head"><h2>我的候選清單</h2><span class="small-count">只存這支 iPhone</span></div>
  ${customFood.length?customFood.map(x=>`<article class="card custom-food"><div><span class="kicker">${esc(x.area||'未指定區域')}</span><h3>${esc(x.name)}</h3><p>${esc(x.note||'尚未加備註')}</p></div><button class="delete-round" data-action="delete-food" data-id="${esc(x.id)}" aria-label="刪除 ${esc(x.name)}">×</button></article>`).join(''):'<div class="empty compact-empty">還沒有自訂店家。看到朋友推薦的餐廳時，可直接加在下面。</div>'}
  <form id="foodForm" class="card quick-form"><h2>新增餐飲候選</h2><label><span>店名 *</span><input name="name" required maxlength="80" placeholder="例如：某間咖啡館"></label><label><span>城市／附近景點</span><input name="area" maxlength="80" placeholder="例如：羅馬 · Pantheon"></label><label><span>想吃什麼／備註</span><textarea name="note" maxlength="240" rows="3" placeholder="誰推薦、必點、是否要訂位…"></textarea></label><button class="primary wide" type="submit">加入這支 iPhone</button></form>`;
}
function renderSouvenirs(){
  const categories=['all',...new Set(souvenirItems.map(x=>x.category))];
  const visible=souvenirItems.filter(x=>souvenirFilter==='all'||x.category===souvenirFilter);
  const wanted=souvenirItems.filter(x=>souvenirChecklist[x.id]).length;
  return `<div class="gift-summary"><b>${wanted} 件想買</b><span>先勾選再決定，不必每一項都買。價格以 € 級距表示，實際以現場標價為準。</span></div>
  <div class="filter-row gift-filters">${categories.map(category=>`<button class="filter-chip ${souvenirFilter===category?'active':''}" data-action="gift-filter" data-filter="${esc(category)}">${category==='all'?'全部':esc(category)}</button>`).join('')}</div>
  ${visible.map(x=>`<label class="card gift-card ${souvenirChecklist[x.id]?'wanted':''}"><input type="checkbox" data-gift="${x.id}" ${souvenirChecklist[x.id]?'checked':''}><span class="gift-body"><span class="kicker">${esc(x.city)} · ${esc(x.category)} · ${esc(x.buyNear)}</span><span class="gift-title">${esc(x.item)}</span><span class="gift-budget">${esc(x.budget)}</span><span class="gift-why">${esc(x.why)}</span><span class="gift-carry"><b>攜帶／辨真：</b>${esc(x.carry)}</span><span class="actions">${external(appleMap(x.place),' 購買地點','strong')}${x.url?external(x.url,'官方／參考'):''}</span></span></label>`).join('')}
  <div class="notice"><b>入境與退稅原則</b><br>食品優先選密封常溫品；肉類與生鮮乳製品不要帶回台灣。高價精品、酒類與退稅商品保留收據，並在出發前依台灣海關、航空與退稅單最新規則再核對。</div>`;
}
function renderTools(){
  return `<article class="card install-card"><h2>安裝到 iPhone 主畫面</h2><ol><li>使用 Safari 開啟網站（不是 LINE／Google App 內建瀏覽器）。</li><li>點底部「分享」四方形上箭頭。</li><li>往下找「加入主畫面」，再點「新增」。</li><li>從主畫面打開一次，進入各主頁讓內容完成離線快取。</li></ol><button class="primary wide" data-action="install">顯示安裝提示</button></article>
  <article class="card"><h2>官方入口</h2><div class="official-list">${officialLinks.map(x=>external(x[1],x[0])).join('')}</div></article>
  <article class="card"><h2>離線出發前測試</h2><ol><li>在 Wi-Fi 下逐頁打開「今天、行程、票券、導覽、更多」。</li><li>每張當日 PDF／QR code 都在「票券」按過「開啟」。</li><li>開飛航模式，從主畫面重開 App 再測一次。</li></ol><p class="muted">Apple／Google 地圖導航仍可能需要網路；可先下載離線地圖，並截圖重要集合點。</p></article>
  <article class="card"><h2>隱私邊界</h2><p>公開網站含大致日期、飯店名與景點安排，可分享給同行者，但不適合放入 PIN、PNR、barcode、護照號碼或完整名單。這些私人檔只經「票券」存在個人裝置。</p></article>`;
}
function renderMore(){
  const tabs=[['profile','我的分組'],['food','餐飲'],['souvenirs','伴手禮'],['safety','安全'],['checklist','行前購買'],['phrases','基本用語'],['tools','工具']];
  const body=moreTab==='profile'?renderProfile():moreTab==='food'?renderFood():moreTab==='souvenirs'?renderSouvenirs():moreTab==='safety'?renderSafety():moreTab==='checklist'?renderChecklist():moreTab==='phrases'?renderPhrases():renderTools();
  app.innerHTML=`<div class="subnav">${tabs.map(x=>`<button class="${moreTab===x[0]?'active':''}" data-action="more-tab" data-tab="${x[0]}">${x[1]}</button>`).join('')}</div>${body}`;
}

function render(){
  document.getElementById('pageTitle').textContent=titles[currentView];
  document.querySelectorAll('.tabbar button').forEach(b=>b.classList.toggle('active',b.dataset.view===currentView));
  if(currentView==='today')renderToday();
  else if(currentView==='timeline')renderTimeline();
  else if(currentView==='tickets')renderTickets();
  else if(currentView==='guides')renderGuides();
  else renderMore();
  window.scrollTo({top:0,behavior:'instant'});
}
function changeView(view){currentView=view;render();}

document.querySelector('.tabbar').addEventListener('click',event=>{
  const button=event.target.closest('[data-view]');if(button)changeView(button.dataset.view);
});
app.addEventListener('click',async event=>{
  const button=event.target.closest('[data-action]');if(!button)return;
  const action=button.dataset.action;
  if(action==='view')changeView(button.dataset.view);
  if(action==='more'){moreTab=button.dataset.tab||'profile';changeView('more');}
  if(action==='day'){selectedDay=Number(button.dataset.day);renderTimeline();}
  if(action==='filter'){guideFilter=button.dataset.filter;renderGuides();}
  if(action==='food-filter'){foodFilter=button.dataset.filter;renderMore();}
  if(action==='gift-filter'){souvenirFilter=button.dataset.filter;renderMore();}
  if(action==='guide')showGuide(button.dataset.id);
  if(action==='upload'){uploadTarget=button.dataset.id;fileInput.value='';fileInput.click();}
  if(action==='open-ticket'){
    const item=await dbGet(button.dataset.id);if(!item)return;
    const url=URL.createObjectURL(item.file),anchor=document.createElement('a');anchor.href=url;anchor.target='_blank';anchor.rel='noopener';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),60000);
  }
  if(action==='delete-ticket'&&confirm('只從這支裝置刪除這張票券？')){await dbDelete(button.dataset.id);renderTickets();}
  if(action==='more-tab'){moreTab=button.dataset.tab;renderMore();}
  if(action==='delete-food'){
    customFood=customFood.filter(x=>x.id!==button.dataset.id);localStorage.setItem(foodCustomKey,JSON.stringify(customFood));renderMore();
  }
  if(action==='reset-profile'){profile={...defaultProfile};localStorage.setItem(profileKey,JSON.stringify(profile));renderMore();}
  if(action==='speak'){
    speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(phrases[Number(button.dataset.index)][0]);utterance.lang='it-IT';utterance.rate=.8;speechSynthesis.speak(utterance);
  }
  if(action==='install')showInstallHelp();
});
app.addEventListener('change',event=>{
  if(event.target.matches('[data-profile]')){profile[event.target.dataset.profile]=event.target.value;localStorage.setItem(profileKey,JSON.stringify(profile));renderMore();}
  if(event.target.matches('[data-check]')){checklist[event.target.dataset.check]=event.target.checked;localStorage.setItem(checklistKey,JSON.stringify(checklist));renderMore();}
  if(event.target.matches('[data-gift]')){souvenirChecklist[event.target.dataset.gift]=event.target.checked;localStorage.setItem(souvenirKey,JSON.stringify(souvenirChecklist));renderMore();}
});
app.addEventListener('submit',event=>{
  if(event.target.id!=='foodForm')return;
  event.preventDefault();const data=new FormData(event.target),name=String(data.get('name')||'').trim();if(!name)return;
  customFood.unshift({id:`food-${Date.now()}`,name,area:String(data.get('area')||'').trim(),note:String(data.get('note')||'').trim()});
  localStorage.setItem(foodCustomKey,JSON.stringify(customFood));renderMore();
});
fileInput.addEventListener('change',async()=>{
  const file=fileInput.files?.[0];if(!file||!uploadTarget)return;
  try{await dbPut({id:uploadTarget,file,name:file.name,type:file.type,updated:Date.now()});await renderTickets();}
  catch(error){alert('無法儲存檔案。請確認 Safari 有足夠空間，再試一次。');console.error(error)}
});
document.body.addEventListener('click',event=>{
  const close=event.target.closest('[data-action="close"]');
  if(close||event.target.matches('.modal')){event.target.closest('.modal')?.remove();document.body.classList.remove('modal-open');}
});

function showInstallHelp(){
  if(deferredInstall){deferredInstall.prompt();deferredInstall=null;return;}
  const isiOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
  alert(isiOS?'在 Safari 點底部「分享」→「加入主畫面」→「新增」。':'在瀏覽器選單找「安裝 App」或「建立捷徑」。');
}
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstall=event;installBtn.hidden=false;});
installBtn.hidden=false;installBtn.textContent='⇩';installBtn.addEventListener('click',showInstallHelp);

function updateOnline(){document.getElementById('offlineBanner').hidden=navigator.onLine;}
window.addEventListener('online',updateOnline);window.addEventListener('offline',updateOnline);updateOnline();
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');
render();
