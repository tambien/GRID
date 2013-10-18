/*=============================================================================

 ___   __    _  _______  _______    ___      ___   _______  __   __  _______ 
|   | |  |  | ||       ||       |  |   |    |   | |       ||  | |  ||       |
|   | |   |_| ||  _____||_     _|  |   |    |   | |    ___||  |_|  ||_     _|
|   | |       || |_____   |   |    |   |    |   | |   | __ |       |  |   |  
|   | |  _    ||_____  |  |   |    |   |___ |   | |   ||  ||       |  |   |  
|   | | | |   | _____| |  |   |    |       ||   | |   |_| ||   _   |  |   |  
|___| |_|  |__||_______|  |___|    |_______||___| |_______||__| |__|  |___|  

=============================================================================*/

goog.provide("game.views.InstructionLightView");

goog.require("goog.dom");


/** 
	@constructor
	@param {Element} container
*/
var InstructionLightView = function(container){
	/** @type {Element} */
	this.Element = goog.dom.createDom("div", {"class" : "InstructionLightView"});
	goog.dom.appendChild(container, this.Element);
	/** @type {Element} */
	this.light = goog.dom.createDom("div", {"id" : "light"});
	goog.dom.appendChild(this.Element, this.light);
}

/** 
	
*/
InstructionLightView.prototype.flash = function(color, time){
	
}