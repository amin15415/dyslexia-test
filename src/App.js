import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './pages/Welcome/Welcome';
import Decoding from './pages/Decoding/Decoding';
import Encoding from './pages/Encoding';
import './App.css';
import logo from './assets/images/logo.png';
import Navigation from './utils/Navigation';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="container">
          <header>
            <div className="gryfn">
              <div>
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
