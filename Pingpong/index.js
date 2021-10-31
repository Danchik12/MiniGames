var cvs = document.getElementById("game");
var ctx = cvs.getContext("2d");
var paddleSpeed=7;
var computer={
	x:10,
	y:cvs.height/2-60,
	score:0,
	//увеличить чтобы сделать сложнее
	complexity:0.1,
	color:'white',
	width:10,
	height:140,
	draw: function() {
    ctx.beginPath();
	ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y,this.width,this.height)
    ctx.closePath();
	
	},
	scoreTable:function(){
		ctx.font = "24px Verdana";
		ctx.fillStyle = 'white';
		ctx.fillText(this.score,0+40,0+30)}
	
};
var player={
	x:cvs.width-20,
	y:cvs.height/2-60,
	score:0,
	color:'white',
	dy:0,
	width:10,
	height:140,
	draw: function() {
    ctx.beginPath();
	ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y,this.width,this.height)
    ctx.closePath();
	}
	,
	scoreTable:function(){
		ctx.font = "24px Verdana";
		ctx.fillStyle = 'white';
		ctx.fillText(this.score,cvs.width-50,0+30)}
	
};
var ball={
	
	x:cvs.width/2,
	y:cvs.height/2,
	radius: 10,
	vx:5,
	vy:5,
	color:"white",
	resetting:false,
	draw: function() {
    ctx.beginPath();
	ctx.arc(this.x,this.y,this.radius,0, Math.PI * 2, true)
    ctx.closePath();
	ctx.fillStyle = this.color;
    ctx.fill();
}
};

document.addEventListener("keydown",function(e){
	if (e.code ==="ArrowUp"){
		player.dy=-paddleSpeed;
		
		
	}
	if (e.code ==="ArrowDown" ){
		player.dy=paddleSpeed;
		
		}

		
})
document.addEventListener('keyup', function (e) {
  // Если это стрелка вверх или вниз,
  if (e.which === 38 || e.which === 40) {
    // останавливаем правую платформу
    player.dy = 0;
}})


function collides(obj1, obj2) {
  return obj1.x > obj2.x && obj1.x < obj2.x+obj2.width && obj1.y > obj2.y 
  && obj1.y < obj2.y+obj2.height;
}

//Рисование объектов
function draw(){
 computer.draw();
 player.draw();
 computer.scoreTable();
 player.scoreTable();
 ball.draw();
}

function render(){
 ctx.beginPath ();
 ctx.setLineDash ([5,7]);
 ctx.moveTo (cvs.width/2,0);
 ctx.lineTo (cvs.width/2,cvs.height);
 ctx.closePath ();
 ctx.strokeStyle = 'white';
 ctx.stroke ();
 draw();

}
//Обновление
function update(){
	player.y += player.dy;
	//гранцицы платформы игрока
	if(player.y<0){
		player.y=0;
	}else if(player.y +player.height>cvs.height){
		player.y=cvs.height-player.height;
	}
	//если мяч забит 
	if (ball.x < 0  && !ball.resetting) {
        // Помечаем, что мяч перезапущен, чтобы не зациклиться
        ball.resetting = true;
        // Даём 2 секунды на подготовку игрокам
        setTimeout(() => {
          // Всё, мяч в игре
          ball.resetting = false;
          // Снова запускаем его из центра
          ball.x = cvs.width / 2;
          ball.y = cvs.height / 2;
		  player.score++;
        }, 2000);
      }
	  //То же самое для компьютера
	  if (ball.x > cvs.width  && !ball.resetting) {
        // Помечаем, что мяч перезапущен, чтобы не зациклиться
        ball.resetting = true;
        // Даём 2 секунды на подготовку игрокам
        setTimeout(() => {
          // Всё, мяч в игре
          ball.resetting = false;
          // Снова запускаем его из центра
          ball.x = cvs.width / 2;
          ball.y = cvs.height / 2;
		  computer.score++;
        }, 2000);
      }
	//платформа движется как мяч 
computer.y += ((ball.y - (computer.y + computer.height / 2))) * computer.complexity;


	//границы мяча
	if (ball.y<=0 || ball.y+ball.radius>=cvs.height){
		ball.vy*=-1
		ball.y+=ball.vy;
	}
	//отбивание мяча
	if(collides(ball,player)){
		
		ball.vx*=-1;
		ball.x+=ball.vx;
		ball.x = player.x;
	}
	//то же самое для компьютера
	if(collides(ball,computer)){
		
		ball.vx*=-1;
		ball.x+=ball.vx;
		ball.x = computer.x + computer.width;
	}
	//выпадения мяча
	if (computer.score>player.score){
		ball.x-=ball.vx;
		ball.y+=ball.vy;
		 
		}else if(computer.score<player.score){
		ball.x+=ball.vx;
		ball.y+=ball.vy;
		
	}else if (computer.score==0 && player.score ==0){
		ball.x+=ball.vx;
		ball.y+=ball.vy;
	}
	
}


//Главный цикл игры
function loop(){
ctx.clearRect(0, 0, cvs.width, cvs.height)
render();
update();
	
requestAnimationFrame(loop)
}
window.onload=loop()