/*=============================================================================
	DIRECTION
=============================================================================*/
goog.provide("data.Direction");

goog.require("goog.math.Coordinate");

/** 
	@enum {string}
*/
var Direction = {
	North : 'n',
	South : 's',
	East : 'e',
	West : 'w',
};


/** 
	@param {Direction} direction
	@returns {Direction}	the opposite direction
*/
Direction.opposite = function(direction){
	switch(direction){
		case Direction.North : 
			return Direction.South;
		case Direction.South : 
			return Direction.North;
		case Direction.East : 
			return Direction.West;
		case Direction.West : 
			return Direction.East;
		default :
			return Direction.West;
	}
}

/** 
	@param {Direction} direction
	@returns {Direction}	the direction to the left
*/
Direction.left = function(direction){
	switch(direction){
		case Direction.North : 
			return Direction.West;
		case Direction.South : 
			return Direction.East;
		case Direction.East : 
			return Direction.North;
		case Direction.West : 
			return Direction.South;
		default :
			return Direction.West;
	}
}

/** 
	@param {Direction} direction
	@returns {Direction}	the direction to the right
*/
Direction.right = function(direction){
	switch(direction){
		case Direction.North : 
			return Direction.East;
		case Direction.South : 
			return Direction.West;
		case Direction.East : 
			return Direction.South;
		case Direction.West : 
			return Direction.North;
		default :
			return Direction.West;
	}
}

/** 
	@param {Direction} direction
	@returns {!goog.math.Coordinate} vector representation of that direction
*/
Direction.toVector = function(direction){
	switch(direction){
		case Direction.North : 
			return new goog.math.Coordinate(0, -1);
		case Direction.South : 
			return new goog.math.Coordinate(0, 1);
		case Direction.West : 
			return new goog.math.Coordinate(-1, 0);
		case Direction.East : 
			return new goog.math.Coordinate(1, 0);
	}
	//if it didn't return anything else (mostly to appease the compiler)
	return new goog.math.Coordinate(0, 0);	
}

/** 
	@param {Direction} direction
	@returns {number} angle in degrees with West = 0 deg
*/
Direction.toAngle = function(direction){
	switch(direction){
		case Direction.North : 
			return 90;
		case Direction.South : 
			return 270;
		case Direction.West : 
			return 0;
		case Direction.East : 
			return 180;
	}
	//if it didn't return anything else (mostly to appease the compiler)
	return 0
}

/** 
	@param {string} direction
	@returns {Direction}
*/
Direction.fromString = function(direction){
	if (Direction.isDirection(direction)){
		return /** @type {Direction} */(direction);
	} else {
		return Direction.North;
	}
}

/**
	@param {!goog.math.Coordinate} pos0
	@param {!goog.math.Coordinate} pos1
	@returns {Direction|null} the relative direction
*/
Direction.relativeDirection = function(pos0, pos1){
	var diff = goog.math.Coordinate.difference(pos0, pos1);
	if (diff.x === 0 && diff.y > 0){
		return Direction.North;
	} else if (diff.x === 0 && diff.y < 0){
		return Direction.South;
	} else if (diff.x < 0 && diff.y === 0){
		return Direction.East;
	} else if (diff.x > 0 && diff.y === 0){
		return Direction.West;
	} else {
		return null;
	}
}

/** 
	@param {function(Direction)} callback
*/
Direction.forEach = function(callback){
	callback(Direction.North);
	callback(Direction.South);
	callback(Direction.East);
	callback(Direction.West);
}


/** 
	@param {?} thing
	@returns {boolean}
*/
Direction.isDirection = function(thing){
	var isDir = false;
	Direction.forEach(function(dir){
		if (thing === dir){
			isDir = true;
		}
	});
	return isDir;
}

/**
	@param {Direction} direction
	@returns {Direction.Orientation} the relative direction
*/
Direction.getOrientation = function(direction){
	if (direction === Direction.West || direction === Direction.East){
		return Direction.Orientation.Horizontal;
	} else {
		return Direction.Orientation.Vertical;
	}
}

/** 
	@enum {string}
*/
Direction.Orientation = {
	Vertical : "vertical",
	Horizontal : "horizontal"
};

