const GRID_SIZE = 4;

let grid = [];
let score = 0;
let highScore = 0;

function initGame() {
  grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
  score = 0;
  highScore = localStorage.getItem('2048-highscore') || 0;
  
  addNewTile();
  addNewTile();
}

function addNewTile() {
  const emptyCells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }
  
  if (emptyCells.length > 0) {
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
  }
}

function getGrid() {
  return grid;
}

function getScore() {
  return score;
}

function updateScore(points) {
  score += points;
  if (score > highScore) {
    updateHighScore(score);
  }
}

function getHighScore() {
  return highScore;
}

function updateHighScore(newScore) {
  highScore = newScore;
  localStorage.setItem('2048-highscore', highScore);
}

function slideAndMerge(row) {
  let filtered = row.filter(val => val !== 0);
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      updateScore(filtered[i]);
      filtered[i + 1] = 0;
      i++;
    }
  }
  filtered = filtered.filter(val => val !== 0);
  while (filtered.length < GRID_SIZE) {
    filtered.push(0);
  }
  return filtered;
}

function hasEmptyCells() {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        return true;
      }
    }
  }
  return false;
}

function hasWon() {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 2048) {
        return true;
      }
    }
  }
  return false;
}

function hasMoves() {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        return true;
      }
      if (col < GRID_SIZE - 1 && grid[row][col] === grid[row][col + 1]) {
        return true;
      }
      if (row < GRID_SIZE - 1 && grid[row][col] === grid[row + 1][col]) {
        return true;
      }
    }
  }
  return false;
}

function isGameOver() {
  return !hasEmptyCells() && !hasMoves();
}

function renderGrid() {
  const tileContainer = document.getElementById('tile-container');
  if (!tileContainer) return;
  
  tileContainer.innerHTML = '';
  
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const value = grid[row][col];
      if (value !== 0) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = value;
        tile.style.gridRowStart = row + 1;
        tile.style.gridColumnStart = col + 1;
        tile.style.backgroundColor = getTileColor(value);
        tileContainer.appendChild(tile);
      }
    }
  }
}

function getTileColor(value) {
  const colors = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e'
  };
  return colors[value] || '#3c3a32';
}

function gameOver() {
  return !hasEmptyCells() && !hasMoves();
}

function move(direction) {
  const oldGrid = JSON.stringify(grid);
  
  if (direction === 'left') {
    for (let row = 0; row < GRID_SIZE; row++) {
      grid[row] = slideAndMerge(grid[row]);
    }
  } else if (direction === 'right') {
    for (let row = 0; row < GRID_SIZE; row++) {
      let reversed = grid[row].slice().reverse();
      let moved = slideAndMerge(reversed);
      grid[row] = moved.reverse();
    }
  } else if (direction === 'up') {
    for (let col = 0; col < GRID_SIZE; col++) {
      let column = [];
      for (let row = 0; row < GRID_SIZE; row++) {
        column.push(grid[row][col]);
      }
      let moved = slideAndMerge(column);
      for (let row = 0; row < GRID_SIZE; row++) {
        grid[row][col] = moved[row];
      }
    }
  } else if (direction === 'down') {
    for (let col = 0; col < GRID_SIZE; col++) {
      let column = [];
      for (let row = 0; row < GRID_SIZE; row++) {
        column.push(grid[row][col]);
      }
      let reversed = column.slice().reverse();
      let moved = slideAndMerge(reversed);
      moved = moved.reverse();
      for (let row = 0; row < GRID_SIZE; row++) {
        grid[row][col] = moved[row];
      }
    }
  }
  
  return oldGrid !== JSON.stringify(grid);
}

function hasWon() {
  const maxTile = Math.max(...grid.flat());
  return maxTile >= 2048;
}

function isGameOver() {
  // Check for empty cells
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        return false;
      }
    }
  }
  
  // Check for possible merges
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const current = grid[row][col];
      if (col < GRID_SIZE - 1 && current === grid[row][col + 1]) {
        return false;
      }
      if (row < GRID_SIZE - 1 && current === grid[row + 1][col]) {
        return false;
      }
    }
  }
  
  return true;
}

export {
  initGame,
  getGrid,
  getScore,
  updateScore,
  getHighScore,
  updateHighScore,
  addNewTile,
  move,
  hasEmptyCells,
  hasWon,
  isGameOver,
  renderGrid
};
