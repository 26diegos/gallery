import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Gallery from './components/Gallery/Gallery';

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Route exact path="/uuid/:uuid" component={Gallery} />
        </div>
      </Router>
    </div>
  );
}

export default App;
