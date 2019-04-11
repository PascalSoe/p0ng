var paddleL, paddleR, ball, wallTop, wallBottom, powerup, rocket;
var MAX_SPEED = 15;
var speed = 7;
var powerL = 0;
var powerR = 0;

var powerfunction;
var POWER_TIMER = 10000;
var POWER_RESPAWN = 5000;
var id_of_timeout;

var colorBall = '#0000ff';
var colorL = '#ff0000';
var colorR = '#00ff00';

var upL = false;
var downL = false;
var stopL = false;
var upR = false;
var downR = false;
var stopR = false;
var PADDLE_SIZE = 100;

var scoreL = 0;
var scoreR = 0;
var ballvalue = 1;
var MAX_SCORE = 10;

var fontsize = 40;

var powerups = [
	function(user){growPad(user);},
	function(user){shrinkPad(user);},
	function(user){ballValue();},
	function(user){shootRocket(user);},
	function(user){powershot(user);}
];

var powercolors = ['#08FF15', '#FF0815', '#D4AF37', '#FF9900', '#FFCCCC'];

function setup(){
	var cnv = createCanvas(1100,600);
	cnv.parent('sketch-holder');
	cnv.style('display', 'block');
	textSize(fontsize);
	textAlign(CENTER, CENTER);

	//createSprite(x,y,width,height)

	paddleL = createSprite(30, height/2, 10, PADDLE_SIZE);
	paddleL.immovable = true;
	paddleL.shapeColor = color(colorL);
	paddleL.draw = function(){
		fill(paddleL.shapeColor);
		stroke(0);
		rect(0,0,paddleL.width,paddleL.height);
	}


	paddleR = createSprite(width - 28, height/2, 10, PADDLE_SIZE);
	paddleR.immovable = true;
	paddleR.shapeColor = color(colorR);
	paddleR.draw = function(){
		fill(paddleR.shapeColor);
		stroke(0);
		rect(0,0,paddleR.width,paddleR.height);
	}

	wallTop = createSprite(width/2, -14, width, 30);
	wallTop.immovable = true;
	wallTop.shapeColor = color('white');

	wallBottom = createSprite(width/2, height+14, width, 30);
	wallBottom.immovable = true;
	wallBottom.shapeColor = color('white');

	ball = createSprite(width/2, height/2, 25, 25);
	ball.maxSpeed = MAX_SPEED;
	ball.shapeColor = color(colorBall);
	ball.setCollider('circle');
	ball.draw = function () {
		fill(ball.shapeColor);
		stroke(ball.shapeColor);
		ellipse(0, 0, 25, 25);
	}
	ball.setSpeed(speed, Math.random() < 0.5 ? 0 : 180);

	id_of_timeout = setTimeout(function(){
		spawnpowerup();
	}, POWER_RESPAWN + 5000 * random());

}

function draw(){
	background(0);

	checkKeys();

	movePaddles();

	moveBall();

	checkOnRocket();

	drawSprites();

}

function checkKeys(){

	//KEYDOWN
	if(keyWentDown('up'))
	{
		upR = true;
		downR = false;
	}
	if(keyWentDown('down'))
	{
		upR = false;
		downR = true;
	}
	if(keyWentDown('w'))
	{
		upL = true;
		downL = false;
	}
	if(keyWentDown('s'))
	{
		upL = false;
		downL = true;
	}

	//KEYUP
	if(keyWentUp('up'))
	{
		upR = false;
	}
	if(keyWentUp('down'))
	{
		downR = false;
	}
	if(keyWentUp('w'))
	{
		upL = false;
	}
	if(keyWentUp('s'))
	{
		downL = false;
	}
}

function movePaddles(){
	if(!stopR){
		if(upR)
		{
			if(!paddleR.bounce(wallTop)){
				paddleR.position.y = paddleR.position.y-MAX_SPEED/2;
			}
		}
		if(downR)
		{
			if(!paddleR.bounce(wallBottom)){
				paddleR.position.y = paddleR.position.y+MAX_SPEED/2;
			}
		}
	}
	if(!stopL){
		if(upL)
		{
			if(!paddleL.bounce(wallTop)){
				paddleL.position.y = paddleL.position.y-MAX_SPEED/2;
			}
		}
		if(downL)
		{
			if(!paddleL.bounce(wallBottom)){
				paddleL.position.y = paddleL.position.y+MAX_SPEED/2;
			}
		}
	}
}

function stopPaddle(paddle){
	if(paddle===1){
		stopL = true;
	}
	if(paddle===2){
		stopR = true;
	}
	rocket.remove();
	rocket = null;

	setTimeout(function(){
		stopL = false;
		stopR = false;
	}, 1000);
}

function moveBall(){
	var bounceAngle;

	ball.bounce(wallTop);
	ball.bounce(wallBottom);


	if(ball.bounce(paddleL)){
		if(speed < MAX_SPEED){
			speed += 1;
		}
    
    bounceAngle = ball.getDirection() + (ball.position.y - paddleL.position.y) / 2;
		if(bounceAngle>= 270 && bounceAngle < 300){
			bounceAngle = 300;
		}
		if(bounceAngle<=90 && bounceAngle > 60 ){
			bounceAngle = 60;
		}
		ball.maxSpeed = MAX_SPEED + powerL;
		ball.setSpeed(speed + powerL, ball.getDirection()+bounceAngle);
		powerL = 0;

	}

	if(ball.bounce(paddleR)){
		if(speed < MAX_SPEED){
			speed += 1;
		}
    
    bounceAngle = ball.getDirection() + (paddleR.position.y - ball.position.y) / 2;
		if(bounceAngle<= 270 && bounceAngle > 240){
			bounceAngle = 240;
		}
		if(bounceAngle>=90 && bounceAngle < 120 ){
			bounceAngle = 120;
		}
		ball.maxSpeed = MAX_SPEED + powerR;
		ball.setSpeed(speed + powerR, ball.getDirection()+bounceAngle);
		powerR = 0;

	}

	//collect powerup on collision
	if(powerup){
		if(!powerup.removed){
			ball.overlap(powerup, usepowerup);
		} else {
			despawnpowerup(POWER_RESPAWN);
		}
	}

	//score left
	if(ball.position.x < 0){
		score(2);

		if(scoreR >= MAX_SCORE){
			fill(color(0,255,0));
			text('Player 2 wins!', width*0.5, height*0.3);
		}else{
			fill(255);
			text('Player 2 scores!', width*0.5, height*0.3);
			setTimeout(function(){
	    	loop();
			}, 1500);
		}
	}
	//score right
	else if(ball.position.x > width){
		score(1);

		if(scoreL >= MAX_SCORE){
			fill(color(255,0,0));
			text('Player 1 wins!', width*0.5, height*0.3);
		}else{
			fill(255);
			text('Player 1 scores!', width*0.5, height*0.3);
			setTimeout(function(){
	    	loop();
			}, 1500);
		}
	}

}

function checkOnRocket(){
	if(rocket){
		if(!rocket.removed){
			if(rocket.position.x < 0 || rocket.position.x > width){
				rocket.remove();
				rocket = null;
			}
			else if(rocket.getDirection() == 180){
				if(rocket.overlap(paddleL)){
					stopPaddle(1);
				}
			}
			else if(rocket.getDirection() == 0){
				if(rocket.overlap(paddleR)){
					stopPaddle(2);
				}
			}
		}
		else{
			rocket = null;
		}
	}
}

function score(player){
	//ball back to middle
	ball.position.x = width/2
	ball.position.y = height/2

	paddleL.position.y = height/2
	paddleR.position.y = height/2

	speed = 7;
	powerL = 0;
	powerR = 0;

	stopL = false;
	stopR = false;

	if(player == 1){
		scoreL += ballvalue;
		ball.setSpeed(speed, 180);
		var s= document.getElementById("scoreholder1");
		s.innerHTML  = scoreL;
	}
	if(player == 2){
		scoreR += ballvalue;
		ball.setSpeed(speed, 0);
		var s= document.getElementById("scoreholder2");
		s.innerHTML  = scoreR;
	}

	ballvalue = 1;

	ball.shapeColor = color('#0000FF');

	if(rocket){
			rocket.remove();
	}
	rocket = null;

	despawnpowerup(POWER_TIMER);

	noLoop();

}

function resetgame(){

	allSprites.removeSprites();
	clear();
	despawnpowerup(0);
	clearTimeout(id_of_timeout);
	//document.getElementById("reset").style.display="none";

	speed = 7;
	powerL = 0;
	powerR = 0;

	upL = false;
	downL = false;
	stopL = false;
	upR = false;
	downR = false;
	stopR = false;
	scoreL = 0;
	scoreR = 0;
	ballvalue = 1;
	powerup = null;
	id_of_timeout = null;

	var s= document.getElementById("scoreholder1");
	s.innerHTML  = scoreL;
	var s= document.getElementById("scoreholder2");
	s.innerHTML  = scoreR;

	setup();

	loop();
}

function spawnpowerup(){
		powerup = createSprite(width * 0.3 + (width * 0.4 ) * random(), height * 0.1 + (height * 0.8) * random(), 60, 60);
		powerup.immovable = true;
		pickApower();
		powerup.setCollider('circle');
		powerup.draw = function() {
			fill(powercolor);
			ellipse(0,0,powerup.width);
		}
		powerup.life = Math.trunc(getFrameRate() * 15);
}

function despawnpowerup(spawndelay){
	if(powerup){
			powerup.remove();
			if(spawndelay != 0){
				id_of_timeout = setTimeout(function(){
					spawnpowerup();
				}, spawndelay + 10000 * random());
		}
	}
	powerup = null;
}

function usepowerup(){
		despawnpowerup(POWER_TIMER);
		if(ball.getDirection() > 90 & ball.getDirection()<270){
			powerfunction(2);
		} else {
			powerfunction(1);
		}
}

function pickApower(){
	var powerID = Math.floor(Math.random()*powerups.length);
	powerfunction = powerups[powerID];
	powercolor = color(powercolors[powerID]);
}

function growPad(user){
	if(user===1){
		paddleL.height = PADDLE_SIZE * 1.5;
		setTimeout(function(){
			paddleL.height = PADDLE_SIZE;
		}, POWER_TIMER);
	}
	if(user===2){
		paddleR.height = PADDLE_SIZE * 1.5;
		setTimeout(function(){
			paddleR.height = PADDLE_SIZE;
		}, POWER_TIMER);
	}
}

function shrinkPad(user){
	if(user===1){
		paddleR.height = PADDLE_SIZE * 0.5;
		setTimeout(function(){
			paddleR.height = PADDLE_SIZE;
		}, POWER_TIMER);
	}
	if(user===2){
		paddleL.height = PADDLE_SIZE * 0.5;
		setTimeout(function(){
			paddleL.height = PADDLE_SIZE;
		}, POWER_TIMER);
	}
}

function ballValue(){
	ballvalue += 1;
	ball.shapeColor = color('#D4AF37');
}

function shootRocket(user){
	var direction, x, y, col;
	if(user==1){
		x = paddleL.position.x;
		y = paddleL.position.y;
		col = paddleL.shapeColor
		direction = 0;
	}
	if(user==2){
		user=-1;
		x = paddleR.position.x;
		y = paddleR.position.y;
		col = paddleR.shapeColor
		direction = 180;
	}

	rocket = createSprite(x+20*user, y, 10, 10);
	rocket.maxSpeed = 5;
	rocket.shapeColor = col;
	rocket.draw = function () {
		fill(col);
		stroke(col);
		triangle(0, 10, 0, -10, user*20, 0);
	}
	rocket.setSpeed(speed, direction);
	drawSprite(rocket);
}

function powershot(user){
	if(user==1){
		powerL = 5;
	}
	if(user==2){
		powerR = 5;
	}
}
