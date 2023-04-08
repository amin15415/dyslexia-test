import { useState, useCallback } from 'react';

export const useDecodingLogic = (desdWords) => {
  const [currentGradeIndex, setCurrentGradeIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [totalWrongCount, setTotalWrongCount] = useState(0);

  const advanceWord = useCallback((isCorrect) => {
    const updatedCorrect = isCorrect ? correctCount + 1 : correctCount;
    const updatedWrong = !isCorrect ? wrongCount + 1 : wrongCount;
    const updatedTotalWrong = !isCorrect ? totalWrongCount + 1 : totalWrongCount;

    setCorrectCount(updatedCorrect);
    setWrongCount(updatedWrong);
    setTotalWrongCount(updatedTotalWrong);
  }, [correctCount, wrongCount, totalWrongCount]);

  const advanceGrade = useCallback(() => {
    setCurrentGradeIndex((prevIndex) => prevIndex + 1);
    setCorrectCount(0);
    setWrongCount(0);
  }, []);

  const updateDesdWords = useCallback((isCorrect, wordIndex) => {
    desdWords[currentGradeIndex].words[wordIndex] = isCorrect;
  }, [currentGradeIndex]);

  return {
    currentGradeIndex,
    correctCount,
    wrongCount,
    totalWrongCount,
    advanceWord,
    advanceGrade,
    updateDesdWords,
  };
};