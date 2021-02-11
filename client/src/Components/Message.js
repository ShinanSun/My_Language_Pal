import React from 'react';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

const Message = ({ message, name }) => {
  const isCurrent = message.user === name.trim().toLowerCase();
  let bgcolor = 'white';
  let position = 'center';
  let color = 'black';
  if (message.user) {
    color = 'white';
    if (isCurrent) {
      bgcolor = 'blue';
      position = 'flex-start';
    } else {
      bgcolor = 'palevioletred';
      position = 'flex-end';
    }
  }

  return (
    <ListItem display="block">
      <Box width="100%">
        <Box
          display="flex"
          flexDirection="row"
          justifyContent={position}
          width="100%"
        >
          <Box bgcolor={bgcolor} color={color} p={1} borderRadius={16}>
            {message.message}
          </Box>
        </Box>
        <Box>
          <Typography align={isCurrent ? 'left' : 'right'}>
            {message.user}
          </Typography>
        </Box>
      </Box>
    </ListItem>
  );
};

export default Message;
