var cvs = document.getElementById("game");
var ctx = cvs.getContext("2d");

var grid = 16;
// cadres speed
var count = 0;

//score
var score=0;
function getRandomColor(){
	const random_color=Math.floor(Math.random()*16777215).toString(16);
	return '#'+random_color
}
// snake
var snake = {
  // coordinates
  x: 160,
  y: 160,
  // 
  dx: grid,
  dy: 0,
  color:getRandomColor(),
  
  cells: [],
  //start length snake
  maxCells: 1
};
//apples
var apple = {

  x: 320,
  y: 320
};
//for apples
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function loop() {
  
  requestAnimationFrame(loop);
  
  if (++count < 4) {
    return;
  }
  
  count = 0;
 
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.font = "24px Verdana";
  ctx.fillStyle = 'white';
  ctx.fillText(score,0+10,0+25)
  
  snake.x += snake.dx;
  snake.y += snake.dy;
 //Врезание в границу
  if (snake.x < 0 || snake.x >= cvs.width || snake.y < 0 || snake.y >= cvs.height) {
    
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 1;
        snake.dx = grid;
        snake.dy = 0;
		snake.color=getRandomColor();
       
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
		score=0;
  
  
  }
  
  snake.cells.unshift({ x: snake.x, y: snake.y });
  
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
  //рисование яблока
  ctx.fillStyle = 'red';
  ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);
  //рисование всей змеи
  
  
  snake.cells.forEach(function (cell, index) {
	 ctx.fillStyle = snake.color;
    
    ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
    //поедания яблока
    if (cell.x === apple.x && cell.y === apple.y) {
    
	  score++;
      snake.maxCells++;
	  snake.color=getRandomColor();
	  
      
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }
    //если змея врезалась в себя
    for (var i = index + 1; i < snake.cells.length; i++) {
     
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 1;
        snake.dx = grid;
        snake.dy = 0;
		snake.color=getRandomColor();
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
		score=0;
      }
    }
  });
}
//управление змеей
document.addEventListener('keydown', function (e) {
  
  if (e.which === 37 && snake.dx === 0) {
    
    snake.dx = -grid;
    snake.dy = 0;
  }
  
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
 
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});
requestAnimationFrame(loop);

