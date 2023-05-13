export function getEideticWords(gradeIndex, testWords) {
  let gradeObj = testWords[gradeIndex];
  let words = gradeObj ? gradeObj.words : undefined;
  while (!words && gradeIndex > 0) {
      gradeIndex--;
      gradeObj = testWords[gradeIndex];
      words = gradeObj ? gradeObj.words : undefined;
  }
  
  // If after decrementing gradeIndex to 0 and we still don't have valid words, we should return an error or empty words
  if (!words) return { eideticWords: [], tooFewWordsCorrect: true };

  let eideticWords = Object.keys(words).filter((word) => words[word] === true);
  const testLevelLength = Object.keys(words).length;

  while (eideticWords.length < testLevelLength && gradeIndex >= 0) {
      gradeIndex--;
      const prevGradeObj = testWords[gradeIndex];
      const prevGradeWords = prevGradeObj ? prevGradeObj.words : undefined;
      if (!prevGradeWords) continue;
      const prevTrueWords = Object.keys(prevGradeWords).filter(
          (word) => prevGradeWords[word] === true
      );
      eideticWords = [...eideticWords, ...prevTrueWords];
  }

  eideticWords = eideticWords.slice(0, testLevelLength);
  const tooFewWordsCorrect = eideticWords.length < testLevelLength;

  return { eideticWords, tooFewWordsCorrect };
}


export function getPhoneticWords(gradeIndex, testWords) {
  let gradeObj = testWords[gradeIndex];
  let words = gradeObj ? gradeObj.words : undefined;
  while (!words && gradeIndex > 0) {
      gradeIndex--;
      gradeObj = testWords[gradeIndex];
      words = gradeObj ? gradeObj.words : undefined;
  }
  
  // If after decrementing gradeIndex to 0 and we still don't have valid words, we should return an error or empty words
  if (!words) return { phoneticWords: [] };

  let phoneticWords = Object.keys(words).filter((word) => words[word] === false);
  const testLevelLength = Object.keys(words).length;

  while (phoneticWords.length < testLevelLength && gradeIndex > 0) {
      gradeIndex--;
      const prevGradeObj = testWords[gradeIndex];
      const prevGradeWords = prevGradeObj ? prevGradeObj.words : undefined;
      if (!prevGradeWords) continue;
      const prevFalseWords = Object.keys(prevGradeWords).filter(
          (word) => prevGradeWords[word] === false
      );
      phoneticWords = [...phoneticWords, ...prevFalseWords];
  }

  phoneticWords = phoneticWords.slice(0, testLevelLength);

  return { phoneticWords };
}
