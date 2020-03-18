const Square = () => {
  let value = null;

  const getValue = () => value;
  const setValue = (val) => { if (!value) value = val };
  
  return {
    getValue,
    setValue
  }
};

const gameboard = (() => {
  const display = document.querySelector("#message");
  let message = "Click start to play";
  const squares = [...document.querySelectorAll(".cell")];
  const squareData = [];
  const watchers = [];

  squares.forEach((square, i) => {
    squareData[i] = Square();
    square.addEventListener( "click", (e) => publish(e) );
  });

  const addWatcher = (obj) => watchers.push(obj);
  

  const publish = (e) => { 
    if ( watchers.length > 0 ) {
      var output = square(e.target);

      watchers.forEach((watcher) => watcher.notify(output));
    }
  };
  
  const square = (i) => squareData[i]; 
  
  const render = () => {
    squares.forEach((square, i) => {
      square.innerHTML = squareData[i].getValue();
    });

    display.innerHTML = message;
  };

  const setMessage = (msg) => message = msg;

  return {
    render,
    square,
    watchers,
    addWatcher,
    setMessage,
  }
})();

const Player = (name, mark) => {
  const winningPositions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  const markedSquares = [];
  
  const getName = () => name;
  const getMark = () => mark;
  const getMarkedSquares = () => markedSquares;

  const play = (pos) => {
    markedSquares.push(pos);
  };

  const isWinner = () => {
    let output = false;
    winningPositions.forEach((postion)  => {
      if ( postion.every((i) => markedSquares.includes(i)) )
        output = true;
    });

    return output;
  };
  
  return {
    getName,
    getMark,
    getMarkedSquares,
    play,
    isWinner,
  }
};

const game = (() => {
  const playerX = Player("human", "X");
  const playerO = Player("computer", "O")
  const board = gameboard;
  const state = {
    new: 0,
    running: 1,
    over: 2
  }
  let currentState = state.new;

  const notify = (square) => { 
   if ( currentState === state.running ) {
     square.setValue(currentPlayer.getMark());
     board.render(); 
   }
  };
  
  let currentPlayer = playerX;
  
  return {
    playerX,
    playerO,
    board,
    notify
  }
})();

game.board.addWatcher(game);
game.board.render();