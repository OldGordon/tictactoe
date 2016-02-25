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
});































