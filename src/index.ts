import { questionBank } from "./Questions/Questions";

interface Player {
  name: string;
  score: number;
  correctAnswers: number;
}
interface GameState {
  player1: Player;
  player2: Player;
  currentPlayer: number;
  currentQuestionIndex: number;
  selectedOption: number | null;
  timeRemaining: number;
  questions: any[];
  difficulty: string;
}
let gameState: GameState = {
  player1: { name: "Player 1", score: 0, correctAnswers: 0 },
  player2: { name: "Player 2", score: 0, correctAnswers: 0 },
  currentPlayer: 1,
  currentQuestionIndex: 0,
  selectedOption: null,
  timeRemaining: 10,
  questions: [],
  difficulty: "Easy",
};

let timerInterval: number;
let timeoutId: number;

const rootContainer = document.querySelector(
  ".rootContainer",
) as HTMLDivElement;

let playScreen: HTMLDivElement;
let gameScreen: HTMLDivElement;
let resultsScreen: HTMLDivElement;
let saveNotification: HTMLDivElement;
let player1Name: HTMLInputElement;
let player2Name: HTMLInputElement;
let difficultySelect: HTMLSelectElement;
let player1NameDisplay: HTMLDivElement;
let player2NameDisplay: HTMLDivElement;
let player1Score: HTMLSpanElement;
let player2Score: HTMLSpanElement;
let questionNumber: HTMLSpanElement;
let questionText: HTMLDivElement;
let optionsContainer: HTMLDivElement;
let submitBtn: HTMLButtonElement;
let timeDisplay: HTMLSpanElement;
let player1Badge: HTMLDivElement;
let player2Badge: HTMLDivElement;
let resumeBtn: HTMLButtonElement;
let homeScreen: HTMLDivElement;
function createHomeScreen() {
  homeScreen = document.createElement("div");
  homeScreen.id = "home-screen";
  homeScreen.className = "container";
  const heading = document.createElement("h1");
  heading.textContent = "Two-Player Quiz Challenge";
  const desc = document.createElement("p");
  desc.textContent =
    "Test your knowledge against each other in this exciting quiz game!";
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "btn-container";
  const newBtn = document.createElement("button");
  newBtn.id = "new-btn";
  newBtn.textContent = "New Game";
  newBtn.addEventListener("click", showPlayScreen);
  resumeBtn = document.createElement("button");
  resumeBtn.id = "resume-btn";
  resumeBtn.textContent = "Resume Game";
  resumeBtn.disabled = true;
  resumeBtn.addEventListener("click", resumeGame);
  buttonContainer.appendChild(newBtn);
  buttonContainer.appendChild(resumeBtn);
  homeScreen.appendChild(heading);
  homeScreen.appendChild(desc);
  homeScreen.appendChild(buttonContainer);
  rootContainer.appendChild(homeScreen);
}

function createPlayScreen() {
  playScreen = document.createElement("div");
  playScreen.id = "play-screen";
  playScreen.className = "container";
  playScreen.style.display = "none";

  const heading = document.createElement("h2");
  heading.textContent = "Game Setting";

  const player1Container = document.createElement("div");
  const player1Label = document.createElement("label");
  player1Label.setAttribute("for", "player1-name");
  player1Label.textContent = "Player 1 Name:";
  player1Name = document.createElement("input");
  player1Name.type = "text";
  player1Name.id = "player1-name";
  player1Name.placeholder = "Player 1";
  player1Name.required = true;

  player1Container.appendChild(player1Label);
  player1Container.appendChild(player1Name);
  const player2Container = document.createElement("div");
  const player2Label = document.createElement("label");
  player2Label.setAttribute("for", "player2-name");
  player2Label.textContent = "Player 2 Name:";

  player2Name = document.createElement("input");
  player2Name.type = "text";
  player2Name.id = "player2-name";
  player2Name.placeholder = "Player 2";
  player2Name.required = true;
  player2Container.appendChild(player2Label);
  player2Container.appendChild(player2Name);
  const difficultyContainer = document.createElement("div");
  const difficultyLabel = document.createElement("label");
  difficultyLabel.setAttribute("for", "difficulty-select");
  difficultyLabel.textContent = "Difficulty:";
  difficultySelect = document.createElement("select");
  difficultySelect.id = "difficulty-select";
  const easyOption = document.createElement("option");
  easyOption.value = "easy";
  easyOption.textContent = "Easy";
  const mediumOption = document.createElement("option");
  mediumOption.value = "medium";
  mediumOption.textContent = "Medium";
  const hardOption = document.createElement("option");
  hardOption.value = "hard";
  hardOption.textContent = "Hard";
  difficultySelect.appendChild(easyOption);
  difficultySelect.appendChild(mediumOption);
  difficultySelect.appendChild(hardOption);

  difficultyContainer.appendChild(difficultyLabel);
  difficultyContainer.appendChild(difficultySelect);

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "btn-container";

  const startGameBtn = document.createElement("button");
  startGameBtn.id = "start-game-btn";
  startGameBtn.textContent = "Start Game";
  startGameBtn.addEventListener("click", showGameScreen);

  buttonContainer.appendChild(startGameBtn);

  playScreen.appendChild(heading);
  playScreen.appendChild(player1Container);
  playScreen.appendChild(player2Container);
  playScreen.appendChild(difficultyContainer);
  playScreen.appendChild(buttonContainer);

  rootContainer.appendChild(playScreen);
}

function createGameScreen() {
  gameScreen = document.createElement("div");
  gameScreen.id = "game-screen";
  gameScreen.className = "container";
  gameScreen.style.display = "none";

  const playerBadges = document.createElement("div");
  playerBadges.className = "player-badges";
  player1Badge = document.createElement("div");
  player1Badge.id = "player1-badge";
  player1Badge.className = "player-badge player-1";
  player1NameDisplay = document.createElement("div");
  player1NameDisplay.id = "player1-name-display";
  player1NameDisplay.textContent = "Player 1";
  const player1ScoreContainer = document.createElement("div");
  player1ScoreContainer.textContent = "Score: ";
  player1Score = document.createElement("span");
  player1Score.id = "player1-score";
  player1Score.textContent = "0";
  player1ScoreContainer.appendChild(player1Score);
  player1Badge.appendChild(player1NameDisplay);
  player1Badge.appendChild(player1ScoreContainer);

  player2Badge = document.createElement("div");
  player2Badge.id = "player2-badge";
  player2Badge.className = "player-badge player-2";

  player2NameDisplay = document.createElement("div");
  player2NameDisplay.id = "player2-name-display";
  player2NameDisplay.textContent = "Player 2";
  const player2ScoreContainer = document.createElement("div");
  player2ScoreContainer.textContent = "Score: ";
  player2Score = document.createElement("span");
  player2Score.id = "player2-score";
  player2Score.textContent = "0";
  player2ScoreContainer.appendChild(player2Score);

  player2Badge.appendChild(player2NameDisplay);
  player2Badge.appendChild(player2ScoreContainer);

  playerBadges.appendChild(player1Badge);
  playerBadges.appendChild(player2Badge);

  const timeRemaining = document.createElement("div");
  timeRemaining.className = "time-remaining";
  timeRemaining.textContent = "Time: ";
  timeDisplay = document.createElement("span");
  timeDisplay.id = "time-display";
  timeDisplay.textContent = "10";
  timeRemaining.appendChild(timeDisplay);
  timeRemaining.appendChild(document.createTextNode("s"));

  const questionContainer = document.createElement("div");
  questionContainer.className = "question-container";

  const questionNumberContainer = document.createElement("div");
  questionNumberContainer.className = "question-number";
  questionNumberContainer.textContent = "Question ";
  questionNumber = document.createElement("span");
  questionNumber.id = "question-number";
  questionNumber.textContent = "1";
  questionNumberContainer.appendChild(questionNumber);
  questionNumberContainer.appendChild(document.createTextNode("of 10"));
  questionText = document.createElement("div");
  questionText.id = "question-text";
  questionText.className = "question-text";
  questionText.textContent = "Question text will appear here";
  optionsContainer = document.createElement("div");
  optionsContainer.id = "options-container";
  optionsContainer.className = "options-container";
  questionContainer.appendChild(questionNumberContainer);
  questionContainer.appendChild(questionText);
  questionContainer.appendChild(optionsContainer);
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "btn-container";
  submitBtn = document.createElement("button");
  submitBtn.id = "submit-btn";
  submitBtn.textContent = "Submit";
  submitBtn.disabled = true;
  submitBtn.addEventListener("click", () => submitAnswer());
  const saveBtn = document.createElement("button");
  saveBtn.id = "save-btn";
  saveBtn.textContent = "Save Game";
  saveBtn.addEventListener("click", saveGame);
  buttonContainer.appendChild(submitBtn);
  buttonContainer.appendChild(saveBtn);
  gameScreen.appendChild(playerBadges);
  gameScreen.appendChild(timeRemaining);
  gameScreen.appendChild(questionContainer);
  gameScreen.appendChild(buttonContainer);
  rootContainer.appendChild(gameScreen);
}

function createResultsScreen() {
  resultsScreen = document.createElement("div");
  resultsScreen.id = "results-screen";
  resultsScreen.className = "container";
  resultsScreen.style.display = "none";
  const heading = document.createElement("h2");
  heading.textContent = "Game Results";
  const resultsContainer = document.createElement("div");
  resultsContainer.className = "results-container";
  const player1Result = document.createElement("div");
  player1Result.id = "player1-result";
  player1Result.className = "result-card player-1";
  const player1ResultName = document.createElement("h3");
  player1ResultName.id = "player1-result-name";
  player1ResultName.textContent = "Player 1";
  const player1FinalScoreP = document.createElement("p");
  player1FinalScoreP.textContent = "Score: ";
  const player1FinalScore = document.createElement("span");
  player1FinalScore.id = "player1-final-score";
  player1FinalScore.textContent = "0";
  player1FinalScoreP.appendChild(player1FinalScore);
  player1FinalScoreP.appendChild(document.createTextNode("/10"));
  const player1CorrectP = document.createElement("p");
  player1CorrectP.textContent = "Correct Answers: ";
  const player1Correct = document.createElement("span");
  player1Correct.id = "player1-correct";
  player1Correct.textContent = "0";
  player1CorrectP.appendChild(player1Correct);
  player1Result.appendChild(player1ResultName);
  player1Result.appendChild(player1FinalScoreP);
  player1Result.appendChild(player1CorrectP);
  const player2Result = document.createElement("div");
  player2Result.id = "player2-result";
  player2Result.className = "result-card player-2";
  const player2ResultName = document.createElement("h3");
  player2ResultName.id = "player2-result-name";
  player2ResultName.textContent = "Player 2";
  const player2FinalScoreP = document.createElement("p");
  player2FinalScoreP.textContent = "Score: ";
  const player2FinalScore = document.createElement("span");
  player2FinalScore.id = "player2-final-score";
  player2FinalScore.textContent = "0";
  player2FinalScoreP.appendChild(player2FinalScore);
  player2FinalScoreP.appendChild(document.createTextNode("/10"));
  const player2CorrectP = document.createElement("p");
  player2CorrectP.textContent = "Correct Answers: ";
  const player2Correct = document.createElement("span");
  player2Correct.id = "player2-correct";
  player2Correct.textContent = "0";
  player2CorrectP.appendChild(player2Correct);
  player2Result.appendChild(player2ResultName);
  player2Result.appendChild(player2FinalScoreP);
  player2Result.appendChild(player2CorrectP);
  resultsContainer.appendChild(player1Result);
  resultsContainer.appendChild(player2Result);
  const winnerAnnouncement = document.createElement("div");
  winnerAnnouncement.id = "winner-announcement";
  const winnerHeading = document.createElement("h2");
  winnerHeading.textContent = "Winner: ";
  const winnerName = document.createElement("span");
  winnerName.id = "winner-name";
  winnerName.textContent = "Player 1";
  winnerHeading.appendChild(winnerName);
  winnerAnnouncement.appendChild(winnerHeading);
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "btn-container";
  const playAgainBtn = document.createElement("button");
  playAgainBtn.id = "play-again-btn";
  playAgainBtn.textContent = "Play Again";
  playAgainBtn.addEventListener("click", () => {
    homeScreen.style.display = "none";
    playScreen.style.display = "block";
    gameScreen.style.display = "none";
    resultsScreen.style.display = "none";
  });
  const homeBtn = document.createElement("button");
  homeBtn.id = "home-btn";
  homeBtn.textContent = "Back to Home";
  homeBtn.addEventListener("click", () => {
    homeScreen.style.display = "block";
    playScreen.style.display = "none";
    gameScreen.style.display = "none";
    resultsScreen.style.display = "none";
  });
  buttonContainer.appendChild(playAgainBtn);
  buttonContainer.appendChild(homeBtn);
  resultsScreen.appendChild(heading);
  resultsScreen.appendChild(resultsContainer);
  resultsScreen.appendChild(winnerAnnouncement);
  resultsScreen.appendChild(buttonContainer);
  rootContainer.appendChild(resultsScreen);
}

function createSaveNotification() {
  saveNotification = document.createElement("div");
  saveNotification.className = "save-notification";
  saveNotification.id = "save-notification";
  saveNotification.textContent = "Game progress saved!";
  saveNotification.style.display = "none";

  rootContainer.appendChild(saveNotification);
}

function showHomeScreen() {
  homeScreen.style.display = "block";

  if (localStorage.getItem("quizGameState")) {
    resumeBtn.disabled = false;
  }

  playScreen.style.display = "none";
  gameScreen.style.display = "none";
  resultsScreen.style.display = "none";
}

function showPlayScreen() {
  homeScreen.style.display = "none";
  playScreen.style.display = "block";
  gameScreen.style.display = "none";
  resultsScreen.style.display = "none";
}

function showGameScreen() {
  console.log("game screen");
  console.log(player1Name.value, player2Name.value, difficultySelect.value);

  homeScreen.style.display = "none";
  playScreen.style.display = "none";
  gameScreen.style.display = "block";
  resultsScreen.style.display = "none";

  player1NameDisplay.textContent = player1Name.value;
  player2NameDisplay.textContent = player2Name.value;

  gameState = {
    player1: {
      name: player1Name.value,
      score: 0,
      correctAnswers: 0,
    },
    player2: {
      name: player2Name.value,
      score: 0,
      correctAnswers: 0,
    },
    currentPlayer: 1,
    currentQuestionIndex: 0,
    selectedOption: null,
    timeRemaining: 10,
    questions: getQuestion(difficultySelect.value),
    difficulty: difficultySelect.value,
  };

  loadQuestion();
}

function showResultsScreen() {
  homeScreen.style.display = "none";
  playScreen.style.display = "none";
  gameScreen.style.display = "none";
  resultsScreen.style.display = "block";
}

function getQuestion(prop: string) {
  let key = 0;
  if (prop === "easy") {
    key = 0;
  } else if (prop === "medium") {
    key = 1;
  } else {
    key = 2;
  }
  return questionBank[key];
}

function loadQuestion() {
  if (gameState.currentQuestionIndex >= gameState.questions.length) {
    console.log("hello-end");
    endGame();
    return;
  }

  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
  console.log(currentQuestion);

  questionNumber.textContent = String(gameState.currentQuestionIndex + 1);
  questionText.textContent = currentQuestion.question;
  optionsContainer.innerHTML = "";

  currentQuestion.options.forEach((option: string, index: number) => {
    const optionElement = document.createElement("div");
    optionElement.className = "option";
    optionElement.textContent = option;
    optionElement.dataset.index = String(index);
    optionElement.addEventListener("click", () => {
      document.querySelectorAll(".option").forEach((opt) => {
        opt.classList.remove("selected");
      });
      optionElement.classList.add("selected");
      gameState.selectedOption = index;
      submitBtn.disabled = false;
    });

    optionsContainer.appendChild(optionElement);
  });

  gameState.timeRemaining = 10;
  updateTimer();
  startTimer();
}

function startTimer() {
  timerInterval = window.setInterval(() => {
    gameState.timeRemaining -= 0.1;
    gameState.timeRemaining = Math.max(0, gameState.timeRemaining);
    updateTimer();
  }, 100);

  timeoutId = window.setTimeout(() => {
    submitAnswer();
  }, 10000);
}

function updateTimer() {
  timeDisplay.textContent = String(Math.ceil(gameState.timeRemaining));
}

function clearTimers() {
  clearInterval(timerInterval);
  clearTimeout(timeoutId);
}

function submitAnswer() {
  clearTimers();

  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
  const correctAnsIndex = currentQuestion.correctAnswer;
  const options = document.querySelectorAll(".option");
  options[correctAnsIndex].classList.add("correct");
  console.log(1);

  if (gameState.selectedOption !== null) {
    if (gameState.selectedOption !== correctAnsIndex) {
      options[gameState.selectedOption].classList.add("wrong");
    } else {
      if (gameState.currentPlayer === 1) {
        gameState.player1.score += 1;
        gameState.player1.correctAnswers++;
      } else {
        gameState.player2.score += 1;
        gameState.player2.correctAnswers++;
      }
      player1Score.textContent = String(gameState.player1.score);
      player2Score.textContent = String(gameState.player2.score);
    }
  }
  console.log(2);

  options.forEach((option) => {
    option.style.pointerEvents = "none";
    console.log(3);
  });

  submitBtn.disabled = true;
  setTimeout(() => {
    gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
    gameState.currentQuestionIndex++;
    gameState.selectedOption = null;
    updatePlayerInfo();
    loadQuestion();
  }, 1500);
}
function updatePlayerInfo() {
  if (gameState.currentPlayer === 1) {
    player1Badge.classList.add("active-player");
    player2Badge.classList.remove("active-player");
  } else {
    player1Badge.classList.remove("active-player");
    player2Badge.classList.add("active-player");
  }
}
function endGame() {
  const player1ResultName = document.getElementById(
    "player1-result-name",
  ) as HTMLHeadingElement;
  const player2ResultName = document.getElementById(
    "player2-result-name",
  ) as HTMLHeadingElement;
  const player1FinalScore = document.getElementById(
    "player1-final-score",
  ) as HTMLSpanElement;
  const player2FinalScore = document.getElementById(
    "player2-final-score",
  ) as HTMLSpanElement;
  const player1Correct = document.getElementById(
    "player1-correct",
  ) as HTMLSpanElement;
  const player2Correct = document.getElementById(
    "player2-correct",
  ) as HTMLSpanElement;
  player1ResultName.textContent = gameState.player1.name;
  player2ResultName.textContent = gameState.player2.name;
  player1FinalScore.textContent = String(gameState.player1.score);
  player2FinalScore.textContent = String(gameState.player2.score);
  player1Correct.textContent = String(gameState.player1.correctAnswers);
  player2Correct.textContent = String(gameState.player2.correctAnswers);

  let winnerName = "";
  if (gameState.player1.score > gameState.player2.score) {
    winnerName = gameState.player1.name;
    document.getElementById("player1-result")!.classList.add("winner");
    document.getElementById("player2-result")!.classList.remove("winner");
  } else if (gameState.player2.score > gameState.player1.score) {
    winnerName = gameState.player2.name;
    document.getElementById("player2-result")!.classList.add("winner");
    document.getElementById("player1-result")!.classList.remove("winner");
  } else {
    winnerName = "It's a tie!";
    document.getElementById("player1-result")!.classList.remove("winner");
    document.getElementById("player2-result")!.classList.remove("winner");
  }

  document.getElementById("winner-name")!.textContent = winnerName;
  localStorage.removeItem("quizGameState");
  showResultsScreen();
}
function resumeGame() {
  const savedState = JSON.parse(localStorage.getItem("quizGameState")!);
  if (savedState) {
    gameState = savedState;
    updatePlayerInfo();
    showGameScreen();
    loadQuestion();
  }
}
function saveGame() {
  localStorage.setItem("quizGameState", JSON.stringify(gameState));
  saveNotification.style.display = "block";
  setTimeout(() => {
    saveNotification.style.display = "none";
  }, 2000);
  showHomeScreen();
}
function initApp() {
  createHomeScreen();
  createPlayScreen();
  createGameScreen();
  createResultsScreen();
  createSaveNotification();
  if (localStorage.getItem("quizGameState")) {
    resumeBtn.disabled = false;
  }
}
document.addEventListener("DOMContentLoaded", initApp);
