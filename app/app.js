/*jslint browser: true*/
/*jslint node: true*/
/*jshint strict: false*/
/*global $, jQuery, alert*/

$(document).ready(function () {
	'use strict';

	var Game = function () {
		this.cpuMax = 2;
		this.cpuMin = 1;
		this.board = [];

	};

	Game.prototype.getBoard = function () {

		for (var i = 0; i < 9 ; i++) {
			this.board[i] = $("#item" + (i + 1)).html();
		}
		return this.board;

	};

	//This checks if we have the same token in  vertical , horizontal and diagonal lines
    Game.prototype.checkWin = function (player, board) {
		if (
			(board[0] === player && board[1] === player && board[2] === player) ||
			    (board[3] === player && board[4] === player && board[5] === player) ||
			    (board[6] === player && board[7] === player && board[8] === player) ||
			    (board[0] === player && board[3] === player && board[6] === player) ||
			    (board[1] === player && board[4] === player && board[7] === player) ||
			    (board[2] === player && board[5] === player && board[8] === player) ||
			    (board[0] === player && board[4] === player && board[8] === player) ||
			    (board[2] === player && board[4] === player && board[6] === player)
		) {
			return true;
		} else {
			return false;
		}

	};
	//this function checks if the board is complete return false
	Game.prototype.checkTie = function () {

		var board = this.getBoard();

		//if we found an empty cell the game is not over
		for (var i = 0; i < 9; i++) {
			if (board[i] === ""){
				return false;
			}
		}
		return  true;
	};
	//this provide to the game logic where CPU can do a valid move
	Game.prototype.cpuPlay = function (i, maxMin, board) {
		//we need a new board
		var newBoard = this.getBoard();
		if(newBoard[i] === ""){
			newBoard[i] = maxMin;
			return newBoard;
		} else {
			return false;
		}
	};

	Game.prototype.emptyCell = function (board) {
		var bestCell = -10,
			rank = 0;
		for (var i = 0; i < 9; i++) {
			var newBoard = this.cpuPlay(i, rank, board);
			if(newBoard){
				var netxValue = this.maxmin(newBoard);
				if (netxValue < bestCell) {
					netxValue = bestCell;
					rank = i;

				}
			}
		}
		return rank;
	};
	Game.prototype.maxMin = function(board) {
		if(this.checkWin(this.cpuMax, board)){
			return 1;
		} else if (this.checkWin(this.cpuMin, board)) {
			return -1;
		} else if (this.checkTie(board) ){
			return 0;
		} else {


		}
	};
});































