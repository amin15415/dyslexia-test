import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Welcome from './pages/Welcome/Welcome';
import Decoding from './pages/Decoding/Test';
import Encoding from './pages/Encoding/Encoding';
import './App.css';
import logo from './assets/images/gryfn_logo.png';

function App() {
  const location = useLocation();
  const [isHome, setIsHome] = useState(location.pathname === '/');
  
  useEffect(() => {
    setIsHome(location.pathname === '/');
  }, [location]);

  return (
      <div className="App">
        <div className="container">
          <header>
            <div className="gryfn">
              <div className="logo-text-container">
                <img src={logo} alt="Logo" className="logo"/>
                <p>gryfn</p>
              </div>
            </div>
            {isHome && <nav><a href="/">About</a></nav>}
          </header>
          <main style={{background: isHome ? '#3d3d3d' : 'white'}}>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/decoding" element={<Decoding />} />
              <Route path="/encoding" element={<Encoding />} />
            </Routes>
          </main>
        </div>
      </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;