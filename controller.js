"use strict";

console.log("controller successfully loaded");
Minesweeper.Controller = function(node) {
  // Private
  var minesweeper = node;
  var gameTileTemplate = $(".gameTileTemplate");
  var gameRowTemplate = $(".gameRowTemplate");
  var gameGrid = $(".gameGrid");
  var numGameRows;
  var numGameCols;
  var initialTime = null;
  var timerOn = false;
  // Public
  return {
    model: Minesweeper.Model(),
    // Initialize
    initialize: function() {
      numGameRows = this.model.getYSize();
      numGameCols = this.model.getXSize();
      this.resetGameGridDisplay();
      this.model.setGameGridCallback(this._setGameValues);
      this.model.setRevealedGridCallBack(this.updateRevealedTiles);
      this.bindSmiley();
      console.log("initialization successful");
      this.setInitPhase();
    },
    _setGameValues: function() {
      //Sets gameValues for all tiles;
      var gameTiles = $(".gameTile");
      for(var i=0; i<gameTiles.length; i++) {
        var currentTile = $(gameTiles[i]);
        var xcoord = currentTile.attr("data-xcoord");
        var ycoord = currentTile.attr("data-ycoord");
        var value = controller.model.getGameGrid()[xcoord][ycoord];
        currentTile.attr("data-gameValue", value);
      };
    },
    // Display Functions
    resetGameGridDisplay() {
      this._populateGameRows(numGameRows,numGameCols);
    },
    _populateGameRows: function(numRows,numCols) {
      for(var i=0; i<numRows; i++) {
        var newRow = this._getFormattedGameRow(i);
        for(var j=0; j<numCols; j++) {
          var newTile = this._getFormattedGameTile(j,i);
          newRow.append(newTile);
        };
        gameGrid.append(newRow);
      };
    },
    _getFormattedGameRow: function(y) {
      var newRow = gameRowTemplate.clone();
      newRow.removeClass("gameRowTemplate").addClass("gameRow");
      newRow.attr("data-ycoord", y);
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
    updateRevealedTiles: function() {
      var grid = controller.model.getRevealedGrid();
      for(var y=0; y<numGameRows; y++) {
        var row = gameGrid.find(".gameRow[data-ycoord="+y+"]");
        for(var x=0; x<numGameCols; x++) {
          var tile = row.find("[data-xcoord="+x+"]");
          var visible = grid[x][y];
          if(visible) {
            tile.attr("data-revealed", "true")
          } else {
            tile.attr("data-revealed", "false");
          };
        };
      };
    },
    // Game state functions
    setInitPhase: function() {
      $(".minesweeper").attr("data-phase","init");
      this.resetTimer();
      this.setSmileyGraphic("smile");
      this.bindAllTileButtons(this._initialTileFunction);
      this.model.resetRevealedGrid();
      this.updateRevealedTiles();
      console.log("initPhase");
    },
    setPlayPhase: function() {
      $(".minesweeper").attr("data-phase","play");
      this.startTimer();
      this.setSmileyGraphic("smile");
      this.bindAllTileButtons(this._tileFunction);
      console.log("playPhase");
    },
    setLosePhase: function() {
      $(".minesweeper").attr("data-phase","lose");
      this.stopTimer();
      this.setSmileyGraphic("dead");
      this.bindAllTileButtons(null);
      console.log("losePhase");
    },
    setWinPhase: function() {
      $(".minesweeper").attr("data-phase","win");
      this.stopTimer();
      this.setSmileyGraphic("sunglasses");
      this.bindAllTileButtons(null);
      console.log("winPhase");
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
      initialTime = null;
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
      gameGrid.unbind();
      gameGrid.on("click", ".gameTile", function (e) {
        var tile = e.target;
        if(func) {
          func(tile);
        };
      });
    },
    _initialTileFunction: function(tile) {
      controller.setPlayPhase();
      var xcoord = Number($(tile).attr("data-xcoord"));
      var ycoord = Number($(tile).attr("data-ycoord"));
      controller.model.resetGameGrid(xcoord,ycoord);
      controller.model.resetRevealedGrid();
      controller.model.revealTile(xcoord, ycoord);
      if(controller.model.checkWin()) {
        controller.setWinPhase();
      };
    },
    _tileFunction: function(tile) {
        var xcoord = $(tile).attr("data-xcoord");
        var ycoord = $(tile).attr("data-ycoord");
        controller.model.revealTile(xcoord, ycoord);
        if(controller.model.checkWin()) {
          controller.setWinPhase();
        } else if(controller.model.checkLoss()) {
          controller.setLosePhase();
        };
    },
    // Debug
  };
};
//temp for debugging
var controller = Minesweeper.Controller($(".minesweeper")[0]);
controller.initialize();
