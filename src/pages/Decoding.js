import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Decoding = () => {
	const navigate = useNavigate();
	const [wordIndex, setWordIndex] = useState(0);
	const [levelIndex, setLevelIndex] = useState(0);
	const [gradeIndex, setGradeIndex] = useState(0);
	const [gradeLevel, setGradeLevel] = useState('K');
	const [buttonActive, setButtonActive] = useState(true);
	const [countdown, setCountdown] = useState(0);
	
	const desdWords = {
		'K': { 'baby': null, 'one': null, 'boat': null, 'do': null, 'car': null },
		'1L': { 'was': null, 'daddy': null, 'book': null, 'good': null, 'doll': null },
		'1U': { 'girl': null, 'apple': null, 'they': null, 'story': null, 'some': null },
		'2': { 'above': null, 'what': null, 'any': null, 'busy': null, 'night': null },
		'3': { 'done': null, 'huge': null, 'ocean': null, 'station': null, 'could': null },
		'4': { 'because': null, 'echo': null, 'couple': null, 'eager': null, 'together': null },
		'5': { 'bought': null, 'delicious': null, 'neighbor': null, 'achieve': null, 'region': null },
		'6': { 'malicious': null, 'bureau': null, 'similar': null, 'campaign': null, 'waltz': null },
		'7-8': { 'prairie': null, 'gadget': null, 'facsimile': null, 'emphasize': null, 'prescription': null },
		'9-12': { 'zealous': null, 'clique': null, 'atrocious': null, 'catastrophe': null, 'liquidate': null }
	};
	
	const currentWord = Object.keys(desdWords[gradeLevel])[wordIndex];
	const [correct, setCorrect] = useState(0);
	const [wrong, setWrong] = useState(0);
	const [totalWrong, setTotalWrong] = useState(0);

	const handleNextWord = () => {
		
		setButtonActive(false);
		setCountdown(4);

		if (currentWord == currentWord) {
			setCorrect(correct + 1);
			Object.keys(desdWords[gradeLevel])[currentWord] = true;
		}
		else {
      setWrong(wrong + 1);
			setTotalWrong(totalWrong + 1);
      Object.keys(desdWords[gradeLevel])[currentWord] = false;
    }

		setLevelIndex(levelIndex + 1);

		if (correct >= 3) {
			setGradeIndex(gradeIndex + 1);
		}

		if (wrong >= 3 && totalWrong >= 5 && levelIndex >= 5)  {
			setTimeout(() => {
				navigate('/encoding'); // route to the Encoding page after 1 second
			}, 1000);
		}
	};

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
			{buttonActive ? (
				<button onClick={handleNextWord}>Next Word</button>
			) : (
				<p>Next Word will be available in {countdown} seconds</p>
			)}
			<p>Say this word: </p>
			<h2>{currentWord}</h2>
			<p>Correct: {correct}</p>
			<p>Wrong: {wrong}</p>
			<p>Total wrong: {totalWrong}</p>
			<p>Grade level: {gradeLevel}</p>
		</div>
	);
};

export default Decoding;