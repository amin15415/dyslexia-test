import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getPhoneticWords } from '../../utils/getWords';
import phoneticCorrect from '../../utils/phoneticCorrect';
import { useNavigate } from 'react-router-dom';
import "./Phonetic.css";

const Phonetic = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const desdWords = location.state.desdWords;
    const gradeIndex = location.state.gradeIndex;
    const { phoneticWords } = getPhoneticWords(
      gradeIndex,
      desdWords
      );
      const audioPaths = phoneticWords.map((word) => require(`../../assets/audio/${word}.mp3`));
      const [userInputs, setUserInputs] = useState(Array(audioPaths.length).fill(''));
      const [incompleteSubmit, setIncompleteSubmit] = useState(false);

    useEffect(() => {
        console.log(audioPaths);
    }, [audioPaths]);

    const handleSubmit = () => {
        let correct = 0;
        const incorrectPhoneticWords = [];
        userInputs.some((input) => input === '') ? setIncompleteSubmit(true) : setIncompleteSubmit(false);

        if (!userInputs.some((input) => input === '')) {

            for (let i = 0; i < audioPaths.length; i++) {
                if (phoneticCorrect(phoneticWords[i], userInputs[i])) {
                    correct++;
                } else {
                    incorrectPhoneticWords.push(phoneticWords[i]);
                }
            }
            setTimeout(() => {
                navigate('/results', { state: { 
                    desdWords: desdWords, 
                    readingLevel: location.state.readingLevel,
                    phoneticCorrect: correct,
                    eideticCorrect: location.state.eideticCorrect
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

export default Phonetic;