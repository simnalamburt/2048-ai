# Constants
const direction =
  left  :37
  up    :38
  right :39
  down  :40

# makeGame() closure
const makeGame = (initial) ->
  grid = initial.slice(0)

  return {
    # game.forEach (row, col, value) -> ...
    forEach: (handler) ->
      for row from 0 til 4
        for col from 0 til 4
          handler(row, col, grid[row][col])

    # game.move(game.left)
    # game.move(event.which)
    move: (cmd) ->
      adapter = do ->
        getc = switch cmd
               | direction.left  => (it, i) -> grid[it][i]
               | direction.right => (it, i) -> grid[it][3-i]
               | direction.up    => (it, i) -> grid[i][it]
               | direction.down  => (it, i) -> grid[3-i][it]

        setc = switch cmd
               | direction.left  => (it, i, val) -> grid[it][i] = val
               | direction.right => (it, i, val) -> grid[it][3-i] = val
               | direction.up    => (it, i, val) -> grid[i][it] = val
               | direction.down  => (it, i, val) -> grid[3-i][it] = val

        return {
          get: (it) ->
            line = [0 0 0 0]
            for i from 0 til 4
              line[i] = getc(it, i)
            return line
          set: (it, line) ->
            for i from 0 til 4
              setc(it, i, line[i])
        }

      moved = false

      for it from 0 til 4
        # Fetch a line from the grid
        line = adapter.get(it)

        # 2048 logic
        for head from 0 til 4
          if line[head] != 0
            # 1. Try merge with adjacent cell
            for peek from head + 1 til 4
              continue if line[peek] == 0
              break unless line[head] == line[peek]

              # merge
              line[head] *= 2
              line[peek] = 0

              moved := true
              break
          else
            # 2. Try move adjacent cell to current position
            for peek from head + 1 til 4
              continue if line[peek] == 0

              # move
              line[head] = line[peek]
              line[peek] = 0

              moved := true
              --head # Make it iterate once again
              break

        # Apply the editted line to the grid
        adapter.set(it, line)

      return moved

    spawn: ->
      available = []
      @forEach (row, col, value) ->
        return if value != 0
        available.push { row: row, col: col };

      pick = available[Math.floor(Math.random() * available.length)]
      grid[pick.row][pick.col] = | Math.random() < 0.9 => 2
                                 | _                   => 4
  }


# UI controller
$ ->
  game = makeGame [
    [0 0 0 0]
    [2 0 0 0]
    [0 0 0 2]
    [0 0 0 0]
  ]

  present = ->
    game.forEach (row, col, num) ->
      $('#'+row+'-'+col).text switch | num != 0 => num
                                     | _        => ''

  present!

  each = ->
    if game.move(direction[Object.keys(direction)[Math.floor(Math.random() * Object.keys(direction).length)]])
      game.spawn!
      present!

    setTimeout(each, 100)

  setTimeout(each, 1000)
