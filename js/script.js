// Переменные состояния игры
let isGameRunning = false;
let score = 0; // Текущие очки игрока
let targetSizePercent = 10; // Начальный размер мишени в % от поля
let spawnSpeed = 3; // Начальная скорость появления мишеней в секундах
let currentTarget = null; // Данные о текущей мишени

// Счётчик очков
const scoreText = document.getElementById("score-text");
updateScoreDisplay(); // Изначально устанавливаем счёт

// Игровое поле
const gameField = document.getElementById("game-field");

// Создание новой мишени
function createNewTarget() {
    // Определяем ширину и высоту мишени
    const fieldWidth = gameField.offsetWidth;
    const fieldHeight = gameField.offsetHeight;
    const targetRadius = Math.min(fieldWidth, fieldHeight) * targetSizePercent / 100 / 2;
    const targetDiameter = targetRadius * 2;

    // Позиции мишени (ограничиваем случайные координаты)
    const x = Math.floor(Math.random() * (fieldWidth - targetDiameter));
    const y = Math.floor(Math.random() * (fieldHeight - targetDiameter));

    // Создаем новую мишень
    const newTarget = document.createElement("div");
    newTarget.className = "target";
    newTarget.style.setProperty("--target-size", `${targetDiameter}px`);
    newTarget.style.left = `${x}px`;
    newTarget.style.top = `${y}px`;

    // Назначаем обработчик клика
    newTarget.onclick = handleClickOnTarget;

    // Добавляем мишень на игровое поле
    gameField.appendChild(newTarget);

    // Ставим таймер следующего появления мишени
    currentTarget = {
        element: newTarget,
        timerID: setTimeout(() => {
            removeTarget(newTarget); // Удаляем предыдущую мишень
            createNewTarget(); // Создаем новую мишень
        }, spawnSpeed * 1000)
    };
}

// Обработчик клика по мишени
function handleClickOnTarget(event) {
    if (!isGameRunning) return;

    // Удаляем текущую мишень
    removeTarget(this);

    // Создаем новую мишень
    createNewTarget();

    // Повышаем очки
    score++;
    updateScoreDisplay();
}

// Обработчик клика по игровому полю
gameField.addEventListener('click', event => {
    if (!event.target.classList.contains('target') && isGameRunning) {
        // Штрафуем игрока за промах
        score--;
        updateScoreDisplay();
    }
});

// Удаление мишени
function removeTarget(target) {
    if (currentTarget) {
        clearTimeout(currentTarget.timerID); // Останавливаем таймер
        currentTarget.element.remove(); // Удаляем мишень
        currentTarget = null;
    }
}

// Обновление отображения очков
function updateScoreDisplay() {
    scoreText.textContent = `Очки: ${score}`;
}

// Запуск игры
document.getElementById('start-game').addEventListener('click', () => {
    if (!isGameRunning) {
        isGameRunning = true;
        score = 0; // Сбрасываем счётчик очков
        updateScoreDisplay(); // Обновляем отображение очков
        createNewTarget(); // Создаем первую мишень
    }
});

// Завершение игры
document.getElementById('stop-game').addEventListener('click', () => {
    if (isGameRunning) {
        isGameRunning = false;
        removeTarget(currentTarget.element); // Убираем последнюю мишень
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