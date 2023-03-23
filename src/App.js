import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './Welcome';
import Decoding from './Decoding';
import './App.css';
import logo from './logo.svg';

function App() {
  return (
    <Router>
      <div className="App">
          <div className="top-bar">
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo" />
              <h1>Your App Name</h1>
            </div>
            <nav>
              <a href="/">Home</a>
            </nav>
          </div>
      <div className="container">
        <header>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/decoding" element={<Decoding />} />
          </Routes>
        </main>
      </div>
      </div>
    </Router>
  );
}

export default App;
