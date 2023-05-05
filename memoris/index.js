const cards = document.querySelectorAll('.card')
let hasFliped =false;
let lockBoard = false;
let firstCard,secondCard;
console.log(cards)
function flipCard(){
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');
    if (!hasFliped){
        hasFliped=true;
        firstCard=this;
        return;
    }
    else{
        hasFliped=false;
        secondCard=this;
        checkMatch();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        lockBoard=false;
        resetBoard();
        }, 1000);
}
function checkMatch(){
    if (firstCard.dataset.card === secondCard.dataset.card){
        disableCards()
        return;
    }
    unflipCards()
}
(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
})();

cards.forEach(card => card.addEventListener('click',flipCard));
