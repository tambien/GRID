/*==========================================================================================
 _______  _______  __   __  _______  _______  _______  ______    _______  _______  __    _ 
|       ||   _   ||  |_|  ||       ||       ||       ||    _ |  |       ||       ||  |  | |
|    ___||  |_|  ||       ||    ___||  _____||       ||   | ||  |    ___||    ___||   |_| |
|   | __ |       ||       ||   |___ | |_____ |       ||   |_||_ |   |___ |   |___ |       |
|   ||  ||       ||       ||    ___||_____  ||      _||    __  ||    ___||    ___||  _    |
|   |_| ||   _   || ||_|| ||   |___  _____| ||     |_ |   |  | ||   |___ |   |___ | | |   |
|_______||__| |__||_|   |_||_______||_______||_______||___|  |_||_______||_______||_|  |__|

==========================================================================================*/

goog.provide("managers.views.GameScreen");
goog.require("goog.dom");
goog.require("game.views.BoardView");


var GameScreen = {
	/** @type {Element} */
	Screen : goog.dom.createDom("div", {"id" : "GameScreen", "class" : "screen"}),
	initialize : function(){
		//add the BoadView to the GameView
		goog.dom.appendChild(document.body, GameScreen.Screen);
		goog.dom.appendChild(GameScreen.Screen, BoardView.Board);
	}
};

GameScreen.initialize();
