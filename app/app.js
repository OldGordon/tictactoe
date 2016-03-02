/*jslint browser: true*/
/*jslint node: true*/
/*jshint strict: false*/
/*global $, jQuery, alert*/

$(document).ready(function () {
	'use strict';
	var playerOn = {
		player: 1,
		cpu: 2
	},
		gameState = {
			playing: 0,
			waiting: 1,
			over: 2
		};
	//constructor for the game board
	var Board = function () {
		this.board = [];
		this.cells = [];
		for (var i = 0; i < 9; i++) {
			this.cells[i] = $("item" + i + 1);
		}

	};
	//this reset to 0 every cell in the board.Return nothing
	Board.prototype.reset = function() {
		this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	};
	//checks if a cell is empty.Return Bool
	Board.prototype.emptyCell = function(cell) {
		return (this.board[cell] === 0 );
	};
	//write a cell with the value passed
	Board.prototype.writeCell = function(cell, value) {
		this.board[cell] = value;
	};
	//This checks if we have the same token in  vertical , horizontal and diagonal lines
    Board.prototype.checkWin = function (player, board) {
		if (
			(board[0] === player && board[1] === player && board[2] === player) ||
			(board[3] === player && board[4] === player && board[5] === player) ||
			(board[6] === player && board[7] === player && board[8] === player) ||
			//horizontal lines
			(board[0] === player && board[3] === player && board[6] === player) ||
			(board[1] === player && board[4] === player && board[7] === player) ||
			(board[2] === player && board[5] === player && board[8] === player) ||
			//vertical lines
			(board[0] === player && board[4] === player && board[8] === player) ||
			(board[2] === player && board[4] === player && board[6] === player)
			//diagonal lines
		) {
			return true;
		} else {
			return false;
		}

	};
	//this function checks if the board is complete return true
	Board.prototype.checkTie = function () {

		//if we found an empty cell the game is not over
		for (var i = 0; i < 9; i++) {
			if (this.board[i] === ""){
				return true;
			}
		}
		return false;
	};
	//we draw the X or O corresponding to the player or cpu turn
	Board.prototype.drawToken = function () {
		for (var i = 0; i < 9; i++) {

			if(this.board[i] === 0) {
				this.cells[i].innerHTML = "";
			} else {
				if (this.board[i] === playerOn.player){
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
		this.state = null;
		this.reset();
	};
	//checks if a value is even or not
	Game.prototype.isEven = function(value) {
		return (value % 2 === 0) ? true : false;
	};
	//sends a message to a HTML container
	Game.prototype.showMessage = function(info) {
		this.message.innerHTML = info;
	};
	//First move for the cpu is random. Return number
	Game.prototype.randomCell = function() {
		return Math.floor(Math.random() * 9);
	};

	//when starts a new game makes start either the cpu or    //player. this is for even games starts the cpu.
	Game.prototype.reset = function() {
		this.board.reset();
		if(!this.isEven(this.turn)) {
			this.state = gameState.waiting;
			this.showMessage("Your turn");
			this.writeCell(this.randomCell, playerOn.cpu);
		} else {
			this.turn++;
			this.state = gameState.playing;
			this.showMessage("Player turn");
			this.drawToken();
		}
	};

	Game.prototype.startMove = function(num) {

		if (this.state === gameState.playing) {

			if (this.board.emptyCell(num)) {
				this.board.drawToken(playerOn.player, num);
				if (this.board.checkWin(playerOn.player)) {
					this.state = gameState.over;
					this.showMessage("You Win");
				} else if (this.checkTie()) {
					this.state = gameState.over;
					this.showMessage("A tie");
				} else {
					this.state = gameState.waiting;
					this.showMessage("Cpu turn");
					this.findMove();
					if(this.board.checkWin(playerOn.cpu)) {
						this.state = gameState.over;
						this.showMessage("Cpu win");
					} else if (!this.board.checkTie()) {
						this.state = gameState.over;
						this.showMessage("A tie");
					} else {
						this.showMessage("Player turn");
						this.state = gameState.playing;
					}
				}
			}
			this.board.drawToken();
		} else if (this.state === gameState.over) {
			this.reset();
				}
	};

	Game.prototype.findMove = function () {
		var bestMove = -99,
			prevMove = -99,
			pos = 0;
		for (var i = 0; i < 9; i++) {
			if (this.board.emptyCell(i)) {
				this.board.writeCell( i, playerOn.cpu);
				prevMove = this.minMax();
				if (prevMove > bestMove) {
					bestMove = prevMove;
					pos = i;
				}
				this.board.writeCell(0, i);
			}

		}
		this.board.writeCell(playerOn.cpu, pos);
	};

	Game.prototype.minMax = function() {
		var prev, bestMove = 99;

		if (this.board.checkWin(playerOn.cpu)) return 1;
		if (this.board.checkTie()) return 0 ;
		for (var i = 0; i < 9; i++) {
			if (this.board.emptyCell(i)) {
				this.board.writeCell(playerOn.player, i);
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
		var prev, bestMove = -99;

		if (this.board.checkWin(playerOn.player)) return -1;
		if (this.board.checkTie()) return 0 ;
		for (var i = 0; i < 9; i++) {
			if (this.board.emptyCell(i)) {
				this.board.writeCell(playerOn.player, i);
				prev = this.minMax();
				if (prev > bestMove) {
					bestMove = prev;
				}
				this.board.writeCell(0, i);
			}
		}
		return bestMove;

	};


});































