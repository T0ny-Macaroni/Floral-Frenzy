// JavaScript Document

var board;
var boardSize = 8;
var candyNum = 5;
var active;
var tileWidth;
var resetButton = document.querySelector('.is-warning');
var saveButton = document.querySelector('.is-info');

var scores = [];

function initBoard() {
	$('#score span').text('0');
	
	board = new Array(boardSize);
	
	// generate board
	for (var i = 0; i < boardSize; i++) {
		board[i] = new Array(boardSize);
		for (var j = 0; j < boardSize; j++) {
			board[i][j] = Math.ceil(candyNum * Math.random());
			
			// check for possible matches
			if (i > 1 && j > 1) {
				while ((board[i - 1][j] == board[i][j] && board[i - 2][j] == board[i][j]) || (board[i][j - 1] == board[i][j] && board[i][j - 2] == board[i][j])) {
					board[i][j] = Math.ceil(candyNum * Math.random());
				}
			}
			else if (i < 2 && j > 1) {
				while (board[i][j - 1] == board[i][j] && board[i][j - 2] == board[i][j]) {
					board[i][j] = Math.ceil(candyNum * Math.random());
				}
			}
			else if (i > 1 && j < 2) {
				while (board[i - 1][j] == board[i][j] && board[i - 2][j] == board[i][j]) {
					board[i][j] = Math.ceil(candyNum * Math.random());
				}
			}
			
			// draw tile
			$('#board > div').append('<div class="tile"><a href="javascript:void(0);" class="candy' + board[i][j] + ' x' + i + ' y' + j + '"><span></span></a></div>');
		}
	}
	
	tileWidth = $('#board .tile').width();
	
	for (var i = 0; i < boardSize; i++) {
		var offset = tileWidth * (boardSize - i - 1);
		$('#board .tile .y' + i).css('left', offset);
		$('#board .tile .x' + i).css('top', offset);
	}
		
	minDist = $('#board .tile a').width() / 2;
	
	// css3 animation settings
	$('#board .tile a').css('transition', 'top 0.3s, left 0.3s, background-color 0.3s, border-color 0.3s')
		.css('-moz-transition', 'top 0.3s, left 0.3s, background-color 0.3s, border-color 0.3s')
		.css('-webkit-transition', 'top 0.3s, left 0.3s, background-color 0.3s, border-color 0.3s')
		.css('-o-transition', 'top 0.3s, left 0.3s, background-color 0.3s, border-color 0.3s')
		.bind('mousedown', function(e) {
			if (active) {
				if ($('a.selected').length > 0 && !$(this).hasClass('selected')) {
					var a = $('.selected');
					$('.selected').removeClass('selected');
					
					swapTiles(a, $(this));
				}
				else {
					$(this).toggleClass('selected');
				}
			}
		})
		.bind('mouseup', function(e) {
			if (active) {
				if ($('a.selected').length > 0 && !$(this).hasClass('selected')) {
					var a = $('.selected');
					$('.selected').removeClass('selected');
					
					swapTiles(a, $(this));
				}
			}
		});
	
	score = 0;
	
	active = true;
	tDamage = window.setTimeout('timeDamage()', 500);
}

function tile(x, y) {
	this.x = x;
	this.y = y;
}

function swapTiles(a, b) {
	active = false;
	var aClass = a.attr('class');
	var ax = parseInt(aClass.slice(aClass.search(' x') + 2, aClass.search(' x') + 3));
	var ay = parseInt(aClass.slice(aClass.search(' y') + 2, aClass.search(' y') + 3));
	
	var bClass = b.attr('class');
	var bx = parseInt(bClass.slice(bClass.search(' x') + 2, bClass.search(' x') + 3));
	var by = parseInt(bClass.slice(bClass.search(' y') + 2, bClass.search(' y') + 3));
	
	if (((ax - bx == 1 || bx - ax == 1) && ay == by) || ((ay - by == 1 || by - ay == 1) && ax == bx)) {
		board[ax][ay] = board[ax][ay] + board[bx][by];
		board[bx][by] = board[ax][ay] - board[bx][by];
		board[ax][ay] = board[ax][ay] - board[bx][by];
		
		aLeft = a.css('left') + '';
		bLeft = b.css('left') + '';
		aTop = a.css('top') + '';
		bTop = b.css('top') + '';
		a.css('left', bLeft);
		b.css('left', aLeft);
		a.css('top', bTop);
		b.css('top', aTop);
		
		a.removeClass('x' + ax + ' y' + ay).addClass('x' + bx + ' y' + by);
		b.removeClass('x' + bx + ' y' + by).addClass('x' + ax + ' y' + ay);
		
		if (checkMatches()) {
		}
		else {
			a.removeClass('x' + bx + ' y' + by).addClass('x' + ax + ' y' + ay);
			b.removeClass('x' + ax + ' y' + ay).addClass('x' + bx + ' y' + by);
			
			c = board[ax][ay];
			board[ax][ay] = board[bx][by];
			board[bx][by] = c;
			
			var t = window.setTimeout(function() {
					a.css('left', aLeft);
					b.css('left', bLeft);
					a.css('top', aTop);
					b.css('top', bTop);
				}, 300);
		}
	}
}

function checkMatches() {
	var matches = new Array(0);
	for (var i = 0; i < boardSize; i++) {
		for (var j = 0; j < boardSize; j++) {
			// check for possible matches
			if (i > 1) {
				if (board[i - 1][j] == board[i][j] && board[i - 2][j] == board[i][j]) {
					var match1 = new Array(0);
					var candyType = board[i][j];
					
					var k = i - 2;
					var cont = true;
					while (cont && k < boardSize) {
						if (board[k][j] == candyType) {
							match1.push(new tile(k, j));
						}
						else {
							cont = false;
						}
						k = k + 1;
					}
					
					matches.push(match1);
				}
			}
			if (j > 1) {
				if (board[i][j - 1] == board[i][j] && board[i][j - 2] == board[i][j]) {
					var match1 = new Array(0);
					var candyType = board[i][j];
					
					var k = j - 2;
					var cont = true;
					while (cont && k < boardSize) {
						if (board[i][k] == candyType) {
							match1.push(new tile(i, k));
						}
						else {
							cont = false;
						}
						k = k + 1;
					}
					
					matches.push(match1);
				}
			}
		}
	}
	
	if (matches.length == 0) {
		var t = window.setTimeout(function() { active = true; }, 300);
		return false;
	}
	else {
		window.clearTimeout(tDamage);
		
		for (var i = 0; i < matches.length; i++) {
			for (var j = 0; j < matches[i].length; j++) {
				board[matches[i][j].x][matches[i][j].y] = 0;
				$('a.x' + matches[i][j].x + '.y' + matches[i][j].y).addClass('match');
				
				var hpWidth = ($('#remaining-hp').width() / $('#hp').width()) * 100 + 3;
				if (hpWidth > 100) {
					hpWidth = 100;
				}
				$('#remaining-hp').width(hpWidth + '%');
				score = score + 10;
			}
		}
		
		tDamage = window.setTimeout('timeDamage()', 500);
		var t = window.setTimeout('removeMatches();', 300);
		
		return true;
	}
}

function removeMatches() {
	updateScore(parseInt($('#score span').text()));
	
	for (var i = 0; i < boardSize - 1; i++) {
		for (var j = 0; j < boardSize; j++) {
			if (board[i][j] == 0) {
				var k = i + 1;
				while (board[k][j] == 0 && k < boardSize - 1) {
					k++;
				}
				if (k == boardSize - 1 && board[k][j] == 0) {
				}
				else {
					var a = $('.x' + k + '.y' + j);
					var b = $('.x' + i + '.y' + j);
					a.css('top', ($('#board .tile').width() * (boardSize - i - 1))).removeClass('x' + k).addClass('x' + i);
					b.removeClass('x' + i).addClass('x' + k).css('top', -tileWidth);
					board[i][j] = board[k][j];
					board[k][j] = 0;
				}
			}
		}
	}
	
		
	var t = window.setTimeout(function() {
			for (var i = 0; i < boardSize; i++) {
				for (var j = 0; j < boardSize; j++) {
					if (board[i][j] == 0) {
						board[i][j] = Math.ceil(candyNum * Math.random());
						$('.x' + i + '.y' + j).css('top', (tileWidth * (boardSize - i - 2)))
							.removeClass().addClass('candy' + board[i][j] + ' x' + i + ' y' + j)
							.css('top', (tileWidth * (boardSize - i - 1)));
					}
				}
			}
			var t2 = window.setTimeout('checkMatches();', 300);
		}, 300);
}

function updateScore(s) {
	if (s < score) {
		s = s + 1;
		$('#score span').text(s);
		var t = window.setTimeout('updateScore(' + s + ')', 10);
	}
}

function printBoard() {
	for (var i = 0; i < boardSize; i++) {
		var s = '';
		for (var j = 0; j < boardSize; j++) {
			s = s + board[i][j] + ' ';
		}
		console.log(s);
	}
}

var tDamage;

function timeDamage() {
	var hpWidth = ($('#remaining-hp').width() / $('#hp').width()) * 100 - 0.2;
	$('#remaining-hp').width(hpWidth + '%');
	
	if (hpWidth < 0) {
		gameOver();
	}
	else {
		tDamage = window.setTimeout('timeDamage()', 500);
	}
}

function gameOver() {
	$('#game-over').fadeIn(200).click(function() {
		$('#board > div .tile').remove();
		$('#remaining-hp').width('100%');
		$('#game-over').fadeOut(500);
		var t = window.setTimeout('initBoard()', 500);
	});
}

function resetBoard() {
	// var board = document.getElementById('board')
	location.reload;

}

function saveScore() {
	console.log(scores);
	scores.push(score);
	localStorage.setItem('score', JSON.stringify(scores));
};

resetButton.addEventListener('click', resetBoard);
saveButton.addEventListener('click', saveScore);



	
