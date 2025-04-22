const allQuestions = {
  football_id: [
    {
      question: "Klub mana yang paling banyak juara Liga Champions?",
      options: ["Barcelona", "Liverpool", "AC Milan", "Real Madrid"],
      answer: 3
    },
    {
      question: "Siapa yang memenangkan Ballon d'Or 2022?",
      options: ["Messi", "Lewandowski", "Benzema", "Ronaldo"],
      answer: 2
    }
  ],
  football_en: [
    {
      question: "Which club has the most Champions League titles?",
      options: ["Barcelona", "Liverpool", "AC Milan", "Real Madrid"],
      answer: 3
    },
    {
      question: "Who won the 2022 Ballon d'Or?",
      options: ["Messi", "Lewandowski", "Benzema", "Ronaldo"],
      answer: 2
    }
  ]
};

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

function startQuiz() {
  const nameInput = document.getElementById("playerName").value.trim();
  const category = document.getElementById("category").value;
  language = document.getElementById("language").value;

  if (!nameInput) return alert(language === "id" ? "Masukkan nama!" : "Enter your name!");

  player = nameInput;
  questions = allQuestions[`${category}_${language}`];
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
  document.getElementById("score").innerText = `${player}, ${language === 'id' ? 'skor kamu' : 'your score'}: ${score}/${questions.length}`;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  answers = [];
  document.getElementById("resultScreen").style.display = "none";
  document.getElementById("loginScreen").style.display = "block";
}