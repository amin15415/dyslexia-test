import React, { useState, useEffect, lazy, Suspense } from 'react';
import { TestWordsProvider } from './contexts/TestWordContext';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import logo from './assets/images/gryfn_logo.png';

const Welcome = lazy(() => import('./pages/Welcome/Welcome'));
const SelectTest = lazy(() => import('./pages/Test Selection/SelectTest'));
const Decoding = lazy(() => import('./pages/Decoding/Decoding'));
const Eidetic = lazy(() => import('./pages/Eidetic/Eidetic'));
const Phonetic = lazy(() => import('./pages/Phonetic/Phonetic'));
const Survey = lazy(() => import('./pages/Survey/Survey'));
const Completed = lazy(() => import('./pages/Completed/Completed'));

function App() {
  const location = useLocation();
  const [isHome, setIsHome] = useState(location.pathname === '/');
  
  useEffect(() => {
    setIsHome(location.pathname === '/');
  }, [location]);

  return (
    <TestWordsProvider>
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
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/test-selection" element={<SelectTest />} />
                <Route path="/decoding" element={<Decoding />} />
                <Route path="/eidetic" element={<Eidetic />} />
                <Route path="/phonetic" element={<Phonetic />} />
                <Route path="/survey" element={<Survey />} />
                <Route path="/completed" element={<Completed />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </TestWordsProvider>
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
