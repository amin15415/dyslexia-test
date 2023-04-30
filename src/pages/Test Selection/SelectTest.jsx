import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TestWordsContext } from '../../contexts/TestWordContext';
import { importWords } from '../../utils/importDecodingWords';
import './SelectTest.css';

export default function SelectTest() {
  const { setTestWords } = useContext(TestWordsContext);
  const navigate = useNavigate();

  const startDESD = async () => {
    const testWords = await importWords('DESD');
    setTestWords(testWords);
    navigate('/decoding');
  };

  const startADT = async () => {
    const testWords = await importWords('ADT');
    setTestWords(testWords);
    navigate('/decoding');
  };

  return (
    <div className='test-selection-container'>
      <div className="button-container">
        <div>
          <button onClick={startDESD}>Child</button>
        </div>
      </div>
      <div className="button-container">
        <div>
          <button onClick={startADT}>Adult</button>
        </div>
      </div>
    </div>
  );
}
