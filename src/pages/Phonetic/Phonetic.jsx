import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getPhoneticWords } from '../../utils/getWords';
import correctPhoneticWords from '../../utils/phoneticCorrect';
import { useNavigate } from 'react-router-dom';
import "./Phonetic.css";

const Phonetic = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const testWords = location.state.testWords;
    const gradeIndex = location.state.gradeIndex;
    const { phoneticWords } = getPhoneticWords(
      gradeIndex,
      testWords
      );
    const audioPaths = phoneticWords.map((word) => require(`../../assets/audio/${word}.mp3`));
    const [userInputs, setUserInputs] = useState(Array(audioPaths.length).fill(''));
    const [incompleteSubmit, setIncompleteSubmit] = useState(false);
    const [currentItem, setCurrentItem] = useState(0);

    useEffect(() => {
        console.log(audioPaths);
    }, []);
    
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
                let phoneticCorrect = 0;
                const phoneticResults = {};

                for (let i = 0; i < audioPaths.length; i++) {
                    const userInput = userInputs[i].toLowerCase().trim();
                    if (correctPhoneticWords(phoneticWords[i], userInput)) {
                        phoneticCorrect++;
                        phoneticResults[userInput] = true;
                    } else {
                        phoneticResults[userInput] = false;
                    }
                }

                setTimeout(() => {
                    navigate('/survey', { state: { 
                        testWords: testWords,
                        readingLevel: location.state.readingLevel,
                        eideticCorrect: location.state.eideticCorrect,
                        eideticResults: location.state.eideticResults,
                        phoneticCorrect: phoneticCorrect,
                        phoneticResults: phoneticResults,
                        test: location.state.test
                    } });
                }, 100);
            }
        }
    };

  return (
    <div className='encoding-container' key={currentItem}>
      <div>
        <h1>Spell these words exactly like they sound</h1>
        <p>For instance, laugh should be spelled 'laf'.</p>
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
              autoFocus
              autoCorrect="off"
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
    </div>
  );   
}

export default Phonetic;