/*jslint browser: true*/
/*jslint node: true*/
/*jshint strict: false*/
/*global $, jQuery, alert*/

$(document).ready(function () {
	'use strict';
	var player = 1,
		cpu = 2,
		playing = 0,
		waiting = 1,
		over = 2;

	//constructor for the game board
	var Board = function () {
		//to keep playerOn values
		this.board = [];
		//to write the "X" or "O" symbols
		this.cells = [];
		//getting the elements of the dom
		for (var i = 0; i < 9; i++) {
			this.cells[i] = document.getElementById("item" + (i + 1));
			//console.log(this.cells);
		}

	};
	//this reset to 0 all the board in the board.Return nothing
	Board.prototype.reset = function() {
		this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	};
	//checks if a cell is empty.Return Bool
	Board.prototype.isEmptyCell = function(cell) {
		return (this.board[cell] === 0 );
	};
	//write a cell with the value passed
	Board.prototype.writeCell = function(value, num) {
		this.board[num] = value;
		console.log(value , num);
	};
	//This checks if we have the same token in  vertical , horizontal and diagonal lines
    Board.prototype.checkWin = function (player) {
		//console.log(this.cells);
		if (
			(this.board[0] === player && this.board[1] === player && this.board[2] === player) ||
			(this.board[3] === player && this.board[4] === player && this.board[5] === player) ||
			(this.board[6] === player && this.board[7] === player && this.board[8] === player) ||
			//horizontal lines
			(this.board[0] === player && this.board[3] === player && this.board[6] === player) ||
			(this.board[1] === player && this.board[4] === player && this.board[7] === player) ||
			(this.board[2] === player && this.board[5] === player && this.board[8] === player) ||
			//vertical lines
			(this.board[0] === player && this.board[4] === player && this.board[8] === player) ||
			(this.board[2] === player && this.board[4] === player && this.board[6] === player)
			//diagonal lines
		) {
			//console.log(board[6]);
			return true;
		} else {
			return false;
		}

	};
	//this function checks if the board is complete return true
	Board.prototype.checkTie = function () {

		//if we found an empty cell the game is not over
		for (var i = 0; i < 9; i++) {

			if (this.board[i] === 0){
				return true;
			}
		}
		return false;
	};
	//we draw the X or O corresponding to the player or cpu turn
	Board.prototype.drawToken = function () {
		for (var i = 0; i < 9; i++) {
			//if the square is empty
			if(this.board[i] === 0) {
				this.cells[i].innerHTML = "";
			} else {
				if (this.board[i] === player){
					this.cells[i].innerHTML = "X";
				} else {
					this.cells[i].innerHTML = "O";
				}
			}
		}
	};
	//constructor for the Game class
	var Game = function () {
		this.board = new Board();
		this.message = $("message");
		this.turn = 0;
		this.state = 9;
		this.reset();
	};
	//checks if a value is even or not
	Game.prototype.isEven = function(value) {
		return (value % 2 === 0) ? true : false;
	};
	//sends a message to a HTML container
	Game.prototype.showMessage = function(info) {
		var message = document.getElementById("message");
		message.innerHTML = info;
		console.log(info);
	};
	//First move for the cpu is random. Return number
	Game.prototype.randomCell = function(min,max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	//when starts a new game makes start either the cpu or    //player. this is for even games starts the cpu.
	Game.prototype.reset = function() {
		this.board.reset();
		if(!this.isEven(this.turn)) {
			this.state = waiting;
			this.showMessage("Your turn");
			this.board.writeCell(cpu, this.randomCell(0, 9));
		} else {
			this.turn++;
			this.state = playing;
			this.showMessage("Player turn");
			this.board.drawToken();
		}
	};
 	//when a square is clicked this event is launch
	Game.prototype.startMove = function(num) {

		if (this.state === playing) {

			if (this.board.isEmptyCell(num)) {

				this.board.writeCell(player, num);

				if (this.board.checkWin(player)) {
					this.state = over;
					this.showMessage("You Win");

				} else if (!this.board.checkTie()) {
					this.state = over;
					this.showMessage("A tie");

				} else {
					this.state = waiting;

					this.showMessage("Cpu turn");

					this.findMove();

					if(this.board.checkWin(cpu)) {
						this.state = over;
						this.showMessage("Cpu win");

					} else if (!this.board.checkTie()) {

						this.state = over;

						this.showMessage("A tie");

					} else {
						this.showMessage("Player turn");

						this.state = playing;
					}
				}
			}

			this.board.drawToken();
		} else if (this.state === over) {
			this.game.reset();
				}
	};

	Game.prototype.findMove = function () {
		var bestMove = -100,
			prevMove = -100,
			pos = 0;
		for (var i = 0; i < 9; i++) {
			if (this.board.isEmptyCell(i)) {
				this.board.writeCell(cpu, i );
				prevMove = this.minMax();
				if (prevMove > bestMove) {
					bestMove = prevMove;
					pos = i;
				}
				this.board.writeCell(0, i);
			}

		}
		this.board.writeCell(cpu, pos);
	};

	Game.prototype.minMax = function() {
		var prev, bestMove = 100;

		if (this.board.checkWin(cpu)) return 1;
		if (!this.board.checkTie()) return 0 ;
		for (var i = 0; i < 9; i++) {
			if (this.board.isEmptyCell(i)) {
				this.board.writeCell(cpu, i);
				prev = this.maxMin();
				if (prev < bestMove) {
					bestMove = prev;
				}
				this.board.writeCell(0, i);
			}
		}
		return bestMove;

	};

	Game.prototype.maxMin = function() {
		var prev, bestMove = -100;

		if (this.board.checkWin(player)) return -1;
		if (!this.board.checkTie()) return 0 ;
		for (var i = 0; i < 9; i++) {
			if (this.board.isEmptyCell(i)) {
				this.board.writeCell(cpu, i);
				prev = this.minMax();
				if (prev > bestMove) {
					bestMove = prev;
				}
				this.board.writeCell(0, i);
			}
		}
		return bestMove;

	};

	var game = new Game();
	$(".item").click(function() {
		console.log(parseInt(this.getAttribute("num")));
		game.startMove(parseInt(this.getAttribute("num")));

	});

});































