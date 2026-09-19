/* =========================================================
   DESA PUSAKA - GOOGLE APPS SCRIPT
   Mempertahankan data lama + menambah Token & Balasan
   ========================================================= */

const SHEET_NAME = "Aduan";

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Waktu", "Nama", "Kategori", "Judul", "Deskripsi", "Status", "Token", "Balasan"]);
  }

  ensureHeaders_(sheet);
  return sheet;
}

function normalize_(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, "").trim();
}

function getColumns_(sheet) {
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const cols = {};
  headers.forEach(function(h, i) { cols[normalize_(h)] = i + 1; });
  return cols;
}

function ensureHeaders_(sheet) {
  let cols = getColumns_(sheet);
  const additions = [
    ["Waktu", "waktu"],
    ["Nama", "nama"],
    ["Kategori", "kategori"],
    ["Judul", "judul"],
    ["Deskripsi", "deskripsi"],
    ["Status", "status"],
    ["Token", "token"],
    ["Balasan", "balasan"]
  ];

  additions.forEach(function(item) {
    if (!cols[item[1]]) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(item[0]);
    }
  });
}

function doPost(e) {
  try {
    const data = JSON.parse((e.postData && e.postData.contents) || "{}");
    const sheet = getSheet_();
    const cols = getColumns_(sheet);
    const action = data.action || "aduan";

    if (action === "reply") {
      const updated = updateAduan_(sheet, cols, data);
      return json_({ success: updated, message: updated ? "Balasan tersimpan." : "Token tidak ditemukan." });
    }

    let token = String(data.token || "").trim().toUpperCase();
    if (!token) token = createUniqueToken_(sheet, cols);

    const row = new Array(sheet.getLastColumn()).fill("");
    row[cols.waktu - 1] = new Date();
    row[cols.nama - 1] = data.nama || "";
    row[cols.kategori - 1] = data.kategori || "";
    row[cols.judul - 1] = data.judul || "";
    row[cols.deskripsi - 1] = data.deskripsi || "";
    row[cols.status - 1] = data.status || "Menunggu";
    row[cols.token - 1] = token;
    row[cols.balasan - 1] = data.balasan || "";

    sheet.appendRow(row);
    return json_({ success: true, token: token });
  } catch (err) {
    return json_({ success: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    const action = String((e && e.parameter && e.parameter.action) || "").toLowerCase();
    const sheet = getSheet_();
    const cols = getColumns_(sheet);

    // Beri token pada data lama yang belum punya token.
    backfillTokens_(sheet, cols);

    if (action === "check") {
      return json_({ success: true, data: findByToken_(sheet, cols, e.parameter.token || "") });
    }

    if (action === "list") {
      return json_({ success: true, data: getAllAduan_(sheet, cols) });
    }

    return json_({ success: true, message: "API Desa Pusaka aktif." });
  } catch (err) {
    return json_({ success: false, error: String(err) });
  }
}

function backfillTokens_(sheet, cols) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const tokenRange = sheet.getRange(2, cols.token, lastRow - 1, 1);
  const tokenValues = tokenRange.getValues();
  let changed = false;

  for (let i = 0; i < tokenValues.length; i++) {
    if (!String(tokenValues[i][0]).trim()) {
      tokenValues[i][0] = createUniqueToken_(sheet, cols);
      changed = true;
    }
  }

  if (changed) tokenRange.setValues(tokenValues);
}

function findByToken_(sheet, cols, token) {
  token = String(token).trim().toUpperCase();
  if (!token) return null;

  const values = sheet.getDataRange().getValues();
  for (let i = values.length - 1; i >= 1; i--) {
    if (String(values[i][cols.token - 1]).trim().toUpperCase() === token) {
      return rowToObject_(values[i], cols);
    }
  }
  return null;
}

function getAllAduan_(sheet, cols) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  return values.slice(1).reverse().map(function(row) { return rowToObject_(row, cols); });
}

function rowToObject_(row, cols) {
  const waktu = row[cols.waktu - 1];
  return {
    waktu: waktu instanceof Date ? waktu.toISOString() : String(waktu || ""),
    token: String(row[cols.token - 1] || ""),
    nama: String(row[cols.nama - 1] || ""),
    kategori: String(row[cols.kategori - 1] || ""),
    judul: String(row[cols.judul - 1] || ""),
    deskripsi: String(row[cols.deskripsi - 1] || ""),
    status: String(row[cols.status - 1] || "Menunggu"),
    balasan: String(row[cols.balasan - 1] || "")
  };
}

function updateAduan_(sheet, cols, data) {
  const token = String(data.token || "").trim().toUpperCase();
  if (!token) return false;

  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][cols.token - 1]).trim().toUpperCase() === token) {
      sheet.getRange(i + 1, cols.status).setValue(data.status || "Dibalas");
      sheet.getRange(i + 1, cols.balasan).setValue(data.balasan || "");
      return true;
    }
  }
  return false;
}

function createUniqueToken_(sheet, cols) {
  let token = "";
  do {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    token = "ADU-";
    for (let i = 0; i < 5; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
  } while (findByToken_(sheet, cols, token));
  return token;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
