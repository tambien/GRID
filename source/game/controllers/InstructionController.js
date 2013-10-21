/*=============================================================================
 ___   __    _  _______  _______  ______    __   __  _______  _______  ___   _______  __    _  _______ 
|   | |  |  | ||       ||       ||    _ |  |  | |  ||       ||       ||   | |       ||  |  | ||       |
|   | |   |_| ||  _____||_     _||   | ||  |  | |  ||       ||_     _||   | |   _   ||   |_| ||  _____|
|   | |       || |_____   |   |  |   |_||_ |  |_|  ||       |  |   |  |   | |  | |  ||       || |_____ 
|   | |  _    ||_____  |  |   |  |    __  ||       ||      _|  |   |  |   | |  |_|  ||  _    ||_____  |
|   | | | |   | _____| |  |   |  |   |  | ||       ||     |_   |   |  |   | |       || | |   | _____| |
|___| |_|  |__||_______|  |___|  |___|  |_||_______||_______|  |___|  |___| |_______||_|  |__||_______|

=============================================================================*/

goog.provide("Instruction.Controller");
goog.provide("Instruction.Model");
goog.provide("Instruction.Event");
goog.provide("Instruction.Event.EventType");

goog.require("data.PieceType");
goog.require("data.Direction");

/** 
	@extends {goog.events.EventTarget}
	@constructor
*/
Instruction.Controller = function(){
	goog.base(this);
	/** @type {Array.<Instruction.Model>} */
	this.instructions = [];
	/** @type {number} */
	this.progress = 0;
}
//inherit
goog.inherits(Instruction.Controller, goog.events.EventTarget);

/** 
	generates a set of instructions from the given pattern
	iterative backtracking to find a randomized solution
	which satisfies the given pattern
	@param {Array.<PatternHit>} hits
*/
Instruction.Controller.prototype.generateInstructions = function(hits){
	var instructions = [];
	var hitIndex = 0;
	var iterations = 0;
	//some max limit to keep it from infinite loop
	while(iterations++ < 10000){
		var hit = hits[hitIndex++];
		var instruction = this.randomInstruction(hit.beat, hit.type);
		instructions.push(instruction);
		if (this.hasCollision(instructions)){
			hitIndex--;
			instructions.pop();
		} else if (hitIndex === hits.length){
			break;
		}
	}
	this.instructions = instructions;
};

/** 
	@returns {boolean} true if the instruction set has a collision in it
*/
Instruction.Controller.prototype.hasCollision = function(instructions){
	var len = instructions.length;
	for (var i = 0; i < len; i++){
		//compare this piece against all the later ones
		var pieceI = instructions[i];
		for (var j = i + 1; j < len; j++){
			var pieceJ = instructions[j];
			if (PieceController.doesCollide(pieceI, pieceJ)){
				return true;
			}
		}
	}
	return false;
};

/** 
	@returns {Instruction.Model} a random instruction which satisfies the beat/type requirement
*/
Instruction.Controller.prototype.randomInstruction = function(beat, type){
	var direction = Direction.random();
	//var randomPosition = parseInt(Math.random()*CONST.BOARDDIMENTION.WIDTH, 10);
	var position = new goog.math.Coordinate(0, 0);
	//get a postioin which satisfies the beat
	switch(direction){
		case Direction.West:
			position.x = beat;
			position.y = parseInt(Math.random()*CONST.BOARDDIMENSION.HEIGHT, 10);
			break;
		case Direction.East:
			position.x = CONST.BOARDDIMENSION.WIDTH - beat - 1;
			position.y = parseInt(Math.random()*CONST.BOARDDIMENSION.HEIGHT, 10);
			break;
		case Direction.North:
			position.y = beat;
			position.x = parseInt(Math.random()*CONST.BOARDDIMENSION.WIDTH, 10);
			break;
		case Direction.South:
			position.y = CONST.BOARDDIMENSION.HEIGHT - beat - 1;
			position.x = parseInt(Math.random()*CONST.BOARDDIMENSION.WIDTH, 10);
			break;
	}
	return {
		direction : direction,
		position : position,
		type : type,
		beat : beat
	};
};

/** 
	remove the instructions
*/
Instruction.Controller.prototype.reset = function(){
	this.progress = 0;
	this.instructions = [];
};

/** 
	@returns {Instruction.Model} the next instruction
*/
Instruction.Controller.prototype.nextInstruction = function(){
	return this.instructions[this.progress++];
},
/** 
	@returns {boolean} if the level is completed or not
*/
Instruction.Controller.prototype.isCompleted = function(){
	return this.progress === this.instructions.length;
},
/** 
	@returns {boolean} true if the piece satisfies the current instruction
*/
Instruction.Controller.prototype.pieceSatisfiesInstruction = function(piece, instruction){
	return goog.math.Coordinate.equals(piece.position, instruction.position) 
		&& piece.direction === instruction.direction
		&& piece.type === instruction.type;
},

//declare as singleton
goog.addSingletonGetter(Instruction.Controller);
//initialize
Instruction.Controller.getInstance();

/*=============================================================================
 	MODEL / EVENT
=============================================================================*/

/** 
	@typedef {{
		beat : number,
		type : PieceType,
		direction : Direction,
		position : !goog.math.Coordinate
	}}
*/
Instruction.Model;

/** 
	@constructor
	@extends {goog.events.Event}
	@param {Instruction.Event.EventType} type
	@param {Instruction.Model} instruction
*/
Instruction.Event = function(type, instruction){
	goog.base(this, type);
	/** @private 
		@type {Instruction.Model} */
	this.instruction = instruction
}

goog.inherits(Instruction.Event, goog.events.Event);

/** 
	@returns {number} the beat of the instruction
*/
Instruction.Event.prototype.getBeat = function(){
	return this.instruction.beat;
}

/** 
	@returns {!goog.math.Coordinate} the position
*/
Instruction.Event.prototype.getPosition = function(){
	return this.instruction.position;
}

/** 
	@returns {Direction} the direction
*/
Instruction.Event.prototype.getDirection = function(){
	return this.instruction.direction;
}

/** 
	@returns {PieceType} the type
*/
Instruction.Event.prototype.getType = function(){
	return this.instruction.type;
}

//EVENT NAME
Instruction.Event.EventType = {
	NEXT : goog.events.getUniqueId("NEXT"),
	END : goog.events.getUniqueId("END")
};