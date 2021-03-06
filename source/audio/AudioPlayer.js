/*=============================================================================

 _______  __   __  ______   ___   _______    _______  ___      _______  __   __  _______  ______   
|   _   ||  | |  ||      | |   | |       |  |       ||   |    |   _   ||  | |  ||       ||    _ |  
|  |_|  ||  | |  ||  _    ||   | |   _   |  |    _  ||   |    |  |_|  ||  |_|  ||    ___||   | ||  
|       ||  |_|  || | |   ||   | |  | |  |  |   |_| ||   |    |       ||       ||   |___ |   |_||_ 
|       ||       || |_|   ||   | |  |_|  |  |    ___||   |___ |       ||_     _||    ___||    __  |
|   _   ||       ||       ||   | |       |  |   |    |       ||   _   |  |   |  |   |___ |   |  | |
|__| |__||_______||______| |___| |_______|  |___|    |_______||__| |__|  |___|  |_______||___|  |_|

plays/loops audio files in a cross-browser way
=============================================================================*/

goog.provide("audio.AudioPlayer");

goog.require("audio.GridAudio");
goog.require("goog.Disposable");

/** 
	@constructor
	@extends {goog.Disposable}
	@param {AudioBuffer} buffer
*/
var AudioPlayer = function(buffer){
	goog.base(this);
	/** @private 
		@type {AudioBuffer} */
	this.buffer = buffer;
	/** @private
		@type {AudioBufferSourceNode | null} */
	this.source = null;
	/** @private
		@type {GainNode} */
	this.gain = GridAudio.createGain();
}

goog.inherits(AudioPlayer, goog.Disposable);

/** @override */
AudioPlayer.prototype.disposeInternal = function(){
	this.buffer = null;
	this.source = null;
	goog.base(this, "disposeInternal");
}

/** 
	@param {number} startOffset
	@param {number} duration of loop
*/
AudioPlayer.prototype.loop = function(startOffset, duration){
	if (this.buffer){
		this.source = GridAudio.Context.createBufferSource();
		var startTime = GridAudio.Context.currentTime;
		var source = this.source;
		source.buffer = this.buffer;
		source.connect(this.gain);
		this.gain.connect(GridAudio.output);
		source.loop = true;
		if (goog.isDef(source.loopStart) && goog.isDef(source.loopEnd)){
			source.loopStart = 0;
			source.loopEnd = duration;
			source.start(startTime + startOffset);
		} else {
			//fall back to older web audio implementation
			source.noteGrainOn(startTime + startOffset, 0, duration);
		}
	}
}
/** 
	@param {number} startOffset
	@param {number=} duration of play time
*/
AudioPlayer.prototype.play = function(startOffset, duration){
	if (this.buffer){
		this.source = GridAudio.Context.createBufferSource();
		var startTime = GridAudio.Context.currentTime;
		var source = this.source;
		duration = duration || this.buffer.duration;
		source.buffer = this.buffer;
		source.connect(this.gain);
		this.gain.connect(GridAudio.output);
		source.loop = false;
		if (goog.isDef(source.start) && goog.isDef(source.stop)){
			source.start(startTime + startOffset, 0, duration);
		} else {
			//fall back to older web audio implementation
			source.noteGrainOn(startTime + startOffset, 0, duration);
		}
	}
}

/** 
	@param {number} startOffset
	@param {number=} duration of play time
	//play with no effects
*/
AudioPlayer.prototype.playDry = function(startOffset, duration){
	if (this.buffer){
		this.source = GridAudio.Context.createBufferSource();
		var startTime = GridAudio.Context.currentTime;
		var source = this.source;
		duration = duration || this.buffer.duration;
		source.buffer = this.buffer;
		source.connect(this.gain);
		this.gain.connect(GridAudio.dry);
		source.loop = false;
		if (goog.isDef(source.start) && goog.isDef(source.stop)){
			source.start(startTime + startOffset, 0, duration);
		} else {
			//fall back to older web audio implementation
			source.noteGrainOn(startTime + startOffset, 0, duration);
		}
	}
}

/** 
	@param {number} time
*/
AudioPlayer.prototype.playAtTime = function(time){
	if (this.buffer){
		this.source = GridAudio.Context.createBufferSource();
		var source = this.source;
		source.buffer = this.buffer;
		source.connect(this.gain);
		this.gain.connect(GridAudio.output);
		source.loop = false;
		if (goog.isDef(source.start) && goog.isDef(source.stop)){
			source.start(time);
		} else {
			//fall back to older web audio implementation
			source.noteOn(time);
		}
	}
}

/** 
	@param {number} time
	@param {number} startOffset
	@param {number} duration of loop
*/
AudioPlayer.prototype.loopAtTime = function(time, startOffset, duration){
	if (this.buffer){
		this.source = GridAudio.Context.createBufferSource();
		var startTime = time;
		var source = this.source;
		source.buffer = this.buffer;
		source.connect(this.gain);
		this.gain.connect(GridAudio.output);
		source.loop = true;
		if (goog.isDef(source.loopStart) && goog.isDef(source.loopEnd)){
			source.loopStart = 0;
			source.loopEnd = duration;
			source.start(startTime + startOffset);
		} else {
			//fall back to older web audio implementation
			source.noteGrainOn(startTime + startOffset, 0, duration);
		}
	}
}

/** 
	@param {number} volume
	@param {number=} fadeOutTime
*/
AudioPlayer.prototype.fadeTo = function(volume, fadeOutTime){
	var now = GridAudio.Context.currentTime;
	var currentGain = this.gain.gain.value;
	fadeOutTime = fadeOutTime || .01;
	this.gain.gain.setValueAtTime(currentGain, now);
	this.gain.gain.linearRampToValueAtTime(volume, now+fadeOutTime);
}

/** 
	@param {number} volume
*/
AudioPlayer.prototype.setVolume = function(volume){
	this.fadeTo(volume, .01);
}

/** 
	mute the player
*/
AudioPlayer.prototype.mute = function(){
	this.setVolume(0);
}

/** 
	mute the player
*/
AudioPlayer.prototype.unmute = function(){
	this.setVolume(1);
}

/** 
	stops the audio
	@param {number=} time
*/
AudioPlayer.prototype.stop = function(time){
	time = time || 0;
	var source = this.source;
	if (goog.isDef(source.stop)){
		source.stop(time);
	} else {
		//fall back to older web audio implementation
		source.noteOff(time);
	}
}
