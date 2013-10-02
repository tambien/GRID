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
/** 
	@constructor
	@extends {goog.Disposable}
	@param {number} beatNum
*/
var PatternBeatView = function(beatNum){
	/** @type {number}*/
	this.beat = beatNum;
	/** @type {Element} */
	this.Element = goog.dom.createDom("div", {"class" : "PatternBeatView"});
	/** @type {Element} */
	this.rest = goog.dom.createDom("div", {"class" : "rest"});
	/** @type {Array.<PatternNoteView>}*/
	this.notes = [];
	goog.dom.appendChild(PatternDisplay.Element, this.Element);
	goog.dom.appendChild(this.Element, this.rest);
	//size it correctly
	var noteWidth = PatternDisplay.getNoteWidth();
	goog.style.setWidth(this.Element, noteWidth);
	//make all the note views
	var patternTypes = PieceType.toArray();
	for (var i = 0; i < patternTypes.length; i++){
		var type = patternTypes[i];
		this.notes[i] = new PatternNoteView(type, this.Element);
	}
}

goog.inherits(PatternBeatView, goog.Disposable);

/** @override */
PatternBeatView.prototype.disposeInternal = function(){
	for (var i = 0; i < this.notes.length; i++){
		this.notes[i].dispose();
		this.notes[i] = null;
	}
	this.notes = null;
	goog.dom.removeChildren(this.Element);
	goog.dom.removeNode(this.Element);
	this.Element = null;
	this.rest = null;
	goog.base(this, "disposeInternal");
}


/** 
	displays the rests in the pattern
	@param {Pattern} pattern
	@param {number} opacity
*/
PatternBeatView.prototype.displayRests = function(hits, opacity){
	if (hits.length === 0){
		this.clearHits();
		goog.style.setOpacity(this.rest, opacity);
	} else {
		goog.style.setOpacity(this.rest, 0);
	}
}

/** 
	@param {Array.<PatternHit>} hits
	@param {number} opacity
*/
PatternBeatView.prototype.displayHits = function(hits, opacity){
	//compare these notes against the patterns and display the right ones
	for (var i = 0; i < this.notes.length; i++){
		var note = this.notes[i];
		for (var j = 0; j < hits.length; j++){
			if (hits[j].type === note.type){
				note.setOpacity(opacity);
			} 
		}
	}
}

/** 
	hides all the notes
*/
PatternBeatView.prototype.clearHits = function(){
	for (var i = 0; i < this.notes.length; i++){
		var note = this.notes[i];
		note.hide();
		note.unglow();
	}
}

/** 
	makes a beat glow
*/
PatternBeatView.prototype.glow  = function(hits){
	//compare these notes against the patterns and display the right ones
	for (var i = 0; i < this.notes.length; i++){
		var note = this.notes[i];
		for (var j = 0; j < hits.length; j++){
			if (hits[j].type === note.type){
				note.glow();
			} 
		}
	}
}