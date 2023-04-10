import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getEideticWords } from '../../utils/getWords';
import { useNavigate } from 'react-router-dom';
import "./Eidetic.css";

const Eidetic = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const desdWords = location.state.desdWords;
    const gradeIndex = location.state.gradeIndex;
    console.log(desdWords);
    const { eideticWords, lessThanFiveWordsCorrect } = getEideticWords(
    gradeIndex,
    desdWords
    );
    const audioPaths = eideticWords.map((word) => require(`../../assets/audio/${word}.mp3`));
    const [userInputs, setUserInputs] = useState(Array(audioPaths.length).fill(''));
    const [incompleteSubmit, setIncompleteSubmit] = useState(false);

    useEffect(() => {
        console.log(audioPaths);
    }, [audioPaths]);

    const handleSubmit = () => {
        let correct = 0;
        const ineideticWords = [];
        userInputs.some((input) => input === '') ? setIncompleteSubmit(true) : setIncompleteSubmit(false);

        if (!userInputs.some((input) => input === '')) {
            for (let i = 0; i < audioPaths.length; i++) {
                const userInput = userInputs[i].toLowerCase().trim();
                if (userInput !== eideticWords[i]) {
                    ineideticWords.push(eideticWords[i]);
                } else {
                    correct++;
                }
            }

            setTimeout(() => {
                navigate('/phonetic', { state: { 
                    desdWords: desdWords, 
                    gradeIndex: gradeIndex, 
                    readingLevel: location.state.readingLevel,
                    eideticCorrect: correct
                } });
            }, 100);
        } else {
            setIncompleteSubmit(true);
            setTimeout (() => {
                setIncompleteSubmit(false);
            }, 3000);
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
          <>
          <div>
            <h1>Spell these words exactly as they should be spelled</h1>
            <p>For instance, laugh should be spelled 'laugh'.</p>
          </div>
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
                      } } />
                  </div>
                </React.Fragment>
              ))}
            </div></>
        )}
      </div>
      <div className='button-container'>
          {incompleteSubmit && <p>Please answer all items.</p>}
        <button
            // disabled={userInputs.some((input) => input === '')}
            onClick={handleSubmit}
          >
            Submit
        </button>
      </div>
    </div>
  );  
  
}

export default Eidetic;