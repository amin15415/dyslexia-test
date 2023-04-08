import { useState, useEffect } from 'react';
import { desdWords } from '../data/data';

const useDecodingLogic = () => {
  const [gradeIndex, setGradeIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);
  const [incorrectWordsInGrade, setIncorrectWordsInGrade] = useState(0);
  const [currentWord, setCurrentWord] = useState(desdWords[gradeIndex].words[Object.keys(desdWords[gradeIndex].words)[wordIndex]]);
  const [stop, setStop] = useState(false);
  const [readingLevel, setReadingLevel] = useState(desdWords[gradeIndex].grade);
  const [correctWordsInGrade, setCorrectWordsInGrade] = useState(0);


  useEffect(() => {
    setCurrentWord(Object.keys(desdWords[gradeIndex].words)[wordIndex]);
  }, [gradeIndex, wordIndex]);

  useEffect(() => {
    console.log('Reading Level:', readingLevel);
    console.log('Grade Index:', gradeIndex);
    console.log('Word Index:', wordIndex);
    console.log('Incorrect Words:', incorrectWords);
    console.log('Incorrect Words In Grade:', incorrectWordsInGrade);
    console.log('Correct Words In Grade:', correctWordsInGrade);
    console.log('Current Word:', currentWord);
    console.log('Stop:', stop);
  }, [readingLevel, gradeIndex, wordIndex, incorrectWords, incorrectWordsInGrade, currentWord, stop, correctWordsInGrade]);

  const updateResults = (speechResult, initial = false) => {
    if (stop) return;
  
    if (initial) {
      return;
    } else {
      const correct = speechResult.toLowerCase() === currentWord.toLowerCase();
      console.log(speechResult);
      const updatedWords = { ...desdWords[gradeIndex].words, [currentWord]: correct };
  
      desdWords[gradeIndex].words = updatedWords;

      if (correct) {
        setCorrectWordsInGrade(correctWordsInGrade + 1);
      } else {
        setIncorrectWords(incorrectWords + 1);
        setIncorrectWordsInGrade(incorrectWordsInGrade + 1);
      }

      if (correctWordsInGrade === 3) {
        setReadingLevel(desdWords[gradeIndex].grade);
        setCorrectWordsInGrade(0);
      }
  
      if (!correct) {
        setIncorrectWords(incorrectWords + 1);
        setIncorrectWordsInGrade(incorrectWordsInGrade + 1);
      }
    }
    
    if (incorrectWordsInGrade >= 3 && incorrectWords >= 5 && wordIndex === Object.keys(desdWords[gradeIndex].words).length - 1) {
      setStop(true);
    }

    if (wordIndex < Object.keys(desdWords[gradeIndex].words).length - 1) {
      setWordIndex(wordIndex + 1);
    } else {
      setGradeIndex(gradeIndex + 1);
      setWordIndex(0);
      setIncorrectWordsInGrade(0);
      setCorrectWordsInGrade(0);
    }
  };

  return {
    readingLevel,
    gradeIndex,
    desdWords,
    currentWord,
    stop,
    updateResults,
  };
};

export default useDecodingLogic;
