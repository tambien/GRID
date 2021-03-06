/*=============================================================================
	TUTORIAL MANAGER

	manages the onboarding experience
=============================================================================*/

goog.provide("managers.TutorialManager");

goog.require("ScreenText");
goog.require("goog.storage.mechanism.HTML5LocalStorage");
goog.require("game.controllers.TileController");
goog.require("screens.views.GridDom");
goog.require("managers.Analytics");

var TutorialManager = {
	/** @type {goog.storage.mechanism.HTML5LocalStorage} */
	storage : new goog.storage.mechanism.HTML5LocalStorage(),
	/** @type {string} */
	storageName : "OnBoarding1",
	/** @type {Object} */
	onBoardingState : {},
	/** init */
	initialize : function(){
		//pull the local storage into the onBoardingState
		var localStore = TutorialManager.getModelFromStorage();
		if (!localStore){
			TutorialManager.onBoardingState = {};
			TutorialManager.storeModel();
		} else {
			TutorialManager.onBoardingState = localStore;
		}
	},
	/** 
		called when the song screen is shown	
	*/
	songScreen : function(){
		if (!TutorialManager.seenAttribute("SongScreen", "firstView")){

		}
	},
	/** 
		called when the song screen is shown	
	*/
	partsScreen : function(){
		if (!TutorialManager.getAttribute("PartsScreen", "playParts")){
			if (StageController.getSolvedLevelCount(StageController.getCurrentStage()) > 0){
				ScreenText.gameScreenInstruction("Hit play to hear all the solved levels.", undefined, 500);
				ScreenText.highlightPartsScreenButton("play", 1500);
				TutorialManager.setAttribute("PartsScreen", "playParts", true, true);
			}
		}
	},
	/** 
		when the play button is hit
	*/
	partsScreenPlayButtonHit : function(){
		if (!TutorialManager.seenAttribute("PartsScreen", "playButtonHit")){
			ScreenText.gameScreenInstruction("Swipe left to mute a part. Tap and hold to solo it.", undefined, 500);
		}
	},
	/*=========================================================================
		LOCAL STORAGE
	=========================================================================*/
	/** 
		@param {string} category
		@param {string} attribute
		@returns {boolean}
	*/
	seenAttribute : function(category, attribute){
		if (!TutorialManager.getAttribute(category, attribute, false)){
			//record the results
			TutorialManager.setAttribute(category, attribute, true, true);
			return false;
		} else {
			return true;
		}
	},
	/** 
		@param {string} category
		@param {string} attribute
		@param {*} value
		@param {boolean=} store
	*/
	setAttribute : function(category, attribute, value, store){
		if (!TutorialManager.onBoardingState[category]){
			TutorialManager.onBoardingState[category] = {};
		}
		TutorialManager.onBoardingState[category][attribute] = value;
		if (store){
			TutorialManager.storeModel();
		}
	},
	/** 
		stores everything in local storage
	*/
	storeModel : function(){
		TutorialManager.storage.set(TutorialManager.storageName, JSON.stringify(TutorialManager.onBoardingState));
	},
	/** 
		@suppress {checkTypes}
		@returns {Object | null} the stored object
	*/
	getModelFromStorage : function(){
		var storageString = TutorialManager.storage.get(TutorialManager.storageName);
		if (!goog.isNull(storageString)){
			return JSON.parse(storageString);
		} else {
			return null;
		}
	},
	/** 
		@param {string} category
		@param {string} attribute
		@param {boolean=} fromStorage
		@returns {*} the attribute requested
	*/
	getAttribute : function(category, attribute, fromStorage){
		var model = fromStorage ? TutorialManager.onBoardingState : TutorialManager.getModelFromStorage();
		if (model && model[category] && model[category][attribute]){
			return model[category][attribute];
		} else {
			return null;
		}
	},
	/*=========================================================================
		GAME SCREEN
	=========================================================================*/
	/** 
		@param {number} stage
		@param {number} level
	*/
	setStage : function(stage, level){
		if (stage === 0 && !TutorialManager.seenAttribute("FirstStage", "Started")) {
			Analytics.trackEvent("tutorial", "first_stage", "start");
		}
		if (stage === 0 && !TutorialManager.getAttribute("FirstStage", "Completed", false)) {
			//hide the back button
			if (level === 0 && !TutorialManager.getAttribute("FirstLevel", "Completed") ){
				ScreenText.gameScreenInstruction("Lets get started!", "Drag the piece onto the board as shown.");
				// ScreenText.showNumbersOnGame(2000);	
				ScreenText.gameScreenDragPiece();
				//highlight the one piece
				Analytics.trackEvent("tutorial", "first_level", "start");
				//TileController.highlightTile(new goog.math.Coordinate(2, 3), PieceType.Red, 1);
			} else if (level === 1 && !TutorialManager.getAttribute("SecondLevel", "Completed") ){
				ScreenText.gameScreenInstruction("To match the pattern above, place the green piece on the 3rd step from the wall.", undefined, 500);
				ScreenText.showNumbersOnGame(1000);	
				ScreenText.showNumbersOnPattern(1000);	
				Analytics.trackEvent("tutorial", "second_level", "start");
			} else if (level === 2 && !TutorialManager.getAttribute("ThirdLevel", "Completed") ){
				ScreenText.gameScreenInstruction("Solve the pattern above without the pieces colliding.", undefined, 500);
				Analytics.trackEvent("tutorial", "third_level", "start");
			} else if (level === 3 && !TutorialManager.getAttribute("FourthLevel", "Completed") ){
				Analytics.trackEvent("tutorial", "fourth_level", "start");
			}  else if (level === 4 && !TutorialManager.getAttribute("FifthLevel", "Completed") ){
				ScreenText.gameScreenInstruction("Look at the board.", "The top row has 2 tiles and the bottom row has 4. Use this to solve the pattern.", 500);
				Analytics.trackEvent("tutorial", "fifth_level", "start");
			} 
		} 
		//learn piece rotation
		if (stage === 2 && level === 0 && !TutorialManager.getAttribute("PieceRotation", "Completed")){
			ScreenText.gameScreenInstruction("Another thing...", "You can rotate pieces in any direction. This might take a little practice.");
			ScreenText.gameScreenPieceDragToRotate();
			Analytics.trackEvent("tutorial", "rotate", "start");
		}
		//if it's perfect give an explination
		if (StageController.isLevelPerfect(stage, level) && !TutorialManager.seenAttribute("ThreeStarLevel", "RecordInstructions")){
			ScreenText.gameScreenInstruction("You've gotten a perfect score on this part! Now record a remix!", undefined, 500);
			// ScreenText.highlightTakes("", 1000);
			// ScreenText.highlightPlayButton("rec", 1000);
		}
		//took away hints
		if (stage >= CONST.NO_HINTS_LEVEL && !TutorialManager.seenAttribute("NoMoreHints", "GoodLuck")){
			ScreenText.gameScreenInstruction("No more hints! Things just got a little more interesting...")
		}
	},
	/** 
		called when a piece is rotated
		@param {Piece} piece
	*/
	pieceWasRotated : function(piece){
		var stage = StageController.getCurrentStage();
		var level = StageController.getCurrentLevel();
		if (stage === 2 && level === 0 && !TutorialManager.getAttribute("PieceRotation", "Completed", false)){
			ScreenText.hideText();
			if (piece.direction === Direction.North){
				ScreenText.quickBoardText("good!");
				TutorialManager.setAttribute("PieceRotation", "Completed", true, true);
				Analytics.trackEvent("tutorial", "rotate", "completed");
				ScreenText.highlightPlayButton("play", 1000);
			} else {
				ScreenText.quickBoardText("almost.");
			}
		}
		Analytics.trackGameAction("rotate");
	},
	/** 
		@param {Piece} piece
		@param {!goog.math.Coordinate} position
	*/
	pieceDroppedOnBoard : function(piece, position){
		var stage = StageController.getCurrentStage();
		var level = StageController.getCurrentLevel();
		if (stage === 0 && level === 0){
			if (!TutorialManager.getAttribute("FirstLevel", "Completed", false)){
				if (position.x === 2 && position.y === 3){
					ScreenText.hideText();	
					ScreenText.quickBoardText("nice!");
					//remove the highlight
					TileController.clearHighlights();
					//press the play button
					ScreenText.highlightPlayButton("play", 1000);
					GameController.playButton.fadeIn();
				} else {
					// TRY AGAIN!
					ScreenText.quickBoardText("not quite.");
					GameController.playButton.fadeOut();
				}
			}
		}
		//second level
		if (stage === 0 && level === 1){
			if (!TutorialManager.getAttribute("SecondLevel", "Completed", false)){
				if (position.x === 4 && position.y === 3){
					ScreenText.hideText();
					ScreenText.quickBoardText("yes!");
					//remove the highlight
					// TileController.clearHighlights();
					//press the play button
					ScreenText.highlightPlayButton("play", 500);
					GameController.playButton.fadeIn();
				} else {
					// TRY AGAIN!
					ScreenText.quickBoardText("almost.");
					GameController.playButton.fadeOut();
				}
			}
		}
		//third level
		if (stage === 0 && level === 2){
			if (!TutorialManager.getAttribute("ThirdLevel", "Completed", false)){
				//check if the pattern is correct to reveal the play button
				if (PatternController.isTargetPattern(PieceController.computeAggregatePattern())){
					//press the play button
					ScreenText.highlightPlayButton("play", 500);
					GameController.playButton.fadeIn();
				} else {
					//GameController.playButton.fadeOut();
				}
			}
		}
		//fourth level
		if (stage === 0 && level === 3){
			if (!TutorialManager.getAttribute("FourthLevel", "Completed", false)){
				//check if the pattern is correct to reveal the play button
				if (PatternController.isTargetPattern(PieceController.computeAggregatePattern())){
					//press the play button
					ScreenText.highlightPlayButton("play", 500);
					GameController.playButton.fadeIn();
				} else {
					//GameController.playButton.fadeOut();
				}
			}
		}
		//fourth level
		if (stage === 0 && level === 4){
			if (!TutorialManager.getAttribute("FifthLevel", "Completed", false)){
				//check if the pattern is correct to reveal the play button
				if (PatternController.isTargetPattern(PieceController.computeAggregatePattern())){
					//press the play button
					ScreenText.highlightPlayButton("play", 500);
					GameController.playButton.fadeIn();
				} else {
					//GameController.playButton.fadeOut();
				}
			}
		}
		//rotation level
		if (stage === 2 && level === 0){
			if (!TutorialManager.getAttribute("PieceRotation", "Completed", false)){
				if (position.x === 3 && position.y === 2){
					ScreenText.hideText();
					//now continue with the double tap instructions
					ScreenText.gameScreenPieceRotate();
				}
			}
		}
		//if it's perfect highlight the record button
		if (StageController.isLevelPerfect(stage, level) && !TutorialManager.seenAttribute("ThreeStarLevel", "HighlightRecord")){
			ScreenText.highlightPlayButton("rec", 500);
		}
		//let analytics know
		Analytics.trackGameAction("move");
	},
	/** 
		@param {GameOverInterstitial} modal
	*/
	gameOverInterShow : function(modal){
		var stage = StageController.getCurrentStage();
		if (stage === 0){
			var instructionDelay = 1500;
			if (!TutorialManager.getAttribute("FirstStage", "Completed")){
				//remove the unnecessary parts of the modal
				goog.dom.setTextContent(modal.TextDescription, "");
				modal.Replay.dispose();
			}
			var level = StageController.getCurrentLevel();
			//some level specific stuff
			if (level === 0 && !TutorialManager.seenAttribute("FirstLevel", "Completed")){
				Analytics.trackEvent("tutorial", "first_level", "completed");
				//set the state
				ScreenText.gameScreenInstruction("\n\n\n\n\n\n\n\nPieces bounce off the walls to make loops.", undefined, instructionDelay);
				ScreenText.highlightNextButton("next", instructionDelay + 1000);
			} else if (level === 1 && !TutorialManager.seenAttribute("SecondLevel", "Completed")){
				Analytics.trackEvent("tutorial", "second_level", "completed");
				ScreenText.gameScreenInstruction("\n\n\n\n\n\n\n\nNow we're making music!", undefined, instructionDelay);
				ScreenText.highlightNextButton("next", instructionDelay + 1000);
			} else if (level === 2 && !TutorialManager.seenAttribute("ThirdLevel", "Completed")){
				Analytics.trackEvent("tutorial", "third_level", "completed");
				ScreenText.gameScreenInstruction("\n\n\n\n\n\n\n\nParts combine to make a song.", undefined, instructionDelay);
				ScreenText.highlightNextButton("next", instructionDelay + 1000);
			} else if (level === 3 && !TutorialManager.seenAttribute("FourthLevel", "Completed")){
				Analytics.trackEvent("tutorial", "fourth_level", "completed");
				ScreenText.gameScreenInstruction("\n\n\n\n\n\n\n\nComplete the part in 1 take to get 3 stars.", undefined, instructionDelay);
				ScreenText.highlightTakes("", instructionDelay+ 500);
				ScreenText.highlightNextButton("next", instructionDelay + 1000);
			} else if (level === 4 && !TutorialManager.seenAttribute("FifthLevel", "Completed")){
				Analytics.trackEvent("tutorial", "fifth_level", "completed");
				//set the state
				ScreenText.gameScreenInstruction("\n\n\n\n\n\n\n\nCongratulations!", "\n\n\n\n\n\n\n\nYou've finished your first song!", instructionDelay);
				TutorialManager.setAttribute("FirstStage", "Completed", true, true);
				Analytics.trackEvent("tutorial", "first_stage", "completed");
				//ScreenText.highlightNextButton("next", instructionDelay + 1000);
			}
		}
	},
	/** 
		called when the game fail interstitial is shown
	*/
	gameFailInterstitial : function(){
		if (!TutorialManager.seenAttribute("GameFailInterstitial", "Shown")){
			var instructionDelay = 1500;
			//set the state
			ScreenText.gameScreenInstruction("\n\nYou've used up all your takes! That's a cue that you should take a short breather.", undefined, instructionDelay);
			ScreenText.highlightPrevButton("back", instructionDelay + 1000);
		}
	},
	/** 
		called when the game screen enters
	*/
	onGameScreen : function(){
		var stage = StageController.getCurrentStage();
		var level = StageController.getCurrentLevel();
		/* if (stage === 0){
			if (level === 0 && TutorialManager.getAttribute("FirstLevel", "Completed")){
				GameScreen.backButton.show();
			} else if (level === 1 && !TutorialManager.getAttribute("SecondLevel", "Completed")){
				GameScreen.backButton.show();
			} else if (level === 2 && !TutorialManager.getAttribute("ThirdLevel", "Completed")){
				GameScreen.backButton.show();
			} else if (level === 3 && !TutorialManager.getAttribute("FourthLevel", "Completed")){
				GameScreen.backButton.show();
			} else if (level === 4 && !TutorialManager.getAttribute("FifthLevel", "Completed")){
				GameScreen.backButton.show();
			}
		} */
		//hide the button's initially if they haven't completed the tutorial
		if (stage === 0 && !TutorialManager.getAttribute("FirstStage", "Completed", false)){
			GameScreen.questionMark.hide();
		} else {
			GameScreen.questionMark.show();
		}
	},
	/** 
		play button clicked
	*/
	gameScreenPlaying : function(){
		var stage = StageController.getCurrentStage();
		if (stage === 0 && !TutorialManager.getAttribute("FirstStage", "Completed")){
			GameController.playButton.fadeOut();
		}		
	},
	/** 
		the play button was hit during free play
	*/
	gameScreenFreePlay : function(){
		//if it's perfect highlight the record button
		if (!TutorialManager.seenAttribute("ThreeStarLevel", "HearOnPartsScreen")){
			ScreenText.gameScreenInstruction("Hear your remixed part together with the rest of the song on the Parts Screen", undefined, 1000);
			//highlight the back button
			ScreenText.highlightBackButton(1300);
		} 
	},
	/** 
		called when the question mark is clicked
		@param {Button} button
	*/
	onQuestionMark : function(button){
		//if the current level is beat, show the 
		var stage = StageController.getCurrentStage();
		var level = StageController.getCurrentLevel();
		if (StageController.isLevelPerfect(stage, level)){
			ScreenText.freePlayRules();
			Analytics.trackEvent("menu", "tutorial_question_mark", "free_play");
		} else {
			Analytics.trackEvent("menu", "tutorial_question_mark", "game_rules");
			ScreenText.gameRules();
		}
	}
}

TutorialManager.initialize();