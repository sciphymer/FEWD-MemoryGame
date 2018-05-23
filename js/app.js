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
let move_cnt = 0;
let beginTime = 0;
let stopTime = 0;
let currentTime = 0;
let star_score = 0;

function startTimer(){
	beginTime = new Date().getTime();
}
function stopTimer(){
	stopTime = new Date().getTime();
}

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
	star_score = document.querySelector(".fa-star");
	currentTime = Math.round(new Date().getTime()-beginTime)/1000;
	//first star
	if (move_cnt<=10 && currentTime<=20 && matchedCard.length>=2){
		star_score.classList.add("fa-star-o");
		star_score.classList.remove("fa-star");
	}
	//second star
	else if (move_cnt<=20 && currentTime<=30 && matchedCard.length>=5){
		star_score.classList.add("fa-star-o");
		star_score.classList.remove("fa-star");
	}
	//third star
	else if (move_cnt<=20 && currentTime<=30 && matchedCard.length==8){
		star_score.classList.add("fa-star-o");
		star_score.classList.remove("fa-star");
	}
	// alert(currentTime);

}

function wrongCardsEffect(){
	// debugger;
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

				if(openedCard[0]==openedCard[1]){
					//when 2 cards are match, show match pattern
					matchedCard.push(target.childNodes[0].className);
					let temp_matchedCards = document.getElementsByClassName(openedCard[0]);
					correctCardsEffect(temp_matchedCards);
					for(let i=0;i<temp_matchedCards.length;i++){
						temp_matchedCards[i].parentNode.classList.add("match");
						temp_matchedCards[i].parentNode.classList.remove("show");
						temp_matchedCards[i].parentNode.classList.remove("open");
					}
					setTimeout(function(){
						for(let i=0;i<temp_matchedCards.length;i++){
							temp_matchedCards[i].parentNode.classList.remove("correct");
						}
					},600);

					//matched and clear the opendedCard array
					openedCard.pop();
					openedCard.pop();

					//update the star score on the panel
					getScore();

					//check if user wins the game
					if(matchedCard.includes("fa fa-diamond")&&
						matchedCard.includes("fa fa-paper-plane-o")&&
						matchedCard.includes("fa fa-anchor")&&
						matchedCard.includes("fa fa-bolt")&&
						matchedCard.includes("fa fa-cube")&&
						matchedCard.includes("fa fa-bicycle")&&
						matchedCard.includes("fa fa-bomb")&&
						matchedCard.includes("fa fa-leaf")){
						stopTimer();

						alert("You win the game!!!\n" + "You have used " + Math.round(stopTime-beginTime)/1000 + " sec.");
					}
				} else {
					// when 2 cards not match, flip cards to backside
					// 1sec time delay to show the cards before removal
					wrongCardsEffect();
					// debugger;
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
					},500);
				}
			}else return;
		}
	}else return;
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
function newGame(){
	//shuffle the cards and put the card on the page
	shuffleAndPlaceCard();
	gameBoard.addEventListener('click', cardAction);
	startTimer();
	//set click listeners to the lists of deck

}

//Restart Game
restartBtn.addEventListener('click',function(){
	//initialize Game Board Deck
	while(gameBoard.hasChildNodes()){
		gameBoard.firstChild.remove();
	}
	move_cnt = 0;
	moves_display.textContent = 0;
	matchedCard = [];
	openedCard = [];
	newGame();
});

//Initial Start Point
move_cnt = 0;
moves_display.textContent = 0;
newGame();