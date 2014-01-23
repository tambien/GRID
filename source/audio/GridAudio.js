/*=============================================================================

 _______  ______    ___   ______     _______  __   __  ______   ___   _______ 
|       ||    _ |  |   | |      |   |   _   ||  | |  ||      | |   | |       |
|    ___||   | ||  |   | |  _    |  |  |_|  ||  | |  ||  _    ||   | |   _   |
|   | __ |   |_||_ |   | | | |   |  |       ||  |_|  || | |   ||   | |  | |  |
|   ||  ||    __  ||   | | |_|   |  |       ||       || |_|   ||   | |  |_|  |
|   |_| ||   |  | ||   | |       |  |   _   ||       ||       ||   | |       |
|_______||___|  |_||___| |______|   |__| |__||_______||______| |___| |_______|

setups up the context

=============================================================================*/

goog.provide("audio.GridAudio");

goog.require("Synthesizer.FeedbackDelay");

/** 
	@typedef {Object}
*/
var GridAudio = {
	/** @type {AudioContext} */
	Context : null,
	/** @type {GainNode} */
	output : null,
	/** @type {GainNode} */
	dry : null,
	/** @type {Synthesizer.FeedbackDelay} */
	delay : null,
	/** initializer */
	initialize : function(){
		if (goog.isDef(goog.global["AudioContext"])){
			GridAudio.Context = new AudioContext();
		} else if (goog.isDef(goog.global["webkitAudioContext"])){
			GridAudio.Context = new webkitAudioContext();
		} else {
			throw Error("cannot create AudioContext");
		}
		GridAudio.output = GridAudio.createGain(),
		GridAudio.dry = GridAudio.createGain(),
		GridAudio.delay = new Synthesizer.FeedbackDelay(GridAudio.Context, GridAudio);
		//connect it up
		//output -> delay -> destination
		GridAudio.output.connect(GridAudio.delay.input);
		GridAudio.delay.output.connect(GridAudio.Context.destination);
		//dry -> destination
		GridAudio.dry.connect(GridAudio.Context.destination);
	},
	/** 
		@returns {GainNode}
	*/
	createGain : function(){
		if (goog.isFunction(GridAudio.Context.createGain)){
			return GridAudio.Context.createGain();
		} else {
			return GridAudio.Context.createGainNode();
		}
	},
	/** 
		@returns {DelayNode}
	*/
	createDelay : function(){
		if (goog.isFunction(GridAudio.Context.createGain)){
			return GridAudio.Context.createDelay();
		} else {
			return GridAudio.Context.createDelayNode();
		}
	}
};

GridAudio.initialize();