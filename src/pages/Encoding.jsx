import { useLocation } from 'react-router-dom';

const Encoding = () => {
    const location = useLocation();
    const desdWords = location.state.desdWords;


    return (
            <div>
              {desdWords.map((wordObj, index) => (
                <div key={index}>
                  <h2>{wordObj.grade}</h2>
                  <ul>
                    {Object.entries(wordObj.words).map(([word, value], index) => (
                      <li key={index}>
                        {word} - {wordObj.grade} ({value !== null ? 'changed' : 'not changed'})
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );
        };

export default Encoding;