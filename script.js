let allQuestions = {};

async function fetchQuestions() {
  const res = await fetch("questions.json");
  allQuestions = await res.json();
}

const langText = {
  id: {
    start: "Mulai",
    back: "Kembali",
    next: "Lanjut",
    finished: "Quiz Selesai!",
    playAgain: "Main Lagi",
    time: "Waktu"
  },
  en: {
    start: "Start",
    back: "Back",
    next: "Next",
    finished: "Quiz Finished!",
    playAgain: "Play Again",
    time: "Time"
  }
};

let questions = [];
let currentQuestion = 0;
let answers = [];
let score = 0;
let timer;
let timeLeft = 15;
let player = "";
let language = "en";

async function startQuiz() {
  const nameInput = document.getElementById("playerName").value.trim();
  const category = document.getElementById("category").value;
  language = document.getElementById("language").value;

  if (!nameInput) return alert(language === "id" ? "Masukkan nama!" : "Enter your name!");

  player = nameInput;
  await fetchQuestions();
  questions = allQuestions[`${category}_${language}`];
  if (!questions) return alert("No questions found for this category/language.");

  answers = Array(questions.length).fill(null);
  currentQuestion = 0;

  updateLanguageUI();
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("quizScreen").style.display = "block";

  loadQuestion();
}

function updateLanguageUI() {
  const lang = langText[language];
  document.getElementById("btnBack").innerText = lang.back;
  document.getElementById("btnNext").innerText = lang.next;
  document.getElementById("btnRestart").innerText = lang.playAgain;
  document.getElementById("resultTitle").innerText = lang.finished;
}

function loadQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  document.getElementById("timer").textContent = `${langText[language].time}: ${timeLeft}`;
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
  document.getElementById("timer").textContent = `${langText[language].time}: ${timeLeft}`;
  if (timeLeft <= 0) {
    clearInterval(timer);
    nextQuestion();
  }
}

function selectAnswer(i) {
  answers[currentQuestion] = i;
  document.querySelectorAll(".option").forEach(btn => btn