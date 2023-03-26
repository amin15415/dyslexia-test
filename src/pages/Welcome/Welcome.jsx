import { useNavigate } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  const navigate = useNavigate();

  const beginTest = () => {
    navigate('/decoding');
  };

  return (
    <div className="welcome-container">
      <div className="text-content">
        <h1>Online Dyslexia Test</h1>
        <p>
        Assess your specific reading difficulties, detect dyslexia risk, and identify areas for improvement.
        </p>
        <button className="yellow-pill-button" onClick={beginTest}>Begin Test</button>
      </div>
      <div className="banner-section"></div>
    </div>
  );
  
};

export default Welcome;
