var suit = ["&#9824;", "&#9829;", "&#9827;", "&#9830;"];
var face = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var value = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
var playerHand = [];
var dealerHand = [];
var deck = [];
let playing = false;
let pbusted = false;
const playTime = document.getElementById("play");
playTime.addEventListener("click", deal);

//Create the card deck
function createDeck() {    
    for(let i = 0; i < suit.length; i++) {
        for (let x = 0; x < face.length; x++) {
            var card = {Suit: suit[i], Face: face[x], Value: value[x] };            
            deck.push(card);
        }
    }    
}

//Shuffle the deck
function shuffle() {    
    for (let x = 0; x < 1000; x++) {
        let location1 = Math.floor(Math.random() * deck.length);
        let location2 = Math.floor(Math.random() * deck.length);
        let tmp = deck[location1];
        deck[location1] = deck[location2];
        deck[location2] = tmp;        
    }      
}

//Deal the first two cards to both players
function deal() {
    createDeck();
    shuffle();
    playing = true;
    playTime.style.visibility = 'hidden';
    playTime.removeEventListener('click', deal);
    document.getElementById('dHandHead').innerHTML = "Dealer Hand";
    document.getElementById('pHandHead').innerHTML = "Player Hand";
    addCard();
    daddCard();
    addCard();
    daddCard();
    playerTurn();
}

//Add cards to the players hand
function addCard() {
    playerHand.push(deck.shift());
    let nextCard = Object.keys(playerHand).length - 1;
    let pface = playerHand[nextCard].Face;
    let psuit = playerHand[nextCard].Suit;
    var newCard = document.createElement("p");
    
    if (psuit === suit[1] || psuit === suit[3]) {
        newCard.className = 'redcard';
        
    } else {
        newCard.className = 'card';
        
    }
    newCard.innerHTML = pface + " " + psuit;    
    var place = document.getElementsByClassName("playerHand")[0];
    place.appendChild(newCard); 
    let total = calcTotal(playerHand);
    
    if (total > 21){
        for (let i = 0; i < playerHand.length; i++) {
            if(playerHand[i].Value === 11) {
                playerHand[i].Value = 1;
            }
        }
    }
    total = calcTotal(playerHand);
    if (total > 21){
        document.getElementById("pHandHead").innerHTML = "Player hand total: " + total + " YOU BUSTED";
        endGame();
    } else {
        document.getElementById("pHandHead").innerHTML = "Player hand total: " + total;
    }
}

//Add cards to the dealers hand
function daddCard() {
    dealerHand.push(deck.shift());
    let nextCard = Object.keys(dealerHand).length - 1;
    let pface = dealerHand[nextCard].Face;
    let psuit = dealerHand[nextCard].Suit;
    var newCard = document.createElement("p");
    if (psuit === suit[1] || psuit === suit[3]) {
        newCard.className = 'redcard';
    } else {
        newCard.className = 'card';
    }
    if(dealerHand.length != 2) {
        newCard.innerHTML = pface + " " + psuit;
    } else {
        newCard.id = "dcardtwo";
    }
    
    var place = document.getElementsByClassName("dealerHand")[0];
    place.appendChild(newCard);      
}

//Players turn
function playerTurn() {
    document.getElementById('message').innerHTML = "Players Turn";
    let total = calcTotal(playerHand);
    if (total === 21) {
        document.getElementById("pHandHead").innerHTML = "Player Hand: Black Jack!!!!" + total;
        endGame();        
    } else {
        document.getElementById("pHandHead").innerHTML = "Player hand total: " + total;
    }
    let hit = document.getElementById("hit");    
    let stay = document.getElementById("stay");
    hit.style.visibility = "visible";    
    stay.style.visibility = "visible";
    hit.addEventListener('click', addCard);
    stay.addEventListener('click', dealerTurn); 
    
}

//Dealers turn
function dealerTurn() {
    document.getElementById("message").innerHTML = "Dealer's turn";
    let nextCard = Object.keys(dealerHand).length - 1;
    let pface = dealerHand[nextCard].Face;
    let psuit = dealerHand[nextCard].Suit;    
    document.getElementById("dcardtwo").innerHTML = pface +" " + psuit;
    let total = calcTotal(dealerHand);
    document.getElementById("dHandHead").innerHTML = "Dealer hand total: " + total;
    if(total === 21){
        document.getElementById("dHandHead").innerHTML = "Dealer hand: BLACK JACK" + total;
        endGame();
    }    
        if(total <= 16){
            while(total <= 16) {
                if (total < 16) {
                    daddCard();                
                } else {
                    for (x in dealerHand) {
                        if (dealerHand[x].Value === 11) {
                            dealerHand[x].Value = 1;
                            daddCard();
                        }
                    }
                }
                total = calcTotal(dealerHand);
                if (total > 21){    
                    for (x in dealerHand) {
                        if (dealerHand[x].Value === 11) {
                            dealerHand[x].Value = 1;
                            total = calcTotal(dealerHand);
                        }
                    }
                }
            }                        
       }    
    if (total > 21) {
        document.getElementById("dHandHead").innerHTML = "Dealer hand: Dealer Busted!";        
    } else {
        document.getElementById("dHandHead").innerHTML = "Dealer hand total: " + total;
    }
    endGame();
}

//Calculate Total
function calcTotal(hand){
    let total =  0;
    for (x in hand) {
        total += hand[x].Value;     
    }
    return total;
}

//End game logic
function endGame() {
    let hit = document.getElementById("hit");
    hit.style.visibility = "hidden";
    let stay = document.getElementById("stay");
    stay.style.visibility = "hidden";
    
    let plength = playerHand.length - 1 ;
    let dlength = dealerHand.length - 1 ;  
    let message = document.getElementById("message");  
    
    let ptotal = calcTotal(playerHand);
    let dtotal = calcTotal(dealerHand);
    if (ptotal > 21) {
        message.innerHTML = "You Busted! You lose";
    } else if (dtotal > 21) {
        message.innerHTML = "Dealer Busted You win!";
    } else if (ptotal > dtotal) {
        message.innerHTML = "You win!";        
    } else if (dtotal > ptotal) {
        message.innerHTML = "Dealer wins!";
    } else {
        message.innerHTML = "Draw!";
    }
    playTime.style.visibility = "visible";
    playTime.addEventListener('click', removeCards);
    playTime.addEventListener('click', deal);
}

//Reset HTML, Decks and Hands
function removeCards() {    
    playTime.removeEventListener('click', removeCards);
    let premove = document.getElementById("phand");
    let dremove = document.getElementById("dlrHand");
    dealerHand = [];
    playerHand = [];
    deck = [];    

    while(premove.firstChild){
        premove.removeChild(premove.lastChild);     
    }
    while(dremove.firstChild){
        dremove.removeChild(dremove.lastChild);
    }
}