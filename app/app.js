//************************************************************//
//                      Toni Julia                            //
//                       OldGordon                            //
//                      FreeCodeCamp                          //
//                TICTACTOE Game Zipline 2016                     //
//                                                            //
//************************************************************//

/*jslint node: true*/
/*jshint strict: false*/
/*global $, jQuery, alert*/

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
	//@param this reset to 0  the board .Returns nothing
	Board.prototype = (function() {

		var reset = function() {
		this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		},

	//@param bool checks if a cell is empty.Return Bool
		isEmptyCell = function(val) {
			return (this.board[val] === 0 );
		},
	//@param write a cell with the value passed
		writeCell = function(num, cell) {
			this.board[cell] = num;

		},

	//@param bool This checks if we have the same token in  vertical , horizontal and diagonal lines
    	checkWin = function(p) {
			var b = this.board;
		//console.log(this.cells);
			if (
				(b[0] === p && b[1] === p && b[2] === p) ||
				(b[3] === p && b[4] === p && b[5] === p) ||
				(b[6] === p && b[7] === p && b[8] === p) ||
				//horizontal lines
				(b[0] === p && b[3] === p && b[6] === p) ||
				(b[1] === p && b[4] === p && b[7] === p) ||
				(b[2] === p && b[5] === p && b[8] === p) ||
				//vertical lines
				(b[0] === p && b[4] === p && b[8] === p) ||
				(b[2] === p && b[4] === p && b[6] === p)
				//diagonal lines
			) {
				//console.log(board[6]);
				return true;
			} else {
				return false;
			}

		},
	//@param bool this function checks if the board is completed return true
		checkTie = function () {

		//if we found an empty cell the game is not 2
			for (var i = 0; i < 9; i++) {
				//console.log(this.board[i]);
				if (this.board[i] === 0) {
					return true;
				}
			}
			return false;
	},


	//@param we draw the X or O corresponding to the player or cpu turn
		drawToken = function () {
			for (var i = 0; i < 9; i++) {
				//if the square is empty
				if(this.board[i] === 0) {
					this.cells[i].innerHTML = "";
				} else {
					if (this.board[i] === 1){
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
	})();

	//constructor for the Game class
	var Game = function () {
		this.player = 1;
		this.cpu = 2;
		this.board = new Board();
		this.message = $("message");
		this.turn = 0;
		this.state = null;
	};


	Game.prototype = (function() {
	//@param bool checks if a value is even or not

		var isEven = function(value) {
			return  (value % 2 === 0) || false;

		},
	//sends a message to a HTML container
		showMessage = function(info) {
			var message = document.getElementById("message");
			message.innerHTML = info;
			//console.log(info);
		},
	//@param number First move for the cpu is random. Return number
		randomCell = function(min,max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
		},

	//when starts a new game makes start either the cpu or    //player. this is for even games starts the cpu.
		reset = function() {
			this.board.reset();
			if(!isEven(this.turn)) {
				this.state = 1;
				showMessage("Cpu turn");
				this.board.writeCell(this.cpu, randomCell(0, 9));

			}
				this.turn++;
				this.state = 0;
				showMessage("Player turn");
				this.board.drawToken();

		},
 	//when a square is clicked this event is launch
		startMove = function(num) {

				switch(this.state){

					case 0:
						if (this.board.isEmptyCell(num)) {

							this.board.writeCell(1, num);

							if (this.board.checkWin(this.player)) {

								this.state = 2;
								showMessage("You Win");

							} else if (!this.board.checkTie()) {

								this.state = 2;
								showMessage("A tie");

							} else {

								this.state = 1;
								showMessage("Cpu turn");

								//initiate the AI cpu turn
								//console.log(this);
								findMove(this);

								if(this.board.checkWin(this.cpu)) {

									this.state = 2;
									showMessage("Cpu wins");

								} else if (!this.board.checkTie()) {

									this.state = 2;
									showMessage("A tie");

								} else {

									showMessage("Player turn");
									this.state = 0;
								}
							}
						}
						this.board.drawToken();
					    break;
					case 2:
						this.reset();
						break;
				}
		},

		findMove = function (that) {

			var bestMove = -100,
				prevMove = -100,
				pos = 0;
			for (var i = 0; i < 9; i++) {

				if (that.board.isEmptyCell(i)) {
					that.board.writeCell(that.cpu, i);

					prevMove = minMax(that);
					if (prevMove > bestMove) {
						bestMove = prevMove;
						pos = i;
					}
					that.board.writeCell(0, i);
				}

			}
			that.board.writeCell(that.cpu, pos);
		},

		minMax = function(thisObj) {

			var prevMove, bestMove = 100;

			if (thisObj.board.checkWin(thisObj.cpu)) return 1;
			if (!thisObj.board.checkTie()) return 0 ;
			for (var i = 0; i < 9; i++) {
				if (thisObj.board.isEmptyCell(i)) {
					thisObj.board.writeCell(thisObj.player, i);
					prevMove = maxMin(thisObj);
					if (prevMove < bestMove) {
						bestMove = prevMove;
					}
					thisObj.board.writeCell(0, i);
				}
			}
			return bestMove;

		},

		maxMin = function(thisObj) {
			var prevMove, bestMove = -100;

			if (thisObj.board.checkWin(thisObj.player)) return -1;
			if (!thisObj.board.checkTie()) return 0 ;
			for (var i = 0; i < 9; i++) {
				if (thisObj.board.isEmptyCell(i)) {
					thisObj.board.writeCell(thisObj.cpu, i);
					prevMove = minMax(thisObj);
					if (prevMove > bestMove) {
						bestMove = prevMove;
					}
					thisObj.board.writeCell(0, i);
				}
			}
			return bestMove;

		};

	return {

		reset: reset,
		startMove: startMove,

	};
})();
$(document).ready(function () {
	'use strict';

	var game = new Game();
	    game.reset();
	$(".item").click(function() {
		//console.log(parseInt(this.getAttribute("num")));
		//we get the value of attribute num as a string and we pass it as a integer
		game.startMove(parseInt(this.getAttribute("num")));

	});


});

