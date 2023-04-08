import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getCorrectWords } from '../../utils/getWords';
import "./Encoding.css";

const Encoding = () => {
  const location = useLocation();
  const desdWords = location.state.desdWords;
  const gradeIndex = location.state.gradeIndex;
  console.log(desdWords);
  const { correctWords, lessThanFiveWordsCorrect } = getCorrectWords(
    gradeIndex,
    desdWords
  );
  const audioPaths = correctWords.map((word) => require(`../../assets/audio/${word}.mp3`));
  const [userInputs, setUserInputs] = useState(Array(audioPaths.length).fill(''));


  useEffect(() => {
    console.log(audioPaths);
  }, [audioPaths]);

  const handleSubmit = () => {
    const incorrectWords = [];
  
    for (let i = 0; i < audioPaths.length; i++) {
      if (userInputs[i] !== correctWords[i]) {
        incorrectWords.push(correctWords[i]);
      }
    }
  
    if (incorrectWords.length > 0) {
      alert(`The following words were spelled incorrectly: ${incorrectWords.join(', ')}`);
    } else {
      alert('All words spelled correctly!');
    }
  };

  return (
    <div className='encoding-container'>
      <div>
        {lessThanFiveWordsCorrect && gradeIndex !== 0 ? (
          <div>
            <p>
              You got fewer than 5 words correct, so you are reading at a
              Kindergarten level.
            </p>
            <p>
              You did not get enough words correct to proceed with the encoding
              portion of the test.
            </p>
          </div>
        ) : (
          <div>
            {audioPaths.map((audioPath, index) => (
              <React.Fragment key={index}>
                <div>
                  <audio src={audioPath} controls />
                </div>
                <div>
                  <input 
                    type="text" 
                    placeholder="Enter spelling" 
                    value={userInputs[index]} 
                    onChange={(e) => {
                      const newInputs = [...userInputs];
                      newInputs[index] = e.target.value;
                      setUserInputs(newInputs);
                    }}
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      <div className='button-container'>
        <button
            disabled={userInputs.some((input) => input === '')}
            onClick={handleSubmit}
          >
            Submit
        </button>
      </div>
    </div>
  );  
  
}

export default Encoding;