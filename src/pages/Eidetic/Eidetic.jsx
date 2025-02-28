import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getEideticWords } from '../../utils/getEncodingWords';
import { useNavigate, useBeforeUnload } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import "./Eidetic.css";
import { IconButton, Stack, Typography } from '@mui/material';
import { ReactTyped } from "react-typed";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import WordByWordTyping from '../../components/WordByWordFadeTyping';

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
    const samplePath = require(`../../assets/audio/laugh.mp3`);
    const instruction1Path = require(`../../assets/audio/eidetic-instruction-1.mp3`);
    const instruction2Path = require(`../../assets/audio/eidetic-instruction-2.mp3`);

    const [userInputs, setUserInputs] = useState(Array(audioPaths.length).fill(''));
    const [incompleteSubmit, setIncompleteSubmit] = useState(false);
    const [currentItem, setCurrentItem] = useState(0);

    const [isTutorial, setIsTutorial] = useState(true);
    const [animationPhase, setAnimationPhase] = useState(0);
    const [inputTyped,setInputTyped] = useState();
    const [instruction1Typed,setInstruction1Typed] = useState();
    const [instruction2Typed,setInstruction2Typed] = useState();

    const [sampleInputValue,setSampleInputValue] = useState('');
    const [isPlaying,setIsPlaying] = useState(false);
    const [isAnimating,setIsAnimating] = useState(false);

    const sampleAudioRef = useRef();
    const instructionAudioRef1 = useRef();
    const instructionAudioRef2 = useRef();
    const playButtonRef = useRef();
    
    useEffect(() => {
      // if first phase is in place the audio for first instruction should be started
      if (animationPhase == 1) { instructionAudioRef1.current.play(); }
      if (animationPhase == 2) {
        sampleAudioRef.current.play();
        playButtonRef.current.classList.add('dynamic-play-button');
        setTimeout(() => playButtonRef.current.classList.remove('dynamic-play-button'), 200);
      }
      if (animationPhase == 3) {
        instructionAudioRef2.current.play();
        // instruction2Typed.start(); 
      }
      if (animationPhase == 4)  inputTyped.start()
    }, [animationPhase]);

    useEffect(() => {
      if (isPlaying && !isAnimating && animationPhase == 1)  setInstruction1Typed(true);
      if (isPlaying && !isAnimating && animationPhase == 3)  setInstruction2Typed(true);
      if (!isPlaying && !isAnimating && animationPhase > 0 && animationPhase < 5) {
        setAnimationPhase(animationPhase + 1);
      }
    }, [isPlaying, isAnimating]);

    useEffect(() => {
      if (!isTutorial)
        window.scrollTo({
          top: 0,
          behavior: 'smooth', // Use 'auto' for instant scrolling without animation
        });

    }, [isTutorial]);
    
    // Add this useEffect for basic navigation protection
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            const message = "Are you sure you want to leave? Your progress will be lost.";
            e.returnValue = message;
            return message;
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    
    // If you're using React Router's useBeforeUnload hook
    useBeforeUnload(
        useCallback((event) => {
            if (!isTutorial || currentItem > 0) {
                event.preventDefault();
                return "Are you sure you want to leave? Your progress will be lost.";
            }
        }, [isTutorial, currentItem])
    );
    
    // Alternatively, if you have a custom hook:
    // useNavigationProtection(isTutorial || currentItem > 0);
    
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

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
          event.preventDefault();
          event.stopPropagation();
          if (isTutorial && animationPhase > 4) setIsTutorial(false);
      }
    }

    function neutralizeSuggestion() {
      const element1 = document.getElementById('tutorialInput');
      const element2 = document.getElementById('testInput');
      if (element1)
        element1.setAttribute('type', 'text');
      if (element2)
        element2.setAttribute('type', 'text');
    }

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
                { isTutorial &&
                <Stack sx={{px: "10px"}} justifyContent="center" alignItems="center" spacing={2}>
                  <Typography variant='h4'>Spelling Test Tutorial</Typography>

                  { animationPhase == 0 &&
                    <button onClick={() => setAnimationPhase(1)}>
                      Start Tutorial
                    </button>
                  }

                  <WordByWordTyping 
                    text="First you will hear a word." 
                    speed={150}
                    startAnimation={instruction1Typed}
                    onStart={() => setIsAnimating(true)}
                    onComplete={() => setIsAnimating(false)}
                  />

                  <audio ref={instructionAudioRef1} src={instruction1Path} onPlay={()=> setIsPlaying(true)} onEnded={()=> setIsPlaying(false)} />
                  { animationPhase > 0 &&
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <audio ref={sampleAudioRef} src={samplePath} controls style={{ position: 'relative', zIndex: 1 }} onPlay={()=> setIsPlaying(true)} onEnded={()=> setIsPlaying(false)}/>
                    <div
                      ref={playButtonRef}
                      style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        zIndex: animationPhase > 3 ? -1 : 2,
                      }}
                    ></div>
                  </div>
                  }

                  <WordByWordTyping 
                    text='You can replay this word by pressing the play button. <br> Next you should spell this word exactly how you would spell it on a spelling test. <br> Please spell the word "laugh" exactly as demonstrated.'
                    speed={150}
                    indexPauses={{11 : 1500, 12: 300, 28: 1700}}
                    startAnimation={instruction2Typed}
                    onStart={() => setIsAnimating(true)}
                    onComplete={() => setIsAnimating(false)}
                  />

                  <audio ref={instructionAudioRef2} src={instruction2Path} onPlay={()=> setIsPlaying(true)} onEnded={()=> setIsPlaying(false)} />
                  
                  { animationPhase > 2 &&
                  <ReactTyped
                    typedRef={setInputTyped}
                    strings={["laugh",""]}
                    typeSpeed={250}
                    backSpeed={70}
                    attr="value"
                    stopped
                    onStart={() => setIsAnimating(true)}
                    onComplete={() => setIsAnimating(false)}
                  >
                    <input
                      type={isAnimating ? "text" : "password"}
                      id="tutorialInput"
                      placeholder="Enter Spelling"
                      value={sampleInputValue}
                      spellCheck="false"
                      autoCorrect="off"
                      autoComplete="off"
                      autoCapitalize="none"
                      onInput={neutralizeSuggestion}
                      onKeyDown={handleKeyDown}
                      // inputMode="none"
                      // autoFocus
                      onChange={(e) => setSampleInputValue(e.target.value)}
                    />
                  </ReactTyped>
                  }
                  { animationPhase > 4 &&
                    <button disabled={sampleInputValue.toLowerCase().trim() !== "laugh" } onClick={() => setIsTutorial(false)}>
                      Start The Test
                    </button>
                  }
                </Stack>
                }
                { !isTutorial &&
                  <>
                <div>
                  <h1>Spell these words correctly, like on a spelling test.</h1>
                  {/* <p>For instance, laugh should be spelled 'laugh'.</p> */}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                  <div>
                  {/* currentItem === 0 && (
                    <div>
                      <h3>Press Play</h3>
                    </div> ) */}
                    <audio 
                      src={audioPaths[currentItem]} 
                      controls
                      autoPlay
                      // autoPlay={currentItem !== 0} 
                    />
                    <div>
                      <input
                        type="password"
                        id="testInput"
                        placeholder="Enter spelling"
                        value={userInputs[currentItem]}
                        spellCheck="false"
                        autoCorrect="off"
                        autoComplete="off"
                        autoCapitalize="none"
                        onInput={neutralizeSuggestion}
                        // inputMode="none"
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
                }
                </>
            )}
          </div>
        </div>
    );
      
};

export default Eidetic;