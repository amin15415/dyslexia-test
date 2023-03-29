export function getCorrectWords(gradeIndex, desdWords) {
    const gradeObj = desdWords[gradeIndex];
    const words = gradeObj.words;
    let correctWords = Object.keys(words).filter((word) => words[word] === true);
  
    while (correctWords.length < 5 && gradeIndex > 0) {
      gradeIndex--;
      const prevGradeObj = desdWords[gradeIndex];
      const prevGradeWords = prevGradeObj.words;
      const prevTrueWords = Object.keys(prevGradeWords).filter(
        (word) => prevGradeWords[word] === true
      );
      correctWords = [...correctWords, ...prevTrueWords];
    }
  
    correctWords = correctWords.slice(0, 5);
    const lessThanFiveWordsCorrect = correctWords.length < 5;
  
    return { correctWords, lessThanFiveWordsCorrect };
  };


export function getWrongWords(gradeIndex, desdWords) {
    const gradeObj = desdWords[gradeIndex];
    const words = gradeObj.words;
    let correctWords = Object.keys(words).filter((word) => words[word] === true);
  
    while (correctWords.length < 5 && gradeIndex > 0) {
      gradeIndex--;
      const prevGradeObj = desdWords[gradeIndex];
      const prevGradeWords = prevGradeObj.words;
      const prevTrueWords = Object.keys(prevGradeWords).filter(
        (word) => prevGradeWords[word] === true
      );
      correctWords = [...correctWords, ...prevTrueWords];
    }
  
    correctWords = correctWords.slice(0, 5);
    const lessThanFiveWordsCorrect = correctWords.length < 5;
  
    return { correctWords, lessThanFiveWordsCorrect };
  };
