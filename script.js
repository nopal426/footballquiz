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
    question: "Who is known as the 'Egyptian King' in football?",
    options: ["Mohamed Salah", "Trezeguet", "Ahmed Hegazi", "Mahmoud Hassan"],
    answer: 0
  },
  {
    question: "Which country won the 2014 FIFA World Cup?",
    options: ["Argentina", "Germany", "Brazil", "Spain"],
    answer: 1
  },
  {
    question: "Which football club has the most Premier League titles?",
    options: ["Manchester City", "Manchester United", "Chelsea", "Arsenal"],
    answer: 1
  },
  {
    question: "Who holds the record for most goals in the UEFA Champions League?",
    options: ["Lionel Messi", "Cristiano Ronaldo", "Raúl", "Robert Lewandowski"],
    answer: 1
  },
  {
    question: "Which player is nicknamed 'The Special One'?",
    options: ["José Mourinho", "Pep Guardiola", "Zinedine Zidane", "Carlo Ancelotti"],
    answer: 0
  }
];

let currentQuestion = 0;
let score = 0;
let player = "";
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
    btn.onclick = () => checkAnswer(i, btn);
    optionsDiv.appendChild(btn);
  });
}

function updateTimer() {
  timeLeft--;
  document.getElementById("timer").textContent = `Time: ${timeLeft}`;
  if (timeLeft <= 0) {
    clearInterval(timer);
    autoNext();
  }
}

function checkAnswer(selected, btn) {
  clearInterval(timer);
  const correct = questions[currentQuestion].answer;
  const correctSound = document.getElementById("correctSound");
  const wrongSound = document.getElementById("wrongSound");

  if (selected === correct) {
    score++;
    btn.style.background = "green";
    correctSound.play();
  } else {
    btn.style.background = "red";
    document.querySelectorAll(".option")[correct].style.background = "green";
    wrongSound.play();
  }
  document.querySelectorAll(".option").forEach(b => b.disabled = true);
}

function autoNext() {
  document.querySelectorAll(".option").forEach(b => b.disabled = true);
  const correct = questions[currentQuestion].answer;
  document.querySelectorAll(".option")[correct].style.background = "green";
  nextQuestion();
}

function nextQuestion() {
  clearInterval(timer);
  currentQuestion++;
  if (currentQuestion < questions.length) {
    setTimeout(loadQuestion, 500);
  } else {
    endQuiz();
  }
}

function endQuiz() {
  clearInterval(timer);
  document.getElementById("quizScreen").style.display = "none";
  document.getElementById("resultScreen").style.display = "block";
  document.getElementById("score").innerText = `Hey ${player}, you scored ${score} out of ${questions.length}`;
  saveToLeaderboard(player, score);
  showLeaderboard();
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  document.getElementById("resultScreen").style.display = "none";
  document.getElementById("loginScreen").style.display = "block";
}

function saveToLeaderboard(name, score) {
  const data = JSON.parse(localStorage.getItem("quiz_leaderboard") || "[]");
  data.push({ name, score });
  data.sort((a, b) => b.score - a.score); // Sort leaderboard by score descending
  localStorage.setItem("quiz_leaderboard", JSON.stringify(data.slice(0, 10))); // Keep only top 10
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
