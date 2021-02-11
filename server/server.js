const express = require('express');
const http = require('http');
const port = process.env.PORT || 3000;
const path = require('path');
const {
  addUser,
  findUser,
  findAllUserInCurrentRoom,
  removeUser,
} = require('./user');

const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server); //configure socketio with server

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/public')));

io.on('connection', (socket) => {
  console.log('a new user connected!');

  //for all the JOIN_NEW_ROOM event:
  socket.on('JOIN_NEW_ROOM', ({ name, room }, cb) => {
    const newUser = addUser({ id: socket.id, name, room });
    if (typeof newUser === 'string') {
      cb(newUser);
    }

    socket.join(newUser.room);
    socket.emit('WELCOME_MESSAGE', {
      user: '',
      message: `${newUser.name}, welcome to room: ${newUser.room}`,
    });
    socket.broadcast
      .to(newUser.room) //emit to specific room
      .emit('WELCOME_MESSAGE', {
        user: '',
        message: `${newUser.name}, has just joined!!`,
      });

    io.to(newUser.room).emit('ROOM_USERS', {
      room: newUser.room,
      users: findAllUserInCurrentRoom(newUser.room),
    });
    cb();
  });

  //for all the SEND_MESSAGE event:
  socket.on('SEND_MESSAGE', (message, cb) => {
    const currentUser = findUser(socket.id);
    if (currentUser) {
      io.to(currentUser.room).emit('NEW_MESSAGE', {
        user: currentUser.name,
        message,
      }); //emit to all sockets in the same room
    }

    cb();
  });

  //for disconnect event
  socket.on('disconnect', () => {
    const removed = removeUser(socket.id);

    if (removed) {
      io.to(removed.room).emit('NEW_MESSAGE', {
        user: '',
        message: `${removed.name} has left this room...  :(`,
      });
      io.to(removed.room).emit('ROOM_USERS', {
        room: removed.room,
        users: findAllUserInCurrentRoom(removed.room.toLowerCase()),
      });
    }
    console.log('user has left!!!');
  });
});
server.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
