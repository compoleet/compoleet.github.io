// Переменные состояния игры
let isGameRunning = false;
let targetSizePercent = 10; // Начальный размер мишени в % от поля
let spawnSpeed = 3; // Начальная скорость появления мишеней в секундах
let targetLifetime = 3; // Начальное время жизни мишени в секундах

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Функция рисования мишени
function drawTarget(x, y, percent) {
    const radius = Math.min(canvas.width, canvas.height) * percent / 100 / 2; // Рассчитываем радиус в процентах от поля
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true); // Круглая мишень
    ctx.fillStyle = '#FFD700'; // Золотистый цвет
    ctx.fill();
}

// Ограничиваем позицию мишени, чтобы она не выходила за пределы холста
function limitPosition(x, y, radius) {
    return [
        Math.max(radius, Math.min(x, canvas.width - radius)), // Корректировка X
        Math.max(radius, Math.min(y, canvas.height - radius)) // Корректировка Y
    ];
}

// Запуск игры
document.getElementById('start-game').addEventListener('click', () => {
    if (!isGameRunning) {
        isGameRunning = true;
        startGameLoop(); // Начинаем цикл игры
    }
});

// Завершение игры
document.getElementById('stop-game').addEventListener('click', () => {
    if (isGameRunning) {
        isGameRunning = false;
    }
});

// Обработчики настроек
document.querySelectorAll('[name="target-size"]').forEach(radio => {
    radio.addEventListener('change', e => {
        targetSizePercent = parseFloat(e.target.value.replace('%', '')); // Получаем значение в процентах
    });
});

document.querySelectorAll('[name="spawn-speed"]').forEach(radio => {
    radio.addEventListener('change', e => {
        spawnSpeed = parseInt(e.target.value); // Сохраняем выбранную скорость появления
    });
});

document.querySelectorAll('[name="target-lifetime"]').forEach(radio => {
    radio.addEventListener('change', e => {
        targetLifetime = parseInt(e.target.value); // Сохраняем выбранное время жизни мишени
    });
});

// Основная игровая логика
function startGameLoop() {
    let lastSpawnTime = Date.now();
    function update() {
        requestAnimationFrame(update);
        if (isGameRunning && (Date.now() - lastSpawnTime >= spawnSpeed * 1000)) { // Проверяем необходимость спауна новой мишени
            clearCanvas();
            const radius = Math.min(canvas.width, canvas.height) * targetSizePercent / 100 / 2; // Вычисляем радиус
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const [limitedX, limitedY] = limitPosition(x, y, radius); // Применяем ограничение позиций
            drawTarget(limitedX, limitedY, targetSizePercent); // Рисуем новую мишень
            lastSpawnTime = Date.now();
        }
    }
    update();
}

// Очистка холста
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Инициализация начальной позиции
clearCanvas();