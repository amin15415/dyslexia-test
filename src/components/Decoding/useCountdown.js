import { useState, useEffect } from 'react';

export const useCountdown = ({ initialCountdown }) => {
  const [countdown, setCountdown] = useState(initialCountdown);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return countdown;
};
