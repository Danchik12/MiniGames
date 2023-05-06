// поле
var origBoard;
//игроки
const einPlayer = 'X';

const twoPlayer = 'O';
//выигрышные комбинации
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]
//все фишки
let textField = document.getElementById('text')
const cells = document.querySelectorAll('.cell');
let player;
startGame();


//старт игры
function startGame() {
	document.querySelector(".endgame").style.display = "none";
	//вешаем события всем фишкам
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
		player=einPlayer;
		textField.innerText='Ходит  '+einPlayer;
	}
}

//функция по клику вызывается
function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		if (player == einPlayer){
			turn(square.target.id, einPlayer)
			textField.innerText='Ходит  '+twoPlayer;
			if (!checkWin(origBoard, einPlayer) && !checkTie()) player =twoPlayer ;

		}else {

			turn(square.target.id,twoPlayer)
			textField.innerText='Ходит  '+einPlayer;
			if (!checkWin(origBoard, twoPlayer) && !checkTie()) player=einPlayer;

		}


	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor ='blue'
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}

	declareWinner(gameWon.player == einPlayer ? "Победил Х" : "Победил О");
}
// пишется текст
function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}


//ничья
function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "Magenta";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Ничья")
		return true;
	}
	return false;
}



