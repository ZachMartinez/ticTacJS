Square = () => {
  let value = null;

  const getValue = () => value;
  const setValue = (val) => { if (!value) value = val };
  
  return {
    getValue,
    setValue
  }
};

const gameboard = (() => {
  const squares = [...document.querySelectorAll(".cell")];
  const squareData = new Array(squares.length).fill(Square());

  const square = (i) => squareData[i];

  const render = () => {
    squares.forEach((square, i) => {
      square.innerHTML = squareData[i];
    });
  };

  return {
    render,
    square
  }
})();