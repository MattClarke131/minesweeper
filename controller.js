console.log("controller successfully loaded");

Minesweeper.Controller = function(node) {
  // Private
  var minesweeper = node;
  var gameTileTemplate = $(".gameTileTemplate");
  var gameRowTemplate = $(".gameRowTemplate");
  var gameGrid = $(".gameGrid");
  var numGameRows = 10;
  var numGameCols = 10;
  var initialTime = null;
  var timerOn = false;

  controller = this;
  // Public
  return {
    model: Minesweeper.Model(),
    // Initialize
    initialize: function() {
      numGameRows = this.model.getYSize();
      numGameCols = this.model.getXSize();
      this.resetGameGridDisplay();
      this.model.setGameGridCallback(this._setGameValues);
      this.bindSmiley();
      console.log("initialization successful");
      this.setInitPhase();
    },
    // Display Functions
    resetGameGridDisplay() {
      gameGrid.empty();
      this._populateGameRows(numGameRows,numGameCols);
    },
    _populateGameRows: function(numRows,numCols) {
      for(var i=0; i<numRows; i++) {
        var newRow = this._getFormattedGameRow();
        for(var j=0; j<numCols; j++) {
          var newTile = this._getFormattedGameTile(j,i);
          newRow.append(newTile);
        };
        gameGrid.append(newRow);
      };
    },
    _getFormattedGameRow: function() {
      var newRow = gameRowTemplate.clone();
      newRow.removeClass("gameRowTemplate").addClass("gameRow");
      newRow.empty();
      return newRow;
    },
    _getFormattedGameTile: function(xcoord,ycoord) {
      var newTile = gameTileTemplate.clone();
      newTile.removeClass("gameTileTemplate").addClass("gameTile");
      newTile.attr("data-xcoord",xcoord);
      newTile.attr("data-ycoord",ycoord);
      return newTile;
    },
    _setGameValues: function() {
      //Sets gameValues for all tiles;
      var gameTiles = $(".gameTile");
      for(var i=0; i<gameTiles.length; i++) {
        var currentTile = $(gameTiles[i]);
        var xcoord = currentTile.attr("data-xcoord");
        var ycoord = currentTile.attr("data-ycoord");
        var value = controller.model.getGameGrid()[ycoord][xcoord];
        currentTile.attr("data-gameValue", value);
      };
    },
    _updateMinesDisplay: function(newValue) {
      // INPUT: string
      if (newValue.length == 1) {
        newValue = "00" + newValue;
      } else if (newValue.length == 2) {
        newValue = "0" + newValue;
      } else if (newValue.length > 3) {
        newValue = 999;
      }
      $(".minesDisplay").html(newValue);
    },
    setSmileyGraphic(newFace) {
      // INPUT: string
      var smileyGraphic = $($(".minesweeper .smileyGraphic")[0]);
      var newSrc;
      switch (newFace) {
        case "smile":
          newSrc = smileyGraphic.attr("data-smile-src");
          break;
        case "nervous":
          newSrc = smileyGraphic.attr("data-nervous-src");
          break;
        case "sunglasses":
          newSrc = smileyGraphic.attr("data-sunglasses-src");
          break;
        case "dead":
          newSrc = smileyGraphic.attr("data-dead-src");
          break;
        default:
          console.log("wrong argument for controller.setSmileyGraphic()");
          break;
      };
      smileyGraphic.attr("src", newSrc);
    },
    _clearGameGrid: function() {
      $(".gameTile").empty();
    },
    // Game state functions
    setInitPhase: function() {
      this._setAllTilesActivity(true);
      this.resetTimer();
      this.setSmileyGraphic("smile");
      this.bindAllTileButtons(this._initialTileFunction);
      this._clearGameGrid();
      console.log("initPhase");
    },
    setPlayPhase: function() {
      this._setAllTilesActivity(true);
      this.startTimer();
      this.setSmileyGraphic("smile");
      this.bindAllTileButtons(this._tileFunction);
      console.log("playPhase");
    },
    setLosePhase: function() {
      this._setAllTilesActivity(false);
      this.stopTimer();
      this.setSmileyGraphic("dead");
      console.log("losePhase");
    },
    setWinPhase: function() {
      this._setAllTilesActivity(false);
      this.stopTimer();
      this.setSmileyGraphic("sunglasses");
      console.log("winPhase");
    },
    _setAllTilesActivity: function(value) {
      var gameTiles = $(".gameTile");
      for(var i=0; i<gameTiles.length; i++) {
        var currentTile = $(gameTiles[i]);
        currentTile.attr("data-activity", value)
      };
    },
    _setIndividualTileActivity: function(xcoord,ycoord,value) {
      $("[data-xcoord="+xcoord+"][data-ycoord="+ycoord+"]").attr("data-activity", value);
    },
    // Time functions
    startTimer: function() {
      initialTime = new Date().getTime();
      timerOn = true;
      this._incrementTimer();
    },
    stopTimer: function() {
      timerOn = false;
    },
    resetTimer: function() {
      intialTime = null;
      timerOn = false;
    },
    _incrementTimer: function() {
      if(timerOn) {
        var currentTime = new Date().getTime();
        var diff = Math.floor((currentTime - initialTime) / 1000);
        this._updateTimerDisplay(diff.toString());
        var controller = this;
        setTimeout(function() {controller._incrementTimer()}, 250);
      };
    },
    _updateTimerDisplay: function(newValue) {
      // INPUT: string
      if (newValue.length === 1) {
        newValue = "00" + newValue;
      } else if (newValue.length === 2) {
        newValue = "0" + newValue;
      } else if (newValue.length > 3) {
        newValue = "999";
      };
      $(".timerDisplay").html(newValue);
    },
    // Binding functions
    bindSmiley: function() {
      var controller = this;
      $(".smileyGraphic").click(function() {
          controller.setInitPhase();
        });
    },
    bindAllTileButtons: function(func) {
      var controller = this;
      for(var x=0; x<numGameCols; x++) {
        for(var y=0; y<numGameRows; y++) {
          this._bindIndividualTileButton(x,y,func);
        };
      };
    },
    _bindIndividualTileButton: function(xcoord,ycoord, func) {
      var controller = this;
      $("[data-xcoord="+xcoord+"][data-ycoord="+ycoord+"]").unbind();
      $("[data-xcoord="+xcoord+"][data-ycoord="+ycoord+"]").click(func);
    },
    _initialTileFunction: function() {
      console.log("_initialTileFunction() called");
      var xcoord = $(this).attr("data-xcoord");
      var ycoord = $(this).attr("data-ycoord");
      controller.model.resetGameGrid(xcoord,ycoord);
      var gameValue = $(this).attr("data-gameValue");
      $(this).html(gameValue);
      controller.setPlayPhase();
    },
    _tileFunction: function() {
      console.log("_tileFunction() called");
      if($(this).attr("data-activity") == "true") {
        var gameValue = $(this).attr("data-gameValue");
        if(gameValue =="bomb") {
          controller.setLosePhase();
        };
        $(this).html(gameValue);
      };
    },
    // Debug
  };
};
//temp for debugging
var controller = Minesweeper.Controller($(".minesweeper")[0]);
controller.initialize();
