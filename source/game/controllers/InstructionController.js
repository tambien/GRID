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

goog.require("data.PieceType");
goog.require("data.Direction");
goog.require("game.controllers.StageController");
goog.require("Grid.Defines");
goog.require("Instruction.Track");

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
	/** @type {Instruction.Model} */
	this.currentInstruction = null;
	/** @type {number} */
	this.countIn = 16;
	/** @type {Array.<Instruction.Track>} */
	this.tracks = [];
	/** @type {Array.<Instruction.Model>}*/
	this.instructionHistory = [];
}
//inherit
goog.inherits(Instruction.Controller, goog.events.EventTarget);

/** 
	generates a set of instructions from the given pattern
	iterative backtracking to find a randomized solution
	which satisfies the given pattern
	@param {Array.<PatternHit>} hits
	@returns {Array.<Instruction.Model>} instructions
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
	this.instructions = this.shuffleInstructions(instructions);
	return instructions;
};

/** 
	shuffles the instruction array
	optionally keeping the first element in place
	@param {Array.<Instruction.Model>} instructions
	@returns {Array.<Instruction.Model>} the shuffled instructions
*/
Instruction.Controller.prototype.shuffleInstructions = function(instructions){
	if (SHUFFLE_INSTRUCTIONS){
		var first;
		if (FIRST_INSTRUCTION_FIRST){
			first = instructions.shift();
		}
		//shuffle the array
		goog.array.shuffle(instructions);
		if (FIRST_INSTRUCTION_FIRST){
			instructions.unshift(first);
		}
	}
	return instructions;
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
			if (goog.math.Coordinate.equals(pieceI.position, pieceJ.position)){	
				return true;
			}
		}
	}
	return false;
};

/** 
	@param {number} stage
	@param {number} level
*/
Instruction.Controller.prototype.setStage = function(stage, level){
	// this.countIn = StageController.getCountIn(stage, level);
	var trackDescriptions = StageController.getTracks(stage);
	for (var i = 0; i < trackDescriptions.length; i++){
		var t = new Instruction.Track(trackDescriptions[i]);
		this.tracks.push(t);
	}
	// //when the level = 0, generate all teh instructions
	// if (level===0){
	// 	var levels = StageController.getLevelCount(stage);
	// 	for (var i = 0; i < levels; i++){
	// 		var stagePattern = StageController.getPattern(stage, i);
	// 		var pattern = new Pattern(stagePattern);
	// 		this.allInstructions[i] = this.generateInstructions(pattern.hits);
	// 	}
	// }
	// this.instructions = this.allInstructions[level];
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
		beat : beat,
		countIn : this.countIn
	};
};

/** 
	remove the instructions
*/
Instruction.Controller.prototype.reset = function(){
	this.progress = 0;
	this.instructions = [];
	this.currentInstruction = null;
};

/** 
	remove the instructions
*/
Instruction.Controller.prototype.stop = function(){
	this.progress = 0;
	this.currentInstruction = null;
};


/** 
	start all the track
	@param {number} time
*/
Instruction.Controller.prototype.play = function(time){
	this.progress = 0;
	for (var i = 0; i < this.tracks.length; i++){
		this.tracks[i].play(time);
	}
};

/** 
	@returns {Instruction.Model} the next instruction
*/
Instruction.Controller.prototype.nextInstruction = function(){
	this.currentInstruction = this.instructions[this.progress++];
	return this.currentInstruction;
};

/** 
	@returns {boolean} if the level is completed or not
*/
Instruction.Controller.prototype.isCompleted = function(){
	return this.progress === this.instructions.length;
};

/** 
	@returns {boolean} true if the piece satisfies the current instruction
*/
Instruction.Controller.prototype.pieceSatisfiesInstruction = function(piece, instruction){
	return goog.math.Coordinate.equals(piece.position, instruction.position) 
		&& piece.direction === instruction.direction
		&& piece.type === instruction.type;
};

/** 
	@returns {number} the count in steps
*/
Instruction.Controller.prototype.getCountIn = function(){
	return this.countIn;
};

/** 
	@returns {Array.<Instruction.Model>} the current instructions
*/
Instruction.Controller.prototype.getCurrentInstructions = function(){
	var insts = [];
	for (var i = 0; i < this.tracks.length; i++){
		var instruction = this.tracks[i].currentInstruction;
		if (instruction !== null){
			insts.push(instruction);
		}
	}
	return insts;
};

/** 
	@param {number} beat
	@param {PieceType} type
	@returns {Instruction.Model} an instruction which doesn't collide with the current one
*/
Instruction.Controller.prototype.getRandomInstruction = function(beat, type){
	var instruction = this.randomInstruction(beat, type);
	while(!this.goodInstruction(instruction)){
		instruction = this.randomInstruction(beat, type);
	}
	this.instructionHistory.push(instruction);
	if (this.instructionHistory.length > 3){
		this.instructionHistory.shift();
	}
	return instruction;
};

/** 
	@param {Instruction.Model} instruction
	@returns {boolean} return true if the instruction doesn't conflict with the previous instructions
*/
Instruction.Controller.prototype.goodInstruction = function(instruction){
	var len = this.instructionHistory.length;
	for (var i = 0; i < len; i++){
		//compare this piece against all the later ones
		var prev = this.instructionHistory[i];
		if (instruction.direction === prev.direction){
			return false;
		} else if (goog.math.Coordinate.equals(instruction.position, prev.position)){
			return false;
		} 
	}
	return true;
};

//declare as singleton
goog.addSingletonGetter(Instruction.Controller);
//initialize
Instruction.Controller.getInstance();

/*=============================================================================
 	MODEL
=============================================================================*/

/** 
	@typedef {{
		beat : number,
		type : PieceType,
		direction : Direction,
		position : !goog.math.Coordinate,
		countIn : number
	}}
*/
Instruction.Model;