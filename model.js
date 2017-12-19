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
    //Check methods
    checkNeighbors: function(xcoord, ycoord) {
      var neighboringBombs = 0;
      for(var x=-1; x<2; x++) {
        for(var y=-1; y<2; y++) {
          if((x!==0 || y!==0) && gameGrid[xcoord+x][ycoord+y] == "bomb") {
            neighboringBombs++;
          };
        };
      };
      return neighboringBombs;
    },
    //Set methods
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
      var bombs = 0;
      while (bombs < 10) {
        var xRand = Math.floor(Math.random() * 10);
        var yRand = Math.floor(Math.random() * 10);
        if(gameGrid[xRand][yRand] !== "bomb" && (xRand !== xClick || yRand !== yClick)) {
          bombs++;
          gameGrid[xRand][yRand] = "bomb"
        };
      };
    },
  };
  return minesweeper;
};
