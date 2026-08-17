# Italia 2026 Travel Companion

為 iPhone Safari 設計的私人義大利旅行 PWA，包含 2026/8/23–9/5 每日時間軸、票券錢包、六個景點導覽、地圖入口與離線功能。

## 資料原則

- 實際憑證／票券永遠優先於行程表與其他資料。
- 公開程式碼只保留日期、時間、地點與使用規則；不包含 PIN、PNR、barcode、訂單碼或完整參加者名單。
- Chianti 憑證同時寫有「14:30 下午場」與「08:00 集合」，App 保留待確認警告。請出發前向 KKday／Caf Tour & Travel 書面確認。
- 火車、航班、會議與未附票券的活動仍應以最新電子票或主辦單位資訊為準。

## 使用與安裝

PWA 必須透過 HTTPS 網址（或電腦上的 localhost）開啟，不能直接雙擊 `index.html`。將整個資料夾部署到任何靜態網站服務即可。

iPhone 安裝步驟：

1. 在 Safari 開啟部署後的網址。
2. 點 Safari 底部「分享」。
3. 選「加入主畫面」。
4. 從主畫面打開一次，並進入每個主要頁面確認離線內容已下載。

## 票券隱私與離線

在「票券」頁按「存入票券」，選擇 PDF 或圖片。檔案會存入該裝置 Safari 的 IndexedDB，不會上傳伺服器，也不在本專案 ZIP 內。清除 Safari 網站資料、切換網域或移除網站資料會刪除已存票券，因此原始憑證仍須另外備份。

出發前建議開啟飛航模式，逐頁檢查行程、導覽與每張本機票券。Apple Maps／Google Maps 導航仍可能需要網路或預先下載的地圖。

## 本機預覽

在本資料夾啟動任何靜態 HTTP server，例如 Python 的 `python3 -m http.server 8080`，然後開啟 `http://localhost:8080`。

## 更新內容

- 行程資料、票券摘要：`app.js`
- 顏色與 iPhone safe area：`styles.css`
- 離線快取版本：`sw.js` 內的 `CACHE`；修改檔案後請遞增版本字串。

## 已納入憑證

羅馬競技場、The RomeHello、梵蒂岡博物館、烏菲茲、學院美術館、Chianti 品酒、比薩＋五漁村、米蘭大教堂、米蘭住宿、《最後的晚餐》、Malpensa 機場住宿。實際 PDF 不包含在公開 ZIP，請在自己的 iPhone 上逐張匯入。
