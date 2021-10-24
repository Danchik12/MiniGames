var cvs = document.getElementById("game");
var ctx = cvs.getContext("2d");
//sound
var over = new Audio();
var kick = new Audio();
var win = new Audio();

over.src = "sound/over.mp3";
kick.src = "sound/kick.mp3";
win.src="sound/win.mp3"
//score
var score=0;
//platform
var platform={
	x:cvs.width/2-70,
	y:cvs.height-30,
	vx:45,
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
//ball
var ball={
	x:cvs.width/2,
	y:cvs.height/2,
	radius: 10,
	vx:4,
	vy:4,
	color:"white",
	
	 draw: function() {
    ctx.beginPath();
	ctx.arc(this.x,this.y,this.radius,0, Math.PI * 2, true)
    ctx.closePath();
	ctx.fillStyle = this.color;
    ctx.fill();
}
};
//block
brickColumnCount=4;
brickRowCount=4;
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
function drawBricks() {
  {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(50+10))+50;
                var brickY = (r*(20+10))+20;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, 50, 20);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
}


//Collisions platform and Ball
function Collision(){
 if(ball.x > platform.x && ball.x < platform.x+platform.width && ball.y > platform.y && ball.y < platform.y+platform.height) {
 ball.vy=-ball.vy
 kick.play();};
}
 //Collisions bricks and ball
 function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(ball.x > b.x && ball.x < b.x+50 && ball.y > b.y && ball.y < b.y+20) {
                    ball.vy = -ball.vy;
					kick.play();
                    b.status = 0;
					score++;
					//Win
					if (score==brickColumnCount*brickRowCount){
						html=`You Win`;
		document.getElementById('message').innerHTML=html;
		win.play();
		window.cancelAnimationFrame(raf);
		
					}
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
		
		platform.x+=platform.vx;
		
	}
	if (e.key==="ArrowLeft" ){
	
		platform.x-=platform.vx;
		
	}
});



//рисование на canvas
function draw(){
	ScoreTable();
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,cvs.width,cvs.height);
	platform.draw();
	ball.draw();
	drawBricks();
	ball.x += ball.vx;
	ball.y += ball.vy;
	if ( ball.y + ball.vy < 0) 
	{
  ball.vy = -ball.vy;
  kick.play();
}
//game over
	if(ball.y>cvs.height){
		html=`Game Over`;
		document.getElementById('message').innerHTML=html;
		over.play();
		window.cancelAnimationFrame(raf);
		}
	

		//Границы
	if (ball.x + ball.vx > cvs.width || ball.x + ball.vx < 0) 
	{
  ball.vx = -ball.vx;
}

	//вызов проверки столкновения
	Collision();
	collisionDetection();
	
	
	
	
	
	var raf = requestAnimationFrame(draw);
}

window.onload=draw;
