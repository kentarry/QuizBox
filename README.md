# Kentarry 🌸 — 心理測驗平台

> 25 種情境式心理測驗 · 圖片廣告輪播 · Google 試算表追蹤 · 純前端零依賴

---

## 檔案說明

| 檔案 | 用途 |
|------|------|
| `kentarry-quiz.html` | 主程式，瀏覽器直接開啟即可 |
| `apps-script.gs` | 貼到 Google 試算表的 Apps Script |
| `README.md` | 本說明文件（GitHub 用） |
| `SETUP.md` | 完整設定步驟（Apps Script + 廣告） |
| `.antigravity/rules.md` | Antigravity AI 讀取的專案規則 |

---

## 快速開始

```bash
# 不需要任何安裝，直接用瀏覽器開啟
open kentarry-quiz.html
```

---

## 25 份測驗清單

| 類別 | 測驗名稱 | 理論依據 |
|------|---------|---------|
| 🧠 心理 | 壓力值評估 | Cohen PSS-10 |
| 🧠 心理 | 情緒調節風格 | Gross & John ERQ |
| 🧠 心理 | 依附風格 | Bartholomew 成人依附模型 |
| 🧠 心理 | 情緒智力 EQ | Mayer-Salovey EI |
| 🧠 心理 | 心理韌性 | Connor-Davidson CD-RISC |
| 🧠 心理 | 自我價值感 | Rosenberg RSE |
| 🧠 心理 | 正念覺察 | Baer FFMQ |
| 🌿 性格 | MBTI 人格類型 | Myers-Briggs |
| 🌿 性格 | 九型人格 | Riso-Hudson Enneagram |
| 🌿 性格 | 內外向光譜 | Eysenck 喚醒理論 |
| 🌿 性格 | 大五人格 OCEAN | Costa & McCrae NEO-PI-R |
| 🌿 性格 | 氣質類型 | Keirsey 氣質理論 |
| 🌿 性格 | 思維認知風格 | Riding CSA |
| 🌿 性格 | 核心價值觀 | Schwartz SVS |
| 🧭 職涯 | 職業性向 | Holland RIASEC |
| 🧭 職涯 | 領導力風格 | Bass 全距領導模型 |
| 🧭 職涯 | 職場溝通風格 | Thomas-Kilmann TKI |
| 🧭 職涯 | 多元智慧優勢 | Gardner MI |
| 🧭 職涯 | 創意思維模式 | Guilford 發散思維 |
| 🧭 職涯 | 決策風格 | Scott & Bruce GDMS |
| 💫 生活 | 愛情語言 | Chapman 五種愛情語言 |
| 💫 生活 | 人際互動風格 | Leary 人際環形模型 |
| 💫 生活 | 生活節奏幸福感 | Seligman PERMA |
| 💫 生活 | 戀愛觀 | Lee 愛情色彩理論 |
| 💫 生活 | 金錢心理 | Klontz 金錢腳本 |

---

## 廣告系統設定

搜尋 `AD_IMAGES = {`，修改圖片網址和點擊連結：

```js
const AD_IMAGES = {

  // 底部常駐橫幅（建議尺寸：1200×120px）
  sticky: [
    { img: 'https://你的圖片.jpg', url: 'https://你的網站.com' },
    { img: 'https://第二張.jpg',   url: 'https://第二個連結.com' },
  ],

  // 答題中間插頁（建議尺寸：800×400px）
  inter: [
    { img: 'https://你的圖片.jpg', url: 'https://你的網站.com' },
  ],

  // 結果頁推廣卡（建議尺寸：800×300px）
  result: [
    { img: 'https://你的圖片.jpg', url: 'https://你的網站.com' },
  ],

  stickyDelay:    4000,  // 橫幅延遲毫秒數（4 秒）
  stickyInterval: 5000,  // 橫幅自動換圖間隔（5 秒）
  interAfterQ:    3,     // 第幾題後出現插頁（0-indexed）
};
```

---

## Google 試算表串接

搜尋 `TRACKER_URL = ''`，填入 Apps Script 部署網址：

```js
const TRACKER_URL = 'https://script.google.com/macros/s/你的ID/exec';
```

詳細步驟 → 見 `SETUP.md`

---

## 記錄的資料

| 資料 | 位置 | 說明 |
|------|------|------|
| 進入網站 | 事件記錄 | 每次打開頁面 |
| 點閱測驗 | 事件記錄 + 總覽 | 點「開始」按鈕 |
| 完成測驗 | 事件記錄 + 總覽 | 看到結果頁 |
| 完成時間 | 事件記錄 | 台灣時區，精確到秒 |
| 使用裝置 | 事件記錄 | 手機 / 電腦 |

---

## 部署方式

**GitHub Pages（免費推薦）**
1. 上傳此資料夾到 GitHub repo
2. Settings → Pages → Branch: main → Save
3. 約 1 分鐘後上線

**Netlify**
拖曳整個資料夾到 [netlify.com](https://netlify.com) → 立即上線

**Vercel**
```bash
npm i -g vercel && vercel
```

---

## 技術規格

- 框架：無（純 Vanilla HTML / CSS / JS）
- 字體：Google Fonts（Noto Sans TC、Lora、Gochi Hand）
- 瀏覽器：Chrome 90+、Firefox 88+、Safari 14+、Edge 90+
- 單檔大小：117 KB
