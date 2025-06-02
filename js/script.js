// Глобальные переменные
let isGameRunning = false;
let score = 0;
let targetSizePercent = 10; // Начальный размер мишени в %
let spawnSpeed = 1; // Начальная скорость появления мишеней в секундах
let currentTarget = null;
let tc = '#ffd700'; // Цвет мишени
let gameField = document.getElementById("game-field");

// Стандартные настройки по умолчанию
const defaultSettings = {
    targetSize: '10%',           // Размер мишени (%)
    spawnSpeed: '1',              // Скорость появления мишеней
    targetColor: '#ffd700',      // Цвет мишени
    gameBorderColor: '#dfffe0'   // Цвет игрового поля
};

// Загрузка настроек из LocalStorage
function loadSettings() {
    const storedSettings = localStorage.getItem('gameSettings');
    return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
}

// Сохранение настроек в LocalStorage
function saveSettings(settings) {
    localStorage.setItem('gameSettings', JSON.stringify(settings));
}

// Функциональность для показа/срытия формы сохранения результата
function showSaveForm() {
    const form = document.getElementById('save-score-form');
    form.style.display = 'block';
    form.addEventListener('submit', handleSaveScoreSubmit);
}

function hideSaveForm() {
    const form = document.getElementById('save-score-form');
    form.style.display = 'none';
    form.reset(); // Очищаем форму
}

// Обновление отображения счета
function updateScoreDisplay() {
    const scoreText = document.getElementById("score-text");
    scoreText.textContent = `Очки: ${score}`;
}

// Формируем и сортируем рейтинг игроков
function renderRating() {
    const rankingList = document.getElementById('player-rating');
    rankingList.innerHTML = ''; // Очистим предыдущий контент

    playerScores.sort((a, b) => b.score - a.score); // Сортируем по очкам в порядке убывания

    playerScores.forEach(({ username, score }) => {
        const item = document.createElement('li');
        item.textContent = `${username}: ${score}`;
        rankingList.appendChild(item);
    });
}

// Обработчик отправки формы с именем пользователя
function handleSaveScoreSubmit(event) {
    event.preventDefault();

    const username = document.getElementById('username-input').value.trim();
    if (!username) return alert('Укажите свое имя!');

    // Сохраняем результат в массив
    playerScores.push({ username, score });
    savePlayerScores();

    // Скрываем форму и обновляем таблицу рейтинга
    hideSaveForm();
    renderRating();
}

// Обновляем рейтинг при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    // Восстанавливаем предыдущие результаты
    loadPlayerScores();
    renderRating();

    // Восстанавливаем настройки игры
    const settings = loadSettings();

    // Применяем загруженные настройки
    document.querySelector(`input[name="target-size"][value="${settings.targetSize}"]`).checked = true;
    document.querySelector(`input[name="spawn-speed"][value="${settings.spawnSpeed}"]`).checked = true;
    document.getElementById('target-color').value = settings.targetColor;
    document.getElementById('game-border-color').value = settings.gameBorderColor;

    // Обновляем глобальные переменные
    targetSizePercent = parseFloat(settings.targetSize.replace('%', ''));
    spawnSpeed = parseFloat(settings.spawnSpeed);
    tc = settings.targetColor;
    gameField.style.backgroundColor = settings.gameBorderColor;

    // Показываем результат очков
    updateScoreDisplay();
});

// Обработчики для изменения настроек
document.querySelectorAll('[name="target-size"]').forEach(radio => {
    radio.addEventListener('change', e => {
        targetSizePercent = parseFloat(e.target.value.replace('%', ''));
        const settings = loadSettings();
        settings.targetSize = e.target.value;
        saveSettings(settings);
    });
});

document.querySelectorAll('[name="spawn-speed"]').forEach(radio => {
    radio.addEventListener('change', e => {
        spawnSpeed = parseFloat(e.target.value);
        const settings = loadSettings();
        settings.spawnSpeed = e.target.value;
        saveSettings(settings);
    });
});

document.getElementById("target-color").addEventListener('change', (event) => {
    tc = event.target.value;
    const settings = loadSettings();
    settings.targetColor = event.target.value;
    saveSettings(settings);
});

document.getElementById("game-border-color").addEventListener('change', (event) => {
    gameField.style.backgroundColor = event.target.value;
    const settings = loadSettings();
    settings.gameBorderColor = event.target.value;
    saveSettings(settings);
});

// Обработчик запуска игры
document.getElementById('start-game').addEventListener('click', () => {
    if (!isGameRunning) {
        isGameRunning = true;
        score = 0; // Сбрасываем счётчик очков
        updateScoreDisplay(); // Обновляем отображение очков
        createNewTarget(); // Создаем первую мишень
    }
});

// Обработчик остановки игры
document.getElementById('stop-game').addEventListener('click', () => {
    if (isGameRunning) {
        isGameRunning = false;
        removeTarget(currentTarget.element); 
        showSaveForm(); // Показываем форму для сохранения результата
    }
});

// Вспомогательные функции для создания и удаления мишени
function createNewTarget() {
    const fieldWidth = gameField.offsetWidth;
    const fieldHeight = gameField.offsetHeight;
    const targetRadius = Math.min(fieldWidth, fieldHeight) * targetSizePercent / 100 / 2;
    const targetDiameter = targetRadius * 2;

    const x = Math.floor(Math.random() * (fieldWidth - targetDiameter));
    const y = Math.floor(Math.random() * (fieldHeight - targetDiameter));

    const newTarget = document.createElement("div");
    newTarget.className = "target";
    newTarget.style.setProperty('--target-size', `${targetDiameter}px`);
    newTarget.style.left = `${x}px`;
    newTarget.style.top = `${y}px`;
    newTarget.style.backgroundColor = tc;

    newTarget.onclick = handleClickOnTarget;
    gameField.appendChild(newTarget);

    currentTarget = {
        element: newTarget,
        timerID: setTimeout(() => {
            removeTarget(newTarget);
            createNewTarget();
        }, spawnSpeed * 1000)
    };
}

function handleClickOnTarget(event) {
    if (!isGameRunning) return;

    removeTarget(this);
    createNewTarget();
    score++;
    updateScoreDisplay();
}

function removeTarget(target) {
    if (currentTarget) {
        clearTimeout(currentTarget.timerID);
        currentTarget.element.remove();
        currentTarget = null;
    }
}

// Обработчик клика по игровому полю
gameField.addEventListener('click', event => {
    if (!event.target.classList.contains('target') && isGameRunning) {
        if (score > 0) {
            score--;
        }
        updateScoreDisplay();
    }
});

// Массив для хранения результатов пользователей
let playerScores = [];

// Загрузка предыдущих результатов из LocalStorage
function loadPlayerScores() {
    try {
        playerScores = JSON.parse(localStorage.getItem('playerScores')) || [];
    } catch (err) {}
}

// Сохранение новых результатов в LocalStorage
function savePlayerScores() {
    localStorage.setItem('playerScores', JSON.stringify(playerScores));
}