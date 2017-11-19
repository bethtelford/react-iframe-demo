import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

class App extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      result: ''
    }
    this.onChange = this.onChange.bind(this);
    this.evaluate = this.evaluate.bind(this);
    this.setResult = this.setResult.bind(this);
    
  }
  onChange(newValue) {
    console.log('new value', newValue)
    this.setState({
      value: newValue
    })
  }

  evaluate(frame) {
    var code = this.state.value;
    frame.contentWindow.postMessage(code, '*');
  }
  setResult(e) {
    console.log('app receives', e)
    if (e.origin === "null" && e.source === this.refsSandbox.contentWindow) {
      this.setState({
        result: e.data
      })
    }
  }
  componentDidMount() {
    window.addEventListener('message', this.setResult);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to the Ace Editor</h1>
          <h2> {this.state.result}</h2>
        </header>
        <AceEditor
          mode="javascript"
          theme="monokai"
          onChange={this.onChange}
          value={this.state.value}
          name="UNIQUE_ID_OF_DIV"
        />
        <button onClick={() => {this.evaluate(this.refsSandbox)}}>eval()</button>
        <iframe ref={el => this.refsSandbox = el} src='http://localhost:3000/frame.html' sandbox='allow-scripts'></iframe>
      </div>
    );
  }
}

export default App;
