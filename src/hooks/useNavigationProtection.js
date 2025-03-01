import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSessionStorage } from './useSessionStorage';

/**
 * Hook to prevent page refreshes and handle unauthorized navigation
 * @param {boolean} isProtected - Whether to enable protection for this page
 * @param {string} redirectPath - Path to redirect to if accessed directly (default: '/')
 */
export const useNavigationProtection = (isProtected = true, redirectPath = '/') => {
  const navigate = useNavigate();
  const location = useLocation();
  const [testStarted] = useSessionStorage('testStarted', false);
  const [testWords] = useSessionStorage('testWords', null);
  const [levelIndex] = useSessionStorage('levelIndex', null);
  const [wordIndex] = useSessionStorage('wordIndex', null);
  const [eideticResults] = useSessionStorage('eideticResults', null);
  const [phoneticResults] = useSessionStorage('phoneticResults', null);
  
  useEffect(() => {
    // Define the test sequence and requirements
    const testSequence = {
      '/decoding': { requires: ['testWords'] },
      '/eidetic': { requires: ['testWords', 'levelIndex'] },
      '/phonetic': { requires: ['testWords', 'eideticResults'] },
      '/survey': { requires: ['testWords', 'eideticResults', 'phoneticResults'] },
      '/completed': { requires: ['testWords', 'eideticResults', 'phoneticResults'] }
    };
    
    // Check if this is a protected page that requires test data
    const isTestPage = Object.keys(testSequence).includes(location.pathname);
    
    if (isProtected && isTestPage) {
      // First check if test has started at all
      if (!testStarted || !testWords) {
        navigate(redirectPath, { replace: true });
        return;
      }
      
      // Then check if user is trying to skip ahead in the sequence
      const requiredData = testSequence[location.pathname]?.requires || [];
      const hasRequiredData = requiredData.every(item => {
        switch(item) {
          case 'testWords': return !!testWords;
          case 'levelIndex': return levelIndex !== null;
          case 'wordIndex': return wordIndex !== null;
          case 'eideticResults': return !!eideticResults;
          case 'phoneticResults': return !!phoneticResults;
          default: return false;
        }
      });
      
      if (!hasRequiredData) {
        // Determine where to redirect based on test progress
        let redirectTo = '/decoding';
        
        if (!testWords) {
          redirectTo = '/';
        } else if (testWords && !eideticResults) {
          redirectTo = '/decoding';
        } else if (testWords && eideticResults && !phoneticResults) {
          redirectTo = '/eidetic';
        } else if (testWords && eideticResults && phoneticResults) {
          redirectTo = '/phonetic';
        }
        
        console.log(`Redirecting from ${location.pathname} to ${redirectTo} due to missing required data`);
        navigate(redirectTo, { replace: true });
        return;
      }
    }

    if (!isProtected) return;

    // Handle page refresh attempts
    const handleBeforeUnload = (e) => {
      const message = 'Refreshing or leaving this page will reset your test progress. Are you sure?';
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    // Handle back/forward navigation
    const handlePopState = (e) => {
      // Cancel the navigation and stay on the current page
      window.history.pushState(null, '', window.location.pathname);
      
      // Optionally show a message to the user
      alert('Please use the test navigation buttons instead of browser controls.');
    };

    // Push a new history state to prevent going back
    window.history.pushState(null, '', window.location.pathname);

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isProtected, navigate, redirectPath, testStarted, location.pathname, testWords, levelIndex, wordIndex, eideticResults, phoneticResults]);
}; 