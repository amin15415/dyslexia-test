import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Typography, Stack } from '@mui/material';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { convertAndDownloadPDF } from '../utils/pdf-utils';
import TestResultReadingReport from './TestResultReadingReport';
import TestResultSpellingReport from './TestResultSpellingReport';
import TestResultInterpretiveReport from './TestResultInterpretiveReport';


export default function TestResultReports({submissionData}) {

    const [isDownloading, setDownloading] = React.useState(false);

    // const submissionData = sampleSubmissionData; // for test purpose
    const {first_name, last_name} = submissionData;

    // refs for creating the PDF from each report
    const readingTestRef = React.useRef();
    const spellingTestRef = React.useRef();
    const interpretiveTestRef = React.useRef();

    return (
        <Stack sx={{width: "100%"}} justifyContent="center" alignItems="center">
            <Typography variant='h3'>Thank You!</Typography>
            <Typography variant='body1'>You can download the results by clicking on the following button:</Typography>
            <Stack direction="row" >
                <button disabled={isDownloading} onClick={() => convertAndDownloadPDF([readingTestRef, spellingTestRef, interpretiveTestRef], 'Dyslexia Screening Results', first_name + ' ' + last_name , 1060, 1400, setDownloading)}>
                    Download
                </button>
            </Stack>
            <Stack sx={{overflow: 'auto', maxHeight: "300px", maxWidth: "90%", mt: "24px", p: "12px"}} >
                <Stack spacing={4}>
                    <TestResultReadingReport contentRef={readingTestRef} submissionData={submissionData} />
                    <TestResultSpellingReport contentRef={spellingTestRef} submissionData={submissionData} />
                    <TestResultInterpretiveReport contentRef={interpretiveTestRef} submissionData={submissionData}/>
                </Stack>
            </Stack>
        </Stack>
    );
  }


  const sampleSubmissionData = 
  {
      "first_name": "amin",
      "last_name": "omidvar",
      "age": "33",
      "email": "adf@book.com",
      "education": "7th grade or 8th grade",
      "learning_disability": false,
      "last_eye_exam": null,
      "eidetic_correct": 2,
      "phonetic_correct": 4,
      "reading_level": "1",
      "reading_score": 0,
      "test": "ADT",
      "test_words": [
          {
              "level": "1",
              "words": {
                  "father": true,
                  "could": true,
                  "know": true,
                  "money": true,
                  "call": true,
                  "funny": true,
                  "there": true
              }
          },
          {
              "level": "2",
              "words": {
                  "does": false,
                  "listen": false,
                  "city": false,
                  "animal": false,
                  "light": false,
                  "uncle": false,
                  "rolled": true
              }
          },
          {
              "level": "3",
              "words": {
                  "calf": false,
                  "enough": false,
                  "meadow": false,
                  "heavy": false,
                  "business": false,
                  "believe": false,
                  "laugh": false
              }
          },
          {
              "level": "4",
              "words": {
                  "delight": null,
                  "familiar": null,
                  "rough": null,
                  "glisten": null,
                  "league": null,
                  "spectacles": null,
                  "decorate": null
              }
          },
          {
              "level": "5",
              "words": {
                  "cautious": null,
                  "ancient": null,
                  "toughen": null,
                  "height": null,
                  "doubt": null,
                  "position": null,
                  "contagious": null
              }
          },
          {
              "level": "6",
              "words": {
                  "conceited": null,
                  "foreign": null,
                  "knapsack": null,
                  "decisions": null,
                  "allegiance": null,
                  "leisure": null,
                  "deny": null
              }
          },
          {
              "level": "JRH",
              "words": {
                  "dominion": null,
                  "intrigue": null,
                  "aeronautic": null,
                  "trudge": null,
                  "tomorrow": null,
                  "graciously": null,
                  "bridge": null
              }
          },
          {
              "level": "HIS",
              "words": {
                  "pollute": null,
                  "exonerate": null,
                  "risible": null,
                  "regime": null,
                  "endeavor": null,
                  "islet": null,
                  "heinous": null
              }
          },
          {
              "level": "LOD",
              "words": {
                  "parliament": null,
                  "gnostic": null,
                  "mannequin": null,
                  "homologous": null,
                  "prerequisite": null,
                  "rhapsody": null,
                  "euphony": null
              }
          },
          {
              "level": "UPD",
              "words": {
                  "litigious": null,
                  "tincture": null,
                  "oligarchy": null,
                  "inefficacious": null,
                  "demagogue": null,
                  "parturition": null,
                  "mimicry": null
              }
          },
          {
              "level": "MAS",
              "words": {
                  "homeopathy": null,
                  "evanesce": null,
                  "geodesy": null,
                  "coulomb": null,
                  "zoophyte": null,
                  "execrable": null,
                  "triptych": null
              }
          },
          {
              "level": "DOC",
              "words": {
                  "sobriquet": null,
                  "deliquesce": null,
                  "colloquy": null,
                  "vitiate": null,
                  "sycophant": null,
                  "intermezzo": null,
                  "dehiscence": null
              }
          },
          {
              "level": "POD",
              "words": {
                  "exiguous": null,
                  "malapropos": null,
                  "ytterbium": null,
                  "monocotyledon": null,
                  "leitmotif": null,
                  "egregious": null,
                  "legerdemain": null
              }
          }
      ],
      "eidetic_result": {
          "rolled": {
              "correct": false,
              "userInput": "road"
          },
          "father": {
              "correct": true,
              "userInput": "father"
          },
          "could": {
              "correct": false,
              "userInput": "dfioj"
          },
          "know": {
              "correct": false,
              "userInput": "now"
          },
          "money": {
              "correct": false,
              "userInput": "moni"
          },
          "call": {
              "correct": true,
              "userInput": "call"
          },
          "funny": {
              "correct": false,
              "userInput": "fie"
          }
      },
      "phonetic_result": {
          "calf": {
              "correct": true,
              "userInput": "caf"
          },
          "enough": {
              "correct": true,
              "userInput": "enaf"
          },
          "meadow": {
              "correct": false,
              "userInput": "med"
          },
          "heavy": {
              "correct": false,
              "userInput": "haa"
          },
          "business": {
              "correct": false,
              "userInput": "visl"
          },
          "believe": {
              "correct": true,
              "userInput": "biliv"
          },
          "laugh": {
              "correct": true,
              "userInput": "laf"
          }
      }
  }