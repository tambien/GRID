/*=============================================================================
 _______  ___   ___      _______ 
|       ||   | |   |    |       |
|_     _||   | |   |    |    ___|
  |   |  |   | |   |    |   |___ 
  |   |  |   | |   |___ |    ___|
  |   |  |   | |       ||   |___ 
  |___|  |___| |_______||_______|
  
=============================================================================*/

goog.provide("game.models.Tile");

goog.require("goog.math.Coordinate");
goog.require("data.Const");
goog.require("data.Direction");
goog.require("game.views.TileView");

/**
	@constructor
	@param {!goog.math.Coordinate} position
*/
var Tile = function(position){
	/** @type {!goog.math.Coordinate} */
	this.position = position;
	/** 
		the walls adjacent to the tile
		@type {Object}
	*/
	this.walls = {};
	/** @type {boolean} */
	this.active = false;
	/** @type {TileView} */
	this.view = new TileView(this);
}

/** 
	@param {Direction} direction
	@return {boolean}
*/
Tile.prototype.hasWall = function(direction){
	return goog.isDef(this.walls[direction]);
}

/** 
	highlights the tile
*/
Tile.prototype.highlight = function(){
	this.view.highlight();
}

/** 
	clears all the data for level / stage switches
*/
Tile.prototype.reset = function(){
	this.walls = {};
	this.active = false;
}

/** 
	@param {Direction} direction the piece is currently travelling in
	@return {TrajectoryStep} the direction the piece would be in after leaving this tile
*/
Tile.prototype.nextStep = function(direction){
	//if it has a wall in that direction, 
	//return the opposite direction
	if (this.hasWall(direction)){
		return new TrajectoryStep(this.position, Direction.opposite(direction), true);
	} else {
		//otherwise just keep going forward in the same direction
		return new TrajectoryStep(goog.math.Coordinate.sum(this.position, Direction.toVector(direction)), direction);
	}
}
