const express = require('express');
const http = require('http');
const port = process.env.PORT || 3000;
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server); //configure socketio with server

app.use(express.json());
//app.use(cors());
app.use(express.static(path.join(__dirname, '../client/public')));

// server routing
// app.get('/chat', (req, res) => {
//   res.send('hell from server');
// });

io.on('connection', (socket) => {
  console.log('a new user connected!');
  socket.on('newMsg', (val) => {
    io.emit('newMsg', val);
  });

  socket.on('disconnect', () => {
    console.log('user has left!!!');
  });
});
server.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
