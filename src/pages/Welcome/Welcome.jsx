import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import './Welcome.css';
import logo from '../../assets/images/gryfn_logo.png'

function Welcome() {
  const navigate = useNavigate();

  const beginTest = () => {
    navigate('/decoding');
  };

  return (
    <div>
      <div className="welcome-container">
        <div className='text-container'>
          <div className="text-content">
            <h1 className='banner-h1'>Online Dyslexia Test</h1>
            <p className='banner-p'>
              Assess your specific reading difficulties, detect dyslexia risk, and identify areas for improvement.
            </p>
            <button onClick={beginTest}>Begin Test</button>
          </div>
        </div>
        <div className="banner-section"></div>
      </div>
      <div className="test-info">
        <Card imageSrc={logo} />
        <Card imageSrc={logo} />
        <Card imageSrc={logo} />
      </div>
    </div>
  );
}

export default Welcome;
