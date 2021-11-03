var cvs = document.getElementById("game");
var ctx = cvs.getContext("2d");
//звуки
var over = new Audio();
var kick = new Audio();
var win = new Audio();
over.src = "sound/over.mp3";
kick.src = "sound/kick.mp3";
win.src="sound/win.mp3"

//скорость платформы
var paddleSpeed=8;

//счет
var score=0;
//скорость мяча
var speedX=4;
var speedY=4;
//различный цвет блоков
function getRandomColor(){
	const random_color=Math.floor(Math.random()*16777215).toString(16);
	return '#'+random_color
}
//платформа
var platform={
	x:cvs.width/2-70,
	y:cvs.height-30,
	vx:0,
	width:120,
	height:15,
	color:"blue",
	 draw: function() {
    ctx.beginPath();
	ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y,this.width,this.height)
    ctx.closePath();
}
};

//мяч
var ball={
	x:cvs.width/2,
	y:cvs.height/2,
	radius: 10,
	color:"white",
	
	 draw: function() {
    ctx.beginPath();
	ctx.arc(this.x,this.y,this.radius,0, Math.PI * 2, true)
    ctx.closePath();
	ctx.fillStyle = this.color;
    ctx.fill();
}
};
//блоки
brickColumnCount=4;
brickRowCount=4;
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1,color:getRandomColor() };
    }
}
//рисование блоуов
function drawBricks() {
  {
    for(var c=0; c<brickColumnCount; c++) {
		
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(50+10))+80;
                var brickY = (r*(20+10))+50;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, 50, 20);
                ctx.fillStyle =bricks[c][r].color
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
}


//Столкновение платформы и мяча
function Collision(){
 if(ball.x > platform.x && ball.x < platform.x+platform.width && ball.y > platform.y && ball.y < platform.y+platform.height) {
speedY=-speedY
 ball.y+=speedY
 kick.play();
 }
}
 //Столкновение блоков и мяча
 function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(ball.x > b.x && ball.x < b.x+50 && ball.y > b.y && ball.y < b.y+20) {
					speedY=-speedY
                    ball.y+=speedY
					kick.play();
                    b.status = 0;
					score++;
					
				
					
					
					
					
					
		
					
                }
            }
        }
    }
}
			//отрисовка очков
function ScoreTable(){
		html=`${score}`;
		document.getElementById('message').innerHTML=html;
		
}
			
//управление платформой
document.addEventListener("keydown",function(e){
	if (e.key==="ArrowRight" ){
		
		platform.vx+=paddleSpeed;
		
	}
	if (e.key==="ArrowLeft"  ){
	
		platform.vx-=paddleSpeed;
		
	}
});
document.addEventListener('keyup', function (e) {
  // Если это стрелка лeво или право
  if (e.which === 37 || e.which === 39) {
    // останавливаем  платформу
    platform.vx = 0;
}})



//рисование на canvas
function draw(){
	ScoreTable();
	platform.x += platform.vx;
	//границы платформы
	if(platform.x<=0){
		platform.x=0;
	}else if(platform.x +platform.width>cvs.width){
		platform.x=cvs.width-platform.width;
	}
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,cvs.width,cvs.height);
	platform.draw();
	ball.draw();
	drawBricks();
	ball.x += speedX;
	ball.y += speedY;
	
//игра окончена
	if(ball.y>cvs.height){
		html=`Game Over`;
		document.getElementById('message').innerHTML=html;
		over.play();
		}
		//победа
	if (score==brickColumnCount*brickRowCount){
		html=`You Win`;
		document.getElementById('message').innerHTML=html;
		win.play();
		window.cancelAnimationFrame(raf);
	}
	
 
		//Границы мяча
	if (ball.x + speedX > cvs.width || ball.x + speedX < 0) 
	{
		speedX=-speedX
  ball.x +=speedX;
}
if ( ball.y + speedY < 0) 
	{
		speedY=-speedY
  ball.y +=speedY
  
}
//вызов проверки столкновения
	Collision();
	collisionDetection();
	
	
	
	
	
	
	var raf = requestAnimationFrame(draw);
}


window.onload=draw;