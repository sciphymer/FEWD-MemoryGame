/*
 * Create a list that holds all of your cards
 */
const cards=["fa fa-diamond",
		   "fa fa-paper-plane-o",
		   "fa fa-anchor",
		   "fa fa-bolt",
		   "fa fa-cube",
		   "fa fa-bicycle",
		   "fa fa-bomb",
		   "fa fa-leaf",
		   "fa fa-diamond",
		   "fa fa-paper-plane-o",
		   "fa fa-anchor",
		   "fa fa-bolt",
		   "fa fa-cube",
		   "fa fa-bicycle",
		   "fa fa-bomb",
		   "fa fa-leaf",
		   ];

const gameBoard = document.querySelector(".deck");
let matchedCard = [];
let openedCard = [];
const restartBtn = document.querySelector("div.restart");
const moves_display = document.querySelector(".moves");
const playAgainBtn = document.querySelector(".playAgain");
let move_cnt = 0;
let current_step_time = 0;
let last_step_time = 0;
let timer = 0;
let timerInterval = 0;
let star_score = 0;
let playTime = document.querySelector(".timer");
const finishGameBkg_Overlay = document.querySelector(".finishGameBkg_Overlay");
const finishGameMsg_Overlay = document.querySelector(".finishGameMsg_Overlay");
let clickInProcess = false;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function shuffleAndPlaceCard(){
	const tempGameBoardDeck = document.createDocumentFragment();
	//make sure the game board cards are cleared
	while(gameBoard.hasChildNodes()){
		gameBoard.removeChild(gameBoard.firstChild);
	};
	let deck = shuffle(cards);
	//create the cards and put inside the deck element in gameboard
	deck.forEach(function(card){
		const list = document.createElement('li');
		list.classList.add("card");
		list.insertAdjacentHTML("afterbegin",'<i class="'.concat(card,'"></i>'));
		tempGameBoardDeck.appendChild(list);
	});
	gameBoard.appendChild(tempGameBoardDeck);
}

function getScore(){

	star_score = document.getElementsByClassName("stars");
	//first star
	if (move_cnt>=36){
		star_score[0].children[0].firstChild.classList.add("fa-star");
		star_score[0].children[0].firstChild.classList.remove("fa-star-o");
	}
	//second star
	else if (move_cnt>=26){
		star_score[0].children[1].firstChild.classList.add("fa-star");
		star_score[0].children[1].firstChild.classList.remove("fa-star-o");
	}
	//third star
	else if (move_cnt>=16){
		star_score[0].children[2].firstChild.classList.add("fa-star");
		star_score[0].children[2].firstChild.classList.remove("fa-star-o");
	}
}

function wrongCardsEffect(){
	//only current 2 cards which are wrong are open
	let wrongCards = document.getElementsByClassName("open");
	for(let i=0; i<wrongCards.length; i++){
		wrongCards[i].classList.add("wrong");
	}

}

function correctCardsEffect(matchedCards){
	for(let i=0; i<matchedCards.length; i++){
		matchedCards[i].parentNode.classList.add("correct");
	}
}

function cardAction(event){

	let target = event.target;

	if(timer==0){
		timerInterval = setInterval(function(){
		timer++;
		playTime.innerHTML = timer;
		},1000)
	}

	current_step_time = new Date().getTime();
	// to ensure the wrong card animation is finished before click a new card,
	// or else the card status cannot be updated in time
	if(((current_step_time-last_step_time)/1000)>0.4){
		//if the click is on the card area
		if (target.classList == "card"){

			if(matchedCard.includes(target.childNodes[0].className))
				return;
			if(openedCard.length<=2){
				target.classList.add("open");
				target.classList.add("show");



				openedCard.push(target.childNodes[0].className);
				//when a pair of cards are opened, check results
				if(openedCard.length==2){

					//add the moves after the card is opened.
					move_cnt ++;
					moves_display.textContent = move_cnt;
					//update the star score on the panel
					getScore();

					//when 2 cards are match, show match effect
					if(openedCard[0]==openedCard[1]){
						//add the card pattern to the matchedCard array
						matchedCard.push(target.childNodes[0].className);
						let temp_matchedCards = document.getElementsByClassName(openedCard[0]);
						correctCardsEffect(temp_matchedCards);
						//update the status of the 2s match cards
						for(let i=0;i<temp_matchedCards.length;i++){
							temp_matchedCards[i].parentNode.classList.add("match");
							temp_matchedCards[i].parentNode.classList.remove("show");
							temp_matchedCards[i].parentNode.classList.remove("open");
						}
						//Since card correct animation has 0.5sec, so class correct need to be delay to remove after that
						setTimeout(function(){
							for(let i=0;i<temp_matchedCards.length;i++){
								temp_matchedCards[i].parentNode.classList.remove("correct");
							}
						},600);

						//matched and clear the opendedCard array
						openedCard.pop();
						openedCard.pop();

						//check if user wins the game
						if(matchedCard.includes("fa fa-diamond")&&matchedCard.includes("fa fa-paper-plane-o")&&
							matchedCard.includes("fa fa-anchor")&&matchedCard.includes("fa fa-bolt")&&
							matchedCard.includes("fa fa-cube")&&matchedCard.includes("fa fa-bicycle")&&
							matchedCard.includes("fa fa-bomb")&&matchedCard.includes("fa fa-leaf")){


							let num_star = document.getElementsByClassName("fa-star-o");
							finishGameBkg_Overlay.style.display = "inline-block";
							clearInterval(timerInterval);
							document.querySelector(".move_Count").innerHTML = move_cnt;
							document.querySelector(".numOfStars").innerHTML = num_star.length;
							document.querySelector(".playTime").innerHTML = timer;
							//since finishGameBkg_Overlay has 0.2sec animation, finishGameMsg_overlay need to delay to start after that
							setTimeout(function(){finishGameMsg_Overlay.style.display = "inline-block";
							},300);
						}
					}else{
						// get time to check when can the next event target be triggered
						last_step_time = new Date().getTime();
						wrongCardsEffect();
						// since wrong card effect has 0.4 sec animation, so the flipping of the card to backside should be done after 0.4sec
						setTimeout(function(){
							for(let i=0;i<openedCard.length;i++){
								let temp_openedcards = document.getElementsByClassName(openedCard[i]);
								for (let j=0;j<temp_openedcards.length;j++){
									temp_openedcards[j].parentNode.classList.remove("show");
									temp_openedcards[j].parentNode.classList.remove("wrong");
									temp_openedcards[j].parentNode.classList.remove("open");
								}
							}
							openedCard.pop();
							openedCard.pop();
						},400);
					}
				}
			}
		}
	}

}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function restartStars(){
	star_score = document.getElementsByClassName("stars");
	for(let i=0;i<=2;i++){
		star_score[0].children[i].firstChild.classList.add("fa-star-o");
		star_score[0].children[i].firstChild.classList.remove("fa-star");
	}
}

function newGame(){
	//initalize parameters

	clearInterval(timerInterval);
	move_cnt = 0;
	moves_display.textContent = 0;
	matchedCard = [];
	openedCard = [];
	restartStars();
	timer = 0;
	playTime.innerHTML = 0;
	//initialize Game Board Deck
	while(gameBoard.hasChildNodes()){
		gameBoard.firstChild.remove();
	}
	//shuffle the cards and put the card on the page
	shuffleAndPlaceCard();
	//set click listeners to the lists of deck
	gameBoard.addEventListener('click', cardAction);
}

//Restart Game
restartBtn.addEventListener('click',newGame);

//Play Again Button shown on complete game screen
playAgainBtn.addEventListener('click',function(){
	finishGameMsg_Overlay.style.display = "none";
	finishGameBkg_Overlay.style.display = "none";
	newGame();
})

//Initial Start Point
move_cnt = 0;
moves_display.textContent = 0;
newGame();