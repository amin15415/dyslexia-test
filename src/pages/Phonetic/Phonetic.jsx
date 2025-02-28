import React, { useEffect, useRef, useState } from "react";
import { getPhoneticWords } from "../../utils/getEncodingWords";
import correctPhoneticWords from "../../utils/phoneticCorrect";
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { useNavigate } from "react-router-dom";
import { ReactTyped } from "react-typed";
import "./Phonetic.css";
import { Input, Stack, Typography } from "@mui/material";
import WordByWordTyping from "../../components/WordByWordFadeTyping";
import { useNavigationProtection } from '../../hooks/useNavigationProtection';

const Phonetic = () => {
  const navigate = useNavigate();
  const [testWords] = useSessionStorage('testWords', '');
  const [, setPhoneticCorrect] = useSessionStorage('phoneticCorrect', 0);
  const [, setPhoneticResults] = useSessionStorage('phoneticResults', '');
  const levelIndex = parseInt(useSessionStorage('levelIndex', ''));
  const { phoneticWords } = getPhoneticWords(levelIndex, testWords);
  const audioPaths = phoneticWords.map((word) =>
    require(`../../assets/audio/${word}.mp3`)
  );

  const samplePath = require(`../../assets/audio/laugh.mp3`);
  const instruction1Path = require(`../../assets/audio/phonetic-instruction-1.mp3`);
  const instruction2Path = require(`../../assets/audio/phonetic-instruction-2.mp3`);

  const [userInputs, setUserInputs] = useState(
    Array(audioPaths.length).fill("")
  );
  const [incompleteSubmit, setIncompleteSubmit] = useState(false);
  const [currentItem, setCurrentItem] = useState(0);


  const [isTutorial, setIsTutorial] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [inputTyped,setInputTyped] = useState();
  const [instruction1Typed,setInstruction1Typed] = useState(false);
  const [instruction2Typed,setInstruction2Typed] = useState(false);

  const [sampleInputValue,setSampleInputValue] = useState('');
  const [isPlaying,setIsPlaying] = useState(false);
  const [isAnimating,setIsAnimating] = useState(false);

  const sampleAudioRef = useRef();
  const instructionAudioRef1 = useRef();
  const instructionAudioRef2 = useRef();
  const playButtonRef = useRef();

  const scrollRef = useRef();

  useNavigationProtection();

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
      instructionAudioRef2.current.scrollIntoView({ behavior: "smooth" });
      // instruction2Typed.start(); 
    }
    if (animationPhase == 4) { 
      inputTyped.start(); 
      scrollRef.current.scrollIntoView({ behavior: "smooth" } );
    }

    if (animationPhase == 5) scrollRef.current.scrollIntoView({ behavior: "smooth" } )
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

  const handleSubmit = () => {
    if (userInputs[currentItem] === "") {
      setIncompleteSubmit(true);
      setTimeout(() => {
        setIncompleteSubmit(false);
      }, 3000);
    } else {
      if (currentItem < audioPaths.length - 1) {
        setCurrentItem(currentItem + 1);
      } else {
        const phoneticResults = {};
        let correct = 0;

        for (let i = 0; i < audioPaths.length; i++) {
          const userInput = userInputs[i].toLowerCase().trim();
          if (
            correctPhoneticWords(phoneticWords[i], userInput) ||
            userInput === phoneticWords[i]
          ) {
            correct++;
            } 
          phoneticResults[phoneticWords[i]] = {
              correct: correctPhoneticWords(phoneticWords[i], userInput) || userInput === phoneticWords[i],
              userInput: userInput
            };
        }

        setTimeout(() => {
          setPhoneticCorrect(correct);
          setPhoneticResults(phoneticResults);
          navigate("/survey");
        }, 100);
      }
    }
  };

  function neutralizeSuggestion() {
    const element1 = document.getElementById('tutorialInput');
    const element2 = document.getElementById('testInput');
    if (element1)
      element1.setAttribute('type', 'text');
    if (element2)
      element2.setAttribute('type', 'text');
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        if (isTutorial && animationPhase > 4) setIsTutorial(false);
    }
  }
 
  return (
    <div className="encoding-container" key={currentItem}>

      { isTutorial &&
        <Stack sx={{px: "10px"}} justifyContent="center" alignItems="center" spacing={2}>
          <Typography variant='h4'>Phonetic Test Tutorial</Typography>
          { animationPhase == 0 &&
            <button onClick={() => setAnimationPhase(1)}>
              Start Test
            </button>
          }

          {/* <ReactTyped
                typedRef={setInstruction1Typed}
                strings={["This part of the test uses a different kind of spelling. First you will hear a word."]}
                typeSpeed={30}
                className='tutorial-text'
                stopped
                showCursor={false}
                onStart={() => setIsAnimating(true)}
                onComplete={() => setIsAnimating(false)}
          /> */}

          <WordByWordTyping 
            text="This part of the test uses a different kind of spelling. First you will hear a word." 
            speed={150}
            indexPauses={{11 : 1100}}
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
          {/* <ReactTyped
                typedRef={setInstruction2Typed}
                preStringTyped={() => scrollRef.current.scrollIntoView()}
                strings={['You can replay this word by pressing the play button.<br> Next you should write this word exactly the way it sounds. You do not need to worry about the correct spelling. <br> For example, the word "laugh" can be spelled "laf". <br> Please spell the word "laugh" as demonstrated']}
                typeSpeed={30}
                className='tutorial-text'
                stopped
                showCursor={false}
                onStart={() => setIsAnimating(true)}
                onComplete={() => setIsAnimating(false)}
          /> */}
          <WordByWordTyping 
            text='You can replay this word by pressing the play button. <br> Next you should write this word exactly the way it sounds. You do not need to worry about the correct spelling. <br> For example, the word "laugh" can be spelled "laf". <br> Please spell the word "laugh" as demonstrated' 
            speed={150}
            // 11 - Next | 12 - you sho... | 22 - you do.. | 33 - for ex... | 35: the word... | 38: "laf"... | 43: please ...
            indexPauses={{11 : 1500, 12: 200, 22: 1500, 33: 1000, 35: 300, 38: 800, 42:2000, 43: 1700}}
            startAnimation={instruction2Typed}
            onStart={() => setIsAnimating(true)}
            onComplete={() => setIsAnimating(false)}
            scrollRef={scrollRef}
          />
          <div ref={scrollRef} />
          <audio ref={instructionAudioRef2} src={instruction2Path} onPlay={()=> setIsPlaying(true)} onEnded={()=> setIsPlaying(false)} />
          
          { animationPhase > 2 &&
          <ReactTyped
            typedRef={setInputTyped}
            strings={["laf",""]}
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
            <button disabled={!["laf","laaf"].includes(sampleInputValue.toLowerCase().trim()) } onClick={() => setIsTutorial(false)}>
              Start The Test
            </button>
          }
        </Stack>
      }
      { !isTutorial &&
      <>
        <div>
          <h1>Please spell these words exactly how they sound. <br></br> Do not worry about correct spelling.</h1>
          {/* <p>For instance, laugh should be spelled 'laf'.</p> */}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            {/* currentItem === 0 && (
              <div>
                <h3>Press Play</h3>
              </div>
            */}
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
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
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
          <div className="button-container">
            {incompleteSubmit && <p>Please answer this item.</p>}
            <button type="submit">
              {currentItem < audioPaths.length - 1 ? "Next" : "Submit"}
            </button>
          </div>
        </form>
      </>
      }
    </div>
  );
};

export default Phonetic;
