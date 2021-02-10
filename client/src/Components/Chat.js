import React, { useState, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
const queryString = require('query-string');
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000');
import Message from './Message';

import Box from '@material-ui/core/Box';

const Chat = ({ location }) => {
  //location is a object provide by Router that passed a prop to Chat component;
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    setName(name);
    setRoom(room);
    console.log(`helloooooo`);

    socket.emit('JOIN_NEW_ROOM', { name, room }, (err) => {
      if (err) alert(err);
    });

    socket.on('WELCOME_MESSAGE', (val) => {
      console.log(`what is welcome message`, val);
      setMessages((messages) => [...messages, val]);
    });

    socket.on('NEW_MESSAGE', (val) => {
      console.log('waht is new Message', val);
      setMessages((messages) => [...messages, val]);
    });

    socket.on('ROOM_USERS', (val) => {
      console.log('what is room-users', val);
      setUsers(val.users);
    });
  }, [location.search]); //if name/room changes, Chat component will re-render

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('SEND_MESSAGE', message, () => {
        setMessage('');
      });
    }
  };

  return (
    <div>
      <h2>{room}</h2>
      {users.map((user, index) => {
        return <div key={index}> {user.name} </div>;
      })}
      <ScrollToBottom>
        {messages.map((object, index) => {
          return <Message message={object} key={index} name={name} />;
        })}
      </ScrollToBottom>
      <form>
        <input
          type="text"
          placeholder="send a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => (e.key === 'Enter' ? sendMessage(e) : null)}
        />
        <button onClick={(e) => sendMessage(e)}>send</button>
      </form>
    </div>
  );
};

export default Chat;
