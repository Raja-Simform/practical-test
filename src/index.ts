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
    category: "general",
    difficulty: "mixed"
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
}
const homeBtn= document.getElementById("home-screen")!;
const newBtn=document.getElementById('new-btn')!;
const setting=document.getElementById("play-screen")!
const game= document.getElementById("game-screen")!;
const result=document.getElementById("results-screen")!
newBtn.addEventListener("click",showPlayScreen);
const player1Name=document.getElementById('player1-name')as HTMLInputElement;
const player2Name=document.getElementById('player2-name')as HTMLInputElement;
const difficlty=document.getElementById('difficulty-select') as HTMLSelectElement;
const  selectBtn=document.getElementById('start-game-btn');
selectBtn?.addEventListener("click",showGameScreen);
 



