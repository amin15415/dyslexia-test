import { useSessionStorage } from '../hooks/useSessionStorage';

const WelcomePage = ({ onStart }) => {
  const [, setTestStarted] = useSessionStorage('testStarted', false);
  
  const handleStart = () => {
    setTestStarted(true);
    onStart();
    navigate('/next-page');
  };
  
  return (
    <button onClick={handleStart}>Start Test</button>
  );
}; 