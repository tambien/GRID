/*============================================================================
 _______  __    _  _______  ___      __   __  _______  ___   _______  _______ 
|   _   ||  |  | ||   _   ||   |    |  | |  ||       ||   | |       ||       |
|  |_|  ||   |_| ||  |_|  ||   |    |  |_|  ||_     _||   | |       ||  _____|
|       ||       ||       ||   |    |       |  |   |  |   | |       || |_____ 
|       ||  _    ||       ||   |___ |_     _|  |   |  |   | |      _||_____  |
|   _   || | |   ||   _   ||       |  |   |    |   |  |   | |     |_  _____| |
|__| |__||_|  |__||__| |__||_______|  |___|    |___|  |___| |_______||_______|
=============================================================================*/

goog.provide("managers.Analytics");

goog.require("models.StagesModel");
goog.require("managers.Version");
goog.require("game.controllers.StageController");
goog.require("goog.events");

var Analytics = {
    /** @type {string} */
	uuid : "",

	/** 
	@private
	@type {Function} */
	onReadyCb : null,

	/** @type {boolean} */
	initialized : false,

    /** initializer */
	initialize : function(){
		ga_storage._setAccount(Version.googleAnalyticsId);
		
		if ( Analytics.onReadyCb != null ) {
			Analytics.onReadyCb();
		} else {
			Analytics.initialized=true;	
		}
		
		//listen for errors and send those
		goog.events.listen(window, goog.events.EventType.ERROR, function(e){
			// e.preventDefault();
			Analytics.trackEvent("error", "runtime", e.getBrowserEvent().message);
		});

		
    },

	/** 
	Invkokes the callback sent through when the Analytics class has inited. If already inited it calls it immediately.
	
	@param {Function} cb
	**/
    onReady : function(cb) {
    	if (Analytics.initialized) {
    		cb();
    	} else {
    		Analytics.onReadyCb = cb;
    	}
    },

	/** 
	Tracking an Event
	usgae: ga_storage._trackEvent('category', 'action', 'label', 'value');
	
	@param {string} category
	@param {string} action
	@param {string=} label
	@param {number | string=} value
	**/
	trackEvent : function (category, action, label, value) {
		if ( value ) {
			ga_storage._trackEvent(category, action, label, value.toString());
		} else if ( label ) {
			ga_storage._trackEvent(category, action, label);
		} else if ( action ) {
			ga_storage._trackEvent(category, action);
		} 		
	},
	/** 
		tracks a player action during game play
		@param {string} action
		@param {number=} value
	*/
	trackGameAction : function(action, value){
		//analytics
		var stage = StageController.getCurrentStage();
		var stageName = StageController.getName(stage);
		var level = StageController.getCurrentLevel();
		var levelString = goog.string.buildString(stageName, "_", level);
		Analytics.trackEvent("gameplay", levelString, action, value);
	},
	/** 
	Tracking an Pageview
	USAGE: ga_storage._trackPageview('/index', 'optional title');
	
	@param {string} page
	@param {string=} title
	**/
	trackPageview : function (page, title) {
		ga_storage._trackPageview(page, title);
	},

	/****************************************************************************************
	SPECIFIC ANALYTIC IMPLEMENTATIONS
	****************************************************************************************/

	/**
	track number of songs unlocked

	@param {string} sessionStartType
	**/
	trackSessionStartInfo :  function( sessionStartType ) {
		// set up a temp player obj
		var player = {
			unlockedSongs : 0,
			solvedLevels : 0,
			numStars : 0,
			oneStarLevels : 0,
			twoStarLevels : 0,
			threeStarLevels : 0,
			songsRecorded : 0
		};

		var stage=0;
		var stageCount = StageController.getStageCount();

		//solved levels
		player.solvedLevels = StageController.getTotalSolvedLevelCount();
		//unlocked songs
		StageController.forEachStage(function(stage){
			if (StageController.isStagePlayable(stage) || StageController.isStageSolved(stage)){
				player.unlockedSongs++;
			}
		});
		//number of stars
		player.numStars = StageController.getTotalStars();
		//the star distribution
		var starDistribution = StageController.getStarDistribution();
		player.oneStarLevels = starDistribution[0];
		player.twoStarLevels = starDistribution[1];
		player.threeStarLevels = starDistribution[2];
		//the number of recorded songs
		player.songsRecorded = StageController.getTotalUserPatterns();

		// session has started
		Analytics.trackEvent('session', 'start', sessionStartType);

		// songs complete upon session start
		Analytics.trackEvent('session', 'user_stats', 'songs_unlocked', player.unlockedSongs.toString() );
		
		// parts complete upon session start
		Analytics.trackEvent('session', 'user_stats', 'solved_levels', player.solvedLevels.toString() );

		// Songs Recorded upon session start
		Analytics.trackEvent('session', 'user_stats', 'parts_recorded', player.songsRecorded.toString() );

		// stars earned
		Analytics.trackEvent('session', 'user_stats', 'stars_earned', player.numStars.toString() );

		// songs with 3 stars
		Analytics.trackEvent('session', 'user_stats', 'songs_with_1_stars', player.oneStarLevels.toString() );
		Analytics.trackEvent('session', 'user_stats', 'songs_with_2_stars', player.twoStarLevels.toString() );
		Analytics.trackEvent('session', 'user_stats', 'songs_with_3_stars', player.threeStarLevels.toString() );
	},

	/**
	track number of songs unlocked
	**/
	trackDeviceInfo :  function() {
		Analytics.trackEvent('device', 'model', window["device"]["model"]);
        Analytics.trackEvent('device', 'platform', window["device"]["platform"]);
        Analytics.trackEvent('device', 'version', window["device"]["version"]);
		// maybe we want to use this somehow? 
        Analytics.uuid = window["device"]["uuid"];

        /*
        alert("here comes the info that I keep promising.");
    	alert("device.model: " + window["device"]["model"]);
        alert("device.platform: " + window["device"]["platform"]);
        alert("device.version: " + window["device"]["version"]);
        alert("device.uuid: " + window["device"]["uuid"]);
        */
        
  	}
}
//Analytics.initialize();