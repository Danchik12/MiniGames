var cvs = document.getElementById("game");
var ctx = cvs.getContext("2d");

var bird=new Image();
var bg=new Image();
var fg=new Image();
var pipeUp=new Image();
var pipeBottom=new Image();

var gap =110;
//audio
var fly = new Audio();
var score_audio = new Audio();

fly.src = "sound/fly.mp3";
score_audio.src = "sound/score.mp3";

bird.src='images/bird.png';
bg.src='images/bg.png';
fg.src='images/fg.png';
pipeUp.src='images/pipeUp.png';
pipeBottom.src='images/pipeBottom.png';
//Button clicked
document.addEventListener("keydown",function(e){
	if(e.key==="ArrowUp"){
	yPos-=35;
	fly.play();
	}
});


//score
var score = 0;
//block created
var pipe=[]
pipe[0]={
	x:cvs.width,
	y:0
}
//Position bird

var xPos=15;
var yPos=150;
//Gravitation
var grav=2;


function draw() {
 ctx.drawImage(bg, 0, 0);

 for(var i = 0; i < pipe.length; i++) {
 ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
 ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);

 pipe[i].x--;

 if(pipe[i].x == 120) {
 pipe.push({
 x : cvs.width,
 y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height
 });
 }

 
 if(xPos + bird.width >= pipe[i].x
 && xPos <= pipe[i].x + pipeUp.width
 && (yPos <= pipe[i].y + pipeUp.height
 || yPos + bird.height >= pipe[i].y + pipeUp.height + gap) || yPos + bird.height >= cvs.height - fg.height) {
 location.reload(); 
 }

 if(pipe[i].x == 5) {
 score++;
 score_audio.play();
 }
 }
 
	ctx.drawImage(fg,0,cvs.height-fg.height);
	ctx.drawImage(bird,xPos,yPos);
	yPos +=grav;
	
	ctx.fillStyle = "#000";
 ctx.font = "24px Verdana";
 ctx.fillText("Счет: " + score, 10, cvs.height - 20);

	requestAnimationFrame(draw);
}

pipeBottom.onload=draw;