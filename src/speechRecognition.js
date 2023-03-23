function speechResult() {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    return new Promise((resolve, reject) => {
      recognition.start();
  
      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript.trim();
        console.log(result);
        resolve(result);
      };
  
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        reject(event.error);
      };
    });
  }
  