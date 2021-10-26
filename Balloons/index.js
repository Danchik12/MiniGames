var cvs = document.getElementById("game");
var ctx = cvs.getContext("2d");
//for speed
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
//for coordinates
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}

//score 
var score=0;

//enemy
var balloon=new Image();
balloon.src='img/balloon.png';
//Position balloon

var xPos=getRandomInt(69,734); //for 69 to 734 int
var yPos=getRandomInt(584,653);//for 584 to 653 int
//Speed
var speed=getRandomFloat(1,3);//for 1 to 3  float
enemy_count=4;
enemys=[]

enemys[0]={
	x:xPos,
	y:yPos,
	vy:speed
};

	




//bullets
//magazin
var magazin=6;
var bullet=new Image();
bullet.src="img/stone.png"

//background
var bg=new Image();
bg.src="img/background.png"





//sound
var recharging = new Audio();
recharging.src="audio/poisk.mp3"
var dead=new Audio();
dead.src="audio/kick.mp3";
var pusto=new Audio();
pusto.src="audio/pusto.mp3";





//balloon click
function onClick(e) {               
                for (d=0;d<enemys.length;d++) {
                    if ((e.offsetX>=enemys[d].x)&&(e.offsetX<=enemys[d].x+balloon.width)&&
                        (e.offsetY>=enemys[d].y)&&(e.offsetY<=enemys[d].y+balloon.height)) {
                            score++;
							
							enemys.splice(d,1);
							
							 }
                }   
            }
document.addEventListener("keydown",function(e){
	if (e.code==="KeyR"){
	recharging.play();
	magazin=6;
	}
});

document.addEventListener("click",function(e){
	if(magazin!=0){
	dead.play();
	magazin=magazin-1;
	onClick(e);
	
	
		
		
	}else{
		pusto.play();
		
	}
});



function draw(){
	ctx.drawImage(bg, 0, 0);
	for (var k=0;k<enemys.length;k++){
		ctx.drawImage(balloon,enemys[k].x,enemys[k].y);
		enemys[k].y-=enemys[k].vy;
		if (enemys[k].y < 512 ){
				if (enemys.length<enemy_count){
			enemys.push({
 x : getRandomInt(69,734),
 y :getRandomInt(584,653),
 vy:getRandomFloat(1,3)
 
				});}
				
			
			}
			if(enemys[k].y<-80){
				enemys.splice(k,1);
			}
			
	}
	
	x=350
	y=448
	for (var i=0;i<magazin;i++){
	ctx.drawImage(bullet,x,y);
	x-=64;
	
	}


	 
	 
	 
	 ctx.font = "24px Verdana";
	ctx.fillText("Счет: " + score, cvs.width/2,0 + 40);
	
	requestAnimationFrame(draw);
}
window.onload=draw;