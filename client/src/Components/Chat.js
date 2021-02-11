import React, { useState, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
const queryString = require('query-string');
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000');
import Message from './Message';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import { deepOrange, deepPurple } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    height: '80vh',
  },
  headBG: {
    backgroundColor: '#e0e0e0',
  },
  borderRight500: {
    borderRight: '1px solid #e0e0e0',
  },
  messageArea: {
    height: '63vh',
  },
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));

const Chat = ({ location }) => {
  const classes = useStyles();
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

    socket.emit('JOIN_NEW_ROOM', { name, room }, (err) => {
      if (err) alert(err);
    });

    socket.on('WELCOME_MESSAGE', (val) => {
      //   console.log(`what is welcome message`, val);
      setMessages((messages) => [...messages, val]);
    });

    socket.on('NEW_MESSAGE', (val) => {
      //   console.log('waht is new Message', val);
      setMessages((messages) => [...messages, val]);
    });

    socket.on('ROOM_USERS', (val) => {
      //   console.log('what is room-users', val);
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
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6" color="primary">
            Welcome to room: {room}
          </Typography>
        </Grid>
      </Grid>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item={true} xs={3} className={classes.borderRight500}>
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <Avatar className={classes.purple}>{name[0]}</Avatar>
              </ListItemIcon>
              <ListItemText primary={name}></ListItemText>
            </ListItem>
          </List>
          <Divider />
          <Grid item={true} xs={12} style={{ padding: '10px' }}>
            <TextField
              label="Search"
              variant="outlined"
              color="primary"
              fullWidth
            />
          </Grid>
          <Divider />
          <List>
            {users.map((user, index) => {
              return (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Avatar className={classes.orange}>{user.name[0]}</Avatar>
                  </ListItemIcon>
                  <ListItemText primary={user.name}>{user.name}</ListItemText>
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid item={true} xs={9}>
          <ScrollToBottom>
            <List className={classes.messageArea}>
              {messages.map((object, index) => {
                return <Message message={object} key={index} name={name} />;
              })}
            </List>
          </ScrollToBottom>
          <Divider />
          <Grid container style={{ padding: '20px' }}>
            <Grid item xs={11}>
              <TextField
                id="outlined-basic"
                label="send a message..."
                variant="outlined"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => (e.key === 'Enter' ? sendMessage(e) : null)}
                fullWidth
              />
            </Grid>
            <Grid item xs={1} align="right">
              <Fab color="primary" aria-label="add">
                <SendIcon onClick={(e) => sendMessage(e)} />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Chat;
