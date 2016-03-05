/*jslint browser: true*/
/*jslint node: true*/
/*jshint strict: false*/
/*global $, jQuery, alert*/

	var player = 1,
		cpu = 2,
		playing = 0,
		waiting = 1,
		over = 2;

	//constructor for the game board
	var Board = function () {

		//we keep here 1,2 or 0 if the cell is empty
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
	Board.prototype = function() {

		var reset = function() {
		this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		},

	//checks if a cell is empty.Return Bool
		isEmptyCell = function(val) {
			return (this.board[val] === 0 );
		},
	//write a cell with the value passed
		writeCell = function(num, cell) {
			this.board[cell] = num;

		},
	//This checks if we have the same token in  vertical , horizontal and diagonal lines
    	checkWin = function(player) {
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

		},
	//this function checks if the board is complete return true
		checkTie = function () {

		//if we found an empty cell the game is not over
			for (var i = 0; i < 9; i++) {
				//console.log(this.board[i]);
				if (this.board[i] === 0) {
					return true;
				}
			}
			return false;
	},


	//we draw the X or O corresponding to the player or cpu turn
		drawToken = function () {
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
		return {
			reset: reset,
			isEmptyCell: isEmptyCell,
			writeCell: writeCell,
			checkWin: checkWin,
			checkTie: checkTie,
			drawToken: drawToken
		};
	}();

	//constructor for the Game class
	var Game = function () {
		this.board = new Board();
		this.message = $("message");
		this.turn = 0;
		this.state = null;
		this.reset();

	};


	Game.prototype = function() {
	//checks if a value is even or not
		isEven = function(value) {
			return (value % 2 === 0) ? true : false;
		},
	//sends a message to a HTML container
		showMessage = function(info) {
			var message = document.getElementById("message");
			message.innerHTML = info;
			//console.log(info);
		},
	//First move for the cpu is random. Return number
		randomCell = function(min,max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
		},

	//when starts a new game makes start either the cpu or    //player. this is for even games starts the cpu.
		reset = function() {
			this.board.reset();
			if(!this.isEven(this.turn)) {
				this.state = waiting;
				this.showMessage("Cpu turn");
				this.board.writeCell(cpu, this.randomCell(0, 9));

			}
				this.turn++;
				this.state = playing;
				this.showMessage("Player turn");
				this.board.drawToken();

		},
 	//when a square is clicked this event is launch
		startMove = function(num) {

				if (this.state === playing) {

					if (this.board.isEmptyCell(num)) {

						this.board.writeCell(1, num);

						if (this.board.checkWin(player)) {
							this.state = over;
							this.showMessage("You Win");

						} else if (!this.board.checkTie()) {
							this.state = over;
							this.showMessage("A tie");

						} else {
							this.state = waiting;
							this.showMessage("Cpu turn2");
							//initiate the AI
							this.findMove();

							if(this.board.checkWin(cpu)) {
								this.state = over;
								this.showMessage("Cpu wins");

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

				} else if (this.state == over) {
							this.reset();
						}
		},

		findMove = function () {
			var bestMove = -100,
				prevMove = -100,
				pos = 0;
			for (var i = 0; i < 9; i++) {
				if (this.board.isEmptyCell(i)) {
					this.board.writeCell(cpu, i);
					prevMove = this.minMax();
					if (prevMove > bestMove) {
						bestMove = prevMove;
						pos = i;
					}
					this.board.writeCell(0, i);
				}

			}
			this.board.writeCell(cpu, pos);
		},

		minMax = function() {
			var prevMove, bestMove = 100;

			if (this.board.checkWin(cpu)) return 1;
			if (!this.board.checkTie()) return 0 ;
			for (var i = 0; i < 9; i++) {
				if (this.board.isEmptyCell(i)) {
					this.board.writeCell(player, i);
					prevMove = this.maxMin();
					if (prevMove < bestMove) {
						bestMove = prevMove;
					}
					this.board.writeCell(0, i);
				}
			}
			return bestMove;

		},

		maxMin = function() {
			var prevMove, bestMove = -100;

			if (this.board.checkWin(player)) return -1;
			if (!this.board.checkTie()) return 0 ;
			for (var i = 0; i < 9; i++) {
				if (this.board.isEmptyCell(i)) {
					this.board.writeCell(cpu, i);
					prevMove = this.minMax();
					if (prevMove > bestMove) {
						bestMove = prevMove;
					}
					this.board.writeCell(0, i);
				}
			}
			return bestMove;

		};

	return {

		isEven: isEven,
		showMessage: showMessage,
		randomCell: randomCell,
		reset: reset,
		startMove: startMove,
		findMove: findMove,
		minMax: minMax,
		maxMin: maxMin

	};
}();
$(document).ready(function () {
	'use strict';

		var game = new Game();

	$(".item").click(function() {
		//console.log(parseInt(this.getAttribute("num")));

		//we get the value of attribute num as a string and we pass it as a integer
		game.startMove(parseInt(this.getAttribute("num")));

	});

});






























