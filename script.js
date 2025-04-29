const restartButton = document.getElementById("restart-btn");
const completionMessage = document.getElementById("completion-message");

const landingPage = document.querySelector(".landing-page");
const gameCategory = document.querySelector(".game-category");
const quizSection = document.querySelector(".quiz");
const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");

let currentQuestionIndex = 0;
let questions = [];
let score = 0;

// Show landing page
function showLandingPage() {
    landingPage.style.display = "";
    gameCategory.style.display = "none";
    quizSection.style.display = "none";
}

// Show category selection
function showGameCategory() {
    landingPage.style.display = "none";
    gameCategory.style.display = "";
    quizSection.style.display = "none";
}

// Show quiz section
function showQuiz(category) {
    landingPage.style.display = "none";
    gameCategory.style.display = "none";
    quizSection.style.display = "";

    getQuestions(category);
}

// Fetch questions
async function getQuestions(category) {
    const API_URL = `https://opentdb.com/api.php?amount=20&type=multiple&category=${encodeURIComponent(category)}`;
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.results && data.results.length > 0 && data.results[0].question) {
            questions = data.results;
            currentQuestionIndex = 0;
            score = 0;
            displayQuestion();
        } else {
            console.error("Invalid data format:", data);
        }
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

// Display current question
function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion && currentQuestion.question) {
        questionElement.innerHTML = currentQuestion.question;
        optionsContainer.innerHTML = "";
        optionsContainer.style.display = "";

        const allOptions = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
        shuffleArray(allOptions);

        allOptions.forEach((option) => {
            const isCorrect = option === currentQuestion.correct_answer;
            addOption(option, isCorrect);
        });
    } else {
        console.error("Invalid question format:", currentQuestion);
    }
}

// Add options to DOM
function addOption(text, isCorrect) {
    const optionElement = document.createElement("button");
    optionElement.textContent = text;
    optionElement.classList.add("option");
    optionElement.dataset.correct = isCorrect;
    optionElement.addEventListener("click", selectOption);
    optionsContainer.appendChild(optionElement);
}

// Shuffle options for randomness
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Handle option selection
async function selectOption(event) {
    const selectedOption = event.target;
    const isCorrect = selectedOption.dataset.correct === "true";

    if (isCorrect) score++;

    questionElement.textContent = isCorrect ? "Correct!" : "Incorrect!";
    optionsContainer.style.display = "none";

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
        displayQuestion();
    } else {
        await new Promise(resolve => setTimeout(resolve, 500));
        showQuizCompleted();
    }
}

// Show quiz completion message
function showQuizCompleted() {
    questionElement.textContent = "";
    optionsContainer.innerHTML = "";
    optionsContainer.style.display = "none";

    completionMessage.innerHTML = `🎉 Quiz Completed!<br>Your Score: ${score} / ${questions.length}`;
    completionMessage.style.display = "block";
    restartButton.style.display = "inline-block";
}

// Restart quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    questions = [];
    score = 0;

    completionMessage.style.display = "none";
    restartButton.style.display = "none";

    showLandingPage();
}

// Add event listener to restart button
restartButton.addEventListener("click", restartQuiz);

// Initial load
showLandingPage();
