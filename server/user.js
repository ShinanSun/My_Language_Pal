const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const isExisted = users.some(
    (user) => user.name === name && user.room === room
  );
  if (isExisted) return "In current room, the user's name has already token.";
  if (name && room) {
    const newUser = { id, name, room };
    users.push(newUser);
    return newUser;
  }
};

const findUser = (id) => {
  return users.find((user) => user.id === id);
};

const findAllUserInCurrentRoom = (room) => {
  return users.filter((user) => user.room === room);
};

const removeUser = (id) => {
  var index = users.findIndex((user) => user.id === id);
  if (index >= 0) {
    var removed = users.splice(index, 1);
    return removed[0];
  }
};

module.exports = { addUser, findUser, findAllUserInCurrentRoom, removeUser };
