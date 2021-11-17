//передаем холст и размер пятнашки 
function Game(context, cellSize){
	//начальное состояние
  this.state = [
    [1,2,3,4],
    [5,6,7,8],
    [9,10,11,12],
    [13,14,15,0]
  ];
  //генерация рандомных светлых цветов чтобы красивее было
function generateLightColorHex() {
  let color = "#";
  for (let i = 0; i < 3; i++)
    color += ("0" + Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)).slice(-2);
  return color;
}
//цвет заливки пятнашек
  this.color = generateLightColorHex();
//наш холст
  this.context = context;
  //размер пятнашки
  this.cellSize = cellSize;
//количество кликов за которые прощел игру
  this.clicks = 0;
}

//получает координаты и рисует в них квадрат пятнашки заданного размера и цвета.
Game.prototype.cellView = function(x, y) {
  this.context.fillStyle = this.color;
  this.context.fillRect(
    x + 1, 
    y + 1, 
    this.cellSize - 2, 
    this.cellSize - 2
  );
};
//стили текста для пятнашек
Game.prototype.numView = function() {
  this.context.font = "bold " + (this.cellSize/2) + "px Sans";
  this.context.textAlign = "center";
  this.context.textBaseline = "middle";
  this.context.fillStyle = "#222";
};
//отрисовка всей игры
Game.prototype.draw = function() {
	//двойной цикл
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (this.state[i][j] > 0) {
        this.cellView(
          j * this.cellSize, 
          i * this.cellSize
        );
		//всем элементам даем стили текста 
        this.numView();
        this.context.fillText(
          this.state[i][j], 
          j * this.cellSize + this.cellSize / 2,
          i * this.cellSize + this.cellSize / 2
        );
      }
    }
  }
};
//При клике на пятнашку будет вызван метод move, который должен переместить ее на пустую клетку.
//Вспомогательный метод getNullCell возвращает позицию пустой клетки на поле.
Game.prototype.getNullCell = function(){
  for (let i = 0; i<4; i++){
    for (let j=0; j<4; j++){
		//если по i и j позицию равна 0  то возвращаем  эту позицию
      if(this.state[j][i] === 0){
        return {x: i, y: j};
      }
    }
  }
};

Game.prototype.move = function(x, y) {
	//получаем нулувую или пустую клетку
  let nullCell = this.getNullCell();
  let canMoveVertical = (x - 1 == nullCell.x || x + 1 == nullCell.x) && y == nullCell.y;
  let canMoveHorizontal = (y - 1 == nullCell.y || y + 1 == nullCell.y) && x == nullCell.x;

  if (canMoveVertical || canMoveHorizontal) {
    this.state[nullCell.y][nullCell.x] = this.state[y][x];
    this.state[y][x] = 0;
    this.clicks++;
  }
};
//Метод victory проверяет, сложены ли пятнашки правильно:
Game.prototype.victory = function() {
	//начальная комбинация
  let combination = [[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,0]];
  let res = true;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
		//проверка по i и j
      if (combination[i][j] != this.state[i][j]) {
        res = false;
        break;
      }
    }
  }
  return res;
};
//Метод mix перемешивает пятнашки заданное количество раз. 
//Он случайным образом выбирает клетку рядом с пустой и меняет их местами.
// Для выбора клетки используется вспомогательная функция getRandomBool.
function getRandomBool() {
  if (Math.floor(Math.random() * 2) === 0) {
    return true;
  }
}

Game.prototype.mix = function(count) {
  let x, y;
  for (let i = 0; i < count; i++) {
    let nullCell = this.getNullCell();

    let verticalMove = getRandomBool();
    let upLeft = getRandomBool();

    if (verticalMove) {
      x = nullCell.x; 
      if (upLeft) {
        y = nullCell.y - 1;
      } else {
        y = nullCell.y + 1;
      }
    } else {
      y = nullCell.y; 
      if (upLeft) {
        x = nullCell.x - 1;
      } else {
        x = nullCell.x + 1;
      }
    }

    if (0 <= x && x <= 3 && 0 <= y && y <= 3) {
      this.move(x, y);
    }
  }

  this.clicks = 0;
};
window.onload = function(){
  let ui=document.getElementById('ui')
  
  let canvas = document.getElementById("game");
  canvas.width  = 400;
  canvas.height = 400;

  let context = canvas.getContext("2d");
  context.fillRect(0, 0, canvas.width, canvas.height);

  let cellSize = canvas.width / 4;

  let game = new Game(context, cellSize);
  game.mix(500);
  game.draw();
  
  html=` Сделано ${game.clicks}  кликов `;
  ui.innerHTML=html;
//обработка кликов
canvas.onclick = function(e) {
  let x = (e.pageX - canvas.offsetLeft) / cellSize | 0;
  let y = (e.pageY - canvas.offsetTop)  / cellSize | 0;
  onEvent(x, y); 
};

canvas.ontouchend = function(e) {
  let x = (e.touches[0].pageX - canvas.offsetLeft) / cellSize | 0;
  let y = (e.touches[0].pageY - canvas.offsetTop)  / cellSize | 0;

  onEvent(x, y);
};  
//при клике двигаем пятнашку 
//перерисовываем игру
//получаем новое значение переменной clicks
function onEvent(x, y) { 
  game.move(x, y);
  context.fillRect(0, 0, canvas.width, canvas.height);
  game.draw();
  html=` Сделано ${game.clicks}  кликов `;
  ui.innerHTML=html;
  //при победе
  //получаем сообщение о победе 
  //начинаем игру заново
  if (game.victory()) {
    alert("Сделано за "+game.clicks+' кликов')
	
    game.mix(500);
    context.fillRect(0, 0, canvas.width, canvas.height);
    game.draw(context, cellSize);
	html=` Сделано ${game.clicks}  кликов `;
	ui.innerHTML=html;
  }
}
}

