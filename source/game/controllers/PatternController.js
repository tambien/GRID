/*=============================================================================

 _______  _______  _______  _______  _______  ______    __    _    _______  _______  ______    ___     
|       ||   _   ||       ||       ||       ||    _ |  |  |  | |  |       ||       ||    _ |  |   |    
|    _  ||  |_|  ||_     _||_     _||    ___||   | ||  |   |_| |  |       ||_     _||   | ||  |   |    
|   |_| ||       |  |   |    |   |  |   |___ |   |_||_ |       |  |       |  |   |  |   |_||_ |   |    
|    ___||       |  |   |    |   |  |    ___||    __  ||  _    |  |      _|  |   |  |    __  ||   |___ 
|   |    |   _   |  |   |    |   |  |   |___ |   |  | || | |   |  |     |_   |   |  |   |  | ||       |
|___|    |__| |__|  |___|    |___|  |_______||___|  |_||_|  |__|  |_______|  |___|  |___|  |_||_______|

=============================================================================*/

goog.provide("game.controllers.PatternController");

goog.require("game.controllers.StageController");
goog.require("game.models.Pattern");
goog.require("game.views.PatternDisplay");
goog.require("goog.array");

/** 
	@typedef {Object}
*/
var PatternController = {
	/** @private
		@type {Pattern} */
	targetPattern : null,
	initialize : function(){
		//hmmm nothing to do here...
	},
	/** 
		@param {number} stage
		@param {number} level
	*/
	setStage : function(stage, level){
		var pattern = StageController.getPattern(stage, level);
		//make a target pattern with this representation
		PatternController.patternLength = pattern.length;
		PatternController.reset();
		PatternDisplay.setStage();
		PatternController.targetPattern = new Pattern();
		PatternController.targetPattern.addPattern(pattern);
		PatternController.showTarget();
	},
	/** 
		clears both patterns
	*/
	reset : function(){
		if (PatternController.targetPattern){
			PatternController.targetPattern.dispose();
		}
	},
	/** 
		notification that a pattern was updated
		@param {Pattern} pattern
	*/
	updated : function(pattern){
		//clear the old version
		PatternDisplay.clear();
		//display this pattern
		PatternDisplay.display(pattern, .4);
		//display the faded target
		PatternDisplay.display(PatternController.targetPattern, 1);
		//set the rests
		PatternDisplay.displayRests(Pattern.combine(PatternController.targetPattern, pattern), 1);
		//glow the intersections
		PatternDisplay.displayGlow(Pattern.intersection(PatternController.targetPattern, pattern));
	},
	/** 
		display the target pattern
	*/
	showTarget : function(){
		PatternDisplay.clear();
		PatternDisplay.display(PatternController.targetPattern, 1);
		PatternDisplay.displayRests(PatternController.targetPattern, 1);
	},
	/** 
		@param {Pattern} pattern
		@returns {boolean} true if the patterns are equivalent
	*/
	isTargetPattern : function(pattern){
		return Pattern.equals(PatternController.targetPattern, pattern);
	},
	/*=========================================================================
		PLAY / STOP
	=========================================================================*/
	/** 
		scrolling animation
	*/
	play : function(){
		// PatternView.scroll();
		PatternDisplay.play();
	},
	/** 
		animate to the stopped position
	*/
	stop : function(){
		// PatternView.stopScroll();
		PatternDisplay.stop();
	},
	/** 
		pause the animation
	*/
	pause : function(){
		// PatternView.pauseScroll();
		PatternDisplay.stop();
	},
}

PatternController.initialize();