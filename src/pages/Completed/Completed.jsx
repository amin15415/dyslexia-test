import React from 'react'
import './Completed.css'

const Completed = () => {
  return (
    <div className='centered-content'>
        <div className='text-container'>
            <h1>You have successfully completed the reading portion of the test!</h1>
            <p>Our results indicate that you are a competent reader. If you are
                still experiencing difficulties with reading and/or spelling in your
                daily life you should consider consulting with a physician, or other
                reading/vision specialist.
            </p>
        </div>
    </div>
  );
};

export default Completed