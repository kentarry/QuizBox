# Kentarry Quiz Platform — Antigravity Agent Rules

## 專案概覽

**Kentarry** 是一個純前端心理測驗平台，所有功能都在單一 HTML 檔案中。

- **主檔**：`kentarry-quiz.html`（117 KB，2168 行）
- **25 份**情境式心理測驗，每份 8–10 題，有學術理論依據
- **廣告系統**：三個位置，圖片輪播，各有 X 關閉按鈕
- **追蹤系統**：Google 試算表記錄點閱、完成、時間、裝置

---

## 資料夾結構

```
kentarry-project/
├── kentarry-quiz.html    ← 唯一主檔，所有邏輯在此
├── apps-script.gs        ← 貼到 Google 試算表的 Apps Script
├── README.md             ← GitHub 說明
├── SETUP.md              ← 完整設定步驟
└── .antigravity/
    └── rules.md          ← 本檔案（Agent 讀取）
```

---

## 三大設定區塊（最常修改）

### 1. 廣告圖片設定 — 搜尋 `AD_IMAGES = {`

```js
const AD_IMAGES = {
  sticky: [                                    // 底部橫幅（1200×120px）
    { img: '圖片URL', url: '點擊連結' },      // ← 改這裡
  ],
  inter: [                                     // 答題插頁（800×400px）
    { img: '圖片URL', url: '點擊連結' },
  ],
  result: [                                    // 結果頁（800×300px）
    { img: '圖片URL', url: '點擊連結' },
  ],
  stickyDelay:    4000,   // 橫幅延遲毫秒
  stickyInterval: 5000,   // 橫幅換圖間隔
  interAfterQ:    3,      // 第幾題後出現插頁（0-indexed）
};
```

### 2. Google 試算表串接 — 搜尋 `TRACKER_URL = ''`

```js
const TRACKER_URL = ''; // ← 貼入 Apps Script 部署網址
```

### 3. 品牌名稱 — 全域搜尋 `Kentarry` 替換

共約 6 處，全部替換即可。

---

## 頁面路由

三個頁面用 CSS `display` 切換，無真實路由：

| 頁面 ID | 說明 | 觸發函數 |
|---------|------|---------|
| `#pg-home` | 首頁（測驗卡片列表） | `goHome()` |
| `#pg-quiz` | 答題頁 | `startQuiz(id)` |
| `#pg-result` | 結果頁 | `showResult()` |

---

## 測驗資料結構

每份測驗是 `DB` 陣列中的一個物件：

```js
{
  id:     'stress',          // 唯一 ID
  cat:    '心理',            // 分類：心理 / 性格 / 職涯 / 生活
  color:  'rose',            // CSS token：rose/mint/lav/gold/coral/sky/sage/blush/sand/ice/peach/lilac
  icon:   '😮‍💨',             // 卡片 Emoji
  title:  '你的壓力值有多高？',
  theory: 'Cohen PSS-10',    // 學術理論依據（必填）
  desc:   '...',
  time:   '約 5 分鐘',
  count:  '10 題',
  tag:    'PSS 壓力量表',
  cnt:    71,                // 已完成人數（初始值，接 Sheets 後自動更新）
  qs: [
    {
      sc:   '情境描述',      // 引導情境（斜體顯示）
      ask:  '問題文字',
      opts: ['選項A','選項B','選項C','選項D']  // 固定 4 個選項
    }
  ],
  score(a) { /* a = 答案陣列，1-indexed，回傳分數或類型 */ },
  result(s) {
    return {
      emoji:  '😌',
      name:   '結果名稱',
      sub:    '結果說明（1-2 句）',
      traits: [{n:'特質名稱', v:88}],  // 最多 4 個，v 為百分比
      tips:   ['建議1','建議2','建議3']
    };
  }
}
```

---

## 追蹤事件

HTML 自動發送三種事件到 Google 試算表：

| 事件 | 觸發時機 | 傳送資料 |
|------|---------|---------|
| `site_visit` | 頁面載入 | 裝置類型 |
| `quiz_view` | 點「開始 →」 | 測驗 ID、裝置 |
| `quiz_complete` | 看到結果頁 | 測驗 ID、裝置、時間 |

---

## 廣告追蹤事件（Console）

| 訊息 | 代表 |
|------|------|
| `[Kentarry Ad] sticky click` | 橫幅被點擊 |
| `[Kentarry Ad] sticky close` | 橫幅被關閉 |
| `[Kentarry Ad] inter view` | 插頁廣告出現 |
| `[Kentarry Ad] inter click` | 插頁廣告被點擊 |
| `[Kentarry Ad] inter close` | 插頁廣告被關閉 |
| `[Kentarry Ad] result click` | 結果頁廣告被點擊 |
| `[Kentarry Ad] result close` | 結果頁廣告被關閉 |

---

## 常見 Agent 任務範例

```
新增一份測驗：
「新增一份關於睡眠品質的測驗，理論依據用 Pittsburgh 睡眠品質量表，10 題情境式」

修改廣告：
「把底部橫幅的圖片改成 https://xxx.jpg，連結改成 https://mysite.com」

換品牌名稱：
「把所有的 Kentarry 改成 MindBloom」

調整廣告出現時機：
「把插頁廣告改成第 6 題後出現」

接上 GA4：
「把 GA4 代碼 G-XXXXXXXXXX 加進去，並解除 trackAd 的 gtag 注解」
```

---

## 注意事項

- `cnt`（已完成人數）初始為靜態數字，接上 `TRACKER_URL` 後自動更新為真實數字
- 廣告圖片用外部 URL，不需要上傳到網站本身
- 所有測驗理論為學術引用，不可聲稱為「官方認證版本」
- 修改 Apps Script 後需重新部署才會生效（網址不變）
