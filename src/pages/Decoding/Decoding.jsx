import React from 'react'
import DESD from './DESD'
import ADT from './ADT'
import { useLocation } from 'react-router-dom';

const Decoding = () => {
  const location = useLocation();
  const test = location.state.test
  return (
    test === 'DESD' ? <DESD /> : <ADT />
  )
}

export default Decoding