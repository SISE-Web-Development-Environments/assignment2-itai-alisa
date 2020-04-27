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

let interval_counter =0;
// Settings
let food_remain = 90;
let max_food = 90;
let min_food = 50;

let ghosts_remain = 1;
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

// specialFood
let special_food=null;
let special_food_eated;


//Ghost
let ghosts = new Array();

//moving_score
let moving_score;
let moving_score_eated;

var game_over = false;
var gameInProgress = false;
var mySound;

// Const
const UP_DIRECTION = 1;
const DOWN_DIRECTION = 2;
const LEFT_DIRECTION = 3;
const RIGHT_DIRECTION = 4;

const CLEAR =0;
const PACMAN = 2;
const FIVE_POINT = 11;
const TEN_POINT =12;
const FIFTEEN_POINT =13;
const HOUR_GLASS = 21;
const SPECIAL_FOOD = 22;
const MOVING_SCORE =23;
const WALL =31;
const GHOST =32;




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
    // === Colors
    document.getElementById("fiveColorForm").value =
        "#" + ("00000" + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6);
    document.getElementById("tenColorForm").value =
        "#" + ("00000" + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6);
    document.getElementById("fifteenColorForm").value =
        "#" + ("00000" + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6);
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
    num_of_monsters_id.innerText = ghosts_remain;
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
    if(!moving_score_eated){
        if (moving_score.food !== null) {
            board[moving_score.x][moving_score.y] = moving_score.food;
        } else {
            board[moving_score.x][moving_score.y] = CLEAR;
        }

        let dir = Math.random();
        //Down
        if (dir < 0.25 &&
            moving_score.y < canvas_height - 1 &&
            board[moving_score.x][moving_score.y + 1]<30
        ) {
            moving_score.y +=1;
            //Up
        } else if (dir < 0.5 &&
            moving_score.y > 0 &&
            board[moving_score.x][moving_score.y - 1]<30
        ) {
            moving_score.y -=1;
            //Left
        } else if (dir < 0.75 &&
            moving_score.x > 0 &&
            board[moving_score.x - 1][moving_score.y]<30
        ) {
            moving_score.x -=1;
            //Right
        } else if (dir <= 1 &&
            moving_score.x < canvas_width - 1 &&
            board[moving_score.x + 1][moving_score.y]<30
        ) {
            moving_score.x +=1;
        }


        let boardElementInPosition = board[moving_score.x][moving_score.y];
        if (boardElementInPosition >= 11 && boardElementInPosition <= 22) {
            moving_score.food = boardElementInPosition;
        }
        else{
            moving_score.food = null;
        }

        board[moving_score.x][moving_score.y] = MOVING_SCORE;
    }

}

function drawMovingScore(center) {
    context.fillStyle = "#bac708";
    context.font = "20px Arial";
    context.fillText("+50", center.x, center.y+10);
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

function moveGhost(ghost) {
    let maxDistance = Infinity;
    let dir;
    let currDistance;

    if (ghost.food !== null) {
        board[ghost.x][ghost.y] = ghost.food;
    } else {
        board[ghost.x][ghost.y] = CLEAR;
    }

    //Right
    if(ghost.x < (canvas_width-1) && board[ghost.x + 1][ghost.y] <30){
        currDistance = calculateDistance(ghost.x + 1, ghost.y, shape.i,shape.j);
        if(currDistance<maxDistance){
            dir=RIGHT_DIRECTION;
            maxDistance=currDistance;
        }
    }

    //Left
    if(ghost.x > 0 && board[ghost.x - 1][ghost.y] <30){
        currDistance = calculateDistance(ghost.x - 1, ghost.y, shape.i,shape.j);
        if(currDistance<maxDistance){
            dir=LEFT_DIRECTION;
            maxDistance=currDistance;
        }
    }
    //Up
    if (ghost.y > 0 && board[ghost.x][ghost.y - 1] <30){
        currDistance = calculateDistance(ghost.x, ghost.y-1, shape.i,shape.j);
        if(currDistance<maxDistance){
            dir=UP_DIRECTION;
            maxDistance=currDistance;
        }

    }
    //Down
    if(ghost.y < (canvas_height-1) && board[ghost.x][ghost.y + 1] <30){
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
    if (boardElementInPosition >= 11 && boardElementInPosition <30) {
        ghost.food = boardElementInPosition;
    } else {
        ghost.food = null;
    }
    board[ghost.x][ghost.y] =GHOST;
};

function restartGhosts() {
    let ghostPlace = [1, 2, 3, 4];
    ghostPlace = shuffleArray(ghostPlace);
    ghosts.forEach(function (ghosts) {
        board[ghosts.x][ghosts.y] = 0;
        let number = ghostPlace.pop();
        if (number === 1) {
            board[0][0] = GHOST;
            ghosts.x = 0;
            ghosts.y = 0;
        } else if (number === 2) {
            board[0][canvas_height-1] = GHOST;
            ghosts.x = 0;
            ghosts.y = canvas_height-1;
        } else if (number === 3) {
            board[canvas_width-1][0] = GHOST;
            ghosts.x = canvas_width-1;
            ghosts.y = 0;
        } else {
            board[canvas_width-1][canvas_height-1] = GHOST;
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
            board[0][0] = GHOST;
            ghost = new Ghost(0, 0, null);
        } else if (number === 2) {
            board[0][canvas_height-1] = GHOST;
            ghost = new Ghost(0, canvas_height-1, null);
        } else if (number === 3) {
            board[canvas_width-1][0] = GHOST;
            ghost = new Ghost(canvas_width-1, 0, null);
        } else {
            board[canvas_width-1][canvas_height-1] = GHOST;
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

function generateSpecialFood() {
    if(special_food===null){
        let emptyCell = findRandomEmptyCell(board);
        special_food = new SpecialFood(emptyCell[0], emptyCell[1]);
        board[special_food.x][special_food.y] = SPECIAL_FOOD;
        special_food_eated = false;
    }
}

function removeSpecialFood() {
    if(!special_food_eated && special_food){
        board[special_food.x][special_food.y] = CLEAR;

    }
    special_food=null;

}

function drawSpecialFood(center) {
    context.beginPath();
    context.arc(center.x, center.y, 7.5, 0, 2 * Math.PI); // circle
    var randomNum = Math.random();
    context.fillStyle = '#ffffff'; //color
    context.fill();
    context.lineWidth = 4;
    context.strokeStyle = '#fc03f4';
    context.stroke();

}

/// ============== Game =======================
function Start() {
    board = new Array();
    score = 0;
    lives=5;
    direction = 4;
    pac_color = "yellow";
    game_over = false;
    moving_score_eated = false;
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
            if (walls_board[i][j] == WALL) {
                board[i][j] = WALL;
            } else {
                var randomNum = Math.random();
                if (randomNum <= (1.0 * food_remain_1) / cnt) {
                    food_remain_1--;
                    board[i][j] = FIVE_POINT;
                } else if (randomNum <= (1.0 * food_remain_2) / cnt) {
                    food_remain_2--;
                    board[i][j] = TEN_POINT;
                } else if (randomNum <= (1.0 * food_remain_3) / cnt) {
                    food_remain_3--;
                    board[i][j] = FIFTEEN_POINT;
                } else if (pacman_remain > 0 && randomNum < (1.0 * (pacman_remain + food_remain_1 + food_remain_2 + food_remain_3)) / cnt) {
                    shape.i = i;
                    shape.j = j;
                    pacman_remain--;
                    board[i][j] = PACMAN;
                } else {
                    board[i][j] = CLEAR;
                }
                cnt--;
            }
        }
    }
    while (food_remain_1 > 0) {
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = FIVE_POINT;
        food_remain_1--;
    }
    while (food_remain_2 > 0) {
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = TEN_POINT;
        food_remain_2--;
    }
    while (food_remain_3 > 0) {
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = FIFTEEN_POINT;
        food_remain_3--;
    }
    setGhosts();
    let cellForMovingScore = findRandomEmptyCell(board);
    moving_score = new MovingScore(cellForMovingScore[0], cellForMovingScore[1], null);
    board[cellForMovingScore[0]][cellForMovingScore[1]] = MOVING_SCORE;
    var emptyCellForHourGlass = findRandomEmptyCell(board);
    board[emptyCellForHourGlass[0]][emptyCellForHourGlass[1]] = HOUR_GLASS;
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
}

function gameOver() {
    mySound.stop();
    let gameOver = new sound("resources/gameOver.mp3");
    gameOver.play();
    game_over = true;
    window.clearInterval(interval);
    interval_counter=0;
    ghosts.length = 0
}

function UpdatePosition() {
    interval_counter++;
    board[shape.i][shape.j] = CLEAR;
    var x = GetKeyPressed();
    if (x == 1) {
        if (shape.j > 0 && board[shape.i][shape.j - 1] !== WALL) {
            shape.j--;
        }
    }
    if (x == 2) {
        if (shape.j < canvas_height - 1 && board[shape.i][shape.j + 1] !== WALL) {
            shape.j++;
        }
    }
    if (x == 3) {
        if (shape.i > 0 && board[shape.i - 1][shape.j] !== WALL) {
            shape.i--;
        }
    }
    if (x == 4) {
        if (shape.i < canvas_width - 1 && board[shape.i + 1][shape.j] !== WALL) {
            shape.i++;
        }
    }

    //All 200
    if(interval_counter%2===0){
        ghosts.forEach(ghost => moveGhost(ghost));
    }
    //All 400
     if (interval_counter%4===0){
         moveMovingScore();
     }

    //All 1000
    if(interval_counter%100===0){
        generateSpecialFood();
    }
    //All 1500
    if(interval_counter%150===0){
        removeSpecialFood();
    }
    foodScoreCalculator();
    movingScoreEncounter()
    ghostEncounter();
    hourGlassEncounter();
    if (x > 0 && x < 5)
        direction = x;
    board[shape.i][shape.j] = PACMAN;
    var currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;
    if (time_elapsed >= game_time) {
        if (score >= 100) {
            window.alert("Winner!!!");
            pac_color = "green";
        } else {
            pac_color = "red";
        }
        game_over=true;
        Draw();
        gameOver();
    } else if (score >= 100) {
        game_over=true;
        Draw();
        gameOver();
        pac_color = "green";
    } else {
        Draw();
    }
}

// ============== Draw ==============
function Draw() {
    canvas.width = canvas.width; //clean board
    lblScore.innerText = score;
    lblTime.innerText = time_elapsed;
    lblLives.innerText = lives;
    for (var i = 0; i < canvas_width; i++) {
        for (var j = 0; j < canvas_height; j++) {
            var center = new Object();
            center.x = i * 30 + 30;
            center.y = j * 30 + 30;
            if (board[i][j] == 2) {
                if (direction == UP_DIRECTION) {
                    context.beginPath();
                    context.arc(center.x, center.y, 15, 1.67 * Math.PI, 1.37 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x - 7.5, center.y - 5, 2.5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color
                    context.fill();
                } else if (direction == DOWN_DIRECTION) {
                    context.beginPath();
                    context.arc(center.x, center.y, 15, 0.65 * Math.PI, 0.35 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x + 3.5, center.y - 1.5, 2.5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color
                    context.fill();
                } else if (direction == LEFT_DIRECTION) {
                    context.beginPath();
                    context.arc(center.x, center.y, 15, 1.15 * Math.PI, 0.85 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x - 2.5, center.y - 7.5, 2.5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color
                    context.fill();
                } else if (direction == RIGHT_DIRECTION) {
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
            } else if (board[i][j] >= FIVE_POINT && board[i][j] <= FIFTEEN_POINT) {
                drawFood(center, i, j);
            } else if (board[i][j] == WALL) {
                context.beginPath();
                context.rect(center.x - 15, center.y - 15, 30, 30);
                context.fillStyle = "grey"; //color
                context.fill();
            } else if (board[i][j] == GHOST) {
                // draw_ghost(context, center.x + 10, center.y - 10, 1);
                let img = document.getElementById("ghost");
                context.drawImage(img, center.x - 15, center.y - 15, 30, 30);
            } else if (board[i][j] == SPECIAL_FOOD) {
                let img = document.getElementById("specialFood");
                context.drawImage(img, center.x - 15, center.y - 15, 30, 30);
                // drawSpecialFood(center);
            } else if (board[i][j] == HOUR_GLASS) {
                let img = document.getElementById("hourglass");
                context.drawImage(img, center.x - 15, center.y - 15, 30, 30);
            } else if (board[i][j] == MOVING_SCORE) {
                let img = document.getElementById("50");
                context.drawImage(img, center.x - 15, center.y - 15, 37, 37);
                // drawMovingScore(center);
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

        if(lives == 0){
            context.beginPath();
            context.rect(messageRect.x, messageRect.y, messageRect.width, messageRect.heigth);
            context.fillStyle = '#FFFFFF';
            context.fillStyle = 'rgba(225,9,0,0.5)';
            context.fillRect(messageRect.x, messageRect.y, messageRect.width, messageRect.heigth);
            context.fill();
            context.lineWidth = 2;
            context.strokeStyle = '#000000';
            context.stroke();
            context.closePath();
            context.font = '20pt Montserrat';
            context.fillStyle = '#000000';
            context.fillText('Loser!', messageRect.x + 25, messageRect.y + 35);
        }
        else if (score >= 100) {
            context.beginPath();
            context.rect(winnerMessageRect.x, winnerMessageRect.y, winnerMessageRect.width, winnerMessageRect.heigth);
            context.fillStyle = '#FFFFFF';
            context.fillStyle = 'rgb(183,225,177)';
            context.fillRect(winnerMessageRect.x, winnerMessageRect.y, winnerMessageRect.width, winnerMessageRect.heigth);
            context.fill();
            context.lineWidth = 2;
            context.strokeStyle = '#000000';
            context.stroke();
            context.closePath();
            context.font = '20pt Montserrat';
            context.fillStyle = '#000000';
            context.fillText("Winner!!!", winnerMessageRect.x + 25, winnerMessageRect.y + 35);
        }
        else{
            context.beginPath();
            context.rect(pointsMessageRect.x, pointsMessageRect.y, pointsMessageRect.width, pointsMessageRect.heigth);
            context.fillStyle = '#FFFFFF';
            context.fillStyle = 'rgb(245,129,133)';
            context.fillRect(pointsMessageRect.x, pointsMessageRect.y, pointsMessageRect.width, pointsMessageRect.heigth);
            context.fill();
            context.lineWidth = 2;
            context.strokeStyle = '#000000';
            context.stroke();
            context.closePath();
            context.font = '20pt Montserrat';
            context.fillStyle = '#000000';
            context.fillText("You are better than " + score + " points!", pointsMessageRect.x + 25, pointsMessageRect.y + 35);
        }

    }
}

function drawFood(center, i, j) {
    var foodType = board[i][j];
    if (foodType == FIVE_POINT) {
        context.beginPath();
        context.arc(center.x, center.y, 7.5, 0, 2 * Math.PI); // circle
        var randomNum = Math.random();
        context.fillStyle = fiveColor; //color
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#003300';
        context.stroke();
    } else if (foodType == TEN_POINT) {
        context.beginPath();
        context.arc(center.x, center.y, 7.5, 0, 2 * Math.PI); // circle
        var randomNum = Math.random();
        context.fillStyle = tenColor; //color
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#003300';
        context.stroke();
    } else if (foodType == FIFTEEN_POINT) {
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

// ============== Encounter Functions ==============
function hourGlassEncounter() {
    if (board[shape.i][shape.j] == HOUR_GLASS) {
        game_time = game_time + 10;
    }
}

function foodScoreCalculator(i, j) {
    var foodType = board[shape.i][shape.j];
    if (foodType == FIVE_POINT) {
        score += 5;
    } else if (foodType == TEN_POINT) {
        score += 10;
    } else if (foodType == FIFTEEN_POINT) {
        score += 15;
    } else if (foodType == SPECIAL_FOOD){
        special_food_eated = true;
        let num = Math.random();
        if(num<0.5){
            score +=50;
        }
        else{
            score -=25;
        }
    }
}

function ghostEncounter() {
    if (board[shape.i][shape.j] === GHOST) {
        score -= 10;
        lives--;
        if (lives === 0) {
            pac_color = "red";
            gameOver();
        } else {
            mySound.stop();
            let ghost = new sound("resources/ghost.mp3");
            ghost.play();
            mySound.play();
            restartGhosts();
            var emptyCell = findRandomEmptyCell(board);
            shape.i = emptyCell[0];
            shape.j = emptyCell[1];
        }
    }
}

function movingScoreEncounter() {
    if (board[shape.i][shape.j] === MOVING_SCORE) {
        score += 50;
        moving_score_eated = true;
    }
}

// ============== Help Functions ==============
function initializeWalls() {
    walls_board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, WALL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, WALL, 0, 0, 0, 0, 0, 0, 0, 0, 0, WALL, WALL, 0, 0, 0, 0, 0, 0, 0],
        [0, WALL, 0, 0, 0, 0, 0, 0, 0, 0, 0, WALL, WALL, 0, 0, 0, 0, WALL, WALL, 0],
        [0, WALL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, WALL, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, WALL, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, WALL, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, WALL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, WALL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, WALL, WALL, WALL, WALL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, WALL, 0, 0, 0, 0, 0, 0, 0, WALL, WALL, WALL, WALL, 0, 0, 0],
        [0, 0, 0, 0, 0, WALL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, WALL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, WALL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, WALL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, WALL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, WALL ,WALL, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, WALL, WALL, 0, 0, 0, 0, 0],
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

function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((Math.pow(x1-x2,2))+Math.pow(y1-y2,2));
}


var rect = {
    x: 300,
    y: 350,
    width: 200,
    heigth: 50
};

var messageRect = {
    x: 300,
    y: 70,
    width: 200,
    heigth: 50
};

var winnerMessageRect = {
    x: 300,
    y: 70,
    width: 200,
    heigth: 50
};

var pointsMessageRect = {
    x: 170  ,
    y: 70,
    width: 435,
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