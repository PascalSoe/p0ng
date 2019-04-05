var paddleL, paddleR, ball, wallTop, wallBottom, powerup;
var MAX_SPEED = 15;
var speed = 7;

var powerfunction;
var POWER_TIMER = 10000;
var POWER_RESPAWN = 5000;
var id_of_timeout;

var upL = false;
var downL = false;
var upR = false;
var downR = false;

var PADDLE_SIZE = 100;

var scoreL = 0;
var scoreR = 0;
var ballvalue = 1;
var MAX_SCORE = 5;

var font;
var fontsize = 40;

var powerups = [
	function(user){
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
	},
	function(user){
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
	},function(user){
		ballvalue += 1;
		ball.shapeColor = color('#D4AF37');
	}

];

var powercolors = ['#08FF15', '#FF0815', '#D4AF37'];

function setup() {
	var cnv = createCanvas(1100,600);
	cnv.parent('sketch-holder');
	cnv.style('display', 'block');
	textSize(fontsize);
	textAlign(CENTER, CENTER);

	//createSprite(x,y,width,height)

	paddleL = createSprite(30, height/2, 10, PADDLE_SIZE);
	paddleL.immovable = true;
	paddleL.shapeColor = color(255,0,0);

	paddleR = createSprite(width - 28, height/2, 10, PADDLE_SIZE);
	paddleR.immovable = true;
	paddleR.shapeColor = color(0,255,0);

	wallTop = createSprite(width/2, -14, width, 30);
	wallTop.immovable = true;
	wallTop.shapeColor = color('white');

	wallBottom = createSprite(width/2, height+14, width, 30);
	wallBottom.immovable = true;
	wallBottom.shapeColor = color('white');

	ball = createSprite(width/2, height/2, 10, 10);
	ball.maxSpeed = MAX_SPEED;
	ball.shapeColor = color('#0000FF');
	ball.draw = function () {
		fill(ball.shapeColor);
		stroke(0,0,255);
		ellipse(0, 0, 25, 25);
	}
	ball.setSpeed(speed, Math.random() < 0.5 ? 0 : 180);

	id_of_timeout = setTimeout(function(){
		spawnpowerup();
	}, POWER_RESPAWN + 5000 * random());

	/* random sprites
	for (x = 1; x <= 10; x++){
		for (y = 1; y <= 5; y++) {
			createSprite(x*100, y*100, 50, 50);
		}
	}
	*/

}

function draw() {
	background(0);

	checkKeys();

	movePaddles();

	moveBall();

	drawSprites();

}

function checkKeys() {

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

function movePaddles() {
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

function moveBall() {
	var bounceAngle;

	ball.bounce(wallTop);
	ball.bounce(wallBottom);


	if(ball.bounce(paddleL)){
		if(speed < MAX_SPEED){
			speed += 1;
		}
		bounceAngle = (ball.position.y - paddleL.position.y) / 2
		ball.setSpeed(speed, ball.getDirection()+bounceAngle);
	}

	if(ball.bounce(paddleR)){
		if(speed < MAX_SPEED){
			speed += 1;
		}
		bounceAngle = (paddleR.position.y - ball.position.y) / 2
		ball.setSpeed(speed, ball.getDirection()+bounceAngle);
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

function score(player) {
	//ball back to middle
	ball.position.x = width/2
	ball.position.y = height/2

	paddleL.position.y = height/2
	paddleR.position.y = height/2

	speed = 7;

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
	upL = false;
	downL = false;
	upR = false;
	downR = false;
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
		powerup = createSprite(40 + (width - 80)*random(), 20 + (height - 20)*random(), 60, 60);
		powerup.immovable = true;
		pickApower();
		//powerup.shapeColor = powercolor;
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


/*
	function growPad(user){
	if(user===1){
		paddleL.height = PADDLE_SIZE * 1.3;
		setTimeout(function(){
			paddleL.height = PADDLE_SIZE;
		}, POWER_TIMER);
	}
	if(user===2){
		paddleR.height = PADDLE_SIZE * 1.3;
		setTimeout(function(){
			paddleR.height = PADDLE_SIZE;
		}, POWER_TIMER);
	}
}
*/
