const JOEL = document.getElementById('jpjoel');
const SHIP = document.getElementById('ship');
const FLAME = document.getElementById('flame');
const GAME = document.getElementById('game');
const GAME_WIDTH = $('#game').width();
const GAME_HEIGHT = $('#game').height();
const THRUSTER = 32 // use e.which;
const START = document.getElementById('start');
const ABOUT = document.getElementById('about');
const SPACER = document.getElementById('spacer');
var counter = 0;
const OBJECTTYPE = [];
const FUELTANK = [];
var gameInterval = null;
var countInterval = null;
var fuelTankInterval = null;
var ghostInterval = null;
var ghost = null;
var fuel = 100;
var astint = 1500;
var id = null;
var spacebar = false;
var mouseStillDown = null;

function checkImpact(obj){
	var left = positionToInteger(obj.style.right) + 25;
	if (left < GAME.clientWidth - 180 || left > GAME.clientWidth - 151){
		return false;
	}
	else if (left > GAME.clientWidth - 180 || left > GAME.clientWidth - 150) {
		const joelTop = positionToInteger(JOEL.style.top);
		const joelBottom = joelTop + 55;
		const objTop = positionToInteger(obj.style.top);
		const objBottom = objTop + 25;
		if (objTop < joelTop && objBottom > joelTop ||
		  objTop >= joelTop && objBottom <= joelBottom ||
		  objTop < joelBottom && objBottom > joelBottom){
			if (obj.className === 'fueltank'){
				fuel = 99;
				obj.remove();
			}
			else if (obj.className === 'ghost') {
				ghost = true;
				JOEL.style.opacity = .5;
				obj.remove();
				setTimeout(joelGhost, 10000);
			}
			else if (obj.className === 'stars'){
				return false;
			}
			else if (ghost === true){
				return false;
			}
			else {
				return true;
			}
		}
	}
}

function createFlyingObj(objectType, objectTop, objectRight = 0, velocity = 2){
  const obj = document.createElement('div');
  obj.className = `${objectType}`;
  obj.style.top = `${objectTop}px`;
  var right = objectRight;
  obj.style.right = right;
  GAME.appendChild(obj);
  function moveObj(){
	obj.style.right = `${right += velocity}px`;
    if (checkImpact(obj)){
      endGame();
    }
    if(right > 0 && right <= GAME.clientWidth){
      window.requestAnimationFrame(moveObj);
    }
    else{
      obj.remove();
    }
  }
  window.requestAnimationFrame(moveObj);
  OBJECTTYPE.push(obj);
  return obj;
}

function moveJoelUp(){
  ABOUT.style.display = 'none';
  FLAME.style.display = 'inline-block';
  if (fuel < 11 ) {
	  document.getElementById('fuel').style.color = 'red';
  }
  if (fuel > 1) {
	  fuel -= .1;
	  var joelTop = JOEL.style.top.replace('px', '');
	  var joelt = parseInt(joelTop, 10);
	  if (joelt > 0) {
		$('#jpjoel').animate({top: '-=6'}, 0);
	  }
	  else if (joelt = 0) {
		$('#jpjoel').animate({top: '+5'}, 0);
	  }
  }
  else {
	  moveJoelDown();
  }
}

function moveJoelDown(){
  var joelTop = JOEL.style.top.replace('px', '');
  var joelt = parseInt(joelTop, 10);
  $('#jpjoel').animate({top: '+=3'}, 0);
  id = requestAnimationFrame(moveJoelDown);
  if (joelt >= 445 ) {
	endGame();
  }
}
	
function moveShip(){
  start();
  SHIP.style.transform = 'rotate(-5deg)';
  $('#ship').animate({left: '-=200', top: '+=150'}, 2500);
  removeEventListener('keydown', takeoff);
  removeEventListener('touchstart', takeoff);
  window.addEventListener('keyup', thrustoff);
  window.addEventListener('keydown', thrust);
  window.addEventListener('touchend', thrustoff);
  window.addEventListener('touchstart', thrust);
}
 
function thrust(e){
  e.preventDefault();
  e.stopPropagation();
  cancelAnimationFrame(id);
  if (e.which === 32 || e.type === 'touchstart') {
    moveJoelUp();
  }
  else {
	moveJoelDown();
  }
}

function thrustoff(e){
	cancelAnimationFrame(id);
	e.preventDefault();
	e.stopPropagation();
	FLAME.style.display = 'none';
	moveJoelDown();
}

function takeoff(e) {
  e.preventDefault();
  e.stopPropagation();
  if (e.which === 32 || e.type === 'touchstart'){
	moveShip();
	FLAME.style.display = 'inline-block';
	$('#jpjoel').animate({top: '-=5'}, 0);
  }
}

function displayScore() {
	var times = document.getElementById('count');
	counter++;
	times.innerHTML = "Score: " + counter;
}

function displayFuel(){
	var fuels = document.getElementById('fuel');
    fuels.innerHTML = "Fuel: " + parseInt(fuel);
}

function positionToInteger(p) {
  return parseInt(p.split('px')[0]) || 0
}

function spacePhysics(){
	starsInterval = setInterval(function() {
    createFlyingObj('stars', Math.floor(Math.random()*(GAME_HEIGHT)), 
	Math.floor(Math.random()*(GAME_WIDTH)), .5)}
  , 800);
  
  starsInterval = setInterval(function() {
    createFlyingObj('stars', Math.floor(Math.random()*(GAME_HEIGHT)), 
	Math.floor(Math.random()*(GAME_WIDTH)), 1)}
  , 700);
  
  starsInterval = setInterval(function() {
    createFlyingObj('stars', Math.floor(Math.random()*(GAME_HEIGHT)), 
	Math.floor(Math.random()*(GAME_WIDTH)), 2.5)}
  , 500);
}

function endGame(){
  window.removeEventListener('keydown', thrust);
  window.removeEventListener('keyup', thrustoff);
  window.removeEventListener('touchstart', thrust);
  window.removeEventListener('touchend', thrustoff);
  cancelAnimationFrame(id);
  clearInterval(gameInterval);
  clearInterval(asteroidInterval);
  clearInterval(ghostInterval);
  alert("Game Over. Score: " + counter)
  clearInterval(scoreInterval);
  clearInterval(fuelInterval);
  window.location.reload(true);
}

function setAsteroidInterval(velocity = 2) {
	if (astint > 50){
		astint -= 100;
	}
	if (counter < 20) {
		velocity = 2;
	}
	else if (counter >= 20 && counter < 40) {
		velocity = 3;
	}
	else if (counter >= 40 && counter < 60) {
		velocity = 4;
	}
	else if (counter >= 60 && counter < 80) {
		velocity = 5;
	}
	else if (counter >= 80 && counter < 100) {
		velocity = 6;
	}
	else if (counter >= 100 && counter < 120) {
		velocity = 7;
	}
	else if (counter >= 120 && counter < 140) {
		velocity = 8;
	}
	else if (counter >= 140 && counter < 160) {
		velocity = 9;
	}
	else if (counter >= 160&& counter < 180) {
		velocity = 10;
	}
	else if (counter >= 180) {
		velocity = 11;
	}
	gameInterval = setInterval(function() {
      createFlyingObj('ast', Math.floor(Math.random()*(GAME_HEIGHT)), 0, Math.random() + velocity)}
    , astint);
}

function joelGhost() {
	JOEL.style.opacity = 1;
	ghost = false;
}

function start() {
  
  var music = document.getElementById("hs_audio");
  music.play();
  music.volume = 0.4;
  
  START.style.opacity = 0;
  ABOUT.style.display = 'none';
  
  scoreInterval = setInterval(displayScore, 1000);
  fuelInterval = setInterval(displayFuel, 100);
  
  fuelTankInterval = setInterval(function() {
    createFlyingObj('fueltank' , Math.floor(Math.random()*(GAME_HEIGHT)), 0, 3)}
  , 50000);
  
  ghostInterval = setInterval(function() {
    createFlyingObj('ghost' , Math.floor(Math.random()*(GAME_HEIGHT)), 0, 3)}
  , 40000);
  
  setAsteroidInterval();
  asteroidInterval = setInterval(setAsteroidInterval, 20000);

}

$(function() {
    $("#aboutjpj").click(function() {
    }, function() {
        $("#about").toggle();
		$("#start").toggle();
    });
});

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)){
	window.addEventListener('touchstart', takeoff);
	START.innerHTML = "TAP to Start";
}

spacePhysics();
window.addEventListener('keydown', takeoff);

