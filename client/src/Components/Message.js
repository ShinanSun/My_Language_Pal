import React from 'react';

const Message = ({ message, name }) => {
  let isSentByCurrentUser = false;

  if (message.user === name) {
    isSentByCurrentUser = true;
  }

  return <div>{message.user + '...' + message.message}</div>;
};

export default Message;
