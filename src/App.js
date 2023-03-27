import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './pages/Welcome/Welcome';
import Decoding from './pages/Decoding/Decoding';
import Encoding from './pages/Encoding';
import './App.css';
import Navigation from './components/Navigation';
import logo from './assets/images/gryfn_logo.png';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="container">
          <header>
            <div className="gryfn">
              <div className="logo-text-container">
                <img src={logo} alt="Logo" className="logo"/>
                <p>gryfn</p>
              </div>
            </div>
            <Navigation />
          </header>
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
