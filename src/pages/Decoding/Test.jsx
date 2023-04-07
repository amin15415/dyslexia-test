import React, { useState, useEffect, useCallback } from 'react';
import './Decoding.css'

export const Test = () => {
    const [isRecording, setIsRecording] = useState(false);

    const startDecoding = () => {
        setIsRecording(!isRecording);
    }

  return (
    <div className="centered-content">
      <div className="decoding-content">
            <div>
                <button onClick={startDecoding}>{isRecording ? 'Stop' : 'Start'}</button>
            </div>
        </div>
    </div>
  )
}
export default Test