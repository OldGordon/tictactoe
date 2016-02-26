/*jslint browser: true*/
/*jslint node: true*/
/*jshint strict: false*/
/*global $, jQuery, alert*/

$(document).ready(function () {
	'use strict';

	var Game = function () {
		this.player1 = "X";
		this.player2 = "O";

	};
	Game.prototype.checkBoard = function () {
		var board = [];
		for (var i = 0; i < 9 ; i++) {
			board[i] = $("#item" + (i + 1)).html();
		}
		return board;

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

		var board = this.checkBoard(),
			arrLengh = board.length;
		//if we found an empty cell the game is not over
		for (var i = 0; i < arrLengh; i++) {
			if (board[i] === ""){
				return false;
			}
		}
		return  true;
	};
	//this provide to the game logic where CPU can do a valid move
	Game.prototype.emptyCells = function (i, maxmin, board) {
		//we need a new board
		var newBoard = this.checkBoard();
		if(newBoard[i] === ""){
			newBoard[i] = maxmin;
			return newBoard;
		} else {
			return false;
		}



	};
});































