import React, { createContext, useState } from 'react';

const TestWordsContext = createContext();

const TestWordsProvider = ({ children }) => {
  const [testWords, setTestWords] = useState(null);

  return (
    <TestWordsContext.Provider value={{ testWords, setTestWords }}>
      {children}
    </TestWordsContext.Provider>
  );
};

export { TestWordsContext, TestWordsProvider };
