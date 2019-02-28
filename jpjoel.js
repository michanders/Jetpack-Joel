const JOEL = document.getElementById('jpjoel');
const SHIP = document.getElementById('ship');
const FLAME = document.getElementById('flame');
const GAME = document.getElementById('game');
const AUDIO = document.getElementById('hsaudio');
const SB = document.getElementById('scoreboard');
const JBOMB = document.getElementById('jbomb');
const AST = document.getElementsByClassName('ast');
const GAME_WIDTH = $('#game').width();
const GAME_HEIGHT = $('#game').height();
const START = document.getElementById('start');
const ABOUT = document.getElementById('about');
const ENDGAME = document.getElementById('endgame');
var OBJECTTYPE = [];
const FUELTANK = [];
var bombs = document.getElementById('bombs');
var stars = true;
var counter = -1;
var cdown = 6;
var cursor = 0;
var KC = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
var gameInterval = null;
var countInterval = null;
var fuelTankInterval = null;
var ghostInterval = null;
var jBombInterval = null;
var displayEndInterval = null;
var ghost = null;
var bomb = null;
var fuel = 100;
var astint = 1500;
var id = null;
var endgame = null;

function checkImpact(obj){
	var left = positionToInteger(obj.style.right) + 25;
	if (left < GAME.clientWidth - 180 || left > GAME.clientWidth - 151){
		return false;
	}
	else if (obj.className === 'ast2'){
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
			else if (obj.className === 'bomb') {
				obj.remove();
				bombs.innerHTML = "J-Bomb: " + 1;
				bomb = true;
				clearInterval(jBombInterval)
			}
			else if (obj.className === 'stars'){
				return false;
			}
			else if (ghost === true){
				return false;
			}
			else {
				if (endgame != true) {
					return true;
				}
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
      $('#jpjoel').animate({left: '-=200'}, 1000);
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
	  fuel -= .05;
	  var joelTop = JOEL.style.top.replace('px', '');
	  var joelt = parseInt(joelTop, 10);
	  if (joelt > 0) {
		$('#jpjoel').animate({top: '-=5'}, 0);
		id = requestAnimationFrame(moveJoelUp);
	  }
	  else if (joelt = 10 && ghost === true) {
		$('#jpjoel').animate({top: '+444'}, 0);
		id = requestAnimationFrame(moveJoelUp);
	  }
	  else if (joelt = 10 && ghost != true) {
		endGame();
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
  if (joelt >= 445 && ghost != true) {
	endGame();
  }
  else if (joelt > 445 && ghost === true) {
  	$('#jpjoel').animate({top: '-25'}, 0);
  }
}
	
function moveShip(){
  start();
  SHIP.style.transform = 'rotate(-5deg)';
  $('#ship').animate({left: '-=200', top: '+=150'}, 2500);
  GAME.removeEventListener('mousedown', takeoff);
  GAME.removeEventListener('touchstart', takeoff);
  window.addEventListener('keydown', jBomb);
  window.addEventListener('touchstart', jBomb);
  window.addEventListener('mouseup', thrustoff);
  window.addEventListener('mousedown', thrust);
  window.addEventListener('touchstart', thrust);
  window.addEventListener('touchend', thrustoff);
  id = requestAnimationFrame(moveJoelUp);
}
 
function thrust(e){
  e.preventDefault();
  e.stopPropagation();
  cancelAnimationFrame(id);
  if (e.type === 'touchstart' || e.type === 'mousedown') {
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
  if (e.type === 'mousedown' || e.targetTouches.length > 1){
	moveShip();
	FLAME.style.display = 'inline-block';
	$('#jpjoel').animate({top: '-=5'}, 0);
  }
}

function jBomb(e) {
	e.preventDefault();
    e.stopPropagation();
	if (bomb === true && (e.which === 66 || e.targetTouches.length > 1)) {
		bomb = false;
		JBOMB.style.opacity = 1;
		JBOMB.style.zIndex = 1;
		bombs.innerHTML = "J-Bomb: " + 0;
		jBomber();
		setjBombInterval();
		for (var x = 0; x < OBJECTTYPE.length; x++){
			if (OBJECTTYPE[x].className === 'ast'){
				OBJECTTYPE[x].className = 'ast2';
				OBJECTTYPE[x].remove();
			}
		}
	}
}

function jBomber() {
  JBOMB.style.opacity -= .1;
  JBOMB.style.opacity === .1 ? JBOMB.style.opacity = 0 : setTimeout(jBomber, 250);
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
	if (stars === true) {
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
}

function display() {
	if(cdown >=1){
		cdown--;
	}
	ENDGAME.innerHTML = "Game Over!!! " + "<br />" + "Score: " + counter + "<br />" + "New Game in... " + cdown;
}

function endGame(){
  endgame = true;
  window.removeEventListener('mousedown', thrust);
  window.removeEventListener('mouseup', thrustoff);
  window.removeEventListener('touchstart', thrust);
  window.removeEventListener('touchend', thrustoff);
  cancelAnimationFrame(id);
  clearInterval(gameInterval);
  clearInterval(asteroidInterval);
  clearInterval(ghostInterval);
  clearInterval(jBombInterval);
  clearInterval(scoreInterval);
  clearInterval(fuelInterval);
  display();
  setInterval(display, 1000);
  setTimeout(reload, 5000);
}


function reload() {
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

function setjBombInterval() {
	if (bomb != true) {
		jBombInterval = setInterval(function() {
    		createFlyingObj('bomb' , Math.floor(Math.random()*(GAME_HEIGHT)), 0, 3)}
  		,20000);
	}
}

function joelGhost() {
	JOEL.style.opacity = 1;
	ghost = false;
}

function start() {
	
  AUDIO.play();
  AUDIO.volume = 0.4;
  
  START.style.opacity = 0;
  ABOUT.style.display = 'none';
  
  scoreInterval = setInterval(displayScore, 1000);
  fuelInterval = setInterval(displayFuel, 100);
  
  fuelTankInterval = setInterval(function() {
    createFlyingObj('fueltank' , Math.floor(Math.random()*(GAME_HEIGHT)), 0, 3)}
  , 50000);
  
  ghostInterval = setInterval(function() {
    createFlyingObj('ghost' , Math.floor(Math.random()*(GAME_HEIGHT)), 0, 3)}
  , 35000);
  
  setjBombInterval();
  
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

document.addEventListener('keydown', (e) => {
  cursor = (e.keyCode == KC[cursor]) ? cursor + 1 : 0;
  if (cursor == KC.length) {
  	openInNewTab('https://liblib.herokuapp.com/');
  }
});

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
};

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)){
	stars = false;
	AUDIO.style.display = "none";
	START.innerHTML = "DOUBLE TAP to Start";
	GAME.addEventListener('touchstart', takeoff);
	GAME.style.width = "95%";
	GAME.style.borderBottom = '2px solid white';
	SB.style.width = "95%";
	JBOMB.style.width = "95%";
	ABOUT.style.width = "95%";
	ABOUT.style.left = "2.5%";
	ABOUT.style.fontSize = "28px";
	JBOMB.style.left = "2.5%";
	window.addEventListener('touchstart', musicOn);
}

function musicOn(e){
	if (e.targetTouches.length > 3) {
		AUDIO.muted == true ? AUDIO.muted = false : AUDIO.muted = true;
	}
}

spacePhysics();
displayScore();
displayFuel();
bombs.innerHTML = "J-Bomb: " + 0;
GAME.addEventListener('mousedown', takeoff);




