export function getEideticWords(gradeIndex, desdWords) {
    const gradeObj = desdWords[gradeIndex];
    const words = gradeObj.words;
    let eideticWords = Object.keys(words).filter((word) => words[word] === true);
  
    while (eideticWords.length < 5 && gradeIndex > 0) {
      gradeIndex--;
      const prevGradeObj = desdWords[gradeIndex];
      const prevGradeWords = prevGradeObj.words;
      const prevTrueWords = Object.keys(prevGradeWords).filter(
        (word) => prevGradeWords[word] === true
      );
      eideticWords = [...eideticWords, ...prevTrueWords];
    }
  
    eideticWords = eideticWords.slice(0, 5);
    const lessThanFiveWordsCorrect = eideticWords.length < 5;
  
    return { eideticWords, lessThanFiveWordsCorrect };
  };


export function getPhoneticWords(gradeIndex, desdWords) {
    const gradeObj = desdWords[gradeIndex];
    const words = gradeObj.words;
    let phoneticWords = Object.keys(words).filter((word) => words[word] === false);
  
    while (phoneticWords.length < 5 && gradeIndex > 0) {
      gradeIndex--;
      const prevGradeObj = desdWords[gradeIndex];
      const prevGradeWords = prevGradeObj.words;
      const prevFalseWords = Object.keys(prevGradeWords).filter(
        (word) => prevGradeWords[word] === false
      );
      phoneticWords = [...phoneticWords, ...prevFalseWords];
    }
  
    phoneticWords = phoneticWords.slice(0, 5);
  
    return { phoneticWords };
  };
