import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LotteryResult from "./APIHelpers/LotteryResult";
import { stringify } from 'querystring';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {content:"click load to show content."};
  }

  loadContent = e => {
    LotteryResult.query(data => {
      this.setState({
        content: JSON.stringify(data)
      });
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <button onClick={this.loadContent}>Load</button>
        <p className="App-intro">
          {this.state.content}
        </p>
      </div>
    );
  }
}

export default App;
