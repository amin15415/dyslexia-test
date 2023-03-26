import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './pages/Welcome/Welcome';
import Decoding from './pages/Decoding/Decoding';
import Encoding from './pages/Encoding';
import './App.css';
import logo from './assets/logo.svg';
import Navigation from './utils/Navigation';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="top-bar">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
            <h1>Your App Name</h1>
          </div>
          <Navigation />
        </div>
        <div className="container">
          <header></header>
          <main>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/decoding" element={<Decoding />} />
              <Route path="/encoding" element={<Encoding />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
