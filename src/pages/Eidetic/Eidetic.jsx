import React, { useEffect, useRef, useState } from 'react';
import { getEideticWords } from '../../utils/getEncodingWords';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import "./Eidetic.css";
import { IconButton, Stack, Typography } from '@mui/material';
import { ReactTyped } from "react-typed";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';

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
    const voiceTestPath = require(`../../assets/audio/eidetic-voice-test.mp3`);

    const [userInputs, setUserInputs] = useState(Array(audioPaths.length).fill(''));
    const [incompleteSubmit, setIncompleteSubmit] = useState(false);
    const [currentItem, setCurrentItem] = useState(0);

    const [isTutorial, setIsTutorial] = useState(true);
    const [isReadyToStart, setIsReadyToStart] = useState(false);
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
    const voiceTestButton = useRef();

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
      if (isPlaying && !isAnimating && animationPhase == 1)  instruction1Typed.start();
      if (isPlaying && !isAnimating && animationPhase == 3)  instruction2Typed.start();
      if (!isPlaying && !isAnimating && animationPhase > 0 && animationPhase < 5) {
        setAnimationPhase(animationPhase + 1);
      }
    }, [isPlaying, isAnimating]);

    
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
                { isTutorial &&
                <Stack sx={{px: "10px"}} justifyContent="center" alignItems="center" spacing={2}>
                  <Typography variant='h4'>Spelling Test Tutorial</Typography>

                  { (!isReadyToStart || animationPhase == 0) &&
                    <Stack justifyContent="center" alignItems="center" spacing={1}>
                      <Typography variant='h6'>Please ensure your audio is functioning and that your device is not muted.</Typography>
                      { !isPlaying &&
                      <IconButton onClick={() => voiceTestButton.current.play()}>
                        <PlayCircleOutlineIcon sx={{width: "100px", height: "100px", color: "#FFC107"}} />
                      </IconButton>
                      }
                      { isPlaying &&
                      <IconButton onClick={() => voiceTestButton.current.pause()}>
                        <PauseCircleOutlineIcon sx={{width: "100px", height: "100px", color: "#FFC107"}} />
                      </IconButton>
                      }
                      <Typography variant='h6'>Click on the play button and continue if you heard the voice clearly.</Typography>
                      
                      <audio ref={voiceTestButton} src={voiceTestPath} onPlay={()=> setIsPlaying(true)} onPause={()=> setIsPlaying(false)} onEnded={()=> {setIsReadyToStart(true); setIsPlaying(false);}} />
                    </Stack>
                  }
 
                  { isReadyToStart && animationPhase == 0 &&
                    <button onClick={() => setAnimationPhase(1)}>
                      I Heard The Voice
                    </button>
                  }

                  <ReactTyped
                        typedRef={setInstruction1Typed}
                        strings={["First you will hear a word."]}
                        typeSpeed={30}
                        className='tutorial-text'
                        stopped
                        showCursor={false}
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
                  <ReactTyped
                        typedRef={setInstruction2Typed}
                        strings={['You can replay this word by pressing the play button. <br> Next you should spell this word exactly how you would spell it on a spelling test. <br> Please spell the word "laugh" exactly as demonstrated.']}
                        typeSpeed={30}
                        className='tutorial-text'
                        stopped
                        showCursor={false}
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
                      type="text"
                      placeholder="Enter Spelling"
                      value={sampleInputValue}
                      spellCheck={false}
                      autoCorrect="off"
                      autoComplete="off"
                      autoCapitalize="none"
                      // inputMode="none"
                      autoFocus
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
