# Italia 2026 Travel Companion v1.5

為 iPhone Safari 設計的義大利旅行 PWA，覆蓋 2026/8/23–9/6。內容包含每日時間軸、住宿與離館提示、個人分組、本機票券錢包、17 條完整中文城市／博物館導覽、地圖、行程附近餐飲、伴手禮、安全指南、義大利語發音與購買清單。

## v1.5 內容升級

- 每條導覽都有可連續閱讀的中文長篇故事線，並保留現場「30 秒看懂／找這個」速查卡。
- 餐飲依羅馬、佛羅倫斯、米蘭、威尼斯與科莫湖的實際行程位置整理，附價位感、必點方向、繞路風險、地圖與官方／參考入口。
- 可在餐飲頁自行新增朋友推薦的店家；資料只存目前裝置。
- 伴手禮依食品、咖啡、工藝設計、香氛保養與時尚精品分類，附購買區域、價位、攜帶與辨真提醒。
- 伴手禮「想買」勾選只存目前裝置，不會影響同行者。

## 資料優先序

1. 實際憑證／票券。
2. 使用者已確認的資訊。
3. 主辦單位、景點、交通與政府官方資料。
4. 雲端 Excel 與其他草稿。

若 App 與最新電子票不同，一律以電子票為準。Chianti 已依確認設為 **8/26 14:30 下午場**，14:15 於 Piazzale Montelungo 集合。

## 同一網址，每人各自使用

App 沒有雲端帳號。同行者可開同一個 GitHub Pages 網址，但以下內容都只存在各自裝置：

- 米蘭住宿：Residence Vigliani 或 Hotel Oro Blu。
- 8/26：Chianti 酒莊組或佛羅倫斯漫遊組。
- 8/29–30：ISPE 會前課程或城市自由行。
- 返程：9/5 或 9/6。
- 行前／伴手禮勾選、自訂餐飲清單與上傳的 PDF／圖片票券。

更換 iPhone、清除 Safari 網站資料或改用不同網域時，這些本機資料不會自動轉移。

## 住宿

- 8/23–8/24：The RomeHello，Via Torino 45。
- 8/24–8/28：C-Hotels Club，Via Santa Caterina da Siena 11。
- 8/28–9/4：Residence Vigliani（4 人）或 Hotel Oro Blu（12 人）。
- 9/4–9/5：Holiday Inn Express Milan–Malpensa Airport，適用 9/5 返程組。
- 9/6 返程組不去科莫湖：9/3–9/5 連住 BnB（Via Nervesa 13, 30171 Venice），9/5–9/6 回米蘭 Porta Romana。

## 威尼斯分流

- 9/3：搭 Italo 8989，15:35 Milano Centrale → 17:52 Venezia Mestre；Check-in 後搭 Line 1 看大運河、San Marco 與 Rialto 夜景。
- 9/4：Murano Faro 只轉船，依序前往 Burano、Torcello、San Marco、Salute 與 Dorsoduro。
- 9/5：Frari、San Marco Basilica、Doge’s Palace；17:57 Italo 8992 回 Milano Centrale，20:25 抵達後住 Porta Romana。
- 9/6：照同行者預排 06:55 Milano Centrale → 07:48 MXP T1，再搭 11:15 BR96。

威尼斯時間依同行者提供的預排 Excel 顯示，不在 App 內重新計算分鐘。收到火車、交通、教堂、宮殿與住宿憑證後，可直接上傳到各自 iPhone 的票券頁；實際使用仍以正式票券與當天現場資訊為準。

## 票券隱私與離線

公開程式碼不包含 PIN、PNR、barcode、訂單號、護照號碼或完整名單。在「票券」頁存入的檔案使用 IndexedDB 儲存於當前 Safari，不會上傳 GitHub，也不在 ZIP 內。

出發前應在 Wi-Fi 下開過五個主頁及每張票券，再用飛航模式實測。Apple／Google 地圖仍可能需網路。

## 餐飲與伴手禮資料

店家資訊優先連到官方網站或城市官方旅遊來源；價位只以 € 級距表示，不硬編碼容易過期的菜單價格。營業日、休業、訂位與季節商品仍須在前一天核對。App 不把任何推薦列為必吃，以免為排隊犧牲正式票券與集合時間。

伴手禮頁的辨真提示特別涵蓋 Murano 玻璃官方標章、Burano 手工蕾絲工時、Como 絲製品標示、精品退稅與食品入境原則。海關、退稅與航空規則會變動，出發前仍要查最新官方規定。

## iPhone 安裝

1. 用 Safari 開啟 HTTPS 部署網址。
2. 點底部「分享」。
3. 選「加入主畫面」後點「新增」。
4. 從主畫面開啟 Italia 2026，不在 LINE 或其他 App 內建瀏覽器使用。

## 尚待確認

- 8/24 09:00 萬神殿官方時段票。8/23 航班改為 07:20 抵達 FCO，上午不再排許願池與萬神殿。
- 8/24 Roma → Firenze 正式高鐵票離線檔。
- 8/25 Brunelleschi 大圓頂正式票券。
- 8/28 Firenze → Milano 實際車次與時間。
- 每人是否另行報名 8/29–30 ISPE pre-conference skills courses。
- 9/4 科莫湖實際船班與車票。
- 9/3 Italo 8989 已確認；票號、車廂與座位只存個人票券，不寫入公開程式碼。Via Nervesa BnB 住宿憑證仍待補入各自裝置。
- 9/5 11:30 聖馬可大教堂、14:00 總督宮正式票券。
- 9/5 Italo 8992 正式票券與 Porta Romana 飯店名稱／地址。
- 9/6 BR96 電子機票最終時間，以及出發前再次核對 Malpensa Express 班表。

## 檔案結構

- `app.js`：行程、住宿、票券摘要、導覽與旅行資料。
- `content.js`：中文長篇導覽、餐飲推薦與伴手禮資料。
- `runtime.js`：畫面、個人化、票券本機儲存與互動。
- `styles.css` 與 `extras.css`：iPhone safe areas、觸控與底部導覽。
- `sw.js`：離線快取。

本版為發布前審閱版，未包含任何私人憑證原檔。另附單檔離線 HTML 預覽；正式 PWA 安裝、service worker 與完整票券錢包仍需 HTTPS 網址。
