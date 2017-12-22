console.log("controller successfully loaded");

Minesweeper.Controller = function(node) {
  // Private
  var minesweeper = node;
  var gameTileTemplate = $(".gameTileTemplate");
  var gameRowTemplate = $(".gameRowTemplate");
  var gameGrid = $(".gameGrid");
  var numGameRows = 10;
  var numGameCols = 10;
  // Public
  return {
    initialize: function() {
      console.log("initialization successful");
      this.populateGameRows(numGameRows, numGameCols);
    },
    populateGameRows: function(numRows,numCol) {
      for(var i=0; i<numRows; i++) {
        var newRow = this._getFormattedGameRow();
        for(var j=0; j<numCol; j++) {
          var newTile = this._getFormattedGameTile(i,j);
          newRow.append(newTile);
        };
        gameGrid.append(newRow);
      };
    },
    _getFormattedGameRow: function() {
      var newRow = gameRowTemplate.clone();
      newRow.removeAttr("hidden");
      newRow.removeClass("gameRowTemplate").addClass("gameRow");
      newRow.empty();
      return newRow;
    },
    _getFormattedGameTile: function(xcoord,ycoord) {
      var newTile = gameTileTemplate.clone();
      newTile.removeAttr("hidden");
      newTile.removeClass("gameTileTemplate").addClass("gameTile");
      newTile.attr("data-xcoord",xcoord);
      newTile.attr("data-ycoord",ycoord);
      return newTile;
    },
  };
};
//temp for debugging
var controller = Minesweeper.Controller($(".minesweeper")[0]);
controller.initialize();
