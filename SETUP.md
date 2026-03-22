# SETUP.md — 完整設定指南

---

## 第一部分：Google 試算表串接

### 步驟一：貼上 Apps Script

1. 打開你的 Google 試算表：
   https://docs.google.com/spreadsheets/d/1h6-NoYaseXYFeRNvz-t2cBgeAxPs8_r9zaVVIATmORI/edit

2. 點上方選單「**擴充功能**」→「**Apps Script**」

3. 把編輯器內所有內容**全部刪掉**

4. 把 `apps-script.gs` 的全部內容貼上

5. 按 `Ctrl+S` 儲存（或點磁碟圖示）

---

### 步驟二：初始化試算表

1. 編輯器上方函式下拉選單，選擇 **`initSheets`**

2. 點「**▶ 執行**」

3. 第一次執行需要授權，依序操作：
   - 點「**審查權限**」
   - 選擇你的 Google 帳號
   - 點「**進階**」→「**前往（不安全）**」
   - 點「**允許**」

4. 執行完成後回到試算表，會看到兩個分頁：

   **「總覽」分頁**（紅色表頭）：
   | 測驗ID | 類別 | 測驗名稱 | 點閱次數 | 完成次數 | 最後更新時間 |
   |--------|------|---------|---------|---------|------------|
   | stress | 心理 | 你的壓力值有多高？ | 0 | 0 | 尚無資料 |
   | … | … | … | 0 | 0 | … |

   **「事件記錄」分頁**（紫色表頭）：
   | 時間（台灣） | 行為 | 測驗ID | 測驗名稱 | 類別 | 裝置 |
   |------------|------|--------|---------|------|------|
   | （有人使用後自動填入） |

---

### 步驟三：部署為網路應用程式

1. 點右上角「**部署**」→「**新增部署作業**」

2. 點類型旁邊的齒輪 ⚙️ → 選「**網頁應用程式**」

3. 填寫設定：
   ```
   說明：    Kentarry Quiz Tracker（隨意）
   執行身分：我（你的 Google 帳號）
   存取權限：所有人              ← 必須選這個
   ```

4. 點「**部署**」→ 複製出現的網址：
   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxxxx/exec
   ```

---

### 步驟四：填入 HTML

打開 `kentarry-quiz.html`，搜尋：
```
TRACKER_URL = ''
```

將網址貼入引號之間：
```js
// 修改前
const TRACKER_URL = '';

// 修改後
const TRACKER_URL = 'https://script.google.com/macros/s/AKfycbxxxxxxxxxx/exec';
```

儲存後完成！

---

### 測試驗證

1. 用瀏覽器開啟 `kentarry-quiz.html`
2. 回到試算表「事件記錄」分頁重新整理
3. 應看到一筆「**進入網站**」的記錄
4. 點擊任一測驗 → 應看到「**點閱測驗**」
5. 答完測驗 → 應看到「**完成測驗**」，「總覽」的完成次數 +1

---

## 第二部分：廣告圖片設定

### 如何修改廣告

打開 `kentarry-quiz.html`，搜尋 `AD_IMAGES = {`，找到以下區塊：

```js
const AD_IMAGES = {

  // ══════════════════════════════════════════════
  // 位置一：底部常駐橫幅
  // 建議圖片尺寸：1200 × 120 px（橫幅型）
  // 進入頁面 stickyDelay 毫秒後從底部滑入
  // 有 X 關閉按鈕，多張圖片自動輪播
  // ══════════════════════════════════════════════
  sticky: [
    {
      img: 'https://你的圖片網址.jpg',   // ← 改這裡（圖片 URL）
      url: 'https://你的點擊連結.com',   // ← 改這裡（點擊後開啟的網址）
    },
    {
      img: 'https://第二張圖片.jpg',     // 刪掉這個物件 = 只有一張不輪播
      url: 'https://第二個連結.com',
    },
  ],
  stickyDelay:    4000,   // 幾毫秒後出現（4000 = 4 秒）
  stickyInterval: 5000,   // 幾毫秒換下一張（5000 = 5 秒）

  // ══════════════════════════════════════════════
  // 位置二：答題中間插頁
  // 建議圖片尺寸：800 × 400 px（橫幅或方形）
  // 第 interAfterQ+1 題答完後出現
  // 有 X 關閉按鈕，每次出現自動換下一張
  // ══════════════════════════════════════════════
  inter: [
    {
      img: 'https://你的圖片網址.jpg',   // ← 改這裡
      url: 'https://你的點擊連結.com',   // ← 改這裡
    },
  ],
  interAfterQ: 3,   // 第 4 題答完後出現（0-indexed，改 4 = 第 5 題後）

  // ══════════════════════════════════════════════
  // 位置三：結果頁推廣卡
  // 建議圖片尺寸：800 × 300 px（寬版橫幅）
  // 測驗完成看到結果頁時出現
  // 有 X 關閉按鈕，多張圖片可點圓點切換
  // ══════════════════════════════════════════════
  result: [
    {
      img: 'https://你的圖片網址.jpg',   // ← 改這裡
      url: 'https://你的點擊連結.com',   // ← 改這裡
    },
  ],
};
```

### 圖片來源建議

| 服務 | 免費 | 說明 |
|------|------|------|
| [Imgur](https://imgur.com) | ✅ | 上傳後直接複製圖片連結 |
| [Cloudinary](https://cloudinary.com) | ✅（免費額度） | 可調整尺寸，專業圖床 |
| Google Drive | ✅ | 分享連結需轉換格式才能直接用 |
| 自己的主機 | ✅ | 放在同一台主機，用相對路徑 |

### 關閉某個廣告位置

```js
// 關閉底部橫幅：把 sticky 設為空陣列
sticky: [],

// 關閉插頁廣告：把 inter 設為空陣列
inter: [],

// 關閉結果頁廣告：把 result 設為空陣列
result: [],
```

---

## 第三部分：接上 GA4 追蹤

### 廣告點擊追蹤

在 `kentarry-quiz.html` 搜尋 `trackAd`，解除 GA4 那行的注解：

```js
function trackAd(pos, action) {
  gtag('event', 'ad_' + action, {ad_position: pos});  // ← 解除這行注解
  console.log('[Kentarry Ad]', pos, action);
}
```

### Google Analytics 代碼

在 `<head>` 標籤內加入（替換 G-XXXXXXXXXX）：

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 常見問題

**Q：試算表沒有更新？**
- 確認 `TRACKER_URL` 已填入，不是空字串
- 部署時「存取權限」必須選「**所有人**」（不是「已登入 Google 的使用者」）
- F12 開發者工具 → Console，確認沒有錯誤訊息

**Q：修改 Apps Script 後需要重新部署嗎？**
- 是的：「部署」→「管理部署作業」→ 點鉛筆圖示 → 版本選「新版本」→「部署」
- 網址不會改變

**Q：廣告圖片不顯示？**
- 確認圖片 URL 是可以直接在瀏覽器開啟的圖片連結（以 .jpg/.png/.webp 結尾）
- Google Drive 的分享連結需要轉換格式

**Q：想把廣告改回文字版？**
- 告訴 Antigravity：「把廣告改成文字版，不用圖片」，AI 會幫你修改
