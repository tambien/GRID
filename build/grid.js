
/**
 * @license RequireJS domReady 2.0.1 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/domReady for details
 */
/*jslint */
/*global require: false, define: false, requirejs: false,
  window: false, clearInterval: false, document: false,
  self: false, setInterval: false */


define('dependencies/domReady',[],function () {
    

    var isTop, testDiv, scrollIntervalId,
        isBrowser = typeof window !== "undefined" && window.document,
        isPageLoaded = !isBrowser,
        doc = isBrowser ? document : null,
        readyCalls = [];

    function runCallbacks(callbacks) {
        var i;
        for (i = 0; i < callbacks.length; i += 1) {
            callbacks[i](doc);
        }
    }

    function callReady() {
        var callbacks = readyCalls;

        if (isPageLoaded) {
            //Call the DOM ready callbacks
            if (callbacks.length) {
                readyCalls = [];
                runCallbacks(callbacks);
            }
        }
    }

    /**
     * Sets the page as loaded.
     */
    function pageLoaded() {
        if (!isPageLoaded) {
            isPageLoaded = true;
            if (scrollIntervalId) {
                clearInterval(scrollIntervalId);
            }

            callReady();
        }
    }

    if (isBrowser) {
        if (document.addEventListener) {
            //Standards. Hooray! Assumption here that if standards based,
            //it knows about DOMContentLoaded.
            document.addEventListener("DOMContentLoaded", pageLoaded, false);
            window.addEventListener("load", pageLoaded, false);
        } else if (window.attachEvent) {
            window.attachEvent("onload", pageLoaded);

            testDiv = document.createElement('div');
            try {
                isTop = window.frameElement === null;
            } catch (e) {}

            //DOMContentLoaded approximation that uses a doScroll, as found by
            //Diego Perini: http://javascript.nwbox.com/IEContentLoaded/,
            //but modified by other contributors, including jdalton
            if (testDiv.doScroll && isTop && window.external) {
                scrollIntervalId = setInterval(function () {
                    try {
                        testDiv.doScroll();
                        pageLoaded();
                    } catch (e) {}
                }, 30);
            }
        }

        //Check if document already complete, and if so, just trigger page load
        //listeners. Latest webkit browsers also use "interactive", and
        //will fire the onDOMContentLoaded before "interactive" but not after
        //entering "interactive" or "complete". More details:
        //http://dev.w3.org/html5/spec/the-end.html#the-end
        //http://stackoverflow.com/questions/3665561/document-readystate-of-interactive-vs-ondomcontentloaded
        //Hmm, this is more complicated on further use, see "firing too early"
        //bug: https://github.com/requirejs/domReady/issues/1
        //so removing the || document.readyState === "interactive" test.
        //There is still a window.onload binding that should get fired if
        //DOMContentLoaded is missed.
        if (document.readyState === "complete") {
            pageLoaded();
        }
    }

    /** START OF PUBLIC API **/

    /**
     * Registers a callback for DOM ready. If DOM is already ready, the
     * callback is called immediately.
     * @param {Function} callback
     */
    function domReady(callback) {
        if (isPageLoaded) {
            callback(doc);
        } else {
            readyCalls.push(callback);
        }
        return domReady;
    }

    domReady.version = '2.0.1';

    /**
     * Loader Plugin API method
     */
    domReady.load = function (name, req, onLoad, config) {
        if (config.isBuild) {
            onLoad(null);
        } else {
            domReady(onLoad);
        }
    };

    /** END OF PUBLIC API **/

    return domReady;
});

/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

define('dependencies/requestAnimationFrame',[
], function() {

  /**
   * requirejs version of Paul Irish's RequestAnimationFrame
   * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
   */

  return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback, element) {

        window.setTimeout(callback, 1000 / 60);

      };
});
/*=============================================================================
 _______  _______  __    _  _______  _______ 
|       ||       ||  |  | ||       ||       |
|       ||   _   ||   |_| ||  _____||_     _|
|       ||  | |  ||       || |_____   |   |  
|      _||  |_|  ||  _    ||_____  |  |   |  
|     |_ |       || | |   | _____| |  |   |  
|_______||_______||_|  |__||_______|  |___|  

	the game constants
=============================================================================*/

define('const',[], function(){

	/**	
		the container of constants
		@const
	*/
	var CONST = {
		/** @enum */
		DIRECTION : {
			NORTH : 'n',
			SOUTH : 's',
			EAST : 'e',
			WEST : 'w'
		},
		/** @enum */
		TILE : {
			INACTIVE : 0,
			ACTIVE : 1
		},
		/** @enum */
		WALL : {
			NORTH : 0
		},
		/** the size of the grid */
		SIZE : {
			WIDTH : 8,
			HEIGHT : 8
		}
	}

	return CONST;
});
/*=============================================================================
 _______  ___   ___      _______ 
|       ||   | |   |    |       |
|_     _||   | |   |    |    ___|
  |   |  |   | |   |    |   |___ 
  |   |  |   | |   |___ |    ___|
  |   |  |   | |       ||   |___ 
  |___|  |___| |_______||_______|

  Tiles have pointers to all the neighboring tiles
  
=============================================================================*/

define ('game/models/Tile',["const"], function(){

	var CONST = require("const");

	/**
		@constructor
		@param {Object} position
	*/
	var Tile = function(position){
		this.position = position;
		/* the objects neighbors */
		this.neighbors = {};
	}

	/** 
		@param {CONST.DIRECTION} direction
		@param {Tile} tile
	*/
	Tile.prototype.setNeighbor = function(direction, tile){
		this.neighbors[direction] = tile;
	}

	/** 
		@param {CONST.DIRECTION} direction
		@param {Tile} tile
	*/
	Tile.prototype.setWall = function(direction, tile){
		this.neighbors[direction] = tile;
	}

	/** 
		
	*/
	Tile.prototype.hasWall = function(){

	}

	return Tile;
});

/*=============================================================================
 _______  ___   ___      _______  _______ 
|       ||   | |   |    |       ||       |
|_     _||   | |   |    |    ___||  _____|
  |   |  |   | |   |    |   |___ | |_____ 
  |   |  |   | |   |___ |    ___||_____  |
  |   |  |   | |       ||   |___  _____| |
  |___|  |___| |_______||_______||_______|

  Tile Controller
=============================================================================*/

define('game/controllers/TileController',['game/models/Tile'], function(){

	var CONST = require("const");

	/** 
		The collection of tiles
		@singleton
	*/
	var Tiles = {
		tiles : new Array(CONST.SIZE.WIDTH * CONST.SIZE.HEIGHT),
		initialize : function(){
			//some initialization routine
		},
		/** 
			@param {number} level
		*/
		setLevel : function(level){

		},
		/** 
			@param {number} stage
		*/
		setStage : function(stage){

		}
	}

	Tiles.initialize();

	//return for require
	return Tiles;
});
/*=============================================================================
 _______  ______    ___   ______  
|       ||    _ |  |   | |      | 
|    ___||   | ||  |   | |  _    |
|   | __ |   |_||_ |   | | | |   |
|   ||  ||    __  ||   | | |_|   |
|   |_| ||   |  | ||   | |       |
|_______||___|  |_||___| |______| 

=============================================================================*/

//require configuration
require.config({
	baseUrl: "./source/",
	paths: {
		// "some": "some/v1.0"
		'underscore' : "dependencies/underscore",
		'const' : "data/Const"
	},
	shim: {
		underscore: {
			exports: '_'
		}
	}
});

//and so it begins...
require(['dependencies/domReady', 'dependencies/requestAnimationFrame', "game/controllers/TileController"], function (domReady) {
	
	
	
	//the application singleton
	var GRID = {
		/** @const */
		version : "0.0.1",
		/** */
		initialize : function(){
			console.log("GRID version "+GRID.version);
			//do initialization stuffs

			//kick off the loop
			GRID.loop();
		},
		/** 
			the loop happens on the animation frame
		*/
		loop : function(){
			//setup the next loop
			requestAnimationFrame(GRID.loop);
		}
	}

	//initialize the application when the dom is ready
	domReady(function () {
		//initialize it
		GRID.initialize();
	});
});


define("../source/main", function(){});
