let cvs = document.getElementById("game");
let ctx = cvs.getContext("2d");
//размер клетки
let grid = 20;
//кадры
let count =0;
//фон
let backgroundImg = new Image();
backgroundImg.src='img/background.jpg'
//звуки 
let ead=new Audio();
ead.src='sound/apple.mp3'

//счет
let score=0;

// змея
let snake = {
  // coordinates
  x: 160,
  y: 160,

  dx: grid,
  dy: 0,
  color:'yellow',
  
  cells: [],
  maxCells: 1
};
//еда
let appleImg = new Image();
appleImg.src='img/apple.png'
let trophyImg  = new Image();
trophyImg.src ='img/trophy.png';
let apple = {

  x: 320,
  y: 320
};

//для еды
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function drawScore(highscore){
    ctx.font = "24px Verdana";
    ctx.fillStyle = 'white';
    ctx.drawImage(appleImg,60,3)
    ctx.fillText(score,88,25)
    ctx.drawImage(trophyImg,265,5)
    ctx.fillText(highscore,295,25)
}



//берем рекорд из локального хранилища
function getHighscore(){
    //берем highscore
    let highscore =localStorage.getItem('highscore');
    //если такой записи не было
    if (highscore === null){
        //присваиваим highscore 0
        highscore=0;
        //добавляем запись
        localStorage.setItem("highscore", highscore)
        //возвращаем значение
        return highscore
        //если была
    }else{
        //просто возвращаем значение
        return highscore
    }
}




//ложим рекорд в локальное хранилище
function setHighscore(score,highscore){

    if (score>highscore){

        highscore=score;
        localStorage.setItem("highscore", highscore);
    }
}
//рестарт
function restart(){
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 1;
    snake.dx = grid;
    snake.dy = 0;
    apple.x = getRandomInt(2, 23) * grid;
    apple.y = getRandomInt(2, 23) * grid;
    score=0;
    count=0;
}



//главный цикл игры
function game() {
	
  requestAnimationFrame(game);
	

  //пропускаем каждый n кадр и чтобы уменьшить скорость игры и увеличивать за съеденые яблоки


  if (++count <5 ) {
    return;
  }

  count = 0;
 
  ctx.clearRect(0, 0,cvs.width, cvs.height);
  ctx.drawImage(backgroundImg,40,40,600,600);
  let highscore=getHighscore();
  drawScore(highscore);

  snake.x += snake.dx;
  snake.y += snake.dy;
  
 //Врезание в границу
  if (snake.x < 40 || snake.x >= cvs.width || snake.y <40 || snake.y >= cvs.height) {
	  //если счет больше рекорда ложим в higscore
		setHighscore(score,highscore)
        restart();
  
  
  }
  //ползание змеи
  snake.cells.unshift({ x: snake.x, y: snake.y });
  
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
  //рисование яблока
ctx.drawImage(appleImg,apple.x,apple.y,grid-1,grid-1)

  //движение змеи
  
  ctx.fillStyle = snake.color;
  snake.cells.forEach(function (cell, index) {
	 
    
    ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
    //поедания яблока
    if (cell.x === apple.x && cell.y === apple.y) {
	  ead.play()
	  score++;
      snake.maxCells++;


	  
	  
      
      apple.x = getRandomInt(2,23) * grid;
      apple.y = getRandomInt(2,23) * grid;
    }
    //если змея врезалась в себя
    for (let i = index + 1; i < snake.cells.length; i++) {
     
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {

        
		setHighscore(score,highscore);
          //если счет больше рекорда ложим в higscore
        restart();
      }
    }
  });
}
//управление змеей
document.addEventListener('keydown', function (e) {
  
  if (e.code === 'ArrowLeft' || e.code === 'KeyA'  && snake.dx === 0) {
    
    snake.dx = -grid;
    snake.dy = 0;
  }
  
  else if (e.code === 'ArrowUp' || e.code === 'KeyW' && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  
  else if (e.code === 'ArrowRight' || e.code === 'KeyD' && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
 
  else if (e.code === 'ArrowDown' || e.code === 'KeyS' && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});


//вызов игры
requestAnimationFrame(game);


