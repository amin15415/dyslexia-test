import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getPhoneticWords } from '../../utils/getWords';
import correctPhoneticWords from '../../utils/phoneticCorrect';
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
    const [phoneticCorrect, setPhoneticCorrect] = useState();

    useEffect(() => {
        console.log(audioPaths);
    }, [audioPaths]);

    function goToExternalSite() {
      window.location.href = `https://worgcu1jmds.typeform.com/to/pIek20LV#rl=${location.state.readingLevel}&es=${location.state.eideticCorrect}&ps=${phoneticCorrect}&test=DESD`;
    }

    const handleSubmit = () => {
        let correct = 0;
        const incorrectPhoneticWords = [];
        userInputs.some((input) => input === '') ? setIncompleteSubmit(true) : setIncompleteSubmit(false);

        if (!userInputs.some((input) => input === '')) {

            for (let i = 0; i < audioPaths.length; i++) {
                const userInput = userInputs[i].toLowerCase().trim();
                if (correctPhoneticWords(phoneticWords[i], userInput)) {
                    correct++;
                } else {
                    incorrectPhoneticWords.push(phoneticWords[i]);
                }
            }
              // Navigate to External Survey togather Scoring/Demographic Data
              setPhoneticCorrect(correct);
              goToExternalSite()
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
          <h1>Spell these words exactly like they sound</h1>
          <p>For instance, laugh should be spelled 'laf'.</p>
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