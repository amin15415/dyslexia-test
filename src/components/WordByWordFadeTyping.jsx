import React, { useState, useEffect } from 'react';
import './WordByWordFadeTyping.css'; // Import the CSS file for animations

const WordByWordFadeTyping = ({ text, speed, indexPauses, onStart, onComplete, startAnimation }) => {
  const [currentText, setCurrentText] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const words = text.split(' ');

  useEffect(() => {

    if (currentIndex < words.length && startAnimation) {
      if (currentIndex == 0) onStart();
      let timeoutAmount = speed;
      
      if (indexPauses && indexPauses[currentIndex] > 0) timeoutAmount = speed + indexPauses[currentIndex];
      if (words[currentIndex] == "<br>") timeoutAmount = 0;
      
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => [...prevText, words[currentIndex]]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, timeoutAmount);
      return () => clearTimeout(timeout);
    } else if (currentIndex == words.length) {
      setCurrentIndex(1000);
      onComplete();
    }
  }, [currentIndex, speed, words]);

  return (
    <div>
      {currentText.map((word, index) => ( 
        <React.Fragment key={index}>
          { word == "<br>" ? <br></br> : <span key={index} className="fade-in tutorial-text">{word} </span>}
        </React.Fragment>
       ))}
    </div>
  );
};

export default WordByWordFadeTyping;