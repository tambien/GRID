/*===============================================================================================================================
 ___      _______  _______  ______   ___   __    _  _______    __   __  _______  __    _  _______  _______  _______  ______   
|   |    |       ||   _   ||      | |   | |  |  | ||       |  |  |_|  ||   _   ||  |  | ||   _   ||       ||       ||    _ |  
|   |    |   _   ||  |_|  ||  _    ||   | |   |_| ||    ___|  |       ||  |_|  ||   |_| ||  |_|  ||    ___||    ___||   | ||  
|   |    |  | |  ||       || | |   ||   | |       ||   | __   |       ||       ||       ||       ||   | __ |   |___ |   |_||_ 
|   |___ |  |_|  ||       || |_|   ||   | |  _    ||   ||  |  |       ||       ||  _    ||       ||   ||  ||    ___||    __  |
|       ||       ||   _   ||       ||   | | | |   ||   |_| |  | ||_|| ||   _   || | |   ||   _   ||   |_| ||   |___ |   |  | |
|_______||_______||__| |__||______| |___| |_|  |__||_______|  |_|   |_||__| |__||_|  |__||__| |__||_______||_______||___|  |_|
=============================================================================================================================== */


goog.provide("managers.LoadingManager");

goog.require("goog.Uri");
goog.require("goog.net.XhrManager");
goog.require("audio.GridAudio");
goog.require("data.AudioBuffers");
goog.require("managers.Version");

/** 
	@typedef {Object}
*/
var LoadingManager = {
	/** @private
		@type {number} */
	totalCallbacks : 0,
	/** @private
		@type {number} */
	loadedFiles : 0,
	/** @private
		@type {function() | null} */
	onloadcallback : null,
	/** @private 
		@type {goog.net.XhrManager} */
	manager : new goog.net.XhrManager(1, null, 1, 6),
	/** initializer */
	initialize : function(){
		//do the initial load
		LoadingManager.totalCallbacks = 3;
		
		LoadingManager.loadIcons(function(){
			LoadingManager.resolvePreload();
		});
		LoadingManager.loadPieces(function(){
			LoadingManager.resolvePreload();
		});
		LoadingManager.loadVersionData(function(){
			LoadingManager.resolvePreload();
		});
	},	
	/** 
		loads the icons
		@param {function()} callback
	*/
	loadIcons : function(callback){
		var icons = ["back", "back_white", "close", "close_white", "error", 
			"forward", "forward_white", "lock", "lock_white", "play", "play_white", 
			"redo", "redo_white", "stop", "stop_white"];

		var callbacker = {
			loaded : 0,
			total : icons.length,
			callback : callback
		};
		for (var i = 0; i < icons.length; i++){
			var icon = icons[i];
			LoadingManager.loadImage("icons/"+icon+".png", function(){
				callbacker.loaded++;
				if (callbacker.loaded === callbacker.total){
					callbacker.callback();
				}
			});
		}	
	},
	/** 
		loads the pieces
		@param {function()} callback
	*/
	loadPieces : function(callback){
		var pieces = ["piece/blue", "piece/green", "piece/red", "piece/purple", "piece/yellow", 
			"piece/pink", "songs/blue", "songs/green", "songs/red", "songs/purple", "songs/yellow", 
			"songs/pink"];

		var callbacker = {
			loaded : 0,
			total : pieces.length,
			callback : callback
		};
		for (var i = 0; i < pieces.length; i++){
			var piece = pieces[i];
			LoadingManager.loadImage(piece+".png", function(){
				callbacker.loaded++;
				if (callbacker.loaded === callbacker.total){
					callbacker.callback();
				}
			});
		}	
	},
	/** 
		loads version data
		@param {function()} callback
	*/
	loadVersionData : function(callback){
		Version.loadVersionData(function() {
			callback();
		});
	},
	/** 
		@param {function()} callback
	*/
	loadApp : function(callback){
		LoadingManager.onloadcallback = callback ;
	},
	/** 
		@param {string} url of JSON file
		@param {function(*)} callback invoked with the JSON
	*/
	loadJSON : function(url, callback){
		LoadingManager.manager.send(url, url, "GET", null, undefined, 1, function(e){
			var jsonString = e.target.getResponse();
			var loadedObject = JSON.parse(jsonString);
			callback(loadedObject);
			//LoadingManager.loadResolved();
		}, 1, goog.net.XhrIo.ResponseType.TEXT);
	},
	/** 
		@param {string} url of audio file
		@param {function(AudioBuffer)} callback invoked with an audio buffer
	*/
	loadAudio : function(url, callback){
		var file = "./assets/audio/"+url;
		LoadingManager.manager.send(file, file, "GET", null, undefined, 1, function(e){
			// callback
			GridAudio.Context.decodeAudioData(e.target.getResponse(), function(b) {
				callback(b);
				//LoadingManager.loadResolved();
			});
		}, 1, goog.net.XhrIo.ResponseType.ARRAY_BUFFER);
	},
	/** 
		@param {string} url of an image
		@param {function(Image)} callback invoked with an image
	*/
	loadImage : function(url, callback){
		var img = new Image();
		img.onload = function(){
			callback(img);
			//LoadingManager.loadResolved();
		};
		img.src = "./assets/images/"+url;
	},
	/** 
		call internally when a load is resolved to increment the loaded files
	*/
	resolvePreload : function(){
		LoadingManager.loadedFiles++;
		if (LoadingManager.loadedFiles === LoadingManager.totalCallbacks){
			LoadingManager.allLoaded();
		}
	},
	/** 
		@private
		called when everything is loaded
		keeps trying to call the callback until one is available
	*/
	allLoaded : function(){
		//invoke the callback (if it's been assigned)
		if (LoadingManager.onloadcallback !== null){
			LoadingManager.onloadcallback();
		//otherwise set a timeout to try again in the future
		} else {
			setTimeout(function(){
				LoadingManager.allLoaded();
			}, 100);
		}
	}
};

LoadingManager.initialize();