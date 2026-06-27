let currentQuestion = null;
let score = 0;
let streak = 0;
let questionCount = 0;
let answered = false;
let selectedAnswer = null;

const STORAGE_KEY = 'quiz-leaderboard';
const MAX_LEADERBOARD = 10;

function initGame() {
    loadLeaderboard();
    nextQuestion();
}

function nextQuestion() {
    const [newQuestion] = getRandomQuestions(1);
    currentQuestion = newQuestion;
    questionCount++;
    answered = false;
    selectedAnswer = null;

    document.getElementById('question').textContent = currentQuestion.question;
    document.getElementById('difficulty').textContent = currentQuestion.difficulty;
    document.getElementById('question-count').textContent = questionCount;

    currentQuestion.options.forEach((option, index) => {
        document.getElementById(`option-${index}`).textContent = option;
    });

    const options = document.querySelectorAll('.option-btn');
    options.forEach(btn => {
        btn.classList.remove('selected', 'correct', 'wrong');
        btn.disabled = false;
    });

    document.getElementById('result-message').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
}

function selectAnswer(index) {
    if (answered) return;

    selectedAnswer = index;
    answered = true;

    const options = document.querySelectorAll('.option-btn');
    const isCorrect = index === currentQuestion.correct;

    options.forEach((btn, i) => {
        btn.disabled = true;
        if (i === currentQuestion.correct) {
            btn.classList.add('correct');
        } else if (i === index && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    const resultDiv = document.getElementById('result-message');
    const pointsGained = getPointsForDifficulty(currentQuestion.difficulty);

    if (isCorrect) {
        score += pointsGained;
        streak += 1;
        resultDiv.className = 'result-message correct';
        resultDiv.textContent = `✅ Correto! +${pointsGained} pontos 🔥 Streak: ${streak}`;
    } else {
        resultDiv.className = 'result-message wrong';
        resultDiv.textContent = `❌ Errado! A resposta correta é: ${currentQuestion.options[currentQuestion.correct]}`;
        streak = 0;
    }

    resultDiv.style.display = 'block';
    document.getElementById('next-btn').style.display = 'block';

    document.getElementById('score').textContent = score;
    document.getElementById('streak').textContent = streak;
}

function getPointsForDifficulty(difficulty) {
    const points = {
        'Fácil': 10,
        'Médio': 25,
        'Difícil': 50
    };
    return points[difficulty] || 10;
}

function loadLeaderboard() {
    const stored = localStorage.getItem(STORAGE_KEY);
    const leaderboard = stored ? JSON.parse(stored) : [];
    displayLeaderboard(leaderboard);
}

function displayLeaderboard(leaderboard) {
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';

    leaderboard
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_LEADERBOARD)
        .forEach((entry, index) => {
            const li = document.createElement('li');
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            li.innerHTML = `
                <span class="leaderboard-position">${medal}</span>
                <span class="leaderboard-score">${entry.score} pts</span>
            `;
            list.appendChild(li);
        });
}

function saveScore() {
    const stored = localStorage.getItem(STORAGE_KEY);
    let leaderboard = stored ? JSON.parse(stored) : [];

    leaderboard.push({
        score: score,
        timestamp: new Date().toLocaleDateString('pt-BR')
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(leaderboard));
    loadLeaderboard();
}

function resetLeaderboard() {
    if (confirm('Tem certeza que quer apagar o histórico de scores?')) {
        localStorage.removeItem(STORAGE_KEY);
        loadLeaderboard();
    }
}

// Salvar score a cada 5 perguntas
setInterval(() => {
    if (questionCount > 0 && questionCount % 5 === 0) {
        saveScore();
    }
}, 1000);

// Iniciar o jogo
window.addEventListener('load', initGame);
