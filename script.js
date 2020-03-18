const Square = pos => {
  let value = null;

  const getValue = () => value;
  const setValue = val => {
    if (!value) {
      value = val;
    } else {
      return false;
    }
  };

  const getPos = () => pos;

  return {
    getValue,
    setValue,
    getPos
  };
};
const Player = (name, mark) => {
  const winningPositions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  const markedSquares = [];
  const getName = () => name;
  const getMark = () => mark;
  const getMarkedSquares = () => markedSquares;

  const play = pos => {
    markedSquares.push(pos);
  };

  const isWinner = () => {
    let output = false;
    winningPositions.forEach(postion => {
      if (postion.every(i => markedSquares.includes(i))) output = true;
    });

    return output;
  };

  return {
    getName,
    getMark,
    getMarkedSquares,
    play,
    isWinner
  };
};

const gameboard = (() => {
  const squares = [...document.querySelectorAll(".cell")];
  const squareData = [];
  const watchers = [];

  squares.forEach((square, i) => {
    squareData[i] = Square(i);
    square.addEventListener("click", e => publish(e));
  });

  const addWatcher = obj => watchers.push(obj);

  const publish = e => {
    if (watchers.length > 0) {
      var output = e;

      watchers.forEach(watcher => watcher.notify(output));
    }
  };

  const square = i => squareData[i];

  const render = () => {
    squares.forEach((square, i) => {
      square.innerHTML = squareData[i].getValue();
    });
  };

  const count = () => squareData.length;

  const isFull = () => squareData.every(square => square.getValue() != null);

  return {
    render,
    square,
    addWatcher,
    count,
    isFull
  };
})();

const gameDisplay = (() => {
  const DOMelement = document.querySelector("#message");
  const message = "Enter the names of the players";

  const setMessage = (msg) => message = msg;
  const render = () => DOMelement.innerHTML = message;

  return {
    setMessage,
    render
  }
})();

const game = (() => {
  const playerX = Player("X", "X");
  const playerO = Player("O", "O");
  const board = gameboard;
  const display = gameDisplay;
  let running = false;
  let currentPlayer = playerX;
  let winner = null;

  const playTurn = square => {
    if (square.getValue() == null) {
      square.setValue(currentPlayer.getMark());
      currentPlayer.play(square.getPos());

      if (currentPlayer.isWinner()) {
        winner = currentPlayer;
        endGame();
      } else {
        if (board.isFull()) endGame();
        else resetRound();
      }
    }
  };

  const resetRound = () => {
    let nextPlayer = currentPlayer === playerX ? playerO : playerX;

    display.setMessage(
      `${nextPlayer.getName()}'s turn, click on where you want to place your mark.`
    );

    currentPlayer = nextPlayer;
  };

  const endGame = () => {
    let msg;

    if (winner) msg = `${winner.getName()} won!`;
    else {
      msg = `It's a tie!`;
    }

    display.setMessage(msg);
    running = false;
  };

  const notify = e => {
    if (running) {
      let square = board.square(e.target.dataset.number);
      playTurn(square);
    }

    board.render();
  };

  const obj = {
    notify
  };
  board.addWatcher(obj);
  board.render();
  return obj;
})();
