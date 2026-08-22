const tripStart=new Date('2026-08-23T00:00:00+02:00');
const tripEnd=new Date('2026-09-06T23:59:59+02:00');
const profileKey='italia-2026-profile-v2',checklistKey='italia-2026-checklist-v2';
const defaultProfile={lodging:'all',wine:'all',course:'all',return:'all'};
let profile={...defaultProfile,...JSON.parse(localStorage.getItem(profileKey)||'{}')};
let checklist=JSON.parse(localStorage.getItem(checklistKey)||'{}');

const optionLabels={
lodging:{all:'尚未選住宿',vigliani:'Residence Vigliani',oroblu:'Hotel Oro Blu'},
wine:{all:'尚未選 8/26 分流',tour:'Chianti 酒莊組',alt:'佛羅倫斯漫遊組'},
course:{all:'尚未選會前課程',enrolled:'8/29–30 會前課程',free:'8/29–30 城市自由行'},
return:{all:'尚未選返程',sep5:'9/5 返台組',sep6:'9/6 返台組'}
};
const conditionLabels={'lodging:vigliani':'Vigliani 組','lodging:oroblu':'Oro Blu 組','wine:tour':'酒莊組','wine:alt':'漫遊組','course:enrolled':'會前課程組','course:free':'自由行組','return:sep5':'9/5 返程組','return:sep6':'9/6 返程組'};

const stays=[
{id:'rome',city:'羅馬',dates:'8/23–8/24',name:'The RomeHello',address:'Via Torino 45, Roma',note:'靠近 Roma Termini；抵達先寄放行李，8/24 退房後再寄放到搭車前。',source:'住宿憑證'},
{id:'florence',city:'佛羅倫斯',dates:'8/24–8/28',name:'C-Hotels Club',address:'Via Santa Caterina da Siena 11, Firenze',note:'靠近 Firenze S.M.N.；烏菲茲約步行 18–22 分鐘，Piazzale Montelungo 約 10–12 分鐘。',source:'使用者確認＋飯店官網'},
{id:'vigliani',city:'米蘭',dates:'8/28–9/4',name:'Residence Vigliani',address:'Viale Paolo Onorato Vigliani 19, Milano',note:'4 人公寓；14:00 後入住、9/4 06:00–10:00 退房。靠近 Portello M5。',source:'住宿憑證',cond:{lodging:'vigliani'}},
{id:'oroblu',city:'米蘭',dates:'8/28–9/4',name:'Hotel Oro Blu',address:'Piazzale Lorenzo Lotto 14, Milano',note:'12 人分房；15:00 後入住、11:00 前退房。Lotto M1/M5 約 50 公尺。',source:'Excel＋住宿截圖',cond:{lodging:'oroblu'}},
{id:'mxp',city:'Malpensa',dates:'9/4–9/5',name:'Holiday Inn Express Milan–Malpensa Airport',address:'Via de Pinedo / Via Oldrini, Case Nuove',note:'9/5 返程組；憑證涵蓋 3 人。訂單 PIN 僅保存在私人票券檔。',source:'住宿憑證',cond:{return:'sep5'}},
{id:'venice-mestre',city:'威尼斯 Mestre',dates:'9/3–9/5',name:'BnB · Via Nervesa 13',address:'Via Nervesa, 13, Venice, Veneto 30171, Italy',note:'9/6 返程組連住兩晚；9/3 搭 Italo 8989、17:52 抵達 Mestre，9/5 08:20–08:30 退房。',source:'使用者確認＋正式車票',cond:{return:'sep6'}},
{id:'porta-romana',city:'米蘭 Porta Romana',dates:'9/5–9/6',name:'Porta Romana 飯店（名稱待補）',address:'請補住宿名稱與地址',note:'9/6 返程組；9/5 晚由 Milano Centrale 搭 M3 抵達，9/6 約 06:20 出發前往 MXP。',source:'威尼斯預排 Excel',cond:{return:'sep6'}}
];

const E=(time,title,note,type='flex',place='',cond=null)=>({time,title,note,type,place,cond});
const days=[
{date:'2026-08-23',d:'8/23',dow:'日',city:'羅馬',subtitle:'抵達・古羅馬・有體力才看許願池',events:[
E('07:20','抵達 FCO 機場','新航班時間。入境與領行李預留 85–100 分鐘；上午不再排任何景點。','move','Fiumicino Airport'),
E('09:00–09:20','前往 FCO 火車站','搭第一班適合的 Leonardo Express；官方車程 32 分鐘、尖峰約每 15 分鐘一班。因 12:10 競技場是硬預約，不把道路塞車風險較高的機場巴士當首選。','move','Fiumicino Aeroporto train station'),
E('09:40–10:20','抵達 Roma Termini','以實際出關與班次為準；若 09:40 仍未離開機場，立即重算寄行李與到場時間，必要時改搭正式排班計程車。','move','Roma Termini'),
E('10:00–10:35','The RomeHello 寄放行李','只帶水、帽子、證件與當天票券；不得帶大型行李前往競技場。','stay','The RomeHello Rome'),
E('10:35–11:05','買輕食、上廁所、補水','只買三明治或可帶走的食物，不進正式餐廳。延誤時直接略過。','food','The RomeHello Rome'),
E('11:10','從飯店前往競技場','預計 11:35–11:45 抵達；11:20 仍未離開飯店就直接搭計程車。','move','Colosseum'),
E('11:55','抵達競技場','憑證要求提前 15 分鐘，所有票券姓名與有照片證件需相符。','fixed','Colosseum'),
E('12:10','Colosseum Full Experience — Attico','先依指示前往電梯與 Attico；競技場停留上限依票種為 90 分鐘。','fixed','Colosseum'),
E('13:50–15:30','古羅馬廣場短線','只走提圖斯拱門 → Via Sacra → 維斯塔之家 → 元老院；酷熱或太累就略過帕拉提諾山。','flex','Roman Forum'),
E('16:00–18:15','回 The RomeHello 入住、洗澡、休息','這段是必要緩衝，不再塞博物館或購物。','stay','The RomeHello Rome'),
E('19:00','許願池（只有體力才去）','先從外圍看；內圈 €2 為選配。若同行者已疲懊，直接在飯店附近晚餐。','flex','Fontana di Trevi'),
E('20:00','晚餐・提早回住宿','萬神殿改到 8/24 早上；第一晚不建議一次追兩個景點。','food','The RomeHello Rome')]},
{date:'2026-08-24',d:'8/24',dow:'一',city:'羅馬 → 佛羅倫斯',subtitle:'廣場、梵蒂岡與高鐵',events:[
E('08:00','退房、行李寄放 The RomeHello','把高鐵票、住宿地址與梵蒂岡憑證先離線開過一次。','stay','The RomeHello Rome'),
E('08:25','從飯店前往萬神殿','準備 09:00 官方時段票；星期一不受星期日 10:30 彌撒動線影響。','move','Pantheon Rome'),
E('09:00','萬神殿','參觀 30–35 分鐘；看穹頂、圆孔光線、地板排水與 Raphael 墓。','fixed','Pantheon Rome'),
E('09:40','納沃納廣場','看 Domitian 競技場的橢圓輪廓與四河噴泉；10:15 前離開。','flex','Piazza Navona'),
E('10:20','聖天使堡外觀・聖天使橋','不進城堡博物館；只沿橋看十尊拿著受難器具的天使。','flex','Ponte Sant Angelo'),
E('10:55','提早午餐','選可在 35–40 分鐘完成的餐點；不在聖彼得廣場排隊。','food','Borgo Pio Rome'),
E('11:40','前往梵蒂岡博物館入口','導航要選 Viale Vaticano，不是聖彼得廣場。步行慢或暑熱時直接搭車。','move','Vatican Museums'),
E('12:15','抵達 Vatican Museums','比憑證要求的 12:30 報到再多留 15 分鐘，出示證件與正式憑證。','fixed','Vatican Museums'),
E('13:00','梵蒂岡博物館英文團體導覽','安檢後往入口大廳最左側樓梯，至 Guided Tours 櫃台報到。','fixed','Vatican Museums'),
E('15:30','導覽後彈性 30–40 分鐘','若導覽準時結束，可看聖彼得廣場；不要為進大教堂重新排長隊而犧牲火車。','flex',"Saint Peter's Square"),
E('16:20','硬性離開梵蒂岡區','取行李與跨城交通不可壓縮；若導覽延後，直接回飯店。','move','The RomeHello Rome'),
E('17:20','取行李・前往 Termini','建議 17:40 前進站，確認月台後再買餐食。','move','Roma Termini'),
E('18:50','Roma Termini → Firenze S.M.N.','到站 20:57；此時間來自 8/16 確認資訊，車票仍需存入票券庫。','fixed','Firenze Santa Maria Novella'),
E('21:05','C-Hotels Club 入住','從 S.M.N. 步行約 4–6 分鐘；只安排附近簡單晚餐。','stay','C-Hotels Club Florence')]},
{date:'2026-08-25',d:'8/25',dow:'二',city:'佛羅倫斯',subtitle:'烏菲茲・城市雕塑・大圓頂',events:[
E('08:35','從 C-Hotels Club 出發','步行約 18–22 分鐘；08:55 抵達入口比較安心。','move','Uffizi Gallery'),
E('09:15','烏菲茲美術館','採 120 分鐘主線；若館內配置調整，以官方地圖與現場人員為準。','fixed','Uffizi Gallery'),
E('11:35','領主廣場 → 野豬噴泉 → Orsanmichele','這段約 35–45 分鐘，串起市政權力、商業行會與街頭傳說。','flex','Piazza della Signoria'),
E('12:25','中央市場・午餐','保留至少 40 分鐘用餐、補水與上廁所。','food','Mercato Centrale Firenze'),
E('13:35','大圓頂行李寄存','中大型包必須先寄放 Piazza Duomo 38/r；攜帶票券與有照片證件。','fixed','Piazza del Duomo 38 red Florence'),
E('14:15','Brunelleschi 大圓頂登頂','463 階、無電梯，遲到寬限僅約 5 分鐘；幽閉或懼高者不建議勉強。','fixed','Brunelleschi Dome Florence'),
E('16:00','洗禮堂／歌劇博物館或回飯店休息','Brunelleschi Pass 其他景點可在 3 個日曆日內各進一次；依票券效期確認。','flex','Opera del Duomo Museum Florence'),
E('17:30','回 C-Hotels Club 休息・集合','登頂後不要再硬塞米開朗基羅廣場；老橋與 Oltrarno 留給 8/26 漫遊組或其他空檔。','flex','C-Hotels Club Florence'),
E('19:00','Trattoria Dall’Oste 晚餐','已確認 8/25 19:00；Google Maps 連結對應 Via Alamanni 3/5R 分店，靠近 S.M.N. 與住宿。','fixed','Via Alamanni 3/5R Firenze')]},
{date:'2026-08-26',d:'8/26',dow:'三',city:'佛羅倫斯',subtitle:'大衛、Medici 與分流午後',events:[
E('08:05','從 C-Hotels Club 出發','步行約 15–18 分鐘；08:30 前抵達學院美術館。','move',"Galleria dell'Accademia Florence"),
E('08:45','Galleria dell’Accademia','先走《囚徒》長廊到 David，再回頭看石膏模型與樂器館。','fixed',"Galleria dell'Accademia Florence"),
E('10:15','Palazzo Medici・San Lorenzo 漫遊','找 Michelangelo「跪式窗」、Medici 六顆球徽章與未完成的教堂立面。','flex','Palazzo Medici Riccardi'),
E('12:15','午餐・回飯店休息','酒莊組避免空腹品酒；兩組約好晚上集合方式。','food','C-Hotels Club Florence'),
E('13:55','酒莊組從飯店出發','Piazzale Montelungo 在車站北側，不是 S.M.N. 正門；過地下道後依標誌找集合點。','move','Piazzale Montelungo Florence',{wine:'tour'}),
E('14:15','Chianti 下午品酒集合','正式憑證為下午場；提前 15 分鐘，帶電子憑證與有效證件。','fixed','Piazzale Montelungo Florence',{wine:'tour'}),
E('14:30','Chianti 葡萄酒與美食品鑑','預估 19:30 左右回到佛羅倫斯，實際依導遊通知。','fixed','Piazzale Montelungo Florence',{wine:'tour'}),
E('14:00','漫遊組：Santa Croce → Oltrarno 工匠區','兩人替代路線：但丁街區、Santa Croce 外觀、老橋南岸、Santo Spirito。','flex','Basilica of Santa Croce Florence',{wine:'alt'}),
E('17:45','漫遊組：San Miniato 或米開朗基羅廣場','依暑熱與體力選一處；天黑前回到有人潮的主要道路。','flex','San Miniato al Monte',{wine:'alt'}),
E('20:00','兩組回報平安・晚餐','在群組回報目前位置與回住宿方式。','food','C-Hotels Club Florence')]},
{date:'2026-08-27',d:'8/27',dow:'四',city:'比薩・五漁村',subtitle:'海岸一日遊',events:[
E('06:15','從 C-Hotels Club 出發','步行至 Piazzale Montelungo 約 10–12 分鐘；不要導航到同名公車站。','move','Piazzale Montelungo Florence'),
E('06:40','集合・找 City Wonders 標誌','憑證要求至少提前 20 分鐘；準備證件、暈車／暈船用品與水。','fixed','Piazzale Montelungo Florence'),
E('07:00','比薩＋五漁村一日遊出發','穿有抓地力的鞋；月台與村落多階梯，同行者彼此約定落單集合點。','fixed','Piazzale Montelungo Florence'),
E('20:00','預估返回佛羅倫斯','實際時間依導遊與交通；隔天早上退房，不再排夜間長行程。','move','C-Hotels Club Florence')]},
{date:'2026-08-28',d:'8/28',dow:'五',city:'佛羅倫斯 → 米蘭',subtitle:'高鐵、Duomo 與分組入住',events:[
E('07:45','C-Hotels Club 退房','飯店離車站很近，仍請先在大廳完成點名與票券確認。','stay','Firenze Santa Maria Novella'),
E('08:30','佛羅倫斯高鐵 → Milano Centrale','班次來自原始行程、目前 Drive 無正式車票；車次與到站時間請以票券為準。','warn','Milano Centrale'),
E('11:10','Residence Vigliani 寄放行李','正式入住 14:00 後；先詢問寄放，再由 Portello／Lotto 前往 Duomo。','stay','Residence Vigliani Milan',{lodging:'vigliani'}),
E('11:10','Hotel Oro Blu 寄放行李','正式入住 15:00 後；Lotto M1 可直達 Duomo。','stay','Hotel Oro Blu Milan',{lodging:'oroblu'}),
E('12:50','抵達米蘭大教堂 Gate 3 Verde','露台入口安檢；服裝遮肩膝。','fixed','Duomo di Milano'),
E('13:30','Duomo Fast-Track・露台','13:30 是露台上行時段；憑證指示下行一律走樓梯。','fixed','Duomo di Milano'),
E('15:00','教堂內部・考古區','套票兩天有效、每區限一次；若太累，先完成票券限制最嚴格的區域。','flex','Duomo di Milano'),
E('16:30','Galleria → La Scala → Brera','沿玻璃穹頂、史卡拉廣場到藝術家街區；60 分鐘短線可直接在 Brera 晚餐。','flex','Galleria Vittorio Emanuele II'),
E('19:00','分組入住・確認隔日路線','住宿選擇只存在各自 iPhone；公開網站仍可看到兩間住宿的一般資訊。','stay','Lotto Milano')]},
{date:'2026-08-29',d:'8/29',dow:'六',city:'米蘭',subtitle:'ISPE 會前課程／城市自由行',events:[
E('08:00','前往 Allianz MiCo','8/29–30 是需另外報名的 pre-conference skills courses，不含在一般大會註冊；時間以 ISPE 議程為準。','warn','Allianz MiCo',{course:'enrolled'}),
E('09:30','自由行：Sforza Castle → Brera','城堡庭院免費；想看 Michelangelo 最後作品《Rondanini Pietà》才需進博物館。','flex','Sforza Castle Milan',{course:'free'}),
E('14:30','自由行：Galleria／購物或午休','避免把 8/31–9/2 正式大會前的週末排得過滿。','flex','Brera Milan',{course:'free'}),
E('18:00','CityLife 建築散步','Tre Torri、城市公園與住宅曲線；從兩間住宿與 MiCo 都容易抵達。','flex','CityLife Milano')]},
{date:'2026-08-30',d:'8/30',dow:'日',city:'米蘭',subtitle:'ISPE 會前課程／運河與古城',events:[
E('08:00','ISPE 會前課程 Day 2','僅適用另外完成課程報名者；早餐不包含在會議註冊。','warn','Allianz MiCo',{course:'enrolled'}),
E('10:00','自由行：Sant’Ambrogio → Colonne di San Lorenzo','看米蘭早期基督教層次，再一路往舊城門與運河區。','flex',"Basilica di Sant'Ambrogio Milan",{course:'free'}),
E('15:30','自由行：Navigli 白天散步','看 Vicolo dei Lavandai、欄杆式公寓與運河運大理石的歷史；晚間人多要顧包。','flex','Vicolo dei Lavandai Milan',{course:'free'}),
E('18:40','前往 Amabile Milano 集合','餐廳在 MiCo／Portello 一帶；先回住宿者依地圖預留交通時間。','move','Viale Teodorico 26 Milano'),
E('19:00','Lab 聚餐・Amabile Milano','日期、時間與餐廳已確認；地址 Viale Teodorico 26。若群組臨時變更，以最新通知為準。','fixed','Viale Teodorico 26 Milano')]},
{date:'2026-08-31',d:'8/31',dow:'一',city:'米蘭',subtitle:'ISPE 正式大會 Day 1',events:[
E('07:30','從住宿前往 Allianz MiCo','Hotel Oro Blu 可走 Lotto；Residence Vigliani 可走 Portello。實際入口依大會通知。','move','Allianz MiCo'),
E('08:30','42nd ISPE Annual Meeting','正式大會為 8/31–9/2；精確 session 以個人議程為準。午餐與茶歇包含、早餐不含。','fixed','Allianz MiCo'),
E('18:30','自由晚餐・回住宿休息','Lab 聚餐已改在 8/30 19:00 Amabile；今晚可直接使用下方 MiCo／Lotto／Portello 備選。','food','Allianz MiCo')]},
{date:'2026-09-01',d:'9/1',dow:'二',city:'米蘭',subtitle:'ISPE 正式大會 Day 2',events:[
E('07:30','前往 Allianz MiCo','使用同一張實體卡或同一台手機進出與轉乘，避免 contactless 被拆成不同旅程。','move','Allianz MiCo'),
E('08:30','ISPE 正式大會','依個人議程；海報與口頭報告場次另存到手機行事曆。','fixed','Allianz MiCo'),
E('18:30','45 分鐘微散步：Tre Torri／CityLife','想休息可直接回飯店；這條路不需另買景點票。','flex','Tre Torri Milano')]},
{date:'2026-09-02',d:'9/2',dow:'三',city:'米蘭',subtitle:'ISPE 閉幕與整理日',events:[
E('07:30','前往 Allianz MiCo','帶可折疊袋收會議資料，避免把護照與全部卡片帶去會場。','move','Allianz MiCo'),
E('08:30','ISPE 正式大會・最後一天','閉幕後確認報帳、證書、行李與隔日《最後的晚餐》具名票券。','fixed','Allianz MiCo'),
E('17:30','回住宿休息・整理票券','確認 9/3 08:25 出發，所有人票券姓名與證件一致。','flex','Lotto Milano'),
E('晚間','AsPEN 聚餐','日期已確認為 9/2 晚上；確切時間、餐廳與集合點仍待主辦通知，收到後可局部更新。','warn')]},
{date:'2026-09-03',d:'9/3',dow:'四',city:'米蘭／威尼斯分流',subtitle:'最後的晚餐後，9/6 組前往 Mestre',events:[
E('08:25','從住宿出發','Lotto 搭 M1 至 Conciliazione／Cadorna 後步行；預留尖峰與找入口時間。','move','Cenacolo Vinciano'),
E('09:00','Cenacolo 售票處報到','憑證要求提前 30 分鐘，出示有效身分證件；具名票不可更名。','fixed','Cenacolo Vinciano'),
E('09:15','前往博物館入口','手機電子票先調高亮度；遲到可能無法入場。','fixed','Cenacolo Vinciano'),
E('09:30','《最後的晚餐》英文導覽','先看耶穌說出背叛後的四組反應，再追中央消失點與窗外光線。','fixed','Cenacolo Vinciano'),
E('10:20','Santa Maria delle Grazie 外觀／教堂','若宗教活動允許再入內；先繞到後方看 Bramante 的圓頂與青蛙迴廊。','flex','Santa Maria delle Grazie Milan'),
E('11:15','Sforza Castle → Brera → Duomo','120 分鐘主線；9/6 組需依高鐵票提早結束、回住宿取行李。','flex','Sforza Castle Milan'),
E('18:00','Navigli Aperitivo','Darsena → Vicolo dei Lavandai → Naviglio Grande；手機與錢包不要放桌邊。','food','Darsena Milano',{return:'sep5'}),
E('15:35–17:52','Italo 8989・Milano Centrale → Venezia Mestre','正式車票已確認；建議 15:05 前到月台區，車廂、座位與臨時變更以票面及車站看板為準。','fixed','Venezia Mestre',{return:'sep6'}),
E('17:52–18:25','抵達 Mestre・BnB Check-in','Via Nervesa 13；放行李後只帶水、外套、行動電源與小包進本島。','stay','Via Nervesa 13 Venice',{return:'sep6'}),
E('18:30–18:45','Mestre → Venezia Santa Lucia','目前規劃搭區間火車；ACTV 48 小時票通常不含 Trenitalia，需另買車票或依飯店位置改搭 ACTV 巴士。','move','Venezia Santa Lucia',{return:'sep6'}),
E('18:45–19:25','Line 1 大運河水上巴士 → San Marco','第一次啟用 ACTV 48 小時票前確認日期；每次上船前都要感應驗票。','move','San Marco Vallaresso Venice',{return:'sep6'}),
E('19:25–20:15','聖馬可夜景 → Mercerie → Rialto','教堂、總督宮與嘆息橋只看外觀；沿主要街道步行到 Rialto。','flex','Piazza San Marco Venice',{return:'sep6'}),
E('20:15–21:15','Rialto 晚餐・橋上夜景','先用餐再看橋；餐廳桌邊與擁擠橋面都要顧好手機和包。','food','Rialto Bridge Venice',{return:'sep6'}),
E('21:15–21:45','Rialto → Ferrovia → Mestre','回程船與區間車以當晚電子看板為準；不要把 Santa Lucia 與 Mestre 當成同一站。','move','Venezia Mestre',{return:'sep6'})]},
{date:'2026-09-04',d:'9/4',dow:'五',city:'科莫湖／威尼斯分流',subtitle:'9/5 組去科莫湖；9/6 組走離島與 Dorsoduro',events:[
E('07:10','米蘭住宿退房・寄放行李','Residence Vigliani 10:00 前退房；Hotel Oro Blu 11:00 前。先問能否寄放到傍晚。','stay','Lotto Milano',{return:'sep5'}),
E('07:50','Milano Cadorna → Como Lago','實際車班出發前再查 Trenord；今日所有船班以官方 2026 夏季表為準。','warn','Milano Cadorna',{return:'sep5'}),
E('09:10','Como 舊城・湖岸短走','大教堂外觀、Piazza Cavour 與碼頭；不要耗掉前往 Bellagio 的船班。','flex','Como Lago',{return:'sep5'}),
E('10:15','Como → Bellagio 船班','快速船名額與規則不同，建議預先確認；普通船較慢。','warn','Bellagio ferry terminal',{return:'sep5'}),
E('12:00','Bellagio 午餐・老城階梯','以碼頭、Salita Serbelloni 與湖畔為核心；好走的鞋比多塞一個景點重要。','food','Bellagio',{return:'sep5'}),
E('14:20','9/5 組：開始返回 Como／米蘭','推薦捨棄 Varenna，確保 17:30 前回米蘭取行李並轉往機場飯店。','move','Como Lago',{return:'sep5'}),
E('17:30','9/5 組：回米蘭取行李','再前往 Milano Cadorna 搭 Malpensa Express；不可把機場飯店地址當成航廈。','move','Milano Cadorna',{return:'sep5'}),
E('20:00','Holiday Inn Express Malpensa 入住','Case Nuove；PIN 僅在私人住宿檔。隔天前往 EVA Air Terminal 1。','stay','Holiday Inn Express Milan Malpensa Airport',{return:'sep5'}),
E('09:00–09:25','Via Nervesa BnB → Venezia Santa Lucia','大致照預排約 09:10 搭區間車；抵達後直接到 Ferrovia 碼頭。','move','Venezia Santa Lucia',{return:'sep6'}),
E('09:35–09:55','Line 3：Ferrovia → Murano Faro','只在 Murano Faro 轉船、不逛 Murano；下船立刻確認 Line 12 月台字母。','move','Murano Faro Venice',{return:'sep6'}),
E('10:11–10:41','Line 12：Murano Faro → Burano','依同行者預排時間顯示；當天以票券、ACTV App 與碼頭電子看板為準。','move','Burano Venice',{return:'sep6'}),
E('10:45–12:40','Burano 彩色房屋・午餐','小運河 → Piazza Galuppi → San Martino 斜鐘塔；11:45 開始午餐。','food','Piazza Baldassarre Galuppi Burano',{return:'sep6'}),
E('13:00–14:15','Line 9 往返 Torcello・島上短走','13:05 抵達；魔鬼橋 → Santa Fosca → Santa Maria Assunta，14:10 船回 Burano。','fixed','Torcello Venice',{return:'sep6'}),
E('14:30–15:35','Line 14：Burano → San Marco–S. Zaccaria','此段跨潟湖較長；上船前先確認方向與停靠碼頭。','move','San Zaccaria Venice',{return:'sep6'}),
E('15:48–17:10','Line 1 → Salute・安康聖母聖殿','15:56 抵達 Salute；看 Longhena 八角形空間與 1630 年瘟疫還願背景。','flex','Basilica di Santa Maria della Salute Venice',{return:'sep6'}),
E('17:10–18:40','Dorsoduro → 學院橋 → Zattere','沿水岸慢走，不加博物館；學院橋回看 Salute 是重點視角。','flex','Ponte dell Accademia Venice',{return:'sep6'}),
E('18:40–21:00','Dorsoduro 晚餐・回 Mestre','約 20:00 後搭船回 Ferrovia，約 20:45–21:00 搭區間車回 Mestre。','food','Zattere Venice',{return:'sep6'})]},
{date:'2026-09-05',d:'9/5',dow:'六',city:'返台／威尼斯分流',subtitle:'9/5 組飛行；9/6 組走本島後回米蘭',events:[
E('06:45','機場飯店退房・前往 MXP T1','退稅組以起飛前約 4 小時抵達為目標；前一晚向飯店確認接駁或預約車，不臨時等車。','move','Malpensa Airport Terminal 1',{return:'sep5'}),
E('07:15','抵達機場・整理退稅資料','EVA Air 在 T1 Area 18，退稅在 T1 2F Area 12；先備妥單據、商品、護照與登機資料，櫃檯開放仍以現場為準。','fixed','Malpensa Airport Terminal 1',{return:'sep5'}),
E('11:15','BR96 米蘭 → 台北','時間來自原始行程；最終仍以電子機票與航空公司通知為準。','fixed','Malpensa Airport Terminal 1',{return:'sep5'}),
E('08:20–09:05','Via Nervesa BnB 退房 → Santa Lucia 寄行李','約 08:35 搭區間車、08:50 抵達；依預排時間前進。','stay','Via Nervesa 13 Venice',{return:'sep6'}),
E('09:05–10:15','步行至 Frari・榮耀聖母教堂','主看 Titian《聖母升天》《Pesaro 聖母》、Bellini 祭壇畫與 Canova 紀念碑。','flex','Basilica Santa Maria Gloriosa dei Frari Venice',{return:'sep6'}),
E('10:15–10:55','San Tomà → San Marco','10:25 左右搭 Line 1；若船班擁擠，11:30 聖馬可預約優先，必要時縮短廣場拍照。','move','Piazza San Marco Venice',{return:'sep6'}),
E('10:55–11:20','聖馬可廣場・時鐘塔外觀','先找正式預約入口與集合點，再拍照；教堂服裝需遮肩膝。','flex','Piazza San Marco Venice',{return:'sep6'}),
E('11:30–12:45','聖馬可大教堂','必須購買官方時段票；官方只保留約 5 分鐘遲到容許，先看金色馬賽克與起伏地板。','fixed','Basilica di San Marco Venice',{return:'sep6'}),
E('12:45–13:50','提早午餐','14:00 總督宮優先；選能在 50–60 分鐘完成的餐廳。','food','Piazza San Marco Venice',{return:'sep6'}),
E('14:00–16:10','總督宮','議會廳 → Tintoretto《天堂》→ 嘆息橋 → 監獄；一般票以正式票券規則為準。','fixed','Doge Palace Venice',{return:'sep6'}),
E('16:10–17:20','海濱 → Ferrovia・領行李','約 16:25 開始搭船回 Santa Lucia；17:05 抵達後立刻取行李。','move','Venezia Santa Lucia',{return:'sep6'}),
E('17:57–20:25','Italo 8992：Venezia S. Lucia → Milano Centrale','正式車票已確認；建議提早抵達 Santa Lucia，車廂、座位與臨時變更以票面及車站看板為準。','fixed','Milano Centrale',{return:'sep6'}),
E('20:35–20:50','M3 Centrale FS → Porta Romana・入住','方向 San Donato；飯店名稱與地址仍待補。','stay','Porta Romana Milan',{return:'sep6'})]},
{date:'2026-09-06',d:'9/6',dow:'日',city:'米蘭 → 台北',subtitle:'延後返程組',events:[
E('05:35–05:45','最後整理・Porta Romana 退房','護照、電子機票、退稅單與要查驗的商品放在隨身可取位置。','stay','Porta Romana Milan',{return:'sep6'}),
E('05:45','預約車前往 Milano Centrale','為了退稅提早到機場，清晨不把地鐵首班與轉乘當唯一方案；前一晚預約車。','move','Milano Centrale',{return:'sep6'}),
E('06:10','抵達 Milano Centrale','依電子看板找 Malpensa Express 月台；先買好早餐，月台臨時變動仍以現場為準。','move','Milano Centrale',{return:'sep6'}),
E('06:25–07:18','Malpensa Express → MXP Terminal 1','依目前官方 2026 時刻表採較早班次；9/5 晚再用官方 App／車票確認是否變動。','move','Malpensa Airport Terminal 1',{return:'sep6'}),
E('07:20','抵達出境大廳・退稅與報到','接近起飛前 4 小時；EVA Air 在 T1 Area 18，退稅在 2F Area 12。','fixed','Malpensa Airport Terminal 1',{return:'sep6'}),
E('11:15','BR96 米蘭 → 台北','與前一日相同航班時段的規劃；以各自電子機票為最終依據。','fixed','Malpensa Airport Terminal 1',{return:'sep6'})]}
];

const tickets=[
{id:'colosseum',date:'8/23 12:10',title:'羅馬競技場・Attico',note:'11:55 前抵達 · 帶證件 · 競技場 90 分鐘 · 禁帶大型行李',day:0},
{id:'rome-hotel',date:'8/23',title:'The RomeHello 住宿',note:'8/23–8/24 · Via Torino 45 · 訂位資料僅存本機',day:0},
{id:'pantheon',date:'8/24 建議 09:00',title:'萬神殿（待購／待上傳）',note:'2026/7 起全票 €7 · 官方 Musei Italiani · 再接納沃納廣場與聖天使橋',day:1,pending:true},
{id:'vatican',date:'8/24 13:00',title:'梵蒂岡博物館英文導覽',note:'12:30 報到 · Viale Vaticano · Guided Tours 櫃台 · 13 人',day:1},
{id:'train-rome-florence',date:'8/24 18:50',title:'Roma → Firenze 高鐵',note:'18:50–20:57 · 正式車票請存入本機',day:1,pending:true},
{id:'florence-hotel',date:'8/24–8/28',title:'C-Hotels Club',note:'Via Santa Caterina da Siena 11 · 公開程式碼不含訂位碼',day:1},
{id:'uffizi',date:'8/25 09:15',title:'烏菲茲美術館',note:'手機電子票可直接出示 · 依現場展廳開放調整動線',day:2},
{id:'duomo-florence',date:'8/25 14:15',title:'Brunelleschi 大圓頂（待上傳）',note:'Piazza Duomo 38/r 寄包 · 帶證件 · 463 階 · 遲到寬限短',day:2,pending:true},
{id:'accademia',date:'8/26 08:45',title:'學院美術館',note:'Galleria dell’Accademia · 建議 08:30 抵達',day:3},
{id:'chianti',date:'8/26 14:30',title:'Chianti 下午品酒',note:'14:15 Piazzale Montelungo 集合 · 正式憑證為下午場 · 4 人',day:3,cond:{wine:'tour'}},
{id:'cinque',date:'8/27 07:00',title:'比薩＋五漁村一日遊',note:'Piazzale Montelungo · 06:40 前抵達 · 4 人',day:4},
{id:'train-florence-milan',date:'8/28 08:30',title:'Firenze → Milano 高鐵（待確認）',note:'目前僅見原始行程，未見正式車票；車次與抵達時間以票券為準',day:5,pending:true},
{id:'duomo',date:'8/28 13:30',title:'米蘭大教堂 Fast-Track',note:'Gate 3 Verde · 露台上行時間 · 下樓走樓梯 · 4 人',day:5},
{id:'milan-vigliani',date:'8/28–9/4',title:'Residence Vigliani',note:'4 人 · 14:00 後入住 · 9/4 10:00 前退房 · PIN 不寫入 App',day:5,cond:{lodging:'vigliani'}},
{id:'milan-oroblu',date:'8/28–9/4',title:'Hotel Oro Blu',note:'Piazzale Lorenzo Lotto 14 · 12 人分房 · 訂位碼不寫入 App',day:5,cond:{lodging:'oroblu'}},
{id:'ispe',date:'8/29–9/2',title:'ISPE 2026 大會資料',note:'8/29–30 會前課程；8/31–9/2 正式大會 · 個人議程建議另存',day:6,pending:true},
{id:'cenacolo',date:'9/3 09:30',title:'《最後的晚餐》英文導覽',note:'09:00 售票處 · 帶證件 · 手機出示 · 不可更名',day:11},
{id:'lake-como',date:'9/4',title:'科莫湖火車／船票（待購）',note:'僅 9/5 返程組 · 以 2026 官方夏季船班為準',day:12,pending:true,cond:{return:'sep5'}},
{id:'venice-outbound',date:'9/3 15:35',title:'Italo 8989・Milano → Venezia Mestre',note:'15:35–17:52 · 僅 9/6 返程組 · 車廂、座位與票號只保存在個人票券檔',day:11,cond:{return:'sep6'}},
{id:'venice-mestre-hotel',date:'9/3–9/5',title:'BnB · Via Nervesa 13',note:'僅 9/6 返程組 · 住宿憑證可上傳到本機；PIN／門鎖碼不寫入公開程式碼',day:11,pending:true,cond:{return:'sep6'}},
{id:'venice-actv',date:'9/3–9/5',title:'ACTV 48 小時票＋Mestre 區間車',note:'48h 票從首次驗票起算；一般 ACTV 時間票不含 Trenitalia，區間車需另購',day:11,pending:true,cond:{return:'sep6'}},
{id:'venice-san-marco',date:'9/5 11:30',title:'聖馬可大教堂官方時段票',note:'官方售票 · 約 5 分鐘遲到容許 · 肩膝遮蔽 · 依購買套票確認是否含 Pala d’Oro／博物館',day:13,pending:true,cond:{return:'sep6'}},
{id:'venice-doge',date:'9/5 14:00',title:'總督宮（待購／待上傳）',note:'預留約 2 小時；一般票或指定時段以正式票面為準',day:13,pending:true,cond:{return:'sep6'}},
{id:'venice-return',date:'9/5 17:57',title:'Italo 8992・Venezia → Milano',note:'17:57–20:25 · 僅 9/6 返程組 · 車廂、座位與票號只保存在個人票券檔',day:13,cond:{return:'sep6'}},
{id:'porta-romana-hotel',date:'9/5–9/6',title:'Porta Romana 飯店（待補）',note:'9/6 返程組 · 請補名稱、地址與入住憑證',day:13,pending:true,cond:{return:'sep6'}},
{id:'mxp-hotel',date:'9/4',title:'Holiday Inn Express Malpensa',note:'9/5 返程組 · 憑證 3 人 · PIN 僅存私人檔',day:12,cond:{return:'sep5'}},
{id:'flight-sep5',date:'9/5 11:15',title:'BR96 MXP → TPE',note:'EVA Air T1 Area 18 · 電子機票為準',day:13,cond:{return:'sep5'}},
{id:'flight-sep6',date:'9/6 11:15',title:'BR96 MXP → TPE',note:'建議 06:25 Centrale → 07:18 MXP T1；9/5 晚仍以官方 App、車票與電子看板為準',day:14,cond:{return:'sep6'}}
];

const S=(title,quick,look,deep,place='')=>({title,quick,look,deep,place});
const guides=[
{id:'rome-arrival',kind:'walk',city:'ROMA',title:'古羅馬與水景（分兩段）',time:'8/23 下午＋8/24 早上',class:'rome',summary:'8/23 先守住 12:10 競技場，晚上有體力才看 Trevi；8/24 09:00 再看 Pantheon，接納沃納廣場與聖天使橋。',route:['8/23 Colosseum','Roman Forum','Trevi（選配）','8/24 Pantheon','Piazza Navona','Ponte Sant’Angelo'],plans:[['8/23','機場 → 寄行李 → 競技場 → Forum 短線 → 休息'],['8/24','Pantheon → Piazza Navona → Ponte Sant’Angelo → 梵蒂岡博物館']],sources:[['Trevi 官方資訊','https://www.turismoroma.it/en/places/trevi-fountain'],['萬神殿官方','https://direzionemuseiroma.cultura.gov.it/en/pantheon/']],stops:[
S('許願池不是只為丟硬幣','Trevi 是古羅馬 Aqua Virgo 水道的終點；立面像凱旋門，中央不是 Neptune，而是海洋人格化的 Oceanus。','看兩匹馬：一匹躁動、一匹溫順，象徵水既狂暴也平靜。','2026/2 起，遊客進最靠近水池的內圈需 €2；外圍仍可看。8/23 是星期日，9:00 起開放付費內圈。','Fontana di Trevi'),
S('萬神殿：一顆混凝土宇宙','穹頂直徑與地面至圓孔高度同為約 43.3 公尺，想像一顆完美球體塞進室內。','靠近中央看圓孔投下的光斑；下雨會進水，地面微凸並有排水孔。','入口刻 Agrippa，現存建築主要是 Hadrian 時代重建。它在 609 年成為教堂，也是能保存至今的重要原因。','Pantheon Rome'),
S('Pantheon 前噴泉的埃及記憶','噴泉是 Giacomo della Porta 16 世紀設計，18 世紀加上 Ramses II 方尖碑。','找基座上的海豚與教宗徽章。','同一條 Aqua Virgo 也供水給 Trevi 與西班牙廣場 Barcaccia；你剛走的是一條城市水道故事線。','Fontana del Pantheon'),
S('從巴洛克走到古羅馬','穿過 Piazza Venezia 後，城市尺度突然變成帝國尺度。','在 Via dei Fori Imperiali 上先找 Trajan 市場與遠方競技場輪廓。','道路是 20 世紀開闢；腳下仍有古代論壇遺構，因此不要把眼前大道誤認為古羅馬原貌。','Via dei Fori Imperiali')]},
{id:'rome-baroque',kind:'walk',city:'ROMA',title:'萬神殿、納沃納與聖天使橋',time:'09:00–11:40',distance:'約 2.6 km',class:'rome',summary:'Pantheon → Piazza Navona → 四河噴泉 → 聖天使橋 → 提早午餐 → 梵蒂岡博物館。11:40 開始朝 Viale Vaticano 移動。',routePlaces:['Pantheon Rome','Piazza Navona','Ponte Sant Angelo','Borgo Pio Rome','Vatican Museums'],plans:[['最推薦','09:00 Pantheon → 09:40 Navona → 10:20 聖天使橋 → 10:55 午餐'],['延誤版','略過 Navona 停留，直接走橋與前往博物館']],sources:[['Turismo Roma','https://www.turismoroma.it/en'],['Pantheon 官方','https://direzionemuseiroma.cultura.gov.it/en/pantheon/']],stops:[
S('橢圓廣場其實是競技場','Piazza Navona 沿著 Domitian Stadium 的長橢圓留下形狀。','站在北端看彎曲建築線，就能讀出古代跑道輪廓。','古代體育場骨架被中世紀與巴洛克城市生活慢慢填滿。','Piazza Navona'),
S('四河噴泉是一張世界地圖','Bernini 用 Nile、Ganges、Danube、Río de la Plata 代表當時教廷認知的四大洲。','找蒙住頭的 Nile、拿槳的 Ganges、碰教宗徽章的 Danube。','傳說河神在躲對面教堂其實不合年代，因噴泉更早完成。','Fontana dei Quattro Fiumi'),
S('橋上的天使拿的是受難器具','每位天使手持十字架、荊冠、釘子等 Passion 器具。','依序看天使手中物件，橋就變成一段朝聖敘事。','Bernini 親作的兩尊原作後來移到 Sant’Andrea delle Fratte。','Ponte Sant Angelo')]},
{id:'colosseum',kind:'museum',city:'ROMA',title:'競技場 Attico＋古羅馬廣場',time:'90＋75 分鐘',class:'rome',summary:'票券先上 Attico，再視體力進 Forum–Palatine。官方要求具名票與證件，競技場不同票種停留上限 75–90 分鐘。',route:['入口','電梯','Attico','二層','一層','提圖斯拱門','Forum'],plans:[['競技場 90 分','入口 → 電梯 → Attico → 二層展覽 → 出口'],['Forum 75 分','提圖斯拱門 → Via Sacra → 維斯塔之家 → 元老院'],['Forum 120 分','再加 Palatine 觀景台']],sources:[['Colosseum 官方','https://colosseo.it/en/opening-times-and-tickets/']],stops:[
S('先上 Attico','依憑證指示先前往電梯，Attico 是高處單向動線。','向下看橢圓與地下層，先建立整體方向。','競技場靠重複拱廊、編號入口與分層通道快速疏散人潮。'),
S('座位就是羅馬階級表','越靠近 arena，社會地位越高；最高層反而最能看清整體秩序。','找不同層的坡度與入口如何把人群分開。','皇帝、元老、騎士、公民與女性等群體的位置，讓政治秩序每天被看見。'),
S('地下層不是原始地面','現在露出的 hypogeum 是升降機、籠舍與工作通道；古代上方覆著木地板與沙。','找垂直槽與牆體，想像舞台機械。','arena 一詞與沙有關；沙吸收液體，也讓表面更容易維護。'),
S('提圖斯拱門：勝利也有代價','從競技場進 Forum 時看拱門內側，羅馬軍隊帶走耶路撒冷聖殿器物。','找七枝燈台 menorah。','它既是帝國勝利宣傳，也是被征服者失去家園與聖物的證據。','Arch of Titus'),
S('Via Sacra 與元老院','Forum 是宗教、政治、審判與商業一起發生的核心。','把 Basilica、Temple、Curia 分成三種功能來看。','站在 Curia 前想像政治辯論，再看 Basilica 平面如何影響後來教堂。','Roman Forum')]},
{id:'vatican',kind:'museum',city:'ROMA',title:'梵蒂岡博物館陪看筆記',time:'隨官方英文團',class:'rome',summary:'不和導遊搶路線；只提供「被帶到哪裡就看什麼」。實際路線與開放區以官方導覽為準。',route:['報到','古典雕塑','地圖畫廊','Raphael Rooms','Sistine Chapel'],plans:[['跟團版','全程跟官方導遊，只在停留時打開相應段落'],['時間受限','導覽後不另排大教堂長隊，16:20 離開']],sources:[['梵蒂岡官方','https://www.museivaticani.va/content/museivaticani/en.html'],['官方地圖','https://www.museivaticani.va/content/dam/museivaticani/pdf/visita_musei/servizi_visitatori/mappa_musei_vaticani.pdf']],stops:[
S('Laocoön：痛苦如何扭動身體','父子被海蛇纏繞，三具身體形成連續螺旋。','看父親腹部與右腿如何抵抗，臉卻已知道無法逃脫。','雕像 1506 年出土，深深影響 Michelangelo；核心是徒勞抵抗的悲劇。'),
S('Apollo Belvedere：理想身體','Apollo 把動作完成後的餘韻固定成優雅平衡。','比較他與 Laocoön：一個從容、一個扭曲。','近代歐洲曾把這種古典身體當美的高峰；也可反問誰定義理想。'),
S('Belvedere Torso','沒有頭與四肢，軀幹扭轉仍讓人感到下一個動作。','看腹部隨扭轉被拉長與壓縮。','Michelangelo 極推崇它，西斯廷天頂許多人物可見類似動勢。'),
S('地圖畫廊','牆上是 16 世紀義大利地理，頭頂金色拱頂同樣重要。','找旅行城市與亞平寧山脈，注意方向未必像手機地圖。','長廊把知識、領土與教廷權力排成壯觀視線。'),
S('雅典學院','中央 Plato 指天、Aristotle 掌心向地，象徵理念與經驗。','找台階上獨坐的 Heraclitus。','Raphael 把古代哲人放進宏偉建築，用古典智慧替文藝復興背書。'),
S('Sistine 天頂','先抓中央九幕，再看周圍先知與女預言家。','《創造 Adam》注意兩手之間永遠保留的縫隙。','虛構建築框架讓數百人物像坐在真實石構上。'),
S('最後的審判','祭壇牆比天頂更擁擠不安；Christ 位於旋轉人群中心。','找右下角被蛇纏住的 Minos。','作品完成時宗教氣氛已不同，裸體也引發爭議並被後來加上遮布；現場禁止攝影。')]},
{id:'florence-center',kind:'walk',city:'FIRENZE',title:'城市就是露天美術館',time:'75–110 分鐘',distance:'約 2.1 km',class:'',summary:'Uffizi → Piazza della Signoria → Loggia dei Lanzi → Porcellino → Orsanmichele → Duomo → Mercato Centrale。',routePlaces:['Uffizi Gallery','Piazza della Signoria','Fontana del Porcellino','Orsanmichele','Florence Cathedral','Mercato Centrale Firenze'],plans:[['75 分','領主廣場 → Orsanmichele → Duomo'],['110 分','再加 Porcellino 與 San Lorenzo']],sources:[['Piazza della Signoria','https://www.feelflorence.it/en/points-interest/piazza-della-signoria']],stops:[
S('Palazzo Vecchio：兩種權力','堡壘外觀屬於共和城市政府，後來又成為 Medici 公爵宮。','找不在正中央的 Arnolfo 塔。','廣場是政治舞台；地上圓石牌記著 Savonarola 1498 年被處刑的位置。','Palazzo Vecchio'),
S('David 是政治宣言','門口是複製品；原作在 Accademia。巨人象徵小共和國對抗強權。','看 David 視線與緊繃手臂，而不只拍正面。','它原計畫放在 Duomo 高處，完成後因力量太強被改放市政廳門口。'),
S('Loggia dei Lanzi','Perseus 高舉 Medusa 頭，也像 Medici 對反對者的警告。','繞到《Perseus》背面找 Cellini 自畫像。','《強擄薩賓婦女》先有三體螺旋構圖，後來才獲得題名。','Loggia dei Lanzi'),
S('野豬噴泉','摸鼻子、丟硬幣是再訪傳說。','看鼻子因數十年觸摸變得金亮。','街上是近代複製品；儀式本身也已成為城市文化。','Fontana del Porcellino'),
S('Orsanmichele：穀倉變教堂','壁龕由各商業行會委託守護聖人，像文藝復興企業贊助牆。','找職業徽章，再比較 Donatello 與 Ghiberti 雕像。','商業、慈善與信仰在同一棟建築重疊。','Orsanmichele'),
S('洗禮堂的天堂之門','面向 Duomo 的金色門是複製品；原作在歌劇博物館。','每格用透視把多段故事塞進同一畫面。','真正創新是用浮雕深淺控制遠近。','Battistero di San Giovanni Florence')]},
{id:'uffizi',kind:'museum',city:'FIRENZE',title:'烏菲茲：從金底到人的世界',time:'90–150 分鐘',class:'',summary:'以藝術史轉折而非死背房號：中世紀金底 → 空間與身體 → Botticelli → Leonardo → 盛期文藝復興 → 色彩與戲劇光。',route:['Giotto','International Gothic','Piero','Lippi','Botticelli','Leonardo','Michelangelo','Raphael','Titian','Caravaggio'],plans:[['90 分','Giotto → Botticelli 雙峰 → Leonardo → Doni Tondo → Caravaggio'],['120 分','再加 Piero、Lippi、Raphael、Titian'],['150 分','每站深入段落＋走廊古雕']],sources:[['Uffizi 官方','https://www.uffizi.it/en/the-uffizi'],['官方地圖與公告','https://www.uffizi.it/en/visit']],stops:[
S('Giotto《Ognissanti Madonna》','人物仍在金色神聖空間，卻開始有重量，寶座也像可走進去的建築。','看膝蓋撐起衣褶、天使前後重疊。','和 Cimabue、Duccio 並看，問空間、觸感與視線如何一步步改變。'),
S('Gentile《三王來朝》','金箔、衣料、動物與異國人物把宗教故事變成宮廷盛會。','沿隊伍從遠山追到前景，找獵豹、猴子與馬蹄。','佛羅倫斯富商用昂貴材料展示虔敬，也展示世界貿易網。'),
S('Piero《Urbino 公爵夫婦》','側面肖像像古錢幣，背景深遠風景建立統治領土。','看公爵鼻樑與皮膚細節沒有被美化。','背面還有寓意凱旋車，把容貌、婚姻紀念與政治形象合一。'),
S('Filippo Lippi 聖母','聖母像有情緒的年輕女子，透明面紗與窗外風景讓神聖變親密。','看前方天使的笑與聖母的憂慮。','先看這張臉，再找 Botticelli《維納斯》相似的細長輪廓。'),
S('Botticelli《春》','不是單一瞬間，而是從慾望、轉化到文明愛的一組神話角色。','右起找 Zephyr、Chloris、Flora；中央 Venus 後方樹叢像光環。','把它當視覺詩，不必假裝學者有唯一解釋。'),
S('《維納斯的誕生》','動人靠線條與節奏，不是正確人體解剖。','看過長脖子、下垂肩膀與站不穩的腳。','這是乘貝殼抵達岸邊；風神氣息推動畫面輪廓。'),
S('Leonardo《天使報喜》','遠景因空氣泛藍，是 aerial perspective；植物來自自然觀察。','從翅膀、百合、桌角一路看到遠山。','透視有不自然處，可能與原本觀看位置有關。'),
S('Leonardo《三王來朝》','未完成讓底稿露出，人物與馬匹像思考正在發生。','先找中央母子三角，再看外圈漩渦。','它和《囚徒》一樣，讓創作過程成為內容。'),
S('Michelangelo《Doni Tondo》','聖家族像雕塑般扭轉，飽和色預告 Mannerism。','看 Mary 如何跨過自己接過孩子。','圓形私人委託可能與婚姻、生育有關；後方裸體仍有多種解讀。'),
S('Raphael《金翅雀聖母》','三人是平穩金字塔，小鳥把溫柔場面連到未來受難。','看 John 把金翅雀遞給 Jesus。','作品曾因建築倒塌碎裂，今日平靜也包含物質脆弱。'),
S('Titian《烏爾比諾的維納斯》','她直視觀者，身體以色彩與光塑形。','找睡狗、玫瑰與背景箱櫃。','和 Botticelli 比較：神話海岸轉為當代室內，線條主導轉成色彩質感。'),
S('Caravaggio《Medusa》','不是畫布而是凸盾；Medusa 看見自身死亡。','側走看臉因曲面凸出，血滴順盾面。','強光、黑暗與瞬間表情把神話變成跳出空間的事件。')]},
{id:'accademia',kind:'museum',city:'FIRENZE',title:'Accademia：石頭如何變成人',time:'60–90 分鐘',class:'',summary:'先走《囚徒》長廊，讓未完成作品把你送到完成的 David；再回看模型、金底畫與樂器。',route:['Hall of Prisoners','David','St Matthew','Plaster Models','Gothic Rooms','Instruments'],plans:[['60 分','囚徒 → David → St Matthew'],['90 分','再加石膏模型與 Medici 樂器']],sources:[['Accademia 官方','https://www.galleriaaccademiafirenze.it/en/']],stops:[
S('《囚徒》','粗鑿與完成表面並存，直接看見 Michelangelo 的工作順序。','繞到側面看不同深度鑿痕。','non-finito 可能有技術、委託與美學多重原因；人物原本就在石裡只是美麗說法。'),
S('《St Matthew》','身體扭轉像要從狹長石塊轉身走出。','看支撐腿與未完成背面。','原屬佛羅倫斯大教堂使徒系列；觀看高度影響誇張姿態。'),
S('David：戰鬥前','右手藏石、左肩掛投石帶，表情是計算與警覺。','從側面看眉間、頸筋與放大的右手。','原計畫放在教堂高處，因此頭手放大；後來成為共和國政治象徵。'),
S('石膏模型廳','石膏是雕塑家反覆修正、轉移比例的重要工作媒介。','找表面定位點或接縫。','這區讓完成的大理石天才回到測量、翻模、放大與協作流程。'),
S('樂器館','收藏讓宮廷成為有音樂、節慶與技術的環境。','找早期鋼琴與裝飾華麗弦樂器。','Cristofori 在 Medici 宮廷發展早期 pianoforte，鍵盤可控制強弱。')]},
{id:'florence-medici',kind:'walk',city:'FIRENZE',title:'Medici 家族藏在街上的暗號',time:'60–90 分鐘',distance:'約 1.5 km',class:'',summary:'Palazzo Medici → San Lorenzo → Medici Chapels → Santa Maria Novella。從牽制街道的粗石牆、「跪式窗」到六顆球家徽，看家族如何把權力做成城市設計。',routePlaces:['Palazzo Medici Riccardi','Basilica di San Lorenzo Florence','Medici Chapels','Santa Maria Novella'],plans:[['60 分','Palazzo Medici 外觀 → San Lorenzo → Medici Chapels 外觀'],['90 分','再加 Santa Maria Novella 立面']],sources:[['FeelFlorence · Palazzo Medici','https://www.feelflorence.it/en/node/79039'],['FeelFlorence 官方城市旅遊','https://www.feelflorence.it/en']],stops:[
S('Palazzo Medici 的三層皮膚','一樓粗礦石像堡壘，往上越來越平滑，把權力從威嚇慢慢轉成文雅。','從路口抬頭，比較三層石頭的粗糙程度與窗戶間距。','Michelozzo 的建築成了文藝復興宮殿典型：富有、強大，卻不以皇宮比例刺激共和國城民。','Palazzo Medici Riccardi'),
S('「跪式窗」為什麼像跪著','Michelangelo 設計的 finestre inginocchiate，下方兩塊卷曲石頭像膝蓋支在窗台上。','找一樓後來封起來的拱廓位置，再看窗框下方的支撐。','當 Medici 需要更多室內空間，原本開放的拱廓被改造；新窗戶後來成為佛羅倫斯宮殿很常見的模式。','Palazzo Medici Riccardi'),
S('Medici 六顆球','紅球家徽在建築、教堂與街角反覆出現，看見它就像看見贊助人簽名。','注意最上方藍球有時帶法國百合花。','藥丸、錢幣、當鋪或武器痕跡都是流傳說法；家徽起源沒有單一確定答案，不要把傳說當史實。','Palazzo Medici Riccardi'),
S('San Lorenzo 為什麼外牆像沒蓋完','教堂是 Medici 家族核心教堂，裸露砖牆突顯了一座從未完成的立面。','比較粗糙外觀與 Brunelleschi 室內的灰石、白牆、比例秩序。','Michelangelo 曾為立面提案但未實現；「未完成」也變成佛羅倫斯最容易辨認的城市表情。','Basilica di San Lorenzo Florence'),
S('Santa Maria Novella 的幾何魔術','Alberti 用正方形、圓形與兩側大渦卷，把既有下層與新的上層合成一個完整立面。','找中央大正方形，再看兩側渦卷如何遮住中廳與側廊的高度差。','這不只是裝飾；比例把一座經過多階段建造的教堂，重新編輯成單一視覺秩序。','Santa Maria Novella')]},
{id:'florence-oltrarno',kind:'walk',city:'FIRENZE',title:'跨過老橋：Oltrarno 工匠與夕陽',time:'100–150 分鐘',distance:'約 3.6 km',class:'',summary:'Ponte Vecchio → Piazza della Passera → Santo Spirito → San Miniato al Monte／Piazzale Michelangelo。保留石板路、工匠街與爬坡緩衝。',routePlaces:['Ponte Vecchio','Piazza della Passera','Basilica di Santo Spirito','San Miniato al Monte','Piazzale Michelangelo'],plans:[['90 分','老橋 → Passera → Santo Spirito 吃飯'],['150 分','再搭車／步行上 San Miniato 與 Piazzale Michelangelo']],sources:[['FeelFlorence · Oltrarno','https://www.feelflorence.it/en/itineraries/oltrarno']],stops:[
S('老橋為什麼全是珠寶店','16 世紀末，肉販與皮革店被珠寶商取代，讓 Medici 經過的路更整齊。','抬頭找店屋上方像一條封閉管道的 Vasari Corridor。','走廊連接 Palazzo Vecchio 與 Pitti Palace，讓統治家族不用走進街上人群。','Ponte Vecchio'),
S('Piazza della Passera 的小尺度','這裡不是紀念碑廣場，而是 Oltrarno 日常生活的小客廳。','看建築高度、店面和餐桌如何共同定義廣場。','名字來源有多種說法，語源不宜當作已證實的單一故事。','Piazza della Passera'),
S('Santo Spirito 的白牆與城市生活','外觀極簡，Brunelleschi 在室內卻以重複列柱與圓拱建立強烈節奏。','先在廣場看居民與餐館，再在開放時間內安靜進教堂。','廣場的市場、學生和夜生活，讓文藝復興建築仍是活的社區空間。','Piazza Santo Spirito'),
S('San Miniato 與「比較年輕」的米開朗基羅廣場','San Miniato 是中世紀教堂；下方 Piazzale Michelangelo 是 19 世紀的城市觀景工程。','在 San Miniato 比較綠白大理石立面，再下行看 David 複製品與全城天際線。','同一個視野把中世紀教堂、文藝復興穹頂與近代旅遊觀景平台疊在一起。','San Miniato al Monte')]},
{id:'milan-duomo',kind:'museum',city:'MILANO',title:'Duomo：一座用運河運來的山',time:'90–120 分鐘',class:'milan',summary:'Gate 3 → 露台 → 立面細節 → 中殿 → St Bartholomew → 考古區。先完成 13:30 固定露台時段。',route:['Gate 3','電梯上行','屋頂露台','步行下樓','教堂','考古區'],plans:[['90 分','露台 45 分 → 教堂 35 分 → 考古區 10 分'],['120 分','每站深入段落＋立面雕像']],sources:[['Duomo 官方','https://www.duomomilano.it/en/']],stops:[
S('粉白大理石從哪裡來','Duomo 使用 Candoglia 大理石，從馬奧納湖區礦場沿水路運到米蘭。','近看石頭不是純白，有粉、灰與細微紋理。','運石船有「A.U.F.」免稅標記；Navigli 的水運是大教堂能長期施工的城市基礎設施。'),
S('飛扶壁不只是裝飾','外側石拱把高穹頂向外的推力傳到獨立扶壁，教堂才能又高又有大窗。','在露台找石拱與垂直尖塔如何互相拉結。','哥德式結構把工程做成天際線；你走在屋頂時正穿過原本應遠觀的支撐系統。'),
S('Madonnina 是米蘭的天際線尺度','最高尖塔上的金色聖母不大，卻長期是城市象徵。','在高層露台找她的剪影，不要為拍照跨越動線或護欄。','後來高樓會在屋頂放 Madonnina 複製像，讓像徵性的「城市最高點」傳統繼續。'),
S('雨水口與雕像宇宙','立面和尖塔上有幾千尊人物、聖徒、動物與怪獸，某些同時處理排水。','挑一根尖塔從底往上追，看結構如何變成植物、人像與空氣。','Duomo 施工跨越數百年，細節也包含不同時代的想像，不是一位建築師一次畫完的作品。'),
S('被剥皮的 St Bartholomew','教堂內這尊人像把自己的皮像披風般掛在肩上。','先看肌肉解剖，再看肩頭垂下的臉與腳。','Marco d’Agrate 用驚人解剖細節呈現殉道方式；基座銘文還強調作者不是 Praxiteles。'),
S('教堂地下的早期米蘭','考古區保留更早的洗禮堂與教堂痕跡。','找八角形洗禮池平面。','今日 Duomo 不是空地上突然出現；它覆蓋著城市數個世紀的宗教核心。')]},
{id:'milan-center',kind:'walk',city:'MILANO',title:'從水晶客廳走到 Brera',time:'60–90 分鐘',distance:'約 1.8 km',class:'milan',summary:'Duomo → Galleria Vittorio Emanuele II → La Scala → Brera。看 19 世紀商業建築如何變成現代城市客廳。',routePlaces:['Duomo di Milano','Galleria Vittorio Emanuele II','Teatro alla Scala','Brera Milan'],plans:[['60 分','Galleria → La Scala → Brera 入口'],['90 分','再加 Brera 巷弄與晚餐']],sources:[['YesMilano · Duomo 與 Galleria','https://www.yesmilano.it/en/see-and-do/venues/duomo-milano'],['YesMilano','https://www.yesmilano.it/en']],stops:[
S('Galleria 是「有屋頂的街」','十字軸線、玻璃拱頂與中央八角形，把商店街提升成城市儀式空間。','站中心回頭看四個拱門透視，再抬頭找四大洲寓意畫。','19 世紀鐵與玻璃技術讓戶外街道可被包裹成室內公共空間，是購物中心的祖先之一。','Galleria Vittorio Emanuele II'),
S('公牛馬賽克與旋轉儀式','地面 Torino 徽章的公牛已被無數鞋跟磨成洞。','若要參與，單腳腳跟不要大力磨踏，也先讓行人通過。','這是現代民俗，不是古老羅馬儀式；磨損本身也成了遊客行為的記錄。'),
S('La Scala 外觀為何如此克制','世界著名歌劇院的外觀並不華麗，城市玄機藏在室內音響、包廂和社交秩序。','從廣場看三層水平線，再轉身看 Leonardo 紀念碑。','歌劇院建於原 Santa Maria alla Scala 教堂所在地，名字保留了被拆除建築的記憶。','Teatro alla Scala'),
S('Brera 的石板路不是沒有生產','今天看來像藝術與餐廳街區，曾長期有工匠、學院、印刷與城市勞動。','看窄街、內院與低樓店面尺度，不只看精品櫥窗。','Pinacoteca 與藝術學院讓街區形成文化身分，後來再被觀光與高級商業改寫。','Brera Milan')]},
{id:'cenacolo',kind:'museum',city:'MILANO',title:'《最後的晚餐》：15 分鐘的觀看順序',time:'45–60 分鐘（含導覽）',class:'milan',summary:'進飯廳後先看全幅反應，再分四組、雙手與透視。導覽在 9:30，9:00 報到。',route:['安檢','穩定溫濕度緩衝區','Last Supper','Crucifixion','離場'],plans:[['15 分看畫','全景 2 分 → 四組反應 4 分 → Judas 3 分 → 透視 3 分 → 對面壁畫 3 分'],['導覽版','先聽官方導覽，再用本頁快速復習']],sources:[['Cenacolo 官方','https://cenacolovinciano.org/en/']],stops:[
S('第一眼：話語像衝擊波','Jesus 剛宣告「你們中有人將背叛我」，使徒以四組三人發生不同反應。','不要先找單一人；從左到右看手勢和身體如何像波浪擴散。','傳統《最後的晚餐》常把 Judas 放在桌子另一邊；Leonardo 把他放回同一排，戲劇變得更心理化。'),
S('Judas、Peter 與 John','Judas 後退、靠近桌面，手邊有錢袋；Peter 向前傾、手持刀；John 柔和下垂。','先找 Peter 水平向後的刀，再回到 Judas 的陰影與手。','三人擠在一組，同時暗示背叛、未來的逮捕反應與親密情感。'),
S('所有線都往 Christ 匯聚','天花板、牆壁與掛毯的透視線，在 Christ 頭部附近消失。','找後方中央窗，讓視線沿天花板格線滑向中心。','原本飯廳的真實空間似乎穿過牆面繼續，使修道士的用餐空間與聖經餐桌重疊。'),
S('手、麵包與葡萄酒','Christ 的兩手既對應麵包與酒，也與 Judas 伸向同一盤食物的動作互相纏繞。','沿桌面找小型食物、空白桌巾與風景光線。','儘管作品嚴重損壞，手勢仍是連結神學、故事與日常食物的核心。'),
S('這不是傳統濕壁畫','Leonardo 為了慢慢修改，在乾燥牆面用實驗性媒材，完成不久就開始劣化。','別只感嘆「很淡」；看修復後仍留下的層次與空白。','作品曾遭受濕氣、不當修復、門洞破壞與戰爭轟炸；今日能觀看本身是保存工程的結果。'),
S('轉身看《釘十字架》','對面 Montorfano 的 Crucifixion 用傳統濕壁畫技法，與 Leonardo 脆弱表面形成對照。','比較兩面牆的色彩狀態與群像節奏。','同一飯廳把最後晚餐與受難結果相對，修道士每日用餐被夾在救贖敘事之間。')]},
{id:'milan-leonardo',kind:'walk',city:'MILANO',title:'Leonardo 在米蘭的腳步',time:'90–120 分鐘',distance:'約 3 km',class:'milan',summary:'Santa Maria delle Grazie → Bramante 後殿 → Sforza Castle → Piazza Mercanti → Duomo。把《最後的晚餐》放回 Sforza 宮廷的工程與藝術網絡。',routePlaces:['Santa Maria delle Grazie Milan','Castello Sforzesco','Piazza Mercanti Milan','Duomo di Milano'],plans:[['90 分','Grazie 外觀 → 城堡庭院 → Cadorna'],['120 分','再加 Piazza Mercanti 與 Duomo']],sources:[['YesMilano · Leonardo','https://www.yesmilano.it/en/see-and-do/itineraries/leonardo-da-vinci-milano']],stops:[
S('Bramante 的後殿','教堂後方大型圓頂與多層幾何體，與正面哥德式紅磚不同。','繞到後方看方形、圓形、半圓一層層疊起。','後殿與飯廳改造都與 Ludovico Sforza 把教堂變成家族紀念空間的計畫相連。','Santa Maria delle Grazie Milan'),
S('Sforza Castle：藝術家也是工程師','Leonardo 在米蘭宮廷不只畫畫，也處理盛典、機械、城市與水利概念。','進入庭院先看防禦尺度，再想宮廷如何同時是軍事、住宿與表演場。','文藝復興的專業分科不像今天明確；觀察、繪圖與製作可以同屬一個工作室。','Castello Sforzesco'),
S('Piazza Mercanti 的聲音遊戲','中世紀商人廣場尺度小，某些對角拱柱可傳遞耳語。','在不打擾他人時，兩人分站 Loggia dei Mercanti 柱子對角嘗試低語。','這種聲學效果讓石建築不只是視覺背景，也像一個可以用耳朵發現的機械。','Piazza Mercanti Milan')]},
{id:'navigli',kind:'walk',city:'MILANO',title:'Navigli：米蘭曾是一座水城',time:'75–105 分鐘',distance:'約 2.5 km',class:'milan',summary:'Darsena → Naviglio Grande → Vicolo dei Lavandai → ringhiera 公寓。黃昏開始、天黑前先完成建築觀察，再吃 aperitivo。',routePlaces:['Darsena Milano','Naviglio Grande','Vicolo dei Lavandai','Ripa di Porta Ticinese'],plans:[['75 分','Darsena → 洗衣巷 → aperitivo'],['105 分','沿兩岸橋樑走一圈']],sources:[['YesMilano · Navigli','https://www.yesmilano.it/en/see-and-do/venues/navigli'],['Navigli Lombardi','https://www.naviglilombardi.it/']],stops:[
S('Darsena 是港口，不只是餐廳風景','這個水盆曾是米蘭貨運系統的城內港。','站水邊找 Naviglio Grande 進入 Darsena 的方向。','水道連接河流、湖區與城市，運輸糧食、建材與米蘭大教堂的大理石。','Darsena Milano'),
S('Vicolo dei Lavandai 的「洗衣男人」','石槽與木製支架記錄水邊勞動；巷名 lavandai 是陽性複數，因為這曾是有組織的男性洗衣工工作。','找傾斜石槽與供擦洗的木／石面。','今天的浪漫景點原是低薪、潮濕且勞力密集的城市服務空間。','Vicolo dei Lavandai'),
S('ringhiera 公寓','外廊沿內院串連房間，鐵欄桿 ringhiera 變成這類集合住宅的名字。','從公共街道看門內的長外廊，不要進入私人內院。','共用外廊促成鄰里交流，也反映工人階級住宅密度與私密性限制。','Ripa di Porta Ticinese'),
S('Leonardo 與運河：不要說他「發明全部」','運河在 Leonardo 來之前已存在；他研究並改良水利、開關和水位控制問題。','看河道水位、橋與岸邊高度差，想像船如何通過不同水位。','比較準確的說法是：Leonardo 參與並記錄了當時工程網絡，而不是單人創造整座水城。','Naviglio Grande')]},
{id:'citylife',kind:'walk',city:'MILANO',title:'CityLife：從展覽城市到三座塔',time:'45–75 分鐘',distance:'約 2 km',class:'milan',summary:'Allianz MiCo → Portello → Tre Torri → CityLife Park。適合會議後不購票的輕散步。',routePlaces:['Allianz MiCo','Portello Metro Station','Tre Torri Milano','CityLife Park'],plans:[['45 分','MiCo → Tre Torri → 地鐵'],['75 分','再繞住宅與公園一圈']],sources:[['YesMilano · CityLife','https://www.yesmilano.it/en/see-and-do/venues/citylife']],stops:[
S('三座塔各用一種不穩定感','Isozaki 塔像無限垂直的直線，Hadid 塔扭轉，Libeskind 塔彎曲。','從公園換三個位置，看塔的輪廓如何改變。','建築不只比高；三種幾何語彙被排成城市品牌。','Tre Torri Milano'),
S('這裡曾是展覽場','舊 Fiera Milano 大部分移走後，土地轉為辦公、住宅、商業與公園混合區。','比較 MiCo 巨大展覽尺度與公園中步行尺度。','你們的旅行因 ISPE 進入這個區域，剛好看見米蘭如何用展覽經濟與不動產改寫城市。','Allianz MiCo')]},
{id:'venice',kind:'walk',city:'VENEZIA',title:'威尼斯三段式導覽：夜景、離島、本島',time:'9/3 晚＋9/4–9/5',distance:'步行約 12–16 km＋水上巴士',class:'milan',summary:'不是把威尼斯當成景點清單，而是依水路分成三段：大運河夜景、北潟湖離島、Frari／San Marco 權力與宗教軸線。',routePlaces:['Venezia Santa Lucia','Piazza San Marco Venice','Rialto Bridge Venice','Burano Venice','Torcello Venice','Basilica di Santa Maria della Salute Venice','Basilica Santa Maria Gloriosa dei Frari Venice','Doge Palace Venice'],plans:[['9/3 夜景','Ferrovia → Line 1 大運河 → San Marco → Mercerie → Rialto'],['9/4 離島','Ferrovia → Murano Faro 轉船 → Burano → Torcello → San Marco → Salute → Dorsoduro'],['9/5 本島','Frari → San Tomà → San Marco Basilica → Doge’s Palace → Santa Lucia']],sources:[['Venezia Unica · San Marco','https://www.veneziaunica.it/en/things-to-do-in-venice/venice-areas/sestieri/san-marco'],['Venezia Unica · Burano','https://www.veneziaunica.it/en/things-to-do-in-venice/venice-areas/isole/burano'],['Venezia Unica · Torcello','https://events.veneziaunica.it/en/things-to-do-in-venice/venice-areas/islands/torcello'],['ACTV 官方水上交通','https://actv.avmspa.it/it/content/orari-servizio-di-navigazione-0'],['聖馬可官方售票','https://tickets.basilicasanmarco.it/en/'],['總督宮官方','https://palazzoducale.visitmuve.it/en/']],stops:[
S('Line 1：從水面讀大運河','威尼斯宮殿的正門常面向水，不是面向今天的步行巷弄。','沿途找貼近水面的入口、繫船柱與不同年代的窗框。','大運河像城市主街；拜占庭式拱窗、哥德式尖拱與文藝復興對稱立面在同一條水路上並置。','Grand Canal Venice'),
S('聖馬可廣場：共和國的舞台','Basilica、Doge’s Palace、鐘樓、時鐘塔與行政建築把宗教、政府、商業和儀式集中在同一空間。','先站廣場西側看兩種立面：Basilica 金色圓拱與總督宮白粉紅幾何格。','夜間只看外觀能先建立方向；9/5 白天再分別進教堂與宮殿，不必第一晚把所有內容看完。','Piazza San Marco Venice'),
S('Rialto：橋也是市場機器','現在石橋承接兩岸商業流動，橋上店鋪把過河與消費結合。','先從岸邊看單拱如何跨過航道，再上橋看水上交通。','Rialto 長期是金融與市場核心；夜景很美，但橋面擁擠時手機不要拿在靠外側的手。','Rialto Bridge Venice'),
S('Burano：色彩不是遊樂園布景','彩色房屋與漁業、產權辨識和島嶼生活相連；蕾絲是另一條重要工藝線。','不要只追最鮮豔的一棟；看門窗、曬衣、小橋與斜鐘塔如何共同構成生活尺度。','「讓漁夫在霧中認家」是流行傳說；官方介紹也提醒，色彩制度與界定住家範圍的實際需求有關。','Burano Venice'),
S('Torcello：威尼斯之前的威尼斯','今天安靜的島曾是潟湖早期重要聚落，和後來繁盛的本島形成強烈反差。','從碼頭經魔鬼橋走向 Santa Fosca 與 Santa Maria Assunta，注意建築周圍大片空地。','如果進主教座堂，重點是末日審判馬賽克；若時間不足，守住 14:10 回程船比多停一座建築重要。','Torcello Venice'),
S('Salute：瘟疫留下的城市輪廓','Santa Maria della Salute 是 1630 年瘟疫後的還願教堂，巨大八角形體量守住大運河入口。','從 San Marco 船上先看整體，進內部再找八角中心與放射空間。','建築師 Baldassare Longhena 把公共災難轉成可從城市多處辨認的宗教紀念物。','Basilica di Santa Maria della Salute Venice'),
S('Dorsoduro：用腳感受水岸城市','這一區比 San Marco 稍微放鬆，學院橋、Zattere 和小巷呈現不同水域尺度。','在學院橋回望 Salute；到 Zattere 比較 Giudecca Canal 與小運河的寬度。','9/4 下午不再加美術館，是為了保留渡船延誤、吃飯和走錯巷的彈性。','Ponte dell Accademia Venice'),
S('Frari：磚牆裡的威尼斯繪畫課','外觀克制，內部卻以巨大尺度容納 Titian、Bellini、墓碑與修會空間。','先沿中軸看 Titian《聖母升天》的紅色節奏，再找《Pesaro 聖母》不對稱的斜向構圖。','作品不是被搬進白盒美術館；祭壇位置、教堂光線和家族紀念需求就是構圖的一部分。','Basilica Santa Maria Gloriosa dei Frari Venice'),
S('聖馬可 Basilica：金色是一種政治語言','拜占庭式平面與馬賽克讓威尼斯把自己放進東地中海的宗教與商業世界。','進門先看起伏地板，再抬頭看金色馬賽克如何隨光線改變；不要只盯正面祭壇。','官方時段票遲到容許很短；宗教活動可能臨時影響參觀，行程必須服從現場秩序。','Basilica di San Marco Venice'),
S('總督宮：輕盈外表包住龐大政府','下層柱廊看似開放，上層牆體反而厚重，結構視覺與一般宮殿顛倒。','從庭院、金梯、議會廳一路到嘆息橋與監獄，感受權力如何從華麗轉向控制。','Doge 是共和國領袖但受制度約束；大議會廳與 Tintoretto《天堂》把政治共同體包進宗教想像。','Doge Palace Venice')]},
{id:'como',kind:'walk',city:'COMO',title:'科莫湖：把船班當成主行程',time:'全日',distance:'步行約 4–6 km',class:'milan',summary:'僅 9/5 返程組：Como → Bellagio → 14:20 開始返回米蘭。這天景點少一個沒關係，錯過返程船班才是大問題。',routePlaces:['Como Lago','Como Cathedral','Bellagio ferry terminal','Salita Serbelloni'],plans:[['9/5 返程組','Como → Bellagio → 14:20 開始返程，不加 Varenna']],sources:[['Navigazione Laghi 官方時刻表','https://www.navigazionelaghi.it/en/tickets-and-timetables-lake-como/'],['Como 官方旅遊','https://www.visitcomo.eu/en/']],stops:[
S('Como：先找回程碼頭','到湖邊第一件事是確認碼頭、購票規則與回程班次，才進舊城。','把碼頭位置、船名／航線與最晚回程班次截圖。','快速船、普通船與渡輪可能有不同票制與停靠方式；不能只看地圖估時間。','Como ferry terminal'),
S('Como Duomo 的長建造期','立面與室內橫跨哥德式與文藝復興，像一座用數世代方言完成的教堂。','找立面兩側的 Pliny the Elder 與 Younger 雕像。','城市把古羅馬學者放在基督教教堂立面，表明地方身分不只有宗教歷史。','Como Cathedral'),
S('Bellagio 的階梯就是景點','湖畔城鎮被坡地擠壓，主要橫向街與縱向階梯編成密集網。','在 Salita Serbelloni 別只拍階梯，看橫街怎麼像一層層陽台。','高低差影響所有時間估算；地圖上 500 公尺不等於平地 500 公尺。','Salita Serbelloni'),
S('Varenna 本次不排','9/5 隔天飛行，下午必須返回米蘭取行李並前往機場飯店。','在 Bellagio 看完湖岸與階梯後就回程，不臨時追另一岸。','把回程留白視為行程的一部分；船班、天候或行李任何一項延誤，都需要這段緩衝。','Bellagio ferry terminal')]}
];

const purchaseItems=[
{id:'pantheon',group:'尚待購買／確認',title:'萬神殿官方時段票',note:'8/24 建議 09:00；2026/7 起全票 €7。這條會順接納沃納廣場、聖天使橋與梵蒂岡。',url:'https://portale.museiitaliani.it/'},
{id:'trevi',group:'尚待購買／確認',title:'Trevi 內圈 €2（選配）',note:'外圈仍可免費看；第一天時間緊，不建議為進內圈犧牲萬神殿或競技場。',url:'https://www.comune.roma.it/web/it/notizia/biglietto-dingresso-fontana-di-trevi.page'},
{id:'train1',group:'尚待購買／確認',title:'8/24 Roma → Firenze 正式車票',note:'已知 18:50–20:57，仍要確認車次、車廂、座位並離線存票。'},
{id:'train2',group:'尚待購買／確認',title:'8/28 Firenze → Milano 高鐵',note:'現有 08:30 只是行程表資訊，尚未在 Drive 看到正式車票。'},
{id:'dome',group:'尚待購買／確認',title:'Brunelleschi Pass／大圓頂 14:15 票券',note:'確認日期與具名資料；大圓頂時段不能遲到。',url:'https://duomo.firenze.it/en/720/brunelleschi-pass'},
{id:'ispe',group:'尚待購買／確認',title:'ISPE 8/29–30 會前課程報名',note:'與 8/31–9/2 正式大會分開；每個人都要確認自己是否另購課程。',url:'https://ispe2026.eventscribe.net/'},
{id:'como',group:'尚待購買／確認',title:'9/5 返程組：9/4 科莫湖火車與船票',note:'僅此組購買；先用 2026 夏季表排回程。',url:'https://www.navigazionelaghi.it/en/tickets-and-timetables-lake-como/'},
{id:'insurance',group:'出發前必備',title:'旅遊平安、醫療與不便險',note:'查海外醫療額度、航班與行李理賠；保單和緊急電話離線存檔。'},
{id:'esim',group:'出發前必備',title:'每人的 eSIM／漫遊方案',note:'不要只靠一人開熱點；迷路或分流時每人都需聯絡能力。'},
{id:'cash',group:'錢與裝備',title:'小額歐元現金',note:'建議每人總備 €80–150，日常只攜 €30–50，以 €5/€10/€20 為主。別把全部現金放同處。'},
{id:'cards',group:'錢與裝備',title:'兩張不同卡組織的卡',note:'主卡和備用卡分開放；ATM/刷卡問幣別時選 EUR，不選 TWD 轉換。'},
{id:'bottle',group:'錢與裝備',title:'可裝水的輕水壺＋電解質',note:'羅馬 nasoni 可補充飲水；8 月中午曝曬前就開始補水。'},
{id:'sun',group:'錢與裝備',title:'帽子、防曬、遮肩薄衣',note:'同時處理暑熱與教堂服裝要求；教堂內帽子要取下。'},
{id:'power',group:'錢與裝備',title:'行動電源、短線、義大利轉接頭',note:'會議與導覽日導航時間長；行動電源要放手提行李。'},
{id:'bag',group:'錢與裝備',title:'前背可拉鍊的小包',note:'地鐵門邊、手扶梯、擁擠景點改背前方；不需要「防盜神器」，需要穩定習慣。'},
{id:'shoes',group:'錢與裝備',title:'已經穿開的步行鞋＋磨腳急救',note:'圓頂 463 階、五漁村與科莫湖城鎮皆有階梯與石路。'},
{id:'copies',group:'出發前必備',title:'護照、保險、緊急電話離線副本',note:'一份在 App，一份在不同雲端，不將所有證件原檔只放同一支手機。'}
];

const phrases=[
['Buongiorno','你好／早安','buon-JOR-no'],['Grazie','謝謝','GRA-tsye'],['Per favore','請','per fa-VO-re'],['Mi scusi','不好意思／借過','mi SKU-zi'],['Parla inglese?','你會說英文嗎？','PAR-la in-GLE-ze'],['Dov’è il bagno?','洗手間在哪裡？','do-VE il BAN-yo'],['Dov’è questo binario?','這個月台在哪？','do-VE KWES-to bi-NA-ryo'],['Quale imbarcadero?','是哪一個水上巴士碼頭？','KWA-le im-bar-ka-DE-ro'],['Questa linea va a Burano?','這班船去 Burano 嗎？','KWES-ta LEE-ne-a va a boo-RA-no'],['Abbiamo una prenotazione','我們有預約','ab-BYA-mo OO-na pre-no-ta-TSYO-ne'],['Senza alcol, per favore','請不要酒精','SEN-tsa AL-kol'],['Sono allergico/a a…','我對…過敏','SO-no al-LER-ji-ko/ka'],['Può chiamare il 112?','可以幫我打 112 嗎？','pwo kya-MA-re il uno-uno-due'],['Ho perso il portafoglio','我的錢包丟了','o PER-so il por-ta-FO-lyo'],['Non mi tocchi!','不要碰我！','non mi TOK-ki'],['Aiuto!','救命／幫忙！','a-YU-to']
];

const officialLinks=[
['112 歐盟緊急電話','tel:112'],['駐義大利台北代表處急難','tel:+393668066434'],['外交部義大利旅遊警示','https://www.boca.gov.tw/sp-trwa-content-2614-ac1b8-1.html'],['羅馬官方旅遊','https://www.turismoroma.it/en'],['佛羅倫斯官方旅遊','https://www.feelflorence.it/en'],['米蘭官方旅遊','https://www.yesmilano.it/en'],['威尼斯官方旅遊','https://www.veneziaunica.it/en'],['ACTV 水上巴士','https://actv.avmspa.it/it/content/orari-servizio-di-navigazione-0'],['ATM 米蘭大眾運輸','https://www.atm.it/en/Pages/default.aspx'],['Malpensa Express','https://www.malpensaexpress.it/en/lines-and-timetable/lines-and-timetables/timetable/'],['義大利高溫健康資訊','https://www.salute.gov.it/new/en/tema/ondate-di-calore/heatwave-bulletins/']
];
