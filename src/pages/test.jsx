import React from "react";
import convertNumberToWords from '../utils/numToWord';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';


export default function Welcome() {



  const speechRecognition = useSpeechRecognition();


  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  var SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
  var SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent
  
  var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
  
  var recognition = new SpeechRecognition();
  if (SpeechGrammarList) {
    // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
    // This code is provided as a demonstration of possible capability. You may choose not to use it.
    var speechRecognitionList = new SpeechGrammarList();
    var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
  }
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  
  // var diagnostic = document.querySelector('.output');
  // var bg = document.querySelector('html');
  // var hints = document.querySelector('.hints');
  
  // var colorHTML= '';
  // colors.forEach(function(v, i, a){
  //   console.log(v, i);
  //   colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
  // });
  // hints.innerHTML = 'Tap/click then say a color to change the background color of the app. Try ' + colorHTML + '.';
  let speechResult;

  const handleClick = async function() {
    // recognition.start();
    const speechRecognitionPromise = speechRecognition.recognizeSpeech();
    const [speechReturn] = await Promise.all([speechRecognitionPromise]);

    speechResult = convertNumberToWords(speechReturn).toLowerCase();
    console.log('Speech result:', speechResult);
    // speechRecognition.stopSpeechRecognition();
    console.log('Ready to receive a color command.');
  }

  const handleClick1 = async function() {
    recognition.start();
    console.log('Ready to receive a color command.');
  }
  
 
  
  recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at the last position.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    var color = event.results[0][0].transcript;
    console.log('Result received: ' + color + '.');
    // bg.style.backgroundColor = color;
    console.log('Confidence: ' + event.results[0][0].confidence);
  }
  
  recognition.onspeechend = function() {
    recognition.stop();
  }
  
  recognition.onnomatch = function(event) {
    console.log( "I didn't recognise that color.");
  }
  
  recognition.onerror = function(event) {
    console.log( 'Error occurred in recognition: ' + event.error);
  }
  

  return (
    <div>
      <div className="welcome-container">
        <div className="text-container">
          <div className="text-content">
            <h1 className="banner-h1">Online Dyslexia Test</h1>
            <p className="banner-p">
              test speech
            </p>
            <button onClick={handleClick}>Begin Test</button>
            <button >similar</button>

          </div>
        </div>
        <div className="banner-section"></div>
      </div>
      <div className="test-info">
        <div className="test-info-header">What You Will Get</div>

      </div>
    </div>
  );
}
