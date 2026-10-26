/**
 * Code.gs — серверная логика Учебного портала
 * Google Apps Script + Google Sheets
 * Email-авторизация, результаты (оценка/время/попытки), бэкап
 */

// ====================== КОНФИГУРАЦИЯ ======================
const SPREADSHEET_ID = 'ВАШ_ID_ТАБЛИЦЫ'; // замените на ID вашей таблицы
const USERS_SHEET = 'Users';
const RESULTS_SHEET = 'Results';
const SALT = 'portal_spo_2026';

/**
 * Точка входа для POST-запросов
 */
function doPost(e) {
  return handleRequest(e);
}

/**
 * Точка входа для GET-запросов
 */
function doGet(e) {
  return handleRequest(e);
}

/**
 * Главный обработчик запросов
 */
function handleRequest(e) {
  try {
    let data = {};

    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        return jsonResponse({ success: false, error: 'Неверный формат JSON' });
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    const action = (data.action || '').toString().trim().toLowerCase();

    switch (action) {
      case 'login':
        return jsonResponse(handleLogin(data));
      case 'save_student':
        return jsonResponse(handleSaveStudent(data));
      case 'get_student':
        return jsonResponse(handleGetStudent(data));
      case 'save_result':
        return jsonResponse(handleSaveResult(data));
      case 'get_results':
        return jsonResponse(handleGetResults(data));
      default:
        return jsonResponse({ success: false, error: 'Неизвестное действие: ' + action });
    }
  } catch (err) {
    return jsonResponse({
      success: false,
      error: 'Внутренняя ошибка сервера: ' + err.message
    });
  }
}

/**
 * Простейший хэш пароля (SHA-256 + соль)
 */
function simpleHash(password) {
  const raw = SALT + String(password || '');
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    raw,
    Utilities.Charset.UTF_8
  );
  return digest.map(function (b) {
    const v = (b < 0 ? b + 256 : b).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
}

/**
 * Нормализация email
 */
function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

/**
 * Получение листа Users (создаёт, если нет)
 */
function getUsersSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(USERS_SHEET);

  if (!sheet) {
    sheet = ss.insertSheet(USERS_SHEET);
    sheet.appendRow(['Email', 'PasswordHash', 'Name', 'Group', 'Role', 'UpdatedAt']);
  }

  return sheet;
}

/**
 * Получение листа Results (создаёт, если нет)
 * A-Email | B-Name | C-Group | D-TestId | E-TestTitle |
 * F-Grade | G-Score | H-MaxScore | I-Percent |
 * J-TimeSpent | K-Attempts | L-FinishedAt
 */
function getResultsSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(RESULTS_SHEET);

  if (!sheet) {
    sheet = ss.insertSheet(RESULTS_SHEET);
    sheet.appendRow([
      'Email',
      'Name',
      'Group',
      'TestId',
      'TestTitle',
      'Grade',
      'Score',
      'MaxScore',
      'Percent',
      'TimeSpent',
      'Attempts',
      'FinishedAt'
    ]);
  }

  return sheet;
}

/**
 * Поиск пользователя по email
 */
function findUserByEmail(email) {
  const sheet = getUsersSheet();
  const values = sheet.getDataRange().getValues();
  const normalized = normalizeEmail(email);

  for (let i = 1; i < values.length; i++) {
    const rowEmail = normalizeEmail(values[i][0]);
    if (rowEmail === normalized) {
      return {
        row: i + 1,
        data: {
          email: values[i][0],
          passwordHash: values[i][1],
          name: values[i][2],
          group: values[i][3],
          role: values[i][4] || 'student',
          updatedAt: values[i][5]
        }
      };
    }
  }
  return null;
}

/**
 * Подсчёт предыдущих попыток студента по тесту
 */
function countAttempts(email, testId) {
  const sheet = getResultsSheet();
  const values = sheet.getDataRange().getValues();
  const normalizedEmail = normalizeEmail(email);
  const tid = String(testId || '');

  let count = 0;
  for (let i = 1; i < values.length; i++) {
    if (normalizeEmail(values[i][0]) === normalizedEmail && String(values[i][3]) === tid) {
      count++;
    }
  }
  return count;
}

/**
 * Вход
 */
function handleLogin(data) {
  const email = normalizeEmail(data.email);
  const password = String(data.password || '');

  if (!email || !password) {
    return { success: false, error: 'Укажите email и пароль' };
  }

  const user = findUserByEmail(email);
  if (!user) {
    return { success: false, error: 'Пользователь с таким email не найден' };
  }

  const incomingHash = simpleHash(password);
  if (incomingHash !== user.data.passwordHash) {
    return { success: false, error: 'Неверный пароль' };
  }

  return {
    success: true,
    email: user.data.email,
    name: user.data.name || email,
    group: user.data.group || '',
    role: user.data.role || 'student'
  };
}

/**
 * Сохранение / обновление студента (без дубликатов по email)
 */
function handleSaveStudent(data) {
  const email = normalizeEmail(data.email);
  if (!email) {
    return { success: false, error: 'Email обязателен' };
  }

  const sheet = getUsersSheet();
  const existing = findUserByEmail(email);
  const now = new Date().toISOString();

  const name = (data.name || '').toString().trim() || (existing ? existing.data.name : email);
  const group = (data.group || '').toString().trim() || (existing ? existing.data.group : '');
  const role = (data.role || '').toString().trim() || (existing ? existing.data.role : 'student');

  let passwordHash = existing ? existing.data.passwordHash : '';
  if (data.password) {
    passwordHash = simpleHash(data.password);
  }

  if (!passwordHash) {
    return { success: false, error: 'Пароль обязателен для нового пользователя' };
  }

  if (existing) {
    sheet.getRange(existing.row, 1, 1, 6).setValues([[
      email,
      passwordHash,
      name,
      group,
      role,
      now
    ]]);
  } else {
    sheet.appendRow([email, passwordHash, name, group, role, now]);
  }

  return {
    success: true,
    email: email,
    name: name,
    group: group,
    role: role,
    updated: !!existing
  };
}

/**
 * Получение данных студента
 */
function handleGetStudent(data) {
  const email = normalizeEmail(data.email);
  if (!email) {
    return { success: false, error: 'Email обязателен' };
  }

  const user = findUserByEmail(email);
  if (!user) {
    return { success: false, error: 'Пользователь не найден' };
  }

  return {
    success: true,
    email: user.data.email,
    name: user.data.name,
    group: user.data.group,
    role: user.data.role
  };
}

/**
 * Сохранение результата теста
 * attempts считается на сервере (предыдущие + 1)
 */
function handleSaveResult(data) {
  const email = normalizeEmail(data.email);
  if (!email) {
    return { success: false, error: 'Email обязателен' };
  }

  const testId = String(data.testId || 'unknown');
  const testTitle = String(data.testTitle || testId);
  const grade = Number(data.grade) || 2;
  const score = Number(data.score) || 0;
  const maxScore = Number(data.maxScore) || 0;
  const percent = Number(data.percent) || 0;
  const timeSpent = Math.max(0, Number(data.timeSpent) || 0);

  let name = String(data.name || '').trim();
  let group = String(data.group || '').trim();

  if (!name || !group) {
    const user = findUserByEmail(email);
    if (user) {
      if (!name) name = user.data.name || email;
      if (!group) group = user.data.group || '';
    }
  }
  if (!name) name = email;

  const prevAttempts = countAttempts(email, testId);
  const attempts = prevAttempts + 1;
  const finishedAt = new Date().toISOString();

  const sheet = getResultsSheet();
  sheet.appendRow([
    email,
    name,
    group,
    testId,
    testTitle,
    grade,
    score,
    maxScore,
    percent,
    timeSpent,
    attempts,
    finishedAt
  ]);

  return {
    success: true,
    email: email,
    testId: testId,
    grade: grade,
    timeSpent: timeSpent,
    attempts: attempts,
    finishedAt: finishedAt
  };
}

/**
 * Получение результатов (для кабинета преподавателя)
 */
function handleGetResults(data) {
  const sheet = getResultsSheet();
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return { success: true, results: [] };
  }

  const filterTestId = data.testId ? String(data.testId) : null;
  const filterGroup = data.group ? String(data.group).trim().toLowerCase() : null;

  const results = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const item = {
      email: row[0],
      name: row[1],
      group: row[2],
      testId: row[3],
      testTitle: row[4],
      grade: row[5],
      score: row[6],
      maxScore: row[7],
      percent: row[8],
      timeSpent: row[9],
      attempts: row[10],
      finishedAt: row[11]
    };

    if (filterTestId && String(item.testId) !== filterTestId) continue;
    if (filterGroup && String(item.group || '').toLowerCase() !== filterGroup) continue;

    results.push(item);
  }

  results.sort(function (a, b) {
    return String(b.finishedAt).localeCompare(String(a.finishedAt));
  });

  return { success: true, results: results };
}

/**
 * Резервное копирование таблицы
 *
 * Как настроить триггер (раз в неделю):
 * 1. Откройте проект Apps Script
 * 2. Слева «Триггеры» (иконка будильника)
 * 3. «+ Добавить триггер»
 * 4. Функция: createBackup
 * 5. Источник: «По времени» → «Недельный таймер»
 * 6. День: Воскресенье, время 02:00–03:00
 * 7. Сохраните
 */
function createBackup() {
  try {
    const file = DriveApp.getFileById(SPREADSHEET_ID);
    const now = new Date();

    const dateStr =
      now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + '-' +
      String(now.getMinutes()).padStart(2, '0');

    const backupName = 'Учебный портал — бэкап ' + dateStr;
    const copy = file.makeCopy(backupName);

    console.log('Бэкап создан: ' + copy.getName() + ' (ID: ' + copy.getId() + ')');
    return copy.getId();
  } catch (err) {
    console.error('Ошибка создания бэкапа: ' + err.message);
    throw err;
  }
}

/**
 * JSON-ответ
 */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
