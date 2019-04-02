var paddleL, paddleR, ball, wallTop, wallBottom, ball2;
var MAX_SPEED = 15;
var speed = 7;

var upL = false;
var downL = false;
var upR = false;
var downR = false;

var PADDLE_SIZE = 100;

var scoreL = 0;
var scoreR = 0;
var MAX_SCORE = 5;

var font;
var fontsize = 40;


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
	ball.draw = function () {
		fill(0,0,255,255);
		stroke(0,0,255);
		ellipse(0, 0, 25, 25);
	}
	ball.setSpeed(speed, 180);

	ellipse(width/2, height/2+30, 25, 25);


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
	ball.position.x = width/2
	ball.position.y = height/2

	paddleL.position.y = height/2
	paddleR.position.y = height/2

	speed = 7;

	if(player == 1){
		scoreL += 1;
		ball.setSpeed(speed, 180);
		var s= document.getElementById("scoreholder1");
		s.innerHTML  = scoreL;
	}
	if(player == 2){
		scoreR += 1;
		ball.setSpeed(speed, 0);
		var s= document.getElementById("scoreholder2");
		s.innerHTML  = scoreR;
	}

	noLoop();

}
