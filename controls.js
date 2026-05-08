import { move, getGrid, getScore, getHighScore, initGame, addNewTile, hasWon, isGameOver, renderGrid } from './game.js';

function setupKeyboardControls() {
  document.addEventListener('keydown', (e) => {
    let direction = null;

    switch (e.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
    }

    if (direction) {
      const changed = move(direction);
      if (changed) {
        addNewTile();
        renderGrid();
        updateScoreDisplay();
        checkGameStatus();
      }
    }
  });
}

function updateScoreDisplay() {
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best-score');
  
  if (scoreEl) {
    scoreEl.textContent = getScore();
  }
  if (bestEl) {
    bestEl.textContent = getHighScore();
  }
}

function checkGameStatus() {
  const messageEl = document.getElementById('game-message');
  if (hasWon()) {
    if (messageEl) {
      messageEl.textContent = 'You win!';
      messageEl.style.color = '#776e65';
    }
  } else if (isGameOver()) {
    if (messageEl) {
      messageEl.textContent = 'Game over!';
      messageEl.style.color = '#776e65';
    }
  } else {
    if (messageEl) {
      messageEl.textContent = '';
    }
  }
}

function setupRestartButton() {
  const restartBtn = document.getElementById('restart-button');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      initGame();
      renderGrid();
      updateScoreDisplay();
      checkGameStatus();
    });
  }
}

export {
  setupKeyboardControls,
  setupRestartButton
};
