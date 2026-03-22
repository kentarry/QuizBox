// ═══════════════════════════════════════════════════════════════
//  Kentarry Quiz Tracker — Google Apps Script
//
//  【使用方式】
//  1. 把此檔案全部內容貼到 Google 試算表的 Apps Script 編輯器
//  2. 選擇函式「initSheets」→ 點執行（只需一次，會自動建好欄位）
//  3. 部署 → 新增部署作業 → 網頁應用程式 → 存取權：所有人
//  4. 複製部署網址，貼到 kentarry-quiz.html 的 TRACKER_URL
//
//  【試算表分頁】
//  - 「總覽」：每份測驗的點閱數、完成數（彙總）
//  - 「事件記錄」：每次行為的詳細紀錄（時間、裝置、測驗）
// ═══════════════════════════════════════════════════════════════

const SHEET_OVERVIEW = '總覽';
const SHEET_EVENTS   = '事件記錄';

const QUIZ_LIST = [
  { id: 'stress',       name: '你的壓力值有多高？',         cat: '心理' },
  { id: 'emotion',      name: '你如何面對自己的情緒？',     cat: '心理' },
  { id: 'attach',       name: '你的親密關係依附風格',       cat: '心理' },
  { id: 'eq',           name: '你的情緒智力有多高？',       cat: '心理' },
  { id: 'resilience',   name: '你的心理韌性有多強？',       cat: '心理' },
  { id: 'selfesteem',   name: '你的自我價值感如何？',       cat: '心理' },
  { id: 'mindful',      name: '你的日常正念程度',           cat: '心理' },
  { id: 'mbti',         name: '你是哪種人格類型？',         cat: '性格' },
  { id: 'ennea',        name: '你是哪一型的靈魂？',         cat: '性格' },
  { id: 'introvert',    name: '你在內外向光譜的哪個位置？', cat: '性格' },
  { id: 'bigfive',      name: '你的大五人格特質',           cat: '性格' },
  { id: 'temperament',  name: '你天生的氣質類型是什麼？',   cat: '性格' },
  { id: 'cognitive',    name: '你的思維認知風格',           cat: '性格' },
  { id: 'values',       name: '你的核心價值觀取向',         cat: '性格' },
  { id: 'career',       name: '哪條職涯路最適合你？',       cat: '職涯' },
  { id: 'leader',       name: '你是哪種類型的領導者？',     cat: '職涯' },
  { id: 'comm',         name: '你的職場溝通風格',           cat: '職涯' },
  { id: 'intelligence', name: '你的多元智慧優勢',           cat: '職涯' },
  { id: 'creative',     name: '你的創意思維模式',           cat: '職涯' },
  { id: 'decision',     name: '你的決策風格是什麼？',       cat: '職涯' },
  { id: 'love',         name: '你的愛情語言是什麼？',       cat: '生活' },
  { id: 'social',       name: '你的人際互動風格',           cat: '生活' },
  { id: 'rhythm',       name: '你的生活節奏與幸福感來源',   cat: '生活' },
  { id: 'romance',      name: '你的戀愛觀與感情模式',       cat: '生活' },
  { id: 'money',        name: '你的金錢心理與財務行為',     cat: '生活' },
];

function doPost(e) {
  try {
    var data      = JSON.parse(e.postData.contents);
    var action    = data.action;
    var quizId    = data.quiz_id;
    var device    = data.device;
    var timestamp = data.timestamp;
    var ss            = SpreadsheetApp.getActiveSpreadsheet();
    var sheetOverview = ss.getSheetByName(SHEET_OVERVIEW);
    var sheetEvents   = ss.getSheetByName(SHEET_EVENTS);
    var twTime        = formatTWTime(timestamp);
    logEvent(sheetEvents, action, quizId, device, twTime);
    if (action === 'quiz_view' || action === 'quiz_complete') {
      updateOverview(sheetOverview, action, quizId, twTime);
    }
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var ss      = SpreadsheetApp.getActiveSpreadsheet();
    var sheet   = ss.getSheetByName(SHEET_OVERVIEW);
    var counts  = getAllCounts(sheet);
    var payload = JSON.stringify({ success: true, data: counts });
    var callback = e.parameter.callback;
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + payload + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService
      .createTextOutput(payload)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function logEvent(sheet, action, quizId, device, twTime) {
  var actionMap = { 'site_visit': '進入網站', 'quiz_view': '點閱測驗', 'quiz_complete': '完成測驗' };
  var quiz     = QUIZ_LIST.filter(function(q){ return q.id === quizId; })[0];
  var quizName = quiz ? quiz.name : (quizId ? quizId : '—');
  var quizCat  = quiz ? quiz.cat  : '—';
  sheet.appendRow([twTime, actionMap[action] || action, quizId || '—', quizName, quizCat, device || '—']);
}

function updateOverview(sheet, action, quizId, twTime) {
  var lastRow = sheet.getLastRow();
  for (var row = 2; row <= lastRow; row++) {
    if (sheet.getRange(row, 1).getValue() === quizId) {
      var col = (action === 'quiz_view') ? 4 : 5;
      var cur = sheet.getRange(row, col).getValue() || 0;
      sheet.getRange(row, col).setValue(cur + 1);
      sheet.getRange(row, 6).setValue(twTime);
      return;
    }
  }
}

function getAllCounts(sheet) {
  var lastRow = sheet.getLastRow();
  var counts  = {};
  for (var row = 2; row <= lastRow; row++) {
    var id        = sheet.getRange(row, 1).getValue();
    var views     = sheet.getRange(row, 4).getValue() || 0;
    var completes = sheet.getRange(row, 5).getValue() || 0;
    if (id) counts[id] = { views: views, completes: completes };
  }
  return counts;
}

function formatTWTime(isoString) {
  try {
    var d  = new Date(isoString);
    var tw = new Date(d.getTime() + 8 * 60 * 60 * 1000);
    var pad = function(n){ return String(n).padStart(2, '0'); };
    return tw.getUTCFullYear() + '/' + pad(tw.getUTCMonth()+1) + '/' + pad(tw.getUTCDate())
         + ' ' + pad(tw.getUTCHours()) + ':' + pad(tw.getUTCMinutes()) + ':' + pad(tw.getUTCSeconds());
  } catch (e) {
    return new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
  }
}

// ═══════════════════════════════════════════════════════════════
//  【初始化】只需執行一次
//  在編輯器上方選「initSheets」→ 點「▶ 執行」
// ═══════════════════════════════════════════════════════════════
function initSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var overview = ss.getSheetByName(SHEET_OVERVIEW) || ss.insertSheet(SHEET_OVERVIEW);
  overview.clearContents();
  overview.getRange(1,1,1,6).setValues([['測驗ID','類別','測驗名稱','點閱次數','完成次數','最後更新時間']]);
  var ovRows = QUIZ_LIST.map(function(q){ return [q.id,q.cat,q.name,0,0,'尚無資料']; });
  overview.getRange(2,1,ovRows.length,6).setValues(ovRows);
  overview.getRange(1,1,1,6).setBackground('#d96878').setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center');
  overview.getRange(2,4,QUIZ_LIST.length,2).setHorizontalAlignment('center');
  overview.setFrozenRows(1);
  overview.autoResizeColumns(1,6);

  var events = ss.getSheetByName(SHEET_EVENTS) || ss.insertSheet(SHEET_EVENTS);
  events.clearContents();
  events.getRange(1,1,1,6).setValues([['時間（台灣）','行為','測驗ID','測驗名稱','類別','裝置']]);
  events.getRange(1,1,1,6).setBackground('#7b5cc8').setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center');
  events.setFrozenRows(1);
  events.autoResizeColumns(1,6);

  ss.setActiveSheet(overview);
  ss.moveActiveSheet(1);

  Logger.log('✅ 初始化完成！分頁「總覽」和「事件記錄」已建立。');
  Logger.log('下一步：部署 → 新增部署作業 → 網頁應用程式 → 存取權：所有人 → 複製網址');
}
