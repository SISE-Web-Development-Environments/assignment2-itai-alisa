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
var food_amount = 50;

$(document).ready(function () {
    context = canvas.getContext("2d");
    Start();
});

function Start() {
    board = new Array();
    score = 0;
    direction = 4;
    pac_color = "yellow";
    initializeWalls();
    var cnt = canvas_width * canvas_height;
    var food_remain_1 = food_amount*0.6;
    var food_remain_2 = food_amount*0.3;
    var food_remain_3 = food_amount*0.1;
    var pacman_remain = 1;
    start_time = new Date();
    for (var i = 0; i < canvas_width; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < canvas_height; j++) {
            if (walls_board[i][j] == 4) {
                board[i][j] = 4;
            }  else {
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
                }
                else if (randomNum < (1.0 * (pacman_remain + food_remain_1 + food_remain_2 + food_remain_3)) / cnt) {
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


function initializeWalls(){
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
    var i = Math.floor(Math.random() * canvas_width + 1);
    var j = Math.floor(Math.random() * canvas_height + 1);
    while (board[i][j] != 0) {
        i = Math.floor(Math.random() * canvas_width + 1);
        j = Math.floor(Math.random() * canvas_height + 1);
    }
    return [i, j];
}

function GetKeyPressed() {
    if (keysDown[38]) {
        return 1;
    }
    if (keysDown[40]) {
        return 2;
    }
    if (keysDown[37]) {
        return 3;
    }
    if (keysDown[39]) {
        return 4;
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
            }
            else if (board[i][j] >= 11 && board[i][j] <= 13) {
                context.beginPath();
                context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
                var randomNum = Math.random();
                context.fillStyle = "black"; //color
                context.fill();
            }
            else if (board[i][j] == 4) {
                context.beginPath();
                context.rect(center.x - 30, center.y - 30, 60, 60);
                context.fillStyle = "grey"; //color
                context.fill();
            }
            else if (board[i][j] == 5) {
                draw_ghost(context,center.x+10,center.y-10,1);
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
        if (shape.j < canvas_height-1 && board[shape.i][shape.j + 1] != 4) {
            shape.j++;
        }
    }
    if (x == 3) {
        if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
            shape.i--;
        }
    }
    if (x == 4) {
        if (shape.i < canvas_width-1 && board[shape.i + 1][shape.j] != 4) {
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
    ctx.strokeStyle="black";
    ctx.lineWidth="1";
    ctx.fillStyle="rgba(89,180,79,0.96)";
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
