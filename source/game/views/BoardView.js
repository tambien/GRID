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
goog.require("screens.views.GridDom");
goog.require('goog.fx.DragDrop');
goog.require("goog.dom.ViewportSizeMonitor");


var BoardView = {
	/** @type {Element} */
	Board : goog.dom.createDom("div", {"id" : "BoardView"}),
	/** @type {Element} */
	BoardContainer : goog.dom.createDom("div", {"id" : "BoardViewContainer"}),
	/** @type {Element} */
	bgBox : goog.dom.createDom("div", {"id" : "BackgroundColor"}),
	/** @type {goog.math.Size} */
	BoardSize : new goog.math.Size(0,0),
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
	margin : 0,
	initialize : function(){
		//add the board to the game screen
		goog.dom.appendChild(GridDom.GameScreen, BoardView.BoardContainer);
		//make the box for the background
		goog.dom.appendChild(BoardView.BoardContainer, BoardView.Board);
		goog.dom.appendChild(BoardView.Board, BoardView.bgBox);
		//put the canvas in the board
		goog.dom.appendChild(BoardView.Board, BoardView.TileCanvas);
		//make the drawing context
		BoardView.TileContext = BoardView.TileCanvas.getContext('2d');
		BoardView.setupSize();
		//resize callback
		var vsm = new goog.dom.ViewportSizeMonitor();
		//listen for changes to the size
		goog.events.listen(vsm, goog.events.EventType.RESIZE, function(size){
			//setup the size
			BoardView.setupSize()
			//redraw the grid
			BoardView.drawGrid(0);
		});
	},
	setupSize : function(){
		//size the canvas
		var margin = BoardView.margin;
		BoardView.BoardSize = new goog.math.Size(CONST.TILESIZE * CONST.BOARDDIMENSION.WIDTH + margin*2, CONST.TILESIZE * CONST.BOARDDIMENSION.HEIGHT + margin *2);
		goog.style.setSize(BoardView.Board, BoardView.BoardSize);
		//and the background
		var fullWidth = goog.style.getSize(GridDom.GameScreen).width; 
		var bgMargin = fullWidth * .03;
		var bgWidth = (fullWidth - bgMargin * 2);
		goog.style.setStyle(BoardView.bgBox, {
			"width" : bgWidth + "px",
			"margin-left" : -(bgWidth / 2) + "px"

		});
		//size the context
		BoardView.TileContext.canvas.width = BoardView.BoardSize.width + 10;
		BoardView.TileContext.canvas.height = BoardView.BoardSize.height + 10;
		//set the bottom position
		goog.style.setStyle(BoardView.Board, {
			// "bottom" : (CONST.TILESIZE * 3 + bgMargin) + "px",
			"margin-left" : - (BoardView.BoardSize.width / 2) + "px"
		});
	},
	/** 
		sets the margin on the Element's top and left
		@param {Element} element
	*/
	applyMargin : function(element){
		var margin = BoardView.margin;
		goog.style.setPosition(element, new goog.math.Coordinate(margin, margin));
	},
	/** 
		@returns {!goog.math.Coordinate} the coordinate of the margins
	*/
	getMargin : function(){
		var margin = BoardView.margin;
		return new goog.math.Coordinate(margin, margin);
	},
	/** 
		@param {number=} animationTime
	*/
	drawGrid : function(animationTime){
		for (var y = 0; y < CONST.BOARDDIMENSION.HEIGHT+1; y++){
			for (var x = 0; x < CONST.BOARDDIMENSION.WIDTH+1; x++){
				setTimeout(function(){
					var nX = x;
					var nY = y;
					return function(){
						BoardView.drawCircle(nX, nY);
					}
				}(), goog.math.randomInt(animationTime || 0));
			}
		}
	},
	/** 
		draw a single circle on the board
		@param {number} x
		@param {number} y
	*/
	drawCircle : function(x, y){
		var context = BoardView.TileContext;
		var margin = BoardView.margin;
		context.save();
		context.translate(margin, margin);
		context.fillStyle = "#777";
		var radius = 2;
		var offset = 6;
		//draw it.
		context.beginPath();
		context.rect(x * CONST.TILESIZE + offset - radius, y * CONST.TILESIZE + offset - radius, radius * 2, radius * 2);
		// context.arc(x * CONST.TILESIZE + offset, y * CONST.TILESIZE + offset, radius, 0, 2 * Math.PI, false);
		context.fill();
		context.restore();
	},
	reset : function() {
		//clear the canvas
		BoardView.TileContext.clearRect(0, 0, BoardView.TileCanvas.width, BoardView.TileCanvas.height);
	},
	/** 
		translates board coordinates to a tile position
		@param {!goog.math.Coordinate} position
		@return {!goog.math.Coordinate}
	*/
	pixelToPosition : function(position){
		var ret = position.clone().translate(-BoardView.margin, -BoardView.margin);
		ret.scale(1 / CONST.TILESIZE);
		return ret.round();
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
		@param {goog.math.Coordinate} position
		@returns {boolean} true if the position is on the board
	*/
	isPositionOnBoard : function(position){
		var BoardPosition = goog.style.getClientPosition(BoardView.Board);
		var greaterThanTopLeft = position.x > BoardPosition.x && position.y > BoardPosition.y;
		var lessThanBottomRight = position.x < BoardPosition.x + BoardView.BoardSize.width && position.y < BoardPosition.y + BoardView.BoardSize.height;
		return greaterThanTopLeft && lessThanBottomRight;
	},
	/*=========================================================================
		MOUSE STUFFS
	=========================================================================*/
	/**
		Event handler for mouse/touchdown on the board. 
		@param {goog.events.Event} e The event object.
		@return {!goog.math.Coordinate}
	*/
	mouseEventToPosition : function(e){
		var clientPosition = goog.style.getClientPosition(BoardView.Board);
		//subtract the touch position to get the offset
		var offset = new goog.math.Coordinate(e.clientX - clientPosition.x, e.clientY - clientPosition.y);
		var ret = offset.clone().translate(-BoardView.margin, -BoardView.margin);
		ret.scale(1 / CONST.TILESIZE);
		ret.floor();
		return ret;
	}
};

//initialize the board
BoardView.initialize();
