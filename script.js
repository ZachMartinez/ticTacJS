const makeCell = (value = null) => {
  const setValue = str => (value ? false : (value = str));

  const getValue = () => value;

  return {
    getValue,
    setValue
  };
};

const gameBoard = (() => {
  const elements = [...document.querySelectorAll("td")];
  let cells = elements.map(element => {
    return makeCell();
  });
  const listeners = [];

  const render = () => {
    elements.forEach((el, i) => {
      el.innerHTML = cells[i].getValue();
    });
  };

  const getCell = i => cells[i];

  const getCellValues = () => cells.map(cell => cell.getValue());

  const isFull = () => cells.every(cell => cell.getValue() != null);

  const isEmpty = () => cells.every(cell => cell.getValue() == null);

  const wipe = () => cells = cells.map(cell => { return makeCell() });

  const shout = e => {
    listeners.forEach(listener => {
      listener.listen(e.target.dataset.number);
    });
  };

  const addListener = obj => listeners.push(obj);

  elements.forEach(element => {
    element.addEventListener("click", e => shout(e));
  });

  return {
    render,
    getCell,
    getCellValues,
    isFull,
    isEmpty,
    shout,
    addListener,
    wipe
  };
})();

const makePlayer = (name, mark) => {
  const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  const markedPositions = [];

  const getName = () => name;

  const getMark = () => mark;

  const play = pos => markedPositions.push(pos);

  const isWinner = () => {
    let result = false;
    winningPatterns.forEach(pattern => {
      if (pattern.every(pos => markedPositions.includes(pos))) result = true;
    });

    return result;
  };

  return {
    getName,
    getMark,
    play,
    isWinner
  };
};

const gameInput = (() => {
  const inputs = [...document.querySelectorAll("input")];
  const start = document.querySelector("#start");
  const listeners = [];

  const shout = () => {
    if (inputs.every(input => input.value != "")) {
      let output = {};
      inputs.forEach(input => {
        output[input.name] = input.value;

        input.setAttribute("disabled", "");
      });
      listeners.forEach(listener => listener.listen(output));
    }
  };

  const reset = () => {
    inputs.forEach(input => {
      input.value = "";
      input.removeAttribute("disabled")
    });
  };

  const setButtonText = str => (start.innerHTML = str);

  const addListener = obj => listeners.push(obj);

  start.addEventListener("click", shout);

  return {
    addListener,
    setButtonText,
    reset
  };
})();

const gameDisplay = (() => {
  const display = document.querySelector("#message");

  let message = "Enter the names of the players and press Start.";

  const setMessage = str => (message = str);

  const render = () => {
    display.innerHTML = message;
  };

  return {
    setMessage,
    render
  };
})();

const game = (() => {
  const board = gameBoard;
  const display = gameDisplay;
  const input = gameInput;

  let playerX;
  let playerO;
  let currentPlayer;
  let isRunning = false;

  const render = () => {
    board.render();
    display.render();
  };

  const listen = e => {
    if (isRunning) {
      if (typeof e === 'string') takeTurn(e);
      if (typeof e === 'object') reset();
    } else {
      if (typeof e === 'object') {
        board.isEmpty() ? start(e) :  reset();
      }
    }

    render();
  };

  const start = obj => {
    playerX = makePlayer(obj.playerXName, "X");
    playerO = makePlayer(obj.playerOName, "O");
    currentPlayer = playerX;
    isRunning = true;
    display.setMessage(`${currentPlayer.getName()}'s turn.`);
    input.setButtonText("Restart");
  };

  const reset = () => {
    isRunning = false;
    board.wipe();
    display.setMessage("Enter the names of the players and press Start.");
    input.reset();
    input.setButtonText("Start");
  };

  const takeTurn = posStr => {
    const pos = parseInt(posStr);

    currentPlayer.play(pos);
    board.getCell(pos).setValue(currentPlayer.getMark());

    if (currentPlayer.isWinner()) {
      endGame(currentPlayer);
    } else if (board.isFull()) {
      endGame();
    } else {
      currentPlayer = currentPlayer == playerO ? playerX : playerO;
      display.setMessage(`${currentPlayer.getName()}'s turn.`);
    }
  };

  const endGame = winner => {
    if (winner) {
      display.setMessage(`${winner.getName()} won!`);
    } else {
      display.setMessage(`It's a tie!`);
    }

    isRunning = false;
  };

  const obj = {
    listen
  };
  board.addListener(obj);
  input.addListener(obj);
  return obj;
})();
