const dino=document.getElementById("dino");
const cactus=document.getElementById("cactus");

let i=0;
setInterval(function(){
	
	i++;
	html=`${i}`;
	document.getElementById("score").innerHTML=html;
	
},100);


document.addEventListener("keydown",function(event){
	if (event.code=="KeyW"){
		if(dino.classList !="jump"){
		dino.classList.add("jump");
		}
		
		setTimeout(function(){
			dino.classList.remove("jump")
		},300)
	}
})

let isAlive=setInterval(function(){
	let DinoTop=parseInt(window.getComputedStyle(dino).getPropertyValue("top"))
	let CactusLeft=parseInt(window.getComputedStyle(cactus).getPropertyValue("left"))
	
	if(CactusLeft<40 && CactusLeft>0 && DinoTop >=150){
		alert("Game Over")
		location.reload();
	}
},100)