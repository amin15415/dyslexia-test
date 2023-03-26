import { useState, useEffect } from 'react';

export const useCountdown = ({ initialCountdown = 3, isActive }) => {
  const [countdown, setCountdown] = useState(initialCountdown);

  useEffect(() => {
    if (isActive) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 0) {
            return prevCountdown - 1;
          } else {
            return prevCountdown;
          }
        });
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isActive]);

  return { countdown, setCountdown };
};
