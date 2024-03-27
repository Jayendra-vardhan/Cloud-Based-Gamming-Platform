const socket = io();

const boardDiv = document.getElementById('board');
let currentPlayer;
let gameEnded = false;

socket.on('initialState', ({ board, currentPlayer }) => {
  updateBoard(board);
  currentPlayer = currentPlayer;
});

socket.on('updateState', ({ board, currentPlayer }) => {
  updateBoard(board);
  currentPlayer = currentPlayer;
});

socket.on('gameOver', ({ winner }) => {
  gameEnded = true;
  if (winner === 'tie') {
    alert('It\'s a tie!');
  } else {
    alert(`Player ${winner} wins!`);
  }
});

function updateBoard(board) {
  boardDiv.innerHTML = '';
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');
      cellDiv.textContent = cell;
      cellDiv.addEventListener('click', () => {
        if (!gameEnded && cell === '') {
          socket.emit('move', { row: i, col: j });
        }
      });
      boardDiv.appendChild(cellDiv);
    });
  });
}
