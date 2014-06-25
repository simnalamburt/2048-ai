'use strict';

// Constants
var direction = {
  left:  37,
  up:    38,
  right: 39,
  down:  40,
};

// makeGame() closure
var makeGame = function(initial) {
  var grid = initial.slice(0);

  return {
    // game.forEach( function(row, col, value) { ... } );
    forEach: function(handler) {
      for (var row = 0; row < 4; ++row) for (var col = 0; col < 4; ++col) {
        handler(row, col, grid[row][col]);
      }
    },

    // game.move(game.left);
    // game.move(event.which);
    move: function(cmd) {
      switch(cmd) {
      case direction.left:
        console.log('왼쪽');
        break;
      case direction.right:
        console.log('오른쪽');
        break;
      case direction.up:
        console.log('위');
        break;
      case direction.down:
        console.log('아래');
        break;
      }
    },
  };
};


// UI controller
$(function() {
  var game = makeGame([
    [0, 0, 0, 0],
    [2, 0, 0, 0],
    [0, 0, 0, 2],
    [0, 0, 0, 0],
  ]);

  var present = function() {
    game.forEach(function(row, col, value) {
      $('#'+row+'-'+col).text(value ? value : '');
    });
  };

  present();

  $(window).keydown(function(e) {
    e.preventDefault();

    game.move(e.which);
    present();
  });
});
