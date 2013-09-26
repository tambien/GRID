/*=============================================================================

 _______  _______  _______  ______    ______     __   __  ___   _______  _     _ 
|  _    ||       ||   _   ||    _ |  |      |   |  | |  ||   | |       || | _ | |
| |_|   ||   _   ||  |_|  ||   | ||  |  _    |  |  |_|  ||   | |    ___|| || || |
|       ||  | |  ||       ||   |_||_ | | |   |  |       ||   | |   |___ |       |
|  _   | |  |_|  ||       ||    __  || |_|   |  |       ||   | |    ___||       |
| |_|   ||       ||   _   ||   |  | ||       |   |     | |   | |   |___ |   _   |
|_______||_______||__| |__||___|  |_||______|     |___|  |___| |_______||__| |__|

renders the view and sets an event listener
=============================================================================*/

goog.provide("game.views.BoardView");

//a bunch of goog.event dependencies
goog.addDependency('', [
	"goog.events.EventHandler",
	"goog.events.EventTarget",
	"goog.debug.ErrorHandler",
	"goog.events.EventWrapper"
	],[]);

goog.require("goog.dom");
goog.require("goog.style");
goog.require("goog.math.Coordinate");
goog.require("goog.events.Event");
goog.require("goog.events");
goog.require("game.views.TileView");
goog.require("screens.views.GridDom");


var BoardView = {
	/** @type {Element} */
	Board : goog.dom.createDom("div", {"id" : "BoardView"}),
	/** @type {Element} */
	TileCanvas : goog.dom.createDom("canvas", {"id" : "TileCanvas"}),
	/** 
		@private 
		@type {CanvasRenderingContext2D}
	*/
	TileContext : null,
	/** 
		@const
		@type {number}
		@private
	*/
	margin : 57 * CONST.PIXELSCALAR,
	initialize : function(){
		//put the canvas in the board
		goog.dom.appendChild(BoardView.Board, BoardView.TileCanvas);
		//make the drawing context
		BoardView.TileContext = BoardView.TileCanvas.getContext('2d');
		//size the canvas
		var margin = BoardView.margin;
		goog.style.setSize(BoardView.Board, CONST.TILESIZE * CONST.BOARDDIMENSION.WIDTH + margin*2, CONST.TILESIZE * CONST.BOARDDIMENSION.HEIGHT + margin *2);
		goog.style.setSize(BoardView.TileCanvas, CONST.TILESIZE * CONST.BOARDDIMENSION.WIDTH + margin * 2, CONST.TILESIZE * CONST.BOARDDIMENSION.HEIGHT + margin * 2);
		//size the context
		BoardView.TileContext.canvas.width = CONST.TILESIZE * CONST.BOARDDIMENSION.WIDTH + margin * 2;
		BoardView.TileContext.canvas.height = CONST.TILESIZE * CONST.BOARDDIMENSION.HEIGHT + margin * 2;
		//add the board to the game screen
		goog.dom.appendChild(GridDom.GameScreen, BoardView.Board);
		//bind an event listener to the board
		goog.events.listen(BoardView.Board, [goog.events.EventType.TOUCHSTART, goog.events.EventType.MOUSEDOWN], BoardView.mousedown);
		goog.events.listen(BoardView.Board, [goog.events.EventType.TOUCHEND, goog.events.EventType.MOUSEUP], BoardView.mouseup);
	},
	drawTile : function(tile){
		var margin = BoardView.margin;
		BoardView.TileContext.save();
		BoardView.TileContext.translate(margin, margin);
		TileView.drawTile(tile, BoardView.TileContext);
		BoardView.TileContext.restore();
	},
	drawGrid : function(){
		var context = BoardView.TileContext;
		var margin = BoardView.margin;
		context.save();
		context.translate(margin, margin);
		context.strokeStyle = "#999";
		context.lineWidth = 1;
		for (var y = 0; y < CONST.BOARDDIMENSION.HEIGHT+1; y++){
			context.beginPath();
			context.moveTo(0, y * CONST.TILESIZE);
			context.lineTo(CONST.TILESIZE * CONST.BOARDDIMENSION.WIDTH, y * CONST.TILESIZE);
			context.stroke();
		}
		for (var x = 0; x < CONST.BOARDDIMENSION.WIDTH+1; x++){
			context.beginPath();
			context.moveTo(x * CONST.TILESIZE, 0);
			context.lineTo(x * CONST.TILESIZE, CONST.TILESIZE * CONST.BOARDDIMENSION.HEIGHT);
			context.stroke();
		}
		context.restore();
	},
	reset : function() {
		//clear the canvas
		BoardView.TileContext.clearRect(0, 0, BoardView.TileCanvas.width, BoardView.TileCanvas.height);
	},
	/** 
		translates board coordinates to a tile position
		@param {!goog.math.Coordinate} position
		@returns {!goog.math.Coordinate}
	*/
	pixelToPosition : function(position){
		var ret = position.clone().translate(-BoardView.margin, -BoardView.margin);
		ret.scale(1 / CONST.TILESIZE);
		return ret.floor();
	},
	/** 
		translates tile position to pixels
		@param {goog.math.Coordinate} position
		@return {goog.math.Coordinate}
	*/
	positionToPixel : function(position){
		return position.clone().scale(CONST.TILESIZE).translate(BoardView.margin, BoardView.margin);
	},
	/**
		Event handler for mouse/touchdown on the board. 
		@param {goog.events.Event} e The event object.
		@returns {!goog.math.Coordinate}
	*/
	mouseEventToPosition : function(e){
		var clientPosition = goog.style.getClientPosition(BoardView.Board);
		//subtract the touch position to get the offset
		var offset = new goog.math.Coordinate(e.clientX - clientPosition.x, e.clientY - clientPosition.y);
		// e.stopPropagation();
		var position = BoardView.pixelToPosition(offset);
		return position;
	},
	/**
		Event handler for mouse/touchdown on the board. 
		@param {goog.events.Event} e The event object.
	*/
	mousedown : function(e){
		e.preventDefault();
		//invoke the click callback
		GameController.mouseDownOnTile(BoardView.mouseEventToPosition(e));
	},
	/**
		Event handler for mouse/touchup on the board. 
		@param {goog.events.Event} e The event object.
	*/
	mouseup : function(e){
		e.preventDefault();
		//invoke the click callback
		GameController.mouseUpOnTile(BoardView.mouseEventToPosition(e));
	}
};

//initialize the board
BoardView.initialize();
