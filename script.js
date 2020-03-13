const Cell = (value = null) => {
  const getValue = () => value;
  
  const setValue = (newVal) => {
    if (value == null)
      value = newVal;
  }
  
  return {
    getValue,
    setValue
  }
};

const Player = (name, mark) => {
  const getName = () => name;
  const getMark = () => mark;
  
  const markedCells = [];
  const getMarkedCells = () => markedCells;

  const winningPositions = [
    [1,2,3],
    [4,5,6],
    [7,8,9],
    [1,4,7],
    [2,5,8],
    [3,6,9],
    [1,5,9],
    [7,5,3]
  ];

  const isWinner = () => {
    let output = false;
    const playerPosition = markedCells.sort();
    winningPositions.forEach((position) => {
      if (position.every((i) => playerPosition.includes(i)))
        output = true;
    });

    return output;
  };

  const play = (pos) => {
    markedCells.push(pos);

    return {
      mark: getMark(),
      pos: pos
    }
  };

  return {
    getMarkedCells,
    getName,
    getMark,
    play,
    isWinner
  }
};

const gameboard = (() => {
  const cells = (() => {
    let elements = document.querySelectorAll(".cell");

    let cells = {};
    elements.forEach((element) => {
      cells[element.dataset.number] = Cell();
    });

    return cells;
  })();

  const cell = (number) => cells[number];
  const totalCells = () => Object.keys(cells).length;

  return {
    cell,
    totalCells,
  }
})();

const game = (() => {
  const playerX = Player("Human", "X");
  const playerO = Player("Computer", "O");
  const board = gameboard;
  let winner;

  return {
    playerX,
    playerO,
    board,
  }
})();