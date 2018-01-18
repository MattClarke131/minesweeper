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
      this.model.resetTileGrid();
      this.resetGameGridDisplay();
      this.model.setRevealedCallBack(this.updateRevealedTiles);
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
        var value = controller.model.getTileGrid()[xcoord][ycoord].gameValue;
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
    updateRevealedTiles: function() {
      var grid = controller.model.getTileGrid();
      for(var y=0; y<numGameRows; y++) {
        var row = gameGrid.find(".gameRow[data-ycoord="+y+"]");
        for(var x=0; x<numGameCols; x++) {
          var tile = row.find("[data-xcoord="+x+"]");
          var visible = grid[x][y].revealed;
          if(visible) {
            tile.attr("data-revealed", "true")
          } else {
            tile.attr("data-revealed", "false");
          };
        };
      };
    },
    _toggleFlag: function(tile) {
      var xcoord = tile.attr("data-xcoord");
      var ycoord = tile.attr("data-ycoord");
      var tileModel = controller.model.getTileGrid()[xcoord][ycoord];
      var isFlagged = tileModel.flagged;
      if(!isFlagged) {
        tile.attr("data-flagged", "true");
        tileModel.flagged = true;
      } else {
        tile.attr("data-flagged", "false");
        tileModel.flagged = false;
      };
    },
    // Game state functions
    setInitPhase: function() {
      $(".minesweeper").attr("data-phase","init");
      this.resetTimer();
      this.bindAllTileButtons(this._initialTileFunction, this._tileShiftClickFunction);
      this.model.resetTileGrid();
      this.updateRevealedTiles();
      console.log("initPhase");
    },
    setPlayPhase: function() {
      $(".minesweeper").attr("data-phase","play");
      this.startTimer();
      this.bindAllTileButtons(this._tileFunction, this._tileShiftClickFunction);
      console.log("playPhase");
    },
    setLosePhase: function() {
      $(".minesweeper").attr("data-phase","lose");
      this.stopTimer();
      this.bindAllTileButtons(null, null);
      console.log("losePhase");
    },
    setWinPhase: function() {
      $(".minesweeper").attr("data-phase","win");
      this.stopTimer();
      this.bindAllTileButtons(null, null);
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
      $(".smileyDisplay").click(function() {
          controller.setInitPhase();
        });
    },
    bindAllTileButtons: function(func, shiftFunc) {
      var controller = this;
      gameGrid.unbind();
      gameGrid.on("click", ".gameTile", function (e) {
        var tile = e.target;
        if (e.shiftKey && shiftFunc) {
          shiftFunc(tile);
        } else if(func) {
          func(tile);
        };
      });
    },
    _initialTileFunction: function(tile) {
      controller.setPlayPhase();
      var xcoord = Number($(tile).attr("data-xcoord"));
      var ycoord = Number($(tile).attr("data-ycoord"));
      controller.model.resetTileGrid(xcoord,ycoord);
      controller._setGameValues();
      controller.model.revealTile(xcoord, ycoord);
      if(controller.model.checkWin()) {
        controller.setWinPhase();
      };
    },
    _tileFunction: function(tile) {
      var xcoord = Number($(tile).attr("data-xcoord"));
      var ycoord = Number($(tile).attr("data-ycoord"));
      controller.model.revealTile(xcoord, ycoord);
      if(controller.model.checkWin()) {
        controller.setWinPhase();
      } else if(controller.model.checkLoss()) {
        controller.setLosePhase();
      };
    },
    _tileShiftClickFunction: function(tile) {
      controller._toggleFlag($(tile));
    },
    // Debug
  };
};
//temp for debugging
var controller = Minesweeper.Controller($(".minesweeper")[0]);
controller.initialize();
