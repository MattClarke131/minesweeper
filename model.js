"use strict"
console.log("model.js successfully loaded");

var Minesweeper = {}
Minesweeper.Model = function() {
  // Private
  var tileGrid;
  var xSize = 10;
  var ySize = 10;
  var numBombs = 10;
  var revealedCallback = function () {};
  // Public
  var minesweeper = {
    // Get methods
    getTileGrid: function() {
      return tileGrid;
    },
    getXSize: function() {
      return xSize;
    },
    getYSize: function() {
      return ySize;
    },
    // Set methods
    setTileGridCallback: function(func) {
      tileGridCallback = func;
    },
    setRevealedCallBack: function(func) {
      revealedCallback = func;
    },
    // Game state methods
    resetTileGrid: function(xClick, yClick) {
      // calls callback function
      var newGrid = [];
      for(var x=0; x<xSize; x++) {
        newGrid.push([]);
        for(var y=0; y<ySize; y++) {
          newGrid[x].push(this._createTileObject(x,y));
        };
      };
      tileGrid = newGrid;
      this._populateBombs(xClick, yClick);
      this._labelGrid();
    },
    _createTileObject: function(xcoord, ycoord) {
      return {
        gameValue: null,
        xcoord: xcoord,
        ycoord: ycoord,
        revealed: false,
        flagged: false,
      };
    },
    _populateBombs: function(xClick, yClick) {
      //The first click is always safe, args mark first click
      var bombs = 0;
      while (bombs < numBombs) {
        var xRand = Math.floor(Math.random() * xSize);
        var yRand = Math.floor(Math.random() * ySize);
        if(tileGrid[xRand][yRand].gameValue !== "bomb" && (xRand !== xClick || yRand !== yClick)) {
          bombs++;
          tileGrid[xRand][yRand].gameValue = "bomb"
        };
      };
    },
    _labelGrid: function() {
      for(var x=0; x<xSize; x++) {
        for(var y=0; y<ySize; y++) {
          if(tileGrid[x][y].gameValue !== "bomb") {
            tileGrid[x][y].gameValue = this._getNumNeighboringBombs(x,y);
          };
        };
      };
    },
    _getNumNeighboringBombs: function(xcoord, ycoord) {
      // INPUT: x, y coordinates
      // OUTPUT: number
      var neighboringBombs = 0;
      for(var x=-1; x<2; x++) {
        for(var y=-1; y<2; y++) {
          if(xcoord+x < xSize &&
             ycoord+y < ySize &&
             xcoord+x >= 0 &&
             ycoord+y >= 0) {
            if(!(x===0 && y===0) && tileGrid[xcoord+x][ycoord+y].gameValue == "bomb") {
              neighboringBombs++;
            };
          };
        };
      };
      return neighboringBombs;
    },
    revealTile: function(xcoord, ycoord) {
      this._revealTileHelper(xcoord, ycoord);
      revealedCallback();
    },
    _revealTileHelper: function(xcoord, ycoord) {
      if(tileGrid[xcoord] == undefined) {
        return;
      } else if(tileGrid[xcoord][ycoord] == undefined) {
        return;
      };
      if(tileGrid[xcoord][ycoord].flagged == true) {
        return;
      };
      var gameValue = tileGrid[xcoord][ycoord].gameValue;
      if(gameValue == "bomb") {
        this._revealAllBombs();
      };
      if(!tileGrid[xcoord][ycoord].revealed) {
        tileGrid[xcoord][ycoord].revealed = true;
        if (gameValue == "0") {
          var surroundingTiles = [
            [xcoord-1, ycoord-1],
            [xcoord-1, ycoord],
            [xcoord-1, ycoord+1],
            [xcoord, ycoord-1],
            [xcoord, ycoord+1],
            [xcoord+1, ycoord-1],
            [xcoord+1, ycoord],
            [xcoord+1, ycoord+1],
          ];
          for(var i=0; i<surroundingTiles.length; i++) {
            this._revealTileHelper(surroundingTiles[i][0],surroundingTiles[i][1])
          };
        };
      };
    },
    _revealAllBombs: function() {
      for(var x=0; x<xSize; x++) {
        for(var y=0; y<ySize; y++) {
          if(tileGrid[x][y].gameValue == "bomb") {
            tileGrid[x][y].revealed = true;
          };
        };
      };
    },
    checkWin: function() {
      var unclicked = 0;
      for(var x=0; x<xSize; x++) {
        for(var y=0; y<ySize; y++) {
          if(!tileGrid[x][y].revealed) {
            unclicked++;
          }
        }
      }
      if(unclicked == numBombs && this.checkLoss() == false) {
        return true;
      } else {
        return false;
      };
    },
    checkLoss: function() {
      for(var x=0; x<xSize; x++) {
        for(var y=0; y<ySize; y++) {
          if(tileGrid[x][y].revealed) {
            if(tileGrid[x][y].gameValue == "bomb") {
              return true;
            }
          };
        };
      };
      return false;
    },
    // DEBUG
    getFlippedTileGrid: function() {
      var flippedGrid = [];
      for(var y=0; y<ySize; y++) {
        flippedGrid.push([]);
      };
      for(var y=0; y<ySize; y++) {
        for(var x=0; x<xSize; x++) {
          flippedGrid[y].push(tileGrid[x][y]);
        };
      };
      return flippedGrid;
    },
    printGridProperty: function(property) {
      var flippedGrid = this.getFlippedTileGrid();

      for(var i=0; i<flippedGrid.length; i++) {
        var row = [];
        for(var j=0; j<flippedGrid[i].length; j++) {
          row.push(flippedGrid[i][j][property]);
        };
        console.log(row);
      };
    },
  };
  return minesweeper;
};
