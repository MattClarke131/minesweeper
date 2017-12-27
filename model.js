console.log("model.js successfully loaded");

var Minesweeper = {}
Minesweeper.Model = function() {
  // Private
  var gameGrid;
  var xSize = 10;
  var ySize = 10;
  var numBombs = 10;
  var callback = function() {};

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
    getAllConnectedZeroes: function(xcoord, ycoord) {
      // INPUT: x,y coordinates
      // OUTPUT: array of form [[x0,y0],[x1,y0],...]
      var connectedZeroes = [];
      // Create a gameGrid with all tiles being equal to false
      var checkedTiles = [];
      for (var x=0; x<xSize; x++) {
        checkedTiles.push([]);
        for (var y=0; y<ySize; y++) {
          checkedTiles[x].push(false);
        };
      };
      // Initial tile is checked
      checkedTiles[xcoord][ycoord] = true;
      var uncheckedTiles = this._getOrthogZeroes(xcoord,ycoord);
      // Helper function
      var filterCheckedZeroes = function(arr) {
        // INPUT: array of form [[x0,y0],[x1,y1],...]
        // OUTPUT: array of form [[x0,y0],[x1,y1],...]
        var uncheckedZeroes = [];
        for(var i=0; i<arr.length; i++) {
          if(!checkedTiles[arr[i][0]][arr[i][1]]) {
            uncheckedZeroes.push(arr[i]);
          };
        };
        return uncheckedZeroes;
      };
      // "Paint fill" algorithm
      while(uncheckedTiles.length > 0) {
        currentTile = uncheckedTiles[0];
        checkedTiles[currentTile[0]][currentTile[1]] = true;
        var newZeroes = this._getOrthogZeroes(currentTile[0],currentTile[1]);
        newZeroes = filterCheckedZeroes(newZeroes);
        for(var i=0; i<newZeroes.length; i++) {
          uncheckedTiles.push(newZeroes[i]);
          checkedTiles[newZeroes[i][0]][newZeroes[i][1]] = true;
        };
        connectedZeroes.push(currentTile);
        uncheckedTiles.shift();
      };
      return connectedZeroes;
    },
    _getOrthogZeroes: function(xcoord, ycoord) {
      // INPUT: x,y coordinates
      // OUTPUT: array of form [[x0,y0],[x1,y1],...]
      var orthogonalZeroes = [];
      var coordPairs = [[xcoord+1,ycoord],
                        [xcoord-1,ycoord],
                        [xcoord,ycoord+1],
                        [xcoord,ycoord-1]];
      for (var i=0; i<coordPairs.length;i++) {
        var xValue = coordPairs[i][0]
        var yValue = coordPairs[i][1]
        if(xValue >=0 &&
           xValue < xSize &&
           yValue >=0 &&
           yValue < ySize) {
          if(gameGrid[xValue][yValue] === 0) {
            orthogonalZeroes.push([xValue,yValue]);
          };
        };
      };
      return orthogonalZeroes;
    },
    // Set methods
    setCallback: function(func) {
      callback = func;
    },
    // Game state methods
    resetGameGrid: function() {
      // calls callback function
      var newGrid = [];
      for(var i=0; i<xSize; i++) {
        newGrid.push([]);
        for(var j=0; j<ySize; j++) {
          newGrid[i].push("");
        };
      };
      gameGrid = newGrid;
      this._populateBombs();
      this._labelGrid();
      callback();
    },
    _populateBombs: function(xClick,yClick) {
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
