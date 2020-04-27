var context;
var shape = new Object();
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
var lives = 5;

// Settings
let food_remain = 90;
let max_food = 90;
let min_food = 50;

let ghosts_remain = 1;
let max_monsters = 4;
let min_monsters = 1;

let game_time = 60;
let min_time = 2;
let max_time = 300;

let fiveColor = "#eff542";
let tenColor = "#42a4f5";
let fifteenColor = "#f542cb";

let KeyboardHelper = {left: 37, up: 38, right: 39, down: 40};
let KeyBoardValues = {left: 'ArrowLeft', up: 'ArrowUp', right: 'ArrowRight', down: 'ArrowDown'};

// specialFood
let special_food=null;
let special_food_eated;
let special_food_interval_start;
let special_food_interval_end;

//Ghost
let ghosts_intervals=[];
let ghosts = new Array();

//
let moving_score;
let moving_score_interval;

var game_over = false;
var gameInProgress = false;
var mySound;

const UP_DIRECTION = 1;
const DOWN_DIRECTION = 2;
const LEFT_DIRECTION = 3;
const RIGHT_DIRECTION = 4;

// =============== Settings ===================
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
    ghosts_remain = Math.floor(Math.random() * (max_monsters - min_monsters + 1)) + min_monsters;
    document.getElementById('monstersForm').value = ghosts_remain;
    // === Game Time
    game_time = Math.floor(Math.random() * (max_time - min_time + 1)) + min_time;
    document.getElementById('gameTimeForm').value = game_time;

}

function validateNumBalls(element) {
    if (element.value < min_food) {
        element.value = min_food;
        food_remain = parseInt(min_food);

    } else if (element.value > max_food) {
        element.value = max_food;
        food_remain = parseInt(max_food);
    } else {
        food_remain = parseInt(element.value);
    }
}

function validateGameTime(element) {
    if (element.value < min_time) {
        element.value = parseInt(min_time);
    } else {
        game_time = parseInt(element.value);
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

function fillSettingBoard() {
    user_name_settings.innerText = sessionStorage.getItem("currentUser");
    game_time_id.innerText = game_time;
    balls_number_id.innerText = food_remain;
    num_of_monsters_id.innerText = monsters_remain;
    left_arrow_id.innerText = KeyBoardValues.left;
    right_arrow_id.innerText = KeyBoardValues.right;
    down_arrow_id.innerText = KeyBoardValues.down;
    up_arrow_id.innerText = KeyBoardValues.up;
    five_points_id.style.color = fiveColor;
    ten_points_id.style.color = tenColor;
    fifteen_points_id.style.color = fifteenColor;
}

function goToGame() {
    ghosts_remain = parseInt(document.getElementById("monstersForm").value);
    fiveColor = document.getElementById("fiveColorForm").value;
    tenColor = document.getElementById("tenColorForm").value;
    fifteenColor = document.getElementById("fifteenColorForm").value;
    context = canvas.getContext("2d");
    setKeys();
    if (gameInProgress) {
        gameOver();
        Start();
    } else {
        gameInProgress = true;
        Start();
    }
    fillSettingBoard();
    switchDiv('ourGame');
}

// =========== Moving Score ========

function MovingScore(x, y, food) {
    this.x = x;
    this.y = y;
    this.food = food;
}

function moveMovingScore() {
    if (moving_score.food !== null) {
        board[moving_score.x][moving_score.y] = moving_score.food;
    } else {
        board[moving_score.x][moving_score.y] = 0;
    }

    let dir = Math.random();
    //Down
    if (dir < 0.25 && moving_score.y < canvas_height - 1 && board[moving_score.x][moving_score.y + 1]!==4) {
        moving_score.y +=1;
        //Up
    } else if (dir < 0.5 && moving_score.y > 0 && board[moving_score.x][moving_score.y - 1]!==4) {
        moving_score.y -=1;
        //Left
    } else if (dir < 0.75 && moving_score.x > 0 && board[moving_score.x - 1][moving_score.y]!==4) {
        moving_score.x -=1;
        //Right
    } else if (dir <= 1 && moving_score.x < canvas_width - 1 && board[moving_score.x + 1][moving_score.y]!==4) {
        moving_score.x +=1;
    }


    let boardElementInPosition = board[moving_score.x][moving_score.y];
    if (
        (boardElementInPosition >= 11 && boardElementInPosition <= 13) ||
        boardElementInPosition===21 ||
        boardElementInPosition===20 ||
        boardElementInPosition===5) {
        moving_score.food = boardElementInPosition;
    }
    else{
        moving_score.food = null;
    }

    board[moving_score.x][moving_score.y] = 22;

}

function drawMovingScore(center) {
    context.fillStyle = "#bac708";
    context.font = "20px Arial";
    context.fillText("+50", center.x, center.y);
}


// =============== Ghost =================
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function Ghost(x, y, food) {
    this.x = x;
    this.y = y;
    this.food = food;
}

function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((Math.pow(x1-x2,2))+Math.pow(y1-y2,2));
}

function moveGhost(ghost) {
    let maxDistance = Infinity;
    let dir;
    let currDistance;

    if (ghost.food !== null) {
        board[ghost.x][ghost.y] = ghost.food;
    } else {
        board[ghost.x][ghost.y] = 0;
    }

    //Right
    if(ghost.x < (canvas_width-1) && board[ghost.x + 1][ghost.y] !== 4){
        currDistance = calculateDistance(ghost.x + 1, ghost.y, shape.i,shape.j);
        if(currDistance<maxDistance){
            dir=RIGHT_DIRECTION;
            maxDistance=currDistance;
        }
    }

    //Left
    if(ghost.x > 0 && board[ghost.x - 1][ghost.y] !== 4){
        currDistance = calculateDistance(ghost.x - 1, ghost.y, shape.i,shape.j);
        if(currDistance<maxDistance){
            dir=LEFT_DIRECTION;
            maxDistance=currDistance;
        }
    }
    //Up
    if (ghost.y > 0 && board[ghost.x][ghost.y - 1] !== 4){
        currDistance = calculateDistance(ghost.x, ghost.y-1, shape.i,shape.j);
        if(currDistance<maxDistance){
            dir=UP_DIRECTION;
            maxDistance=currDistance;
        }

    }
    //Down
    if(ghost.y < (canvas_height-1) && board[ghost.x][ghost.y + 1] !== 4){
        currDistance = calculateDistance(ghost.x, ghost.y+1, shape.i,shape.j);
        if(currDistance<maxDistance){
            dir=DOWN_DIRECTION;
            maxDistance=currDistance;
        }
    }

    //Move
    if(dir === UP_DIRECTION){
        ghost.y -=1;
    } else if(dir === DOWN_DIRECTION){
        ghost.y +=1;
    } else if(dir === LEFT_DIRECTION){
        ghost.x -=1;
    } else if (dir ===RIGHT_DIRECTION){
        ghost.x +=1;
    }

    //Save the curr element
    let boardElementInPosition = board[ghost.x][ghost.y];
    if (
        (boardElementInPosition >= 11 && boardElementInPosition <= 13) ||
        (boardElementInPosition>=21  && boardElementInPosition<=22)
    ) {
        ghost.food = boardElementInPosition;
    } else {
        ghost.food = null;
    }

    board[ghost.x][ghost.y] = 5;
};

function restartGhosts() {
    let ghostPlace = [1, 2, 3, 4];
    ghostPlace = shuffleArray(ghostPlace);
    ghosts.forEach(function (ghosts) {
        board[ghosts.x][ghosts.y] = 0;
        let number = ghostPlace.pop();
        if (number === 1) {
            board[0][0] = 5;
            ghosts.x = 0;
            ghosts.y = 0;
        } else if (number === 2) {
            board[0][canvas_height-1] = 5;
            ghosts.x = 0;
            ghosts.y = canvas_height-1;
        } else if (number === 3) {
            board[canvas_width-1][0] = 5;
            ghosts.x = canvas_width-1;
            ghosts.y = 0;
        } else {
            board[canvas_width-1][canvas_height-1] = 5;
            ghosts.x = canvas_width-1;
            ghosts.y = canvas_height-1;
        }
    })
}

function setGhosts() {
    let ghostPlace = [1, 2, 3, 4];
    let ghostToDraw = ghosts_remain;
    ghostPlace = shuffleArray(ghostPlace);
    while (ghostToDraw > 0) {
        let number = ghostPlace.pop();
        let ghost;
        if (number === 1) {
            board[0][0] = 5;
            ghost = new Ghost(0, 0, null);
        } else if (number === 2) {
            board[0][canvas_height-1] = 5;
            ghost = new Ghost(0, canvas_height-1, null);
        } else if (number === 3) {
            board[canvas_width-1][0] = 5;
            ghost = new Ghost(canvas_width-1, 0, null);
        } else {
            board[canvas_width-1][canvas_height-1] = 5;
            ghost = new Ghost(canvas_width-1, canvas_height-1, null);
        }
        ghostToDraw--;
        ghosts.push(ghost)
    }
}

// ============== specialFood ====================
function SpecialFood(x, y) {
    this.x = x;
    this.y = y;
}

function generateSpecialPill() {
    if(special_food===null){
        let emptyCell = findRandomEmptyCell(board);
        special_food = new SpecialFood(emptyCell[0], emptyCell[1]);
        board[special_food.x][special_food.y] = 20;
        special_food_eated = false;
    }
}

function removeSpecialFood() {
    if(!special_food_eated && special_food){
        board[special_food.x][special_food.y] = 0;
    }
    special_food=null;
}

function drawSpecialFood(center) {
    context.beginPath();
    context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
    context.fillStyle = "#24fc03"; //color
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = '#f4ff19';
    context.stroke();
}


/// ============== Game =======================
function Start() {
    board = new Array();
    score = 0;
    direction = 4;
    pac_color = "yellow";
    game_over = false;
    mySound = new sound("resources/original.mp3");
    mySound.play();
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
    setGhosts();
    let cellForMovingScore = findRandomEmptyCell(board);
    moving_score = new MovingScore(cellForMovingScore[0], cellForMovingScore[1], null);
    board[cellForMovingScore[0]][cellForMovingScore[1]] = 22;
    var emptyCell = findRandomEmptyCell(board);
    board[emptyCell[0]][emptyCell[1]] = 21;
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
    interval = setInterval(UpdatePosition, 100);
    ghosts.forEach(ghost =>
        ghosts_intervals.push(setInterval(() => moveGhost(ghost), 200)));
    special_food_interval_start = setInterval(generateSpecialPill, 10000);
    special_food_interval_end = setInterval(removeSpecialFood, 15000);
    moving_score_interval = setInterval(moveMovingScore, 200);

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
        context.arc(center.x, center.y, 7.5, 0, 2 * Math.PI); // circle
        var randomNum = Math.random();
        context.fillStyle = fiveColor; //color
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#003300';
        context.stroke();
    } else if (foodType == 12) {
        context.beginPath();
        context.arc(center.x, center.y, 7.5, 0, 2 * Math.PI); // circle
        var randomNum = Math.random();
        context.fillStyle = tenColor; //color
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#003300';
        context.stroke();
    } else if (foodType == 13) {
        context.beginPath();
        context.arc(center.x, center.y, 7.5, 0, 2 * Math.PI); // circle
        var randomNum = Math.random();
        context.fillStyle = fifteenColor; //color
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#003300';
        context.stroke();
    }
}


function Draw() {
    canvas.width = canvas.width; //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    lblLives.value = lives;
    for (var i = 0; i < canvas_width; i++) {
        for (var j = 0; j < canvas_height; j++) {
            var center = new Object();
            center.x = i * 30 + 30;
            center.y = j * 30 + 30;
            if (board[i][j] == 2) {
                if (direction == 1) {
                    //UP
                    context.beginPath();
                    context.arc(center.x, center.y, 15, 1.67 * Math.PI, 1.37 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x - 7.5, center.y - 5, 2.5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color
                    context.fill();
                } else if (direction == 2) {
                    //DOWN
                    context.beginPath();
                    context.arc(center.x, center.y, 15, 0.65 * Math.PI, 0.35 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x + 3.5, center.y - 1.5, 2.5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color
                    context.fill();
                } else if (direction == 3) {
                    //LEFT
                    context.beginPath();
                    context.arc(center.x, center.y, 15, 1.15 * Math.PI, 0.85 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x - 2.5, center.y - 7.5, 2.5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color
                    context.fill();
                } else if (direction == 4) {
                    //RIGHT - DEFAULT
                    context.beginPath();
                    context.arc(center.x, center.y, 15, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x + 2.5, center.y - 7.5, 2.5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color
                    context.fill();
                }
            } else if (board[i][j] >= 11 && board[i][j] <= 13) {
                drawFood(center, i, j);
            } else if (board[i][j] == 4) {
                context.beginPath();
                context.rect(center.x - 15, center.y - 15, 30, 30);
                context.fillStyle = "grey"; //color
                context.fill();
            } else if (board[i][j] == 5) {
                draw_ghost(context, center.x + 10, center.y - 10, 1);
            } else if (board[i][j] == 20) {
                drawSpecialFood(center);
            } else if (board[i][j] == 21) {
                let img = document.getElementById("hourglass");
                context.drawImage(img, center.x - 15, center.y - 15, 30, 30);
            } else if (board[i][j] == 22) {
                drawMovingScore(center);
            }
        }
    }
    if (game_over) {
        let img = document.getElementById("gameOver");
        context.drawImage(img, 100, 50, 600, 450);

        context.beginPath();
        context.rect(rect.x, rect.y, rect.width, rect.heigth);
        context.fillStyle = '#FFFFFF';
        context.fillStyle = 'rgba(225,225,225,0.5)';
        context.fillRect(rect.x, rect.y, rect.width, rect.heigth);
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#000000';
        context.stroke();
        context.closePath();
        context.font = '20pt Montserrat';
        context.fillStyle = '#000000';
        context.fillText('New Game', rect.x + 25, rect.y + 35);
    }
}

function foodScoreCalculator(i, j) {
    var foodType = board[shape.i][shape.j];
    if (foodType == 11) {
        score += 5;
    } else if (foodType == 12) {
        score += 10;
    } else if (foodType == 13) {
        score += 15;
    }
}

function ghostEncounter() {
    if (board[shape.i][shape.j] == 5) {
        score -= 10;
        lives--;
        if (lives == 0) {
            window.alert("Loser!");
            pac_color = "red";
            gameOver();
        } else {
            restartGhosts();
            var emptyCell = findRandomEmptyCell(board);
            shape.i = emptyCell[0];
            shape.j = emptyCell[1];

        }
    }
}

function clearIntervals() {
    window.clearInterval(interval);
    window.clearInterval(special_food_interval_start);
    window.clearInterval(special_food_interval_end);
    window.clearInterval(moving_score_interval);
    ghosts_intervals.forEach(interval => window.clearInterval(interval));
    ghosts_intervals.length=0;
}

function gameOver() {
    game_over = true;
    mySound.stop();
    clearIntervals();
    ghosts.length = 0
}

function hourGlassEncounter() {
    if (board[shape.i][shape.j] == 21) {
        game_time = game_time + 10;
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
    foodScoreCalculator();
    ghostEncounter();
    hourGlassEncounter();
    if (x > 0 && x < 5)
        direction = x;
    board[shape.i][shape.j] = 2;
    var currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;
    if (time_elapsed >= game_time) {
        if (score >= 100) {
            window.alert("Winner!!!");
            pac_color = "green";
        } else {
            window.alert("You are better than " + score + " points!");
            pac_color = "red";
        }
        Draw();
        gameOver();
    } else if (score >= 100) {
        Draw();
        gameOver();
        window.alert("Winner!!!");
        pac_color = "green";
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
    ctx.quadraticCurveTo(this.x + 22, this.y + 4, this.x + 30, this.y);
    ctx.moveTo(this.x + 20, this.y);
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

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function isInside(pos, rect) {
    return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.heigth && pos.y > rect.y
}

var rect = {
    x: 300,
    y: 350,
    width: 200,
    heigth: 50
};

$(document).ready(function () {
    canvas.addEventListener('click', function (evt) {
        var mousePos = getMousePos(canvas, evt);
        debugger;
        if (isInside(mousePos, rect) && game_over) {
            goToGame();
        }
    }, false);
});