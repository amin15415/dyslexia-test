import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getCorrectWords } from '../../utils/getWords';

const Encoding = () => {
  const location = useLocation();
  const desdWords = location.state.desdWords;
  const gradeIndex = location.state.gradeIndex;

  const { correctWords, lessThanFiveWordsCorrect } = getCorrectWords(
    gradeIndex,
    desdWords
  );

  const audioPaths = correctWords.map((word) => `../../assets/audio/${word}.mp3`);

  useEffect(() => {
    console.log(audioPaths);
  }, [audioPaths]);

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
          {audioPaths.map((audioPath, index) => (
            <div key={index}>
              <audio src={audioPath} controls />
              <input type="text" placeholder="Enter spelling" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Encoding;