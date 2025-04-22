const loadQuestions = async (category, language) => {
    const response = await fetch('questions.json');
    const data = await response.json();
    return data[category][language];
};

let currentQuestionIndex = 0;
let score = 0;

let currentQuestions = [];
const startGame = async () => {
    const selectedCategory = 'football'; 
    const selectedLanguage = 'en'; 
    currentQuestions = await loadQuestions(selectedCategory, selectedLanguage);
    displayQuestion();
};

const displayQuestion = () => {
    const questionData = currentQuestions[currentQuestionIndex];
    document.getElementById('question').textContent = questionData.question;
  
    const options = document.getElementById('options');
    options.innerHTML = '';
    questionData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        options.appendChild(button);
    });
};

const checkAnswer = (selectedIndex) => {
    const correctAnswer = currentQuestions[currentQuestionIndex].answer;
    if (selectedIndex === correctAnswer) {
        score++;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        displayQuestion();
    } else {
        showScore();
    }
};

const showScore = () => {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('score-container').style.display = 'block';
    document.getElementById('score').textContent = `Your score: ${score}`;
};

startGame();