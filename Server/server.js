const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve the client-side files
app.use(express.static(__dirname + '/public'));

// Initialize game state
let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];
let currentPlayer = 'X';

// Function to check if a player has won
function checkWinner() {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (board[i][0] !== '' && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
      return board[i][0];
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    if (board[0][i] !== '' && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
      return board[0][i];
    }
  }

  // Check diagonals
  if (board[0][0] !== '' && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
    return board[0][0];
  }
  if (board[0][2] !== '' && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
    return board[0][2];
  }

  // Check for tie
  if (!board.flat().includes('')) {
    return 'tie';
  }

  return null;
}

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send initial game state to the connected client
  socket.emit('initialState', { board, currentPlayer });

  // Handle player moves
  socket.on('move', ({ row, col }) => {
    if (board[row][col] === '' && currentPlayer === 'X') {
      board[row][col] = 'X';
      const winner = checkWinner();
      if (winner) {
        io.emit('gameOver', { winner });
      } else {
        currentPlayer = 'O';
        io.emit('updateState', { board, currentPlayer });
      }
    } else if (board[row][col] === '' && currentPlayer === 'O') {
      board[row][col] = 'O';
      const winner = checkWinner();
      if (winner) {
        io.emit('gameOver', { winner });
      } else {
        currentPlayer = 'X';
        io.emit('updateState', { board, currentPlayer });
      }
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
