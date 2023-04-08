import { useState, useEffect } from 'react';

const useCountdown = (interval = 1000) => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    if (count === null) {
      return;
    }

    const timer = setInterval(() => {
      setCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    }, interval);

    return () => clearInterval(timer);
  }, [count, interval]);

  const startCountdown = (initialValue) => {
    setCount(initialValue);
  };

  return [count, startCountdown];
};

export default useCountdown;
