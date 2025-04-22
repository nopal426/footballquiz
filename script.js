const questions = [
  {
    question: "Which club has won the most UEFA Champions League titles?",
    options: ["Barcelona", "Liverpool", "AC Milan", "Real Madrid"],
    answer: 3
  },
  {
    question: "Who won the Ballon d'Or in 2022?",
    options: ["Messi", "Lewandowski", "Benzema", "Ronaldo"],
    answer: 2
  },
  {
    question: "Which country hosted the 2018 World Cup?",
    options: ["Brazil", "Russia", "Germany", "South Africa"],
    answer: 1
  },
  {
    question: "Which country won the 2014 FIFA World Cup?",
    options: ["Argentina", "Germany", "Brazil", "Spain"],
    answer: 1
  },
  {
    question: "Who holds the record for most UCL goals?",
    options: ["Messi", "Cristiano Ronaldo", "Raúl", "Lewandowski"],
    answer: 1
  }
];

let currentQuestion = 0;
let player = "";
let score = 0;
let answers = Array(questions.length).fill(null);
let timer;
let timeLeft = 15;

function startQuiz() {
  const nameInput = document.getElementById("playerName").value.trim();
  if (!nameInput) return alert("Please enter your name.");
  player = nameInput;
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("quizScreen").style.display = "block";
  loadQuestion();
}

function loadQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  document.getElementById("timer").textContent = `Time: ${timeLeft}`;
  timer = setInterval(updateTimer, 1000);

  const q = questions[currentQuestion];
  document.getElementById("question").innerText = q.question;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.className = "option";
    if (answers[currentQuestion] === i) btn.classList.add("selected");
    btn.onclick = () => selectAnswer(i);
    optionsDiv.appendChild(btn);
  });
}

function updateTimer() {
  timeLeft--;
  document.getElementById("timer").textContent = `Time: ${timeLeft}`;
  if (timeLeft <= 0) {
    clearInterval(timer);
    nextQuestion();
  }
}

function selectAnswer(i) {
  answers[currentQuestion] = i;
  document.querySelectorAll(".option").forEach(btn => btn.classList.remove("selected"));
  document.querySelectorAll(".option")[i].classList.add("selected");
}

function nextQuestion() {
  clearInterval(timer);
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    endQuiz();
  }
}

function prevQuestion() {
  clearInterval(timer);
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
}

function endQuiz() {
  clearInterval(timer);
  score = 0;
  answers.forEach((ans, i) => {
    if (ans === questions[i].answer) score++;
  });

  document.getElementById("quizScreen").style.display = "none";
  document.getElementById("resultScreen").style.display = "block";
  document.getElementById("score").innerText = `Hey ${player}, you scored ${score} out of ${questions.length}`;

  saveToLeaderboard(player, score);
  showLeaderboard();
  showReview();
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  answers.fill(null);
  document.getElementById("resultScreen").style.display = "none";
  document.getElementById("loginScreen").style.display = "block";
}

function saveToLeaderboard(name, score) {
  const data = JSON.parse(localStorage.getItem("quiz_leaderboard") || "[]");
  data.push({ name, score });
  data.sort((a, b) => b.score - a.score);
  localStorage.setItem("quiz_leaderboard", JSON.stringify(data.slice(0, 10)));
}

function showLeaderboard() {
  const data = JSON.parse(localStorage.getItem("quiz_leaderboard") || "[]");
  const list = document.getElementById("leaderboardList");
  list.innerHTML = "";
  data.forEach((entry, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${entry.name} - ${entry.score}`;
    list.appendChild(li);
  });
}

function showReview() {
  const reviewDiv = document.getElementById("reviewList");
  reviewDiv.innerHTML = "";

  questions.forEach((q, i) => {
    const userAnswer = answers[i];
    const isCorrect = userAnswer === q.answer;

    const div = document.createElement("div");
    div.className = "review-card";
    div.innerHTML = `
      <p><strong>Q${i + 1}: ${q.question}</strong></p>
      <p>Your Answer: <span class="${isCorrect ? 'correct' : 'wrong'}">
        ${userAnswer !== null ? q.options[userAnswer] : 'No answer'}
      </span></p>
      ${!isCorrect ? `<p>Correct Answer: <span class="correct">${q.options[q.answer]}</span></p>` : ''}
    `;
    reviewDiv.appendChild(div);
  });
}