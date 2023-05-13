import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { adtWords, desdWords } from '../../data/TestWords';
import './SelectTest.css';

export default function SelectTest() {
  const [, setTestWords] = useSessionStorage('testWords', null);
  const [, setTestName] = useSessionStorage('testName', '');
  const navigate = useNavigate();

  const startTest = async (name, words) => {
    sessionStorage.clear();
    setTestName(name);
    setTestWords(words);
    navigate('/decoding');
  };

  return (
    <div className='test-selection-container'>
      <div className="button-container">
        <div>
          <button onClick={() => startTest('DESD', desdWords)}>Child</button>
        </div>
      </div>
      <div className="button-container">
        <div>
          <button onClick={() => startTest('ADT', adtWords)}>Adult</button>
        </div>
      </div>
    </div>
  );
}