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
    // Note that we're sending the message to "*", rather than some specific
    // origin. Sandboxed iframes which lack the 'allow-same-origin' header
    // don't have an origin which you can target: you'll have to send to any
    // origin, which might alow some esoteric attacks. Validate your output!
    frame.contentWindow.postMessage(code, '*');
  }
  setResult(e) {
    if (e.origin === "null" && e.source === this.sandbox.contentWindow) {
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
        <button onClick={() => {this.evaluate(this.sandbox)}}>eval()</button>
        <iframe ref={el => this.sandbox = el} src='http://localhost:3000/frame.html' sandbox='allow-scripts'></iframe>
      </div>
    );
  }
}

export default App;
