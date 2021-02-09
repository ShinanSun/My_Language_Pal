import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import Join from './Join';
import Chat from './Chat';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={Join} />
        <Route path="/chat" component={Chat} />
      </Router>
    );
  }
}
