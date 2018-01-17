"use strict"
console.log("model.js successfully loaded");

var Minesweeper = {}
Minesweeper.Model = function() {
  // Private
  var gameGrid;
  var revealedGrid;
  var xSize = 10;
  var ySize = 10;
  var numBombs = 10;
  var gameGridCallback = function() {};
  var revealedGridCallback = function () {};
  // Public
  var minesweeper = {
    // Get methods
    getGameGrid: function() {
      return gameGrid;
    },
    getRevealedGrid: function() {
      return revealedGrid;
    },
    getXSize: function() {
      return xSize;
    },
    getYSize: function() {
      return ySize;
    },
    // Set methods
    setGameGridCallback: function(func) {
      gameGridCallback = func;
    },
    setRevealedGridCallBack: function(func) {
      revealedGridCallback = func;
    },
    // Game state methods
    resetGameGrid: function(xClick, yClick) {
      // calls callback function
      var newGrid = [];
      for(var i=0; i<xSize; i++) {
        newGrid.push([]);
        for(var j=0; j<ySize; j++) {
          newGrid[i].push("");
        };
      };
      gameGrid = newGrid;
      this._populateBombs(xClick, yClick);
      this._labelGrid();
      gameGridCallback();
    },
    _populateBombs: function(xClick, yClick) {
      //The first click is always safe, args mark first click
      var bombs = 0;
      while (bombs < numBombs) {
        var xRand = Math.floor(Math.random() * xSize);
        var yRand = Math.floor(Math.random() * ySize);
        if(gameGrid[xRand][yRand] !== "bomb" && (xRand !== xClick || yRand !== yClick)) {
          bombs++;
          gameGrid[xRand][yRand] = "bomb"
        };
      };
    },
    _labelGrid: function() {
      for(var x=0; x<xSize; x++) {
        for(var y=0; y<ySize; y++) {
          if(gameGrid[x][y] !== "bomb") {
            gameGrid[x][y] = this._getNumNeighboringBombs(x,y);
          };
        };
      };
    },
    _getNumNeighboringBombs: function(xcoord, ycoord) {
      // INPUT: x,y coordinates
      // OUTPUT: number
      var neighboringBombs = 0;
      for(var x=-1; x<2; x++) {
        for(var y=-1; y<2; y++) {
          if(xcoord+x < xSize &&
             ycoord+y < ySize &&
             xcoord+x >= 0 &&
             ycoord+y >= 0) {
            if(!(x===0 && y===0) && gameGrid[xcoord+x][ycoord+y] == "bomb") {
              neighboringBombs++;
            };
          };
        };
      };
      return neighboringBombs;
    },
    resetRevealedGrid: function() {
      var newGrid = [];
      for(var x=0; x<xSize; x++) {
        newGrid.push([]);
        for(var y=0; y<ySize; y++) {
          newGrid[x].push(false);
        };
      };
      revealedGrid = newGrid;
      revealedGridCallback();
    },
    revealTile: function(xcoord, ycoord) {
      if(gameGrid[xcoord] == undefined) {
        return;
      } else if(gameGrid[xcoord][ycoord] == undefined) {
        return;
      };
      var gameValue = gameGrid[xcoord][ycoord];
      if(!revealedGrid[xcoord][ycoord]) {
        revealedGrid[xcoord][ycoord] = true;
        if (gameValue == "0") {
          var surroundingZeroes = [
            [xcoord-1, ycoord-1],
            [xcoord-1, ycoord],
            [xcoord-1, ycoord+1],
            [xcoord, ycoord-1],
            [xcoord, ycoord+1],
            [xcoord+1, ycoord-1],
            [xcoord+1, ycoord],
            [xcoord+1, ycoord+1],
          ];
          for(var i=0; i<surroundingZeroes.length; i++) {
            this.revealTile(surroundingZeroes[i][0],surroundingZeroes[i][1])
          };
        };
      };
      revealedGridCallback();
    },
    checkWin: function() {
      var unclicked = 0;
      for(var x=0; x<xSize; x++) {
        for(var y=0; y<ySize; y++) {
          if(!revealedGrid[x][y]) {
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
          if(revealedGrid[x][y]) {
            if(gameGrid[x][y] == "bomb") {
              return true;
            }
          };
        };
      };
      return false;
    },
    // DEBUG
    getFlippedGrid: function(grid) {
      var flippedGrid = [];
      for(var y=0; y<ySize; y++) {
        flippedGrid.push([]);
      };
      for(var y=0; y<ySize; y++) {
        for(var x=0; x<xSize; x++) {
          flippedGrid[y].push(grid[x][y]);
        };
      };
      return flippedGrid;
    },
    printGameGrid: function() {
      var flippedGrid = this.getFlippedGrid(gameGrid);
      for(var i=0; i<flippedGrid.length; i++) {
        console.log(flippedGrid[i]);
      };
    },
    printRevealedGrid: function() {
      var flippedGrid = this.getFlippedGrid(revealedGrid);
      for(var i=0; i<flippedGrid.length; i++) {
        console.log(flippedGrid[i]);
      };
    },
  };
  return minesweeper;
};
