import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { speechResult } from './speechRecognition';

const Decoding = () => {
  const navigate = useNavigate();

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

  const [counter, setCounter] = useState(0);
  const [levelCounter, setLevelCounter] = useState(0);
  const [currentWord, setCurrentWord] = useState(Object.keys(desdWords)[counter][levelCounter]);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);
  const [gradeLevel, setGradeLevel] = useState('K');

  const nextWord = () => {
    const currentLevel = Object.keys(desdWords)[counter];
    if (speechResult() === currentWord) {
      setCorrect(correct + 1);
      desdWords[currentLevel][currentWord] = true;
    } else {
      desdWords[currentLevel][currentWord] = false;
      setWrong(wrong + 1);
      setTotalWrong(totalWrong + 1);
    }

    setLevelCounter(levelCounter + 1);

    if (correct >= 3) {
      setGradeLevel(Object.keys(desdWords)[counter]);
    }

    if (wrong >= 3 && totalWrong >= 5 && levelCounter >= 5) {
      navigate('/Encoding_Eidetic');
    }

    if (levelCounter >= 5) {
      setCounter(counter + 1);
      setLevelCounter(0);
      setCorrect(0);
      setWrong(0);
    }

    setCurrentWord(desdWords[gradeLevel][Object.keys(desdWords[gradeLevel])[levelCounter]]);

  };

  const start = () => {
    setCounter(0);
    setLevelCounter(0);
    setGradeLevel('K');
    setCurrentWord(desdWords['K'][Object.keys(desdWords['K'])[0]]);
  };

if (currentWord === undefined) {
  return (
    <div>
      <h1>Online DESD</h1>
      <button onClick={start}>Start</button>
    </div>
);}

return (
  <div>
    <h1>Online DESD</h1>
    <button onClick={nextWord}>Next Word</button>
    <p>Say this word: </p>
    <h2>{currentWord}</h2>
    <p>Correct: {correct}</p>
    <p>Wrong: {wrong}</p>
    <p>Total wrong: {totalWrong}</p>
    <p>Grade level: {gradeLevel}</p>
  </div>
);
}
  
export default Decoding;