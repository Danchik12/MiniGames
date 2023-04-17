let timer = document.getElementById('timer')
let pin_container=document.getElementById('pin_code')
let buttons = document.getElementById('buttons')
let pinDigits =document.getElementsByClassName('code')
let text = document.getElementById('text')
let pin=''
let true_pin=''
function checkPin() {

for (let i=0 ; i<pin.length;i++){

    if (pin[i] === true_pin[i]) {

        pinDigits[i].style.backgroundColor='green'


    } else {
        pinDigits[i].style.backgroundColor='red'
    }


}
if (pin === true_pin){
    text.innerText='Бомба обезврежена!'
    clearInterval(countdown);
    timer.innerText='Вы успели';

}else {

    setTimeout(function(){
        for (let i=0;i<4;i++){
            pinDigits[i].innerText='0';
            pinDigits[i].style.backgroundColor='DimGrey';

        }
    },700)
    clearPin()
}





}
function updatePinDisplay() {
    // Отображение введенного ПИН-кода
    for (let i = 0; i < 4; i++) {
        if(pin[i]){
            pinDigits[i].innerText = pin[i]
        }

    }}
function clearPin() {


    // Сброс введенного ПИН-кода
    pin = "";

}
    class Pin_Table{
    constructor(i){
        this.code=document.createElement('div');
        this.code.classList.add('code');
        this.code.id=i;
        this.code.innerText='0';
        this.pincod = RandomPin();
    }
}
class Button{
    constructor(i) {
       this.button= document.createElement('button') ;
        this.button.classList.add('number_button');
        this.button.id=i;
        this.button.innerText=i;

        this.button.onclick=(event)=> {
            if (pin.length < 4) {

                let buttonValue = this.button.innerText;
                if (buttonValue) {
                    pin += buttonValue;
                    updatePinDisplay();
                }
            }
            if (pin.length === 4) {
                checkPin();
            }
        }}}

for (let i=1;i<=4;i++){
    let table = new Pin_Table(i);

    true_pin+=table.pincod

    pin_container.appendChild(table.code);
}   // добавление пин кода
for (let i=0;i<=9;i++){
    let button =new Button(i)
    buttons.appendChild(button.button);
}  //добавление кнопок


let deadTime = new Date(new Date().getTime() + (1*60*1000))
function RandomPin(){
    let pin = Math.floor(Math.random()*10)  //случайное число между 0 и 9 включая 0 и 9

        return pin


}
let countdown = setInterval(function(){
    let time=new Date().getTime()
    let count = deadTime - time;
    let minutes =Math.floor( (count % (1000 * 60 * 60)) / (1000 * 60) );
    let secundes = Math.floor( (count % (1000 * 60)) / 1000 );
    minutes = minutes < 10 ? "0" + minutes : minutes;
    secundes = secundes < 10 ? "0" + secundes : secundes;

    timer.innerHTML = minutes + ":" + secundes;

    if (count < 0) {
        clearInterval(countdown);
        text.innerText='Все погибли!'
        timer.innerText = "Вы не успели";
    }
}, 1000); //таймер на 1 минуту
