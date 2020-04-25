var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;

let food_remain = 50;
let max_food=90;
let min_food=50;

let monsters_remain=1;
let max_monsters=4;
let min_monsters=1;

let game_time=60;
let min_time=60;
let max_time=300;

let KeyboardHelper = { left: 37, up: 38, right: 39, down: 40 };
let KeyBoardValues = { left: 'ArrowLeft', up: 'ArrowUp', right: 'ArrowRight', down: 'ArrowDown' };



function randomSettings(){
	// ==== Keyboard Default
	KeyboardHelper.down=40;
	KeyboardHelper.right=39;
	KeyboardHelper.up=38;
	KeyboardHelper.left=37;

	KeyBoardValues.down='ArrowDown';
	KeyBoardValues.right='ArrowRight';
	KeyBoardValues.up='ArrowUp';
	KeyBoardValues.lect='ArrowLeft';

	document.getElementById("leftA").value= KeyBoardValues.left;
	document.getElementById("downA").value=KeyBoardValues.down;
	document.getElementById("rightA").value=KeyBoardValues.right;
	document.getElementById("upA").value=KeyBoardValues.up;

	// === food_remain
	food_remain = Math.floor(Math.random() * (max_food - min_food + 1) ) + min_food;
	document.getElementById('ballNumber').value=food_remain;
	// === Monsters
	monsters_remain= Math.floor(Math.random() * (max_monsters - min_monsters + 1) ) + min_monsters;
	document.getElementById('monsters').value=monsters_remain;
	// === Game Time
	game_time = Math.floor(Math.random() * (max_time - min_time + 1) ) + min_time;
	document.getElementById('gameTime').value=game_time;

}

function validateNumBalls (element) {
	if(element.value<min_food){
		element.value=min_food;
		food_remain=min_food;

	}
	else if(element.value>max_food){
		element.value=max_food;
		food_remain=max_food;
	}
	else{
		food_remain=element.value;
	}
}
function validateGameTime (element) {
	if(element.value<min_time){
		element.value=min_time;
	}
	else{
		game_time=element.value;
	}

}

function setKeys(){
	document.getElementById("leftA").addEventListener( 'keydown', function(event) {
		if (!event.metaKey) {
			event.preventDefault();
		}
		KeyboardHelper.left = event.which;
		this.value=event.key;
		KeyBoardValues.left=event.key;
	});

	document.getElementById("rightA").addEventListener( 'keydown', function(event) {
		if (!event.metaKey) {
			event.preventDefault();
		}
		KeyboardHelper.rigth=event.which;
		this.value=event.key;
		KeyBoardValues.right=event.key;

	});

	document.getElementById("downA").addEventListener( 'keydown', function(event) {
		if (!event.metaKey) {
			event.preventDefault();
		}
		KeyboardHelper.down=event.which;
		this.value=event.key;
		KeyBoardValues.down=event.key;

	});

	document.getElementById("upA").addEventListener( 'keydown', function(event) {
		if (!event.metaKey) {
			event.preventDefault();
		}
		KeyboardHelper.up=event.which;
		this.value=event.key;
		KeyBoardValues.up=event.key;

	});
}

$(document).ready(function() {
	context = canvas.getContext("2d");
	setKeys();
	Start();
});



function Start() {
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var pacman_remain = 1;
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = 4;
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1;
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
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
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 250);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
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

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
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
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		score++;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw();
	}
}
