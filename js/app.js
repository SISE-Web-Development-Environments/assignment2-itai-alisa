var context;
var shape = new Object();
var ghosts = new Array();
var board;
var score;
var direction;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var canvas_height = 20;
var canvas_width = 25;
var walls_board;

let food_remain = 90;
let max_food = 90;
let min_food = 50;

let monsters_remain = 1;
let max_monsters = 4;
let min_monsters = 1;

let game_time = 60;
let min_time = 60;
let max_time = 300;

let fiveColor = "#eff542";
let tenColor = "#42a4f5";
let fifteenColor = "#f542cb";

let KeyboardHelper = {left: 37, up: 38, right: 39, down: 40};
let KeyBoardValues = {left: 'ArrowLeft', up: 'ArrowUp', right: 'ArrowRight', down: 'ArrowDown'};

const UP_DIRECTION = 1;
const DOWN_DIRECTION = 2;
const LEFT_DIRECTION = 3;
const RIGHT_DIRECTION = 4;


function randomSettings() {
    // ==== Keyboard Default
    KeyboardHelper.down = 40;
    KeyboardHelper.right = 39;
    KeyboardHelper.up = 38;
    KeyboardHelper.left = 37;

    KeyBoardValues.down = 'ArrowDown';
    KeyBoardValues.right = 'ArrowRight';
    KeyBoardValues.up = 'ArrowUp';
    KeyBoardValues.lect = 'ArrowLeft';

    document.getElementById("leftArrowForm").value = KeyBoardValues.left;
    document.getElementById("downArrowForm").value = KeyBoardValues.down;
    document.getElementById("rightArrowForm").value = KeyBoardValues.right;
    document.getElementById("upArrowForm").value = KeyBoardValues.up;

    // === food_remain
    food_remain = Math.floor(Math.random() * (max_food - min_food + 1)) + min_food;
    document.getElementById('ballNumberForm').value = food_remain;
    // === Monsters
    monsters_remain = Math.floor(Math.random() * (max_monsters - min_monsters + 1)) + min_monsters;
    document.getElementById('monstersForm').value = monsters_remain;
    // === Game Time
    game_time = Math.floor(Math.random() * (max_time - min_time + 1)) + min_time;
    document.getElementById('gameTimeForm').value = game_time;

}

function validateNumBalls(element) {
    if (element.value < min_food) {
        element.value = min_food;
        food_remain = min_food;

    } else if (element.value > max_food) {
        element.value = max_food;
        food_remain = max_food;
    } else {
        food_remain = element.value;
    }
}

function validateGameTime(element) {
    if (element.value < min_time) {
        element.value = min_time;
    } else {
        game_time = element.value;
    }

}

function setKeys() {
    document.getElementById("leftArrowForm").addEventListener('keydown', function (event) {
        if (!event.metaKey) {
            event.preventDefault();
        }
        KeyboardHelper.left = event.which;
        this.value = event.key;
        KeyBoardValues.left = event.key;
    });

    document.getElementById("rightArrowForm").addEventListener('keydown', function (event) {
        if (!event.metaKey) {
            event.preventDefault();
        }
        KeyboardHelper.rigth = event.which;
        this.value = event.key;
        KeyBoardValues.right = event.key;

    });

    document.getElementById("downArrowForm").addEventListener('keydown', function (event) {
        if (!event.metaKey) {
            event.preventDefault();
        }
        KeyboardHelper.down = event.which;
        this.value = event.key;
        KeyBoardValues.down = event.key;

    });

    document.getElementById("upArrowForm").addEventListener('keydown', function (event) {
        if (!event.metaKey) {
            event.preventDefault();
        }
        KeyboardHelper.up = event.which;
        this.value = event.key;
        KeyBoardValues.up = event.key;

    });
}

function goToGame() {
    monsters_remain = document.getElementById("monstersForm").value;
    fiveColor = document.getElementById("fiveColorForm").value;
    tenColor = document.getElementById("tenColorForm").value;
    fifteenColor = document.getElementById("fifteenColorForm").value;
    // == TODO GO TO GAME
}

$(document).ready(function () {
    context = canvas.getContext("2d");
    setKeys();
    Start();
});


// =============== Monsters =================
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function Monster (x,y,food){
    this.x=x;
    this.y=y;
    this.food=food;
}

function moveMonster(monster) {
    let verticalPosition = (monster.x - shape.i) > 0;
    let horizontalPosition = (monster.y - shape.j) > 0;

    if (monster.food !== null) {
        board[monster.x][monster.y] = monster.food;
    }
    else{
        board[monster.x][monster.y] =0;
    }

    if (verticalPosition && monster.x>0 && board[monster.x - 1][monster.y] != 4) {
        monster.x = monster.x - 1;
    } else if (horizontalPosition && monster.y>0 && board[monster.x][monster.y - 1] != 4) {
        monster.y =monster.y - 1;
    } else if (!horizontalPosition && monster.y<canvas_height-1 && board[monster.x][monster.y + 1] != 4) {
        monster.y = monster.y + 1;
    } else if (!verticalPosition && monster.x<canvas_width-1 && board[monster.x + 1][monster.y] != 4) {
        monster.x = monster.x + 1;
    }
    if (board[monster.x][monster.y] >= 11 && board[monster.x][monster.y] <= 13) {
        monster.food = board[monster.x][monster.y];
    }
    else{
        monster.food=null;
    }

    board[monster.x][monster.y]=5;
    Draw();


};

function setMonsters() {
    let monsterPlace = [1, 2, 3, 4];
    let monsterToDraw = monsters_remain;
    monsterPlace = shuffleArray(monsterPlace);
    while (monsterToDraw > 0) {
        let number = monsterPlace.pop();
        let monster;
        if (number === 1) {
            board[0][0] = 5;
            monster = new Monster(0,0, null);
        } else if (number === 2) {
            board[0][24] = 5;
            monster = new Monster(0, 24, null);
        } else if (number === 3) {
            board[24][0] = 5;
            monster = new Monster(24, 0, null);
        } else {
            board[24][24] = 5;
            monster = new Monster(24, 24, null);
        }
        monsterToDraw--;
        ghosts.push(monster)
    }
}


function Start() {
    board = new Array();
    score = 0;
    direction = 4;
    pac_color = "yellow";
    initializeWalls();
    var cnt = canvas_width * canvas_height;
    var food_remain_1 = food_remain * 0.6;
    var food_remain_2 = food_remain * 0.3;
    var food_remain_3 = food_remain * 0.1;
    var pacman_remain = 1;
    start_time = new Date();
    for (var i = 0; i < canvas_width; i++) {
        board[i] = new Array();
        for (var j = 0; j < canvas_height; j++) {
            if (walls_board[i][j] == 4) {
                board[i][j] = 4;
            } else {
                var randomNum = Math.random();
                if (randomNum <= (1.0 * food_remain_1) / cnt) {
                    food_remain_1--;
                    board[i][j] = 11;
                } else if (randomNum <= (1.0 * food_remain_2) / cnt) {
                    food_remain_2--;
                    board[i][j] = 12;
                } else if (randomNum <= (1.0 * food_remain_3) / cnt) {
                    food_remain_3--;
                    board[i][j] = 13;
                } else if (pacman_remain > 0 && randomNum < (1.0 * (pacman_remain + food_remain_1 + food_remain_2 + food_remain_3)) / cnt) {
                    shape.i = i;
                    shape.j = j;
                    pacman_remain--;
                    board[i][j] = 2;
                } else {
                    board[i][j] = 0;
                }
                cnt--;
            }
        }
    }
    while (food_remain_1 > 0) {
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 11;
        food_remain_1--;
    }
    while (food_remain_2 > 0) {
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 12;
        food_remain_2--;
    }
    while (food_remain_3 > 0) {
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 13;
        food_remain_3--;
    }
    setMonsters();
    keysDown = {};
    addEventListener(
        "keydown",
        function (e) {
            keysDown[e.keyCode] = true;
        },
        false
    );
    addEventListener(
        "keyup",
        function (e) {
            keysDown[e.keyCode] = false;
        },
        false
    );
    ghosts.forEach(ghost => setInterval(() =>moveMonster(ghost),200));
    interval = setInterval(UpdatePosition, 100);
}


function initializeWalls() {
    walls_board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0],
        [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 4, 4, 0],
        [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0],
        [0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
}

function findRandomEmptyCell(board) {
    var i = Math.floor(Math.random() * (canvas_width - 1) + 1);
    var j = Math.floor(Math.random() * (canvas_height - 1) + 1);
    while (board[i][j] != 0) {
        i = Math.floor(Math.random() * (canvas_width - 1) + 1);
        j = Math.floor(Math.random() * (canvas_height - 1) + 1);
    }
    return [i, j];
}

function GetKeyPressed() {
    if (keysDown[KeyboardHelper.up]) {
        return 1;
    }
    if (keysDown[KeyboardHelper.down]) {
        return 2;
    }
    if (keysDown[KeyboardHelper.left]) {
        return 3;
    }
    if (keysDown[KeyboardHelper.right]) {
        return 4;
    }
}

function drawFood(center, i, j) {
    var foodType = board[i][j];
    if (foodType == 11) {
        context.beginPath();
        context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
        var randomNum = Math.random();
        context.fillStyle = fiveColor; //color
        context.fill();
    } else if (foodType == 12) {
        context.beginPath();
        context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
        var randomNum = Math.random();
        context.fillStyle = tenColor; //color
        context.fill();
    } else if (foodType == 13) {
        context.beginPath();
        context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
        var randomNum = Math.random();
        context.fillStyle = fifteenColor; //color
        context.fill();
    }
}

function Draw() {
    canvas.width = canvas.width; //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    for (var i = 0; i < canvas_width; i++) {
        for (var j = 0; j < canvas_height; j++) {
            var center = new Object();
            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
            if (board[i][j] == 2) {
                if (direction == 1) {
                    //UP
                    context.beginPath();
                    context.arc(center.x, center.y, 30, 1.67 * Math.PI, 1.37 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x - 15, center.y - 10, 5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color
                    context.fill();
                } else if (direction == 2) {
                    //DOWN
                    context.beginPath();
                    context.arc(center.x, center.y, 30, 0.65 * Math.PI, 0.35 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x + 14, center.y - 3, 5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color
                    context.fill();
                } else if (direction == 3) {
                    //LEFT
                    context.beginPath();
                    context.arc(center.x, center.y, 30, 1.15 * Math.PI, 0.85 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x - 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color
                    context.fill();
                } else if (direction == 4) {
                    //RIGHT - DEFAULT
                    context.beginPath();
                    context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color
                    context.fill();
                }
            } else if (board[i][j] >= 11 && board[i][j] <= 13) {
                drawFood(center, i, j);
            } else if (board[i][j] == 4) {
                context.beginPath();
                context.rect(center.x - 30, center.y - 30, 60, 60);
                context.fillStyle = "grey"; //color
                context.fill();
            } else if (board[i][j] == 5) {
                draw_ghost(context, center.x + 10, center.y - 10, 1);
            }
        }
    }
}

function UpdatePosition() {
    board[shape.i][shape.j] = 0;
    var x = GetKeyPressed();
    if (x == 1) {
        if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
            shape.j--;
        }
    }
    if (x == 2) {
        if (shape.j < canvas_height - 1 && board[shape.i][shape.j + 1] != 4) {
            shape.j++;
        }
    }
    if (x == 3) {
        if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
            shape.i--;
        }
    }
    if (x == 4) {
        if (shape.i < canvas_width - 1 && board[shape.i + 1][shape.j] != 4) {
            shape.i++;
        }
    }
    if (board[shape.i][shape.j] == 1) {
        score++;
    }
    if (x > 0 && x < 5)
        direction = x;
    board[shape.i][shape.j] = 2;
    var currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;
    if (score >= 10 && time_elapsed >= 10) {
        window.clearInterval(interval);
        window.alert("Winner!!!");
        pac_color = "green";
    }
    if (score > 100 && time_elapsed >= 10) {
        window.clearInterval(interval);
        window.alert("Winner!!!");
        pac_color = "green";
    }
    if (score == 50) {
        window.clearInterval(interval);
        window.alert("Game completed");
    } else {
        Draw();
    }
}

function draw_ghost(ctx, center_x, center_y, scale) {
    this.x = center_x - 40;
    this.y = center_y + 30;

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = "1";
    ctx.fillStyle = "rgba(89,180,79,0.96)";
    ctx.beginPath(); //upper part
    ctx.moveTo(this.x, this.y);
    ctx.quadraticCurveTo(this.x + 19, this.y - 90, this.x + 40, this.y);
    ctx.moveTo(this.x, this.y);// now the bottom part
    ctx.quadraticCurveTo(this.x + 3, this.y + 4, this.x + 10, this.y);
    ctx.moveTo(this.x + 10, this.y);
    ctx.quadraticCurveTo(this.x + 12, this.y - 2, this.x + 20, this.y);
    ctx.moveTo(this.x + 20, this.y);
    ctx.quadraticCurveTo(this.x + 22, this.y + 4, this.x + 30, this.y);
    ctx.moveTo(this.x + 30, this.y);
    ctx.quadraticCurveTo(this.x + 35, this.y - 2, this.x + 40, this.y);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = "#000000"; // eye circles
    ctx.beginPath();
    ctx.arc(this.x + 14, this.y - 29, 2, 0, Math.PI * 8, true);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + 25, this.y - 29, 2, 0, Math.PI * 8, true);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fill();
}
