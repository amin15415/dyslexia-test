import React from 'react'
import { useLocation } from 'react-router-dom';
import './Results.css'

const Results = () => {
  const location = useLocation();
  return (
    <div className='results-container'>
        <div>
            <p>Reading Level: {location.state.readingLevel}</p>
            <p>Eidetic Correct: {location.state.eideticCorrect}</p>
            <p>Phonetic Correct: {location.state.phoneticCorrect}</p>
        </div>
    </div>  
  )
}

export default Results