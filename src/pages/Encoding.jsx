import { useLocation } from 'react-router-dom';

function getCorrectWords(gradeIndex, desdWords) {
  const gradeObj = desdWords[gradeIndex];
  const words = gradeObj.words;
  let correctWords = Object.keys(words).filter((word) => words[word] === true);

  if (correctWords.length < 5 && gradeIndex > 0) {
    const prevGradeObj = desdWords[gradeIndex - 1];
    const prevGradeWords = prevGradeObj.words;
    const prevTrueWords = Object.keys(prevGradeWords).filter(
      (word) => prevGradeWords[word] === true
    );
    correctWords = [...correctWords, ...prevTrueWords].slice(0, 5);
  }

  const lessThanFiveWordsCorrect = correctWords.length < 5;

  return {
    correctWords,
    lessThanFiveWordsCorrect,
  };
}

const Encoding = () => {
  const location = useLocation();
  const desdWords = location.state.desdWords;
  const gradeIndex = location.state.gradeIndex;
  const readingLevel = location.state.readingLevel;

  const { correctWords, lessThanFiveWordsCorrect } = getCorrectWords(
    gradeIndex,
    desdWords
  );

  return (
    <div>
      {lessThanFiveWordsCorrect && gradeIndex !== 0 ? (
        <div>
          <p>
            You got fewer than 5 words correct, so you are reading at a
            Kindergarten level.
          </p>
          <p>
            You did not get enough words correct to proceed with the encoding
            portion of the test.
          </p>
        </div>
      ) : (
        <div>
          <p>
            You got {correctWords.length} words correct. You can proceed to the
            encoding portion of the test.
          </p>
        </div>
      )}
    </div>
  );
}

export default Encoding;