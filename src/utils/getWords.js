export function getEideticWords(gradeIndex, testWords) {
    const gradeObj = testWords[gradeIndex];
    const words = gradeObj.words;
    let eideticWords = Object.keys(words).filter((word) => words[word] === true);
    const testLevelLength = Object.keys(words).length;

    while (eideticWords.length < testLevelLength && gradeIndex >= 0) {
      gradeIndex--;
      const prevGradeObj = testWords[gradeIndex];
      const prevGradeWords = prevGradeObj.words;
      const prevTrueWords = Object.keys(prevGradeWords).filter(
        (word) => prevGradeWords[word] === true
      );
      eideticWords = [...eideticWords, ...prevTrueWords];
    }
  
    eideticWords = eideticWords.slice(0, testLevelLength);
    const tooFewWordsCorrect = eideticWords.length < testLevelLength;
  
    return { eideticWords, tooFewWordsCorrect };
  };


export function getPhoneticWords(gradeIndex, testWords) {
    const gradeObj = testWords[gradeIndex];
    const words = gradeObj.words;
    let phoneticWords = Object.keys(words).filter((word) => words[word] === false);
    const testLevelLength = Object.keys(words).length;

  
    while (phoneticWords.length < testLevelLength && gradeIndex > 0) {
      gradeIndex--;
      const prevGradeObj = testWords[gradeIndex];
      const prevGradeWords = prevGradeObj.words;
      const prevFalseWords = Object.keys(prevGradeWords).filter(
        (word) => prevGradeWords[word] === false
      );
      phoneticWords = [...phoneticWords, ...prevFalseWords];
    }
  
    phoneticWords = phoneticWords.slice(0, testLevelLength);
  
    return { phoneticWords };
  };
