let cvs = document.getElementById('game')
cvs.width=500;
cvs.height=1000;
let cxt =cvs.getContext('2d')
let canvas = document.getElementById('next-piece')
canvas.width=400;
canvas.height=400;
let context = canvas.getContext('2d')
let grid=50 //размер клетки
let ScoreEl = document.getElementById('score')
let RowsEl = document.getElementById('rows')
let score =0;
let rows = 0;
let level = 1;


// цвет каждой фигуры
const colors = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
};
let paused = false;
//матрицы фигуры и названия
const tetrominoes = {

    'I' :[
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0]
    ],
    'L': [
        [0,0,1],
        [1,1,1],
        [0,0,0]
    ],
    'O':  [
        [1,1],
        [1,1]
    ],
    'S': [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    'T': [
        [0,1,0],
        [1,1,1],
        [0,0,0]
    ],
    'Z': [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ]}
;
//массив с последовательностью фигурок
let TetroSequence =[];
const playfield =[]; //размер поля 10 на 20
// заполняем  пустыми квадратами
for (let row = -2; row < 20; row++) {
    playfield[row] = [];

    for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0;
    }
}
const ui_field =[]
for (let row = 0; row < 8; row++) {
    ui_field[row] = [];

    for (let col = 0; col < 8; col++) {
        ui_field[row][col] = 0;
    }
}
//текущая фигурка и следующая фигура
let tetrominos =getNextTetromino();
let next_tetromino=tetrominos[0];
let tetromino = tetrominos[1];

//скорость кадров
let count=0;
//анимация
let rAF = null;
//флаг конца игры
let gameOver = false;



function UpdateInfo(){
    ScoreEl.innerText='Счет: '+score;
    RowsEl.innerText='Ряды: '+rows;
}
// получить случайное целое значение в заданном диапазоне
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}



// создаём последовательность фигур, которая появится в игре
function generateSequence() {
    // тут — сами фигуры
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

    while (sequence.length) {
        // случайным образом находим любую из них
        const rand = getRandomInt(0, sequence.length - 1);
        const name = sequence.splice(rand, 1)[0];
        // помещаем выбранную фигуру в игровой массив с последовательностями
        TetroSequence.push(name);
    }
}
// получаем следующую фигуру
function getNextTetromino() {

    if (TetroSequence.length <= 2 ) {
        generateSequence();
    }

    // берём первую фигуру из массива
    const name = TetroSequence.shift();
    // сразу создаём матрицу, с которой мы отрисуем фигуру
    const matrix = tetrominoes[name];

    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    // I начинает с 21 строки (смещение -1), а все остальные — со строки 22 (смещение -2)

    // I начинает с 21 строки (смещение -1), а все остальные — со строки 22 (смещение -2)
    const row = name === 'I' ? -1 : -2;
    //следующая фигура

    const next_name=TetroSequence[0];
    const next_matrix=tetrominoes[next_name];
    const next_col=ui_field[0].length/2- Math.ceil(next_matrix[0].length / 2)
    const next_row =3;
    // вот что возвращает функция
    return[{
        name: next_name,      // название фигуры (L, O, и т.д.)
        matrix: next_matrix,  // матрица с фигурой
        row: next_row,        // текущая строка (фигуры стартуют за видимой областью холста)
        col: next_col
    }, {
        name: name,      // название фигуры (L, O, и т.д.)
        matrix: matrix,  // матрица с фигурой
        row: row,        // текущая строка (фигуры стартуют за видимой областью холста)
        col: col         // текущий столбец
    }];
}

// поворачиваем матрицу на 90 градусов
function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );
    // на входе матрица, и на выходе тоже отдаём матрицу
    return result;
}

// проверяем после появления или вращения, может ли матрица (фигура) быть в этом месте поля или она вылезет за его границы
function isValidMove(matrix, cellRow, cellCol) {
    // проверяем все строки и столбцы
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] && (
                // если выходит за границы поля…
                cellCol + col < 0 ||
                cellCol + col >= playfield[0].length ||
                cellRow + row >= playfield.length ||
                // …или пересекается с другими фигурами
                playfield[cellRow + row][cellCol + col])
            ) {
                // то возвращаем, что нет, так не пойдёт
                return false;
            }
        }
    }
    // а если мы дошли до этого момента и не закончили раньше — то всё в порядке
    return true;
}
// когда фигура окончательна встала на своё место
function placeTetromino() {
    // обрабатываем все строки и столбцы в игровом поле
    for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {

                // если край фигуры после установки вылезает за границы поля, то игра закончилась
                if (tetromino.row + row < 0) {
                    return showGameOver();
                }

                // если всё в порядке, то записываем в массив игрового поля нашу фигуру
                playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
                score+=2.5;
            }
        }
    }

    // проверяем, чтобы заполненные ряды очистились снизу вверх
    for (let row = playfield.length - 1; row >= 0; ) {
        // если ряд заполнен
        if (playfield[row].every(cell => !!cell)) {
            score+=100;
            rows+=1;
            level = Math.floor(rows/5)+1
            // очищаем его и опускаем всё вниз на одну клетку
            for (let r = row; r >= 0; r--) {
                for (let c = 0; c < playfield[r].length; c++) {
                    playfield[r][c] = playfield[r-1][c];
                }
            }
        }
        else {
            // переходим к следующему ряду
            row--;
        }
    }
    // получаем следующую фигуру
     tetrominos =getNextTetromino();
     next_tetromino=tetrominos[0];
     tetromino = tetrominos[1];
    UpdateInfo();
}
//показывает надпись Pause
function showPause(){
    cxt.fillStyle = 'black';
    cxt.globalAlpha = 0.75;
    cxt.fillRect(0, cvs.height / 2 - 30, cvs.width, 60);
    // пишем надпись белым моноширинным шрифтом по центру
    cxt.globalAlpha = 1;
    cxt.fillStyle = 'white';
    cxt.font = '36px cursive';
    cxt.textAlign = 'center';
    cxt.textBaseline = 'middle';
    cxt.fillText('PAUSE', cvs.width / 2, cvs.height / 2);
}
// показываем надпись Game Over
function showGameOver() {
    // прекращаем всю анимацию игры
    cancelAnimationFrame(rAF);
    // ставим флаг окончания
    gameOver = true;


    // рисуем чёрный прямоугольник посередине поля
    cxt.fillStyle = 'black';
    cxt.globalAlpha = 0.75;
    cxt.fillRect(0, cvs.height / 2 - 30, cvs.width, 60);
    // пишем надпись белым моноширинным шрифтом по центру
    cxt.globalAlpha = 1;
    cxt.fillStyle = 'white';
    cxt.font = '36px cursive';
    cxt.textAlign = 'center';
    cxt.textBaseline = 'middle';
    cxt.fillText('GAME OVER!', cvs.width / 2, cvs.height / 2);
}



// следим за нажатиями на клавиши
document.addEventListener('keydown', event => {
    if (event.key === ' ' || event.key === 'Spacebar') {
        paused = !paused;
    }

});
document.addEventListener('keydown', function(e) {
    // если игра закончилась — сразу выходим
    if (gameOver) return;

    // стрелки влево и вправо
    if (e.key === 'ArrowLeft' && !paused || e.key === 'ArrowRight' && !paused) {
        const col = e.key === 'ArrowLeft'
            // если влево, то уменьшаем индекс в столбце, если вправо — увеличиваем
            ? tetromino.col - 1
            : tetromino.col + 1;

        // если так ходить можно, то запоминаем текущее положение
        if (isValidMove(tetromino.matrix, tetromino.row, col)) {
            tetromino.col = col;
        }
    }

    // стрелка вверх — поворот
    if (e.key === 'ArrowUp' && !paused) {
        // поворачиваем фигуру на 90 градусов
        const matrix = rotate(tetromino.matrix);
        // если так ходить можно — запоминаем
        if (isValidMove(matrix, tetromino.row, tetromino.col)) {
            tetromino.matrix = matrix;
        }
    }

    // стрелка вниз — ускорить падение
    if(e.key === 'ArrowDown' && !paused) {
        // смещаем фигуру на строку вниз
        const row = tetromino.row + 1;
        // если опускаться больше некуда — запоминаем новое положение
        if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
            tetromino.row = row - 1;
            // ставим на место и смотрим на заполненные ряды
            placeTetromino();
            return;
        }
        // запоминаем строку, куда стала фигура
        tetromino.row = row;
    }
});

// главный цикл игры
function loop() {
    // начинаем анимацию
    rAF = requestAnimationFrame(loop);

    // очищаем холст
    cxt.clearRect(0,0,cvs.width,cvs.height);
    context.clearRect(0,0,canvas.width,canvas.height)
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (ui_field[row][col]) {
                const name = ui_field[row][col];
                context.fillStyle = colors[name];

                // рисуем всё на один пиксель меньше, чтобы получился эффект «в клетку»
                context.fillRect(col * grid, row * grid, grid-1, grid-1);
            }
        }
    }
    if (next_tetromino) {


        context.fillStyle = colors[next_tetromino.name];

        // отрисовываем её
        for (let row = 0; row < next_tetromino.matrix.length; row++) {
            for (let col = 0; col < next_tetromino.matrix[row].length; col++) {
                if (next_tetromino.matrix[row][col]) {

                    // и снова рисуем на один пиксель меньше
                    context.fillRect((next_tetromino.col + col) * grid, (next_tetromino.row + row) * grid, grid - 1, grid - 1);
                }
            }
        }
    }
    // рисуем игровое поле с учётом заполненных фигур
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            if (playfield[row][col]) {
                const name = playfield[row][col];
                cxt.fillStyle = colors[name];

                // рисуем всё на один пиксель меньше, чтобы получился эффект «в клетку»
                cxt.fillRect(col * grid, row * grid, grid-1, grid-1);
            }
        }
    }

    // рисуем текущую фигуру
    if (tetromino) {
if (!paused) {
//каждый 20 кадр опускаем фигуру на 1 клетку ниже
    if (++count > 36) {
        tetromino.row++;
        count = 0


        // если движение закончилось — рисуем фигуру в поле и проверяем, можно ли удалить строки
        if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
            tetromino.row--;
            placeTetromino();
        }

    }
}else{
    showPause()
}

        // не забываем про цвет текущей фигуры
        cxt.fillStyle = colors[tetromino.name];

        // отрисовываем её
        for (let row = 0; row < tetromino.matrix.length; row++) {
            for (let col = 0; col < tetromino.matrix[row].length; col++) {
                if (tetromino.matrix[row][col]) {

                    // и снова рисуем на один пиксель меньше
                    cxt.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid - 1, grid - 1);
                }
            }
        }

    }
}
//запускаем игру
rAF = requestAnimationFrame(loop);

