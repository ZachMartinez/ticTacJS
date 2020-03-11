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

const gameboard = (() => {
  const cells = (() => {
    let elements = document.querySelectorAll(".cell");

    let cells = {};
    elements.forEach((element) => {
      cells[element.dataset.number] = Cell();
    });

    return cells;
  })();

  const cell = (number) => {
    return cells[number];
  };

  return {
    cell,
  }
})();