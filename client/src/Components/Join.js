import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Join = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  return (
    <div>
      <h1> Join</h1>
      <input
        placeholder="input your name"
        type="text"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="input room name"
        type="text"
        onChange={(e) => setRoom(e.target.value)}
      />
      <Link to={`/chat?name=${name}&room=${room}`}>
        <button
          type="submit"
          onClick={(e) => {
            if (!name || !room) {
              e.preventDefault();
            }
          }}
        >
          sign in
        </button>
        {/* how to prevent Link to other page if name or room is empty string? */}
      </Link>
    </div>
  );
};

export default Join;
