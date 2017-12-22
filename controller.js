console.log("controller successfully loaded");

Minesweeper.Controller = function(node) {
  return {
    initialize: function() {
      console.log("initialization successful");
    },
  };
};
//temp for debugging
var controller = Minesweeper.Controller($(".minesweeper")[0]);
controller.initialize();
