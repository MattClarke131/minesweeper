console.log("model.js successfully loaded");

var Minesweeper = {}
Minesweeper.Model = function() {
  //Private
  var gameGrid;
  var xSize = 10;
  var ySize = 10;
  var numBombs = 10;

  //Public
  var minesweeper = {
    //Get methods
    getGameGrid: function() {
      return gameGrid;
    },
    printGameGrid: function() {
      for(var i=0; i<gameGrid.length;i++) {
        console.log(gameGrid[i]);
      };
    },
    resetGameGrid: function() {
      var newGrid = [];
      for(var i=0; i<xSize; i++) {
        newGrid.push([]);
        for(var j=0; j<ySize; j++) {
          newGrid[i].push("");
        };
      };
      gameGrid = newGrid;
    },
    populateBombs: function(xClick,yClick) {
      //The first click is always safe, args mark first click
      this.resetGameGrid();
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
    getNumNeighboringBombs: function(xcoord, ycoord) {
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
    labelGrid: function() {
      for(var x=0; x<xSize; x++) {
        for(var y=0; y<ySize; y++) {
          if(gameGrid[x][y] !== "bomb") {
            gameGrid[x][y] = this.getNumNeighboringBombs(x,y);
          };
        };
      };
    },
    getOrthogZeroes: function(xcoord, ycoord) {
      // INPUT: x,y coordinates
      // OUTPUT: array of form [x0,y0,x1,y1,...]
      var orthogonalZeroes = [];
      var coordPairs = [[xcoord+1,ycoord],
                        [xcoord-1,ycoord],
                        [xcoord,ycoord+1],
                        [xcoord,ycoord-1]];
      for (var i=0; i<coordPairs.length;i++) {
        if(coordPairs[i][0] >=0 && coordPairs[i][1] >=0 && coordPairs[i][0] < xSize && coordPairs[i][1] < ySize) {
          if(gameGrid[coordPairs[i][0]][coordPairs[i][1]] === 0) {
            orthogonalZeroes.push(coordPairs[i][0],coordPairs[i][1]);
          }
        }
      };
      return orthogonalZeroes;
    },
    getAllConnectedZeroes: function(xcoord, ycoord) {
      // INPUT: x,y coordinates
      // OUTPUT: array of form [x0,y0,x1,y0,...]
      var filterCheckedZeroes = function(arr) {
        // INPUT: array of form [x0,y0,x1,y1,...]
        // OUTPUT: array of form [x0,y0,x1,y1,...]
        var uncheckedZeroes = [];
        for(var i=0; i<arr.length; i+=2) {
          if(!checkedTiles[arr[i]][arr[i+1]]) {
            uncheckedZeroes = uncheckedZeroes.concat(arr[i],arr[i+1]);
          };
        };
        return uncheckedZeroes;
      };
      var connectedZeroes = [];
      var uncheckedTiles = this.getOrthogZeroes(xcoord,ycoord);
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
      while(uncheckedTiles.length > 0) {
        console.log("uncheckedTiles: ", uncheckedTiles);
        currentTile = uncheckedTiles.splice(0,2);
        console.log("currentTile: ", currentTile);
        checkedTiles[currentTile[0]][currentTile[1]] = true;
        var newZeroes = this.getOrthogZeroes(currentTile[0],currentTile[1]);
        newZeroes = filterCheckedZeroes(newZeroes);
        console.log("newZeroes ",newZeroes);
        uncheckedTiles = uncheckedTiles.concat(newZeroes);
        connectedZeroes = connectedZeroes.concat(currentTile);
        console.log("connectedZeroes: ", connectedZeroes);
      };
      return connectedZeroes;
    },
  };
  return minesweeper;
};
