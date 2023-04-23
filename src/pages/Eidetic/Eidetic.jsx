import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getEideticWords } from '../../utils/getWords';
import { useNavigate } from 'react-router-dom';
import "./Eidetic.css";

const Eidetic = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const testWords = location.state.testWords;
    const gradeIndex = location.state.gradeIndex;
    const { eideticWords, tooFewCorrect } = getEideticWords(
    gradeIndex,
    testWords
    );
    const audioPaths = eideticWords.map((word) => require(`../../assets/audio/${word}.mp3`));
    const [userInputs, setUserInputs] = useState(Array(audioPaths.length).fill(''));
    const [incompleteSubmit, setIncompleteSubmit] = useState(false);
    const [currentItem, setCurrentItem] = useState(0);

    useEffect(() => {
        console.log(audioPaths);
    }, [audioPaths]);

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
                let eideticCorrect = 0;
                const eideticResults = {};

                for (let i = 0; i < audioPaths.length; i++) {
                    const userInput = userInputs[i].toLowerCase().trim();
                    if (userInput === eideticWords[i]) {
                      eideticCorrect++;
                      eideticResults[userInput] = true;
                    } else {
                      eideticResults[userInput] = false;
                    }
                }

                setTimeout(() => {
                    navigate('/phonetic', { state: { 
                        testWords: testWords, 
                        gradeIndex: gradeIndex, 
                        readingLevel: location.state.readingLevel,
                        eideticCorrect: eideticCorrect,
                        eideticResults: eideticResults,
                        test: location.state.test
                    } });
                }, 100);
            }
        }
    };

    return (
        <div className='encoding-container'>
            <div>
                {tooFewCorrect && gradeIndex !== 0 ? (
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
                <div>
                  <audio src={audioPaths[currentItem]} controls autoPlay />
                    <div>
                    <input
                    type="text"
                    placeholder="Enter spelling"
                    value={userInputs[currentItem]}
                    spellCheck={false}
                    autoCorrect="off"
                    onChange={(e) => {
                        const newInputs = [...userInputs];
                        newInputs[currentItem] = e.target.value;
                        setUserInputs(newInputs);
                    } } />
                    </div>
                </div></>
                )}
            </div>
            <div className='button-container'>
                {incompleteSubmit && <p>Please answer this item.</p>}
                <button onClick={handleSubmit}>
                    {currentItem < audioPaths.length - 1 ? 'Next' : 'Submit'}
    </button>
</div>
</div>
);
}

export default Eidetic;








