import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Decoding = () => {
	const navigate = useNavigate();

	const desdWords = [
		{ grade: 'K', words: { 'baby': null, 'one': null, 'boat': null, 'do': null, 'car': null } },
		{ grade: '1L', words: { 'was': null, 'daddy': null, 'book': null, 'good': null, 'doll': null } },
		{ grade: '1U', words: { 'girl': null, 'apple': null, 'they': null, 'story': null, 'some': null } },
		{ grade: '2', words: { 'above': null, 'what': null, 'any': null, 'busy': null, 'night': null } },
		{ grade: '3', words: { 'done': null, 'huge': null, 'ocean': null, 'station': null, 'could': null } },
		{ grade: '4', words: { 'because': null, 'echo': null, 'couple': null, 'eager': null, 'together': null } },
		{ grade: '5', words: { 'bought': null, 'delicious': null, 'neighbor': null, 'achieve': null, 'region': null } },
		{ grade: '6', words: { 'malicious': null, 'bureau': null, 'similar': null, 'campaign': null, 'waltz': null } },
		{ grade: '7-8', words: { 'prairie': null, 'gadget': null, 'facsimile': null, 'emphasize': null, 'prescription': null } },
		{ grade: '9-12', words: { 'zealous': null, 'clique': null, 'atrocious': null, 'catastrophe': null, 'liquidate': null } },
	  ];
	
	const [wordIndex, setWordIndex] = useState(0);
	const [gradeIndex, setGradeIndex] = useState(0);
	const [gradeLevel, setGradeLevel] = useState(desdWords[gradeIndex].grade);
	const [readingLevel, setReadingLevel] = useState(null);
	const [buttonActive, setButtonActive] = useState(false);
	const [countdown, setCountdown] = useState(0);
	const [isStarted, setIsStarted] = useState(false);
	const [words, setWords] = useState(Object.keys(desdWords[gradeIndex].words));
	const [currentWord, setCurrentWord] = useState(words[wordIndex]);
	const [correct, setCorrect] = useState(0);
	const [wrong, setWrong] = useState(0);
	const [totalWrong, setTotalWrong] = useState(0);
	const [isLastWord, setIsLastWord] = useState(false);

	const recognizeSpeech = async () => {
		return new Promise((resolve, reject) => {
			const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
		  	recognition.lang = 'en-US';
		  	recognition.interimResults = false;
		  	recognition.maxAlternatives = 1;
	  
		  	recognition.start();
	  
		  	recognition.onresult = (event) => {
				const speechResult = event.results[0][0].transcript;
				resolve(speechResult);
		  };
	  
		  recognition.onerror = (event) => {
				reject(event.error);
		  };
		});
	};

	const startDecoding = () => {
		setIsStarted(true);
		handleNextWord();
	};

	const handleNextWord = async() => {
		
		setButtonActive(false);
		setCountdown(4);

		const speechResult = await recognizeSpeech();
  		console.log('Speech result:', speechResult);

  		if (speechResult.toLowerCase() === currentWord.toLowerCase()) {
    		setCorrect(correct + 1);
    		words[currentWord] = true;
		}
		else {
      		setWrong(wrong + 1);
			setTotalWrong(totalWrong + 1);
      		words[currentWord] = false;
    	}

		setWordIndex(wordIndex + 1);

		if (words[wordIndex] === "liquidate") {
			setIsLastWord(true);
		  }

		setCurrentWord(words[wordIndex]);
	};

	const handleLogic = () => {
		if (desdWords[gradeIndex] && correct >= 3) {
		  setReadingLevel(desdWords[gradeIndex].grade);
		}
	
		if (wrong >= 3 && totalWrong >= 5 && wordIndex >= 5) {
		  setTimeout(() => {
			navigate('/encoding'); 
		  }, 1000);
		}

		if (isLastWord) {
			setTimeout(() => {
			  navigate("/encoding"); 
			}, 4000);
		  }
	  };
	
	  useEffect(() => {
		handleLogic();
	  }, [correct, wrong, wordIndex, totalWrong, isLastWord]); 
	
	useEffect(() => {
		if (wordIndex >= 5) {
		  if (gradeIndex < desdWords.length - 1) {
			setGradeIndex(gradeIndex + 1);
			}
		  setWordIndex(0);
		  setCorrect(0);
		  setWrong(0);
		}
	  }, [wordIndex]);
	
	useEffect(() => {
		setGradeLevel(desdWords[gradeIndex].grade);
		setWords(Object.keys(desdWords[gradeIndex].words));
	  }, [gradeIndex]);

	useEffect(() => {
		console.log(`current word: ${words[wordIndex]} word index: ${wordIndex}, grade index: ${gradeIndex}, 
					grade level: ${gradeLevel}, correct: ${correct}, wrong: ${wrong}, 
					total wrong: ${totalWrong}, reading level: ${readingLevel}`);
	  }, [words, wordIndex, gradeIndex, gradeLevel, correct, wrong, totalWrong, readingLevel]);

	useEffect(() => {
		if (countdown > 0) {
			const timer = setTimeout(() => {
				setCountdown(countdown - 1);
			}, 1000);
			return () => clearTimeout(timer);
		} else {
			setButtonActive(true);
		}
	}, [countdown]);

	return (
		<div>
			<h1>Online DESD</h1>
			{isStarted ? (
				buttonActive ? (
					<button onClick={handleNextWord}>Next Word</button>
				) : (
					<p>Next Word will be available in {countdown} seconds</p>
				)
			) : (
				<button onClick={startDecoding}>Start</button>
			)}
			{!buttonActive && isStarted && (
				<>
					<p>Say this word: </p>
					<h2>{currentWord}</h2>
				</>
			)}
		</div>
	);
};


export default Decoding;