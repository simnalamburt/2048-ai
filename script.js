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
      var adapter = (function() {
        var getc, setc;

        switch(cmd) {
        case direction.left:
          getc = function(it, i)      { return grid[it][i]; };
          setc = function(it, i, val) {        grid[it][i] = val; };
          break;
        case direction.right:
          getc = function(it, i)      { return grid[it][3-i]; };
          setc = function(it, i, val) {        grid[it][3-i] = val; };
          break;
        case direction.up:
          getc = function(it, i)      { return grid[i][it]; };
          setc = function(it, i, val) {        grid[i][it] = val; };
          break;
        case direction.down:
          getc = function(it, i)      { return grid[3-i][it]; };
          setc = function(it, i, val) {        grid[3-i][it] = val; };
          break;
        }

        return {
          get: function(it) {
            var line = [];
            for (var i = 0; i < 4; ++i) { line.push(getc(it, i)); }
            return line;
          },
          set: function(it, line) {
            for (var i = 0; i < 4; ++i) { setc(it, i, line[i]); }
          },
        };
      })();

      var moved = false;

      for (var it = 0; it < 4; ++it) {
        // Fetch a line from the grid
        var line = adapter.get(it);

        // 2048 logic
        for (var head = 0; head < 4; ++head) {
          if (line[head]) {
            // 1. Try merge with adjacent cell
            for (var peek = head + 1; peek < 4; ++peek) {
              if (line[peek] == 0) continue;
              if (line[peek] != line[head]) break;

              // merge
              line[head] *= 2;
              line[peek] = 0;

              moved = true;
              break;
            }
          } else {
            // 2. Try move adjacent cell to current position
            for (var peek = head + 1; peek < 4; ++peek) {
              if (line[peek] == 0) continue;

              // move
              line[head] = line[peek];
              line[peek] = 0;

              moved = true;
              --head; // Make it iterate once again
              break;
            }
          }
        }

        // Apply the editted line to the grid
        adapter.set(it, line);
      }

      return moved;
    },

    spawn: function() {
      var available = [];
      this.forEach(function(row, col, value) {
        if (value) return;

        available.push({ row: row, col: col });
      });

      var pick = available[Math.floor(Math.random() * available.length)];
      grid[pick.row][pick.col] = Math.random() < 0.9 ? 2 : 4;
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

  var options = [direction.left, direction.right, direction.up, direction.down];
  var each = function() {
    var ret = game.move(options[Math.floor(Math.random() * options.length)]);

    if (ret) {
      game.spawn();
      present();
    }

    setTimeout(each, 100);
  };

  setTimeout(each, 1000);
});
