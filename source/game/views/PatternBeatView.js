/*=============================================================================

 _______  _______  ______    __    _    _______  _______  _______  _______    __   __  _     _ 
|       ||       ||    _ |  |  |  | |  |  _    ||       ||   _   ||       |  |  | |  || | _ | |
|    _  ||_     _||   | ||  |   |_| |  | |_|   ||    ___||  |_|  ||_     _|  |  |_|  || || || |
|   |_| |  |   |  |   |_||_ |       |  |       ||   |___ |       |  |   |    |       ||       |
|    ___|  |   |  |    __  ||  _    |  |  _   | |    ___||       |  |   |    |       ||       |
|   |      |   |  |   |  | || | |   |  | |_|   ||   |___ |   _   |  |   |     |     | |   _   |
|___|      |___|  |___|  |_||_|  |__|  |_______||_______||__| |__|  |___|      |___|  |__| |__|

=============================================================================*/

goog.provide("game.views.PatternBeatView");

goog.require("goog.Disposable");
goog.require("game.views.PatternNoteView");
goog.require("graphics.KeyframeAnimation");

/** 
	@constructor
	@extends {goog.Disposable}
	@param {number} beatNum
	@param {Element} container
	@param {number} width
*/
var PatternBeatView = function(beatNum, container, width){
	/** @type {number}*/
	this.beat = beatNum;
	/** @type {Element} */
	this.Element = goog.dom.createDom("div", {"class" : "PatternBeatView"});
	/** @type {Element} */
	this.rest = goog.dom.createDom("div", {"class" : "rest"});
	/** @type {Element} */
	this.restFlash = goog.dom.createDom("div", {"class" : "restFlash"});
	/** @type {Object.<PatternNoteView>}*/
	this.notes = {};
	//size it correctly
	goog.style.setWidth(this.Element, width);
	//make all the note views
	var patternTypes = PieceType.toArray();
	for (var i = 0; i < patternTypes.length; i++){
		var type = patternTypes[i];
		this.notes[type] = new PatternNoteView(type, this.Element);
	}
	goog.dom.appendChild(this.Element, this.rest);
	goog.dom.appendChild(this.rest, this.restFlash);
	goog.dom.appendChild(container, this.Element);
	/** @type {KeyframeAnimation} */
	this.animation = new KeyframeAnimation([{opacity : 0}, {opacity : 1}, {opacity : 0}], [0, 2, 20]);
}

goog.inherits(PatternBeatView, goog.Disposable);

/** @override */
PatternBeatView.prototype.disposeInternal = function(){
	for (var type in this.notes){
		var note = this.notes[type];
		note.dispose();
	}
	this.notes = null;
	goog.dom.removeChildren(this.Element);
	goog.dom.removeNode(this.Element);
	this.Element = null;
	this.rest = null;
	goog.base(this, "disposeInternal");
}


/** 
	displays the rests in the hit
	@param {Array.<PatternHit>} hits
	@param {number} opacity
*/
PatternBeatView.prototype.displayRests = function(hits, opacity){
	if (hits.length === 0){
		// this.clearHits();
		goog.dom.classes.add(this.rest, "rested");
	} else {
		goog.dom.classes.remove(this.rest, "rested");
	}
}

/** 
	@param {Array.<PatternHit>} hits
	@param {number} opacity
*/
PatternBeatView.prototype.displayHits = function(hits, opacity){
	for (var i = 0; i < hits.length; i++){
		var note = this.notes[hits[i].type]
		note.setOpacity(opacity);
	}
}

/** 
	hides all the notes
*/
PatternBeatView.prototype.clearHits = function(){
	for (var type in this.notes){
		var note = this.notes[type];
		note.clear();
	}
}

/** 
	show the border on the hits
	@param {Array.<PatternHit>} hits
*/
PatternBeatView.prototype.displayBorder  = function(hits){
	for (var i = 0; i < hits.length; i++){
		var note = this.notes[hits[i].type]
		note.setBorder();
	}
}

/** 
	show the fill on the hits
	@param {Array.<PatternHit>} hits
*/
PatternBeatView.prototype.displayFill  = function(hits){
	for (var i = 0; i < hits.length; i++){
		var note = this.notes[hits[i].type]
		note.setFill();
	}
}

/** 
	@param {Array.<PatternHit>} hits
	@param {number} cycleTime
	@param {number} delay
*/
PatternBeatView.prototype.animateBeat = function(hits, cycleTime, delay){
	for (var i = 0; i < hits.length; i++){
		var note = this.notes[hits[i].type];
		note.flashAnimation(this.animation, cycleTime, delay);
	}
	if (hits.length === 0){
		this.animation.play(this.restFlash, cycleTime, {delay : delay, repeat : "infinite"});	
	}
}

/** 
	stop the animations
*/
PatternBeatView.prototype.stopAnimation = function(){
	for (var type in this.notes){
		var note = this.notes[type];
		note.stopAnimation(this.animation);
	}
	this.animation.stop(this.restFlash);
}