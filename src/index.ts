import { questionBank } from "./Questions/Questions";

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
// if (localStorage.getItem("quizGameState")) {
//     resumeGameBtn.disabled = false;
// }
 
const homeBtn= document.getElementById("home-screen")!;
const newBtn=document.getElementById('new-btn')!;
const setting=document.getElementById("play-screen")!
const game= document.getElementById("game-screen")!;
const result=document.getElementById("results-screen")!
const player1Name=document.getElementById('player1-name')as HTMLInputElement;
const player2Name=document.getElementById('player2-name')as HTMLInputElement;
const player1Score=document.getElementById('player1-score')!;
const player2Score=document.getElementById('player2-score')!;
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
const player1Badge=document.getElementById('player1-badge')!;
const player2Badge=document.getElementById('player2-badge')!;
const player1ResultName= document.getElementById("player1-result-name")
const player2ResultName= document.getElementById("player2-result-name");
const player1FinalScore=document.getElementById("player1-final-score");
const player2FinalScore=document.getElementById("player2-final-score");
const player1Correct= document.getElementById("player1-correct");
const player2Correct= document.getElementById("player2-correct");
const playAgain=document.getElementById("play-again-btn");
const backHomeBtn=document.getElementById("home-btn");
const saveBtn=document.getElementById('save-btn');
const resumeBtn=document.getElementById('resume-btn');
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
  
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        console.log("hello-end");
        endGame();
        return;
    }
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    console.log(currentQuestion)
    questionNumber.textContent = String(gameState.currentQuestionIndex + 1);
    QuestionText.textContent = currentQuestion.question;
   
    optionsContainer.innerHTML = "";

    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement("DIV");
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
        submitAnswer(true);
    }, 10000);
}
function updateTimer(){
    timeDisplay.textContent = Math.ceil(gameState.timeRemaining);
    
}
function clearTimers() {
    clearInterval(timerInterval);
    clearTimeout(timeoutId);
}
function submitAnswer(isTimeout = false) {
    
    clearTimers();
    
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    const correctAnswerIndex = currentQuestion.correctAnswer;
    
   
    const options = document.querySelectorAll(".option");
    options[correctAnswerIndex].classList.add("correct");
    
    console.log(1);
    if (gameState.selectedOption !== null) {
     
        if (gameState.selectedOption !== correctAnswerIndex) {
            options[gameState.selectedOption].classList.add("wrong");
        } else {
            
            // const pointsEarned = Math.ceil(gameState.timeRemaining);
            
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
    console.log(2)

    options.forEach(option => {
        option.style.pointerEvents = "none";
        console.log(3)
    });
    
  
    submitBtn.disabled = true;
    
   
    setTimeout(() => {
     
        gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
        
     
        gameState.currentQuestionIndex++;
        
        
        gameState.selectedOption = null;
        
      
        updatePlayerInfo();
        
        // console.log("final")
        loadQuestion();
    }, 1500);
}
submitBtn.addEventListener('click',submitAnswer);

function updatePlayerInfo() {
    
    player1Name.textContent = gameState.player1.name;
    player2Name.textContent = gameState.player2.name;
    player1Score.textContent = String(gameState.player1.score);
    player2Score.textContent = String(gameState.player2.score);
    if (gameState.currentPlayer === 1) {
        player1Badge.classList.add("active-player");
        player2Badge.classList.remove("active-player");
    } else {
        player1Badge.classList.remove("active-player");
        player2Badge.classList.add("active-player");
    }
}
function endGame() {
   
    player1ResultName.textContent = gameState.player1.name;
    player2ResultName.textContent = gameState.player2.name;
    player1FinalScore.textContent = gameState.player1.score;
    player2FinalScore.textContent = gameState.player2.score;
    player1Correct.textContent = gameState.player1.correctAnswers;
    player2Correct.textContent = gameState.player2.correctAnswers;
    
    
    let winnerName = "";
    if (gameState.player1.score > gameState.player2.score) {
        winnerName = gameState.player1.name;
        document.getElementById("player1-result").classList.add("winner");
        document.getElementById("player2-result").classList.remove("winner");
    } else if (gameState.player2.score > gameState.player1.score) {
        winnerName = gameState.player2.name;
        document.getElementById("player2-result").classList.add("winner");
        document.getElementById("player1-result").classList.remove("winner");
    } else {
        winnerName = "It's a tie!";
        document.getElementById("player1-result").classList.remove("winner");
        document.getElementById("player2-result").classList.remove("winner");
    }
    
    document.getElementById("winner-name").textContent = winnerName;
    
  
    localStorage.removeItem("quizGameState");
    
   
    showResultsScreen();
}
function showResultsScreen(){
    homeBtn.style.display = "none";
    setting.style.display = "none";
    game.style.display = "none";
    result.style.display = "block";
}
playAgain?.addEventListener("click",()=>{
    homeBtn.style.display = "none";
    setting.style.display = "block";
    game.style.display = "none";
    result.style.display = "none";
});
backHomeBtn?.addEventListener("click",()=>{
    homeBtn.style.display = "block";
    setting.style.display = "none";
    game.style.display = "none";
    result.style.display = "none";
})
function resumeGame() {
  
    const savedState = JSON.parse(localStorage.getItem("quizGameState"));
    if (savedState) {
        gameState = savedState;
        updatePlayerInfo();
        showGameScreen();
        loadQuestion();
    }
}
function saveGame() {
    localStorage.setItem("quizGameState", JSON.stringify(gameState));
}
