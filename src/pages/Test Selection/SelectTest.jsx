import React from 'react'
import { useNavigate } from 'react-router-dom';
import './SelectTest.css'

const SelectTest = () => {

  const navigate = useNavigate();

  const startDESD = () => {
    navigate('/decoding');
  };

  const startADT = () => {
    
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
  )
}

export default SelectTest