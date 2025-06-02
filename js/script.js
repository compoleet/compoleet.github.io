let isGameRunning = false;
let score = 0; 
let targetSizePercent = 10; // Начальный размер мишени в % от поля
let spawnSpeed = 1; // Начальная скорость появления мишеней в секундах
let currentTarget = null; 
let tc='gold';
document.getElementById("game-border-color").addEventListener('change',(event)=>{
    gameField.style.backgroundColor=event.target.value;
});

document.getElementById("target-color").addEventListener('change',(event)=>{
tc=event.target.value;
});

// Счётчик очков
const scoreText = document.getElementById("score-text");
updateScoreDisplay();

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
    newTarget.style.backgroundColor=tc;

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
        if(score>0){
            score--;
        }
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
        removeTarget(currentTarget.element); 
    }
});

// Обработчики настроек
document.querySelectorAll('[name="target-size"]').forEach(radio => {
    radio.addEventListener('change', e => {
        targetSizePercent = parseFloat(e.target.value.replace('%', '')); 
    });
});

document.querySelectorAll('[name="spawn-speed"]').forEach(radio => {
    radio.addEventListener('change', e => {
        spawnSpeed = parseFloat(e.target.value); 
    });
});
