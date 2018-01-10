console.log("model.js successfully loaded");

var Minesweeper = {}
Minesweeper.Model = function() {
  // Private
  var gameGrid;
  var xSize = 10;
  var ySize = 10;
  var numBombs = 10;
  var gameGridCallback = function() {};

  // Public
  var minesweeper = {
    // Get methods
    getGameGrid: function() {
      return gameGrid;
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
    // DEBUG
    printGameGrid: function() {
      for(var i=0; i<gameGrid.length;i++) {
        console.log(gameGrid[i]);
      };
    },
  };
  return minesweeper;
};
