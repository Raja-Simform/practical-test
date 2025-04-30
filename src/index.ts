import { questionBank } from "./Questions/Questions";
// import { showWelcomeScreen, showConfigScreen, showGameScreen, showResultsScreen } from './homeScreen';
// import { startNewGame, resumeGame, saveGame } from './gameScreen';
// import { submitAnswer } from './playerScreen';
let gameState = {
    player1: {
        name: "Player 1",
        score: 0,
        correctAnswers: 0
    },
    player2: {
        name: "Player 2",
        score: 0,
        correctAnswers: 0
    },
    currentPlayer: 1,
    currentQuestionIndex: 0,
    selectedOption: null,
    timeRemaining: 10,
    questions: [],
    difficulty: "Easy"
};


function showPlayScreen() {
    console.log("hello world");
    homeBtn.style.display = "none";
    setting.style.display = "block";
    game.style.display = "none";
    result.style.display = "none";
 
}
function showGameScreen(){
    console.log("game screen");
    console.log(player1Name.value,player2Name.value,difficlty.value);
    homeBtn.style.display = "none";
    setting.style.display = "none";
    game.style.display = "block";
    result.style.display = "none";
    player1NameDisplay.textContent=player1Name.value;
    player2NameDisplay.textContent=player2Name.value;

    gameState = {
        player1: {
            name: player1Name.value,
            score: 0,
            correctAnswers: 0
        },
        player2: {
            name: player2Name.value,
            score: 0,
            correctAnswers: 0
        },
        currentPlayer: 1,
        currentQuestionIndex:0,
        selectedOption: null,
        timeRemaining: 10,
        questions: getQuestion(difficlty.value),
        difficulty: difficlty.value
    };
    // console.log(gameState.questions)
    loadQuestion();

}
let timerInterval;
let timeoutId;
 
const homeBtn= document.getElementById("home-screen")!;
const newBtn=document.getElementById('new-btn')!;
const setting=document.getElementById("play-screen")!
const game= document.getElementById("game-screen")!;
const result=document.getElementById("results-screen")!
const player1Name=document.getElementById('player1-name')as HTMLInputElement;
const player2Name=document.getElementById('player2-name')as HTMLInputElement;
const difficlty=document.getElementById('difficulty-select') as HTMLSelectElement;
const  selectBtn=document.getElementById('start-game-btn');
const player1NameDisplay=document.getElementById("player1-name-display")!;
const player2NameDisplay=document.getElementById("player2-name-display")!;
const questionNumber=document.querySelector('#question-number')!;
const QuestionText=document.getElementById('question-text')!;
const optionsContainer=document.getElementById('options-container')!;
const submitBtn=document.getElementById('submit-btn')! as HTMLButtonElement;
const timeDisplay = document.getElementById("time-display");
const timeRemaining=document.querySelector('.time-remaining')

newBtn.addEventListener("click",showPlayScreen);
selectBtn?.addEventListener("click",showGameScreen);
 


function getQuestion(prop:string){
    let key=0;
    if(prop==="easy"){
        key=0;
    }
    else if(prop==="medium"){
        key=1;
    }
    else{
        key=2;
    }
    return questionBank[key];
}
function loadQuestion() {
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    console.log(currentQuestion)
    questionNumber.textContent = String(gameState.currentQuestionIndex + 1);
    QuestionText.textContent = currentQuestion.question;
   
    optionsContainer.innerHTML = "";

    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement("div");
        optionElement.className = "option";
        optionElement.textContent = option;
        optionElement.dataset.index = index;
        
        optionElement.addEventListener("click", () => {
            document.querySelectorAll(".option").forEach(opt => {
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
   
    timerInterval = setInterval(() => {
        gameState.timeRemaining -= 0.1;
        gameState.timeRemaining = Math.max(0, gameState.timeRemaining);
        updateTimer();
    }, 100);
    
    timeoutId = setTimeout(() => {
        // submitAnswer(true);
    }, 10000);
}
function updateTimer(){
    timeDisplay.textContent = Math.ceil(gameState.timeRemaining);
}
function clearTimers() {
    clearInterval(timerInterval);
    clearTimeout(timeoutId);
}
