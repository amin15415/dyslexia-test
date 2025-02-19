import React, { useState } from 'react';
import { getEideticWords } from '../../utils/getEncodingWords';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import "./Eidetic.css";

const Eidetic = () => {
    const navigate = useNavigate();
    const [testWords] = useSessionStorage('testWords', '');
    const [, setEideticCorrect] = useSessionStorage('eideticCorrect', 0);
    const [, setEideticResults] = useSessionStorage('eideticResults', '');
    const levelIndex = parseInt(useSessionStorage('levelIndex', ''));
    const { eideticWords, tooFewCorrect } = getEideticWords(
                                                            levelIndex,
                                                            testWords
                                                            );
    const audioPaths = eideticWords.map((word) => require(`../../assets/audio/${word}.mp3`));
    const [userInputs, setUserInputs] = useState(Array(audioPaths.length).fill(''));
    const [incompleteSubmit, setIncompleteSubmit] = useState(false);
    const [currentItem, setCurrentItem] = useState(0);

    const handleSubmit = () => {
      if (userInputs[currentItem] === '') {
        setIncompleteSubmit(true);
        setTimeout(() => {
          setIncompleteSubmit(false);
        }, 3000);
      } else {
        if (currentItem < audioPaths.length - 1) {
          setCurrentItem(currentItem + 1);
        } else {
          const eideticResults = {};
          let correct = 0;
    
          for (let i = 0; i < audioPaths.length; i++) {
            const userInput = userInputs[i].toLowerCase().trim();
            if (userInput === eideticWords[i]) {
              correct++;
            }
            eideticResults[eideticWords[i]] = {
              correct: userInput === eideticWords[i],
              userInput: userInput
            };
          }
          setTimeout(() => {
            setEideticCorrect(correct);
            setEideticResults(eideticResults);
            navigate('/phonetic');
          }, 100);
        }
      }
    };

    return (
        <div className='encoding-container' key={currentItem}>
          <div>
            {tooFewCorrect && levelIndex !== 0 ? (
              <div>
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
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                  <div>
                  {currentItem === 0 && (
                    <div>
                      <h3>Press Play</h3>
                    </div> )}
                    <audio src={audioPaths[currentItem]} controls autoPlay={currentItem !== 0} />
                    <div>
                      <input
                        type="text"
                        placeholder="Enter spelling"
                        value={userInputs[currentItem]}
                        spellCheck={false}
                        autoCorrect="off"
                        autoComplete="off"
                        autoCapitalize="none"
                        inputMode="none"
                        autoFocus
                        onChange={(e) => {
                          const newInputs = [...userInputs];
                          newInputs[currentItem] = e.target.value;
                          setUserInputs(newInputs);
                        }}
                      />
                    </div>
                  </div>
                  <div className='button-container'>
                    {incompleteSubmit && <p>Please answer this item.</p>}
                    <button type="submit">
                      {currentItem < audioPaths.length - 1 ? 'Next' : 'Submit'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
    );
      
};

export default Eidetic;
