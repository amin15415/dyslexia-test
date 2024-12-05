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
import logo from '../assets/images/gryfn_logo.png';

const sampleData = [
    {
        "level": "K",
        "words": {
            "baby": true,
            "one": null,
            "boat": null,
            "do": null,
            "car": null
        }
    },
    {
        "level": "1L",
        "words": {
            "was": null,
            "daddy": null,
            "book": null,
            "good": null,
            "doll": null
        }
    },
    {
        "level": "1U",
        "words": {
            "girl": null,
            "apple": null,
            "they": null,
            "story": null,
            "some": null
        }
    },
    {
        "level": "2",
        "words": {
            "above": null,
            "what": null,
            "any": null,
            "busy": null,
            "night": null
        }
    },
    {
        "level": "3",
        "words": {
            "done": null,
            "huge": null,
            "ocean": null,
            "station": null,
            "could": null
        }
    },
    {
        "level": "4",
        "words": {
            "because": null,
            "echo": null,
            "couple": null,
            "eager": null,
            "together": null
        }
    },
    {
        "level": "5",
        "words": {
            "bought": null,
            "delicious": null,
            "neighbor": null,
            "achieve": null,
            "region": null
        }
    },
    {
        "level": "6",
        "words": {
            "malicious": null,
            "bureau": null,
            "similar": null,
            "campaign": null,
            "waltz": null
        }
    },
    {
        "level": "7-8",
        "words": {
            "prairie": null,
            "gadget": null,
            "facsimile": null,
            "emphasize": null,
            "prescription": null
        }
    },
    {
        "level": "9-12",
        "words": {
            "zealous": null,
            "clique": null,
            "atrocious": null,
            "catastrophe": null,
            "liquidate": null
        }
    }
]


export default function TestResultReadingReport({contentRef, submissionData}) {

    const {name, age, education, test_words, reading_level } = submissionData;
    // const [testWords] = useSessionStorage('testWords', '');
    // const [readingLevel] = useSessionStorage('readingLevel', null);

    // const testWords = sampleData;

    const getGradeNumber = (levelName) => {
        if (test_words && test_words.length > 0 ) {
            for (let index in test_words) {
                console.log(index)
                console.log(test_words[index].level)
                if (test_words[index].level == levelName) return (Number(index) + 1);
            }
        }
    }
console.log(test_words)
    return (
        <div ref={contentRef}>
        <Table   sx={{ minWidth: "1000px", border: "solid 1px" }} aria-label="Result Table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={4} align='center'>
                <Stack justifyContent="center" alignItems="center">
                    <div className="logo-text-container">
                        <img src={logo} alt="Logo" className="logo"/>
                        <p className='logo-report-text'>gryfn</p>
                    </div>
                    <Typography variant='h4'>DESD Record Sheet</Typography>
                </Stack>

              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align='left'>Test Taker's Name: {name}</TableCell>
              <TableCell colSpan={2} align='left'>Age: {age}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align='left'>Grade Placement: {education}</TableCell>
              <TableCell colSpan={2} align='left'>Date of Testing: {new Date().toDateString()}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell colSpan={4} align="center"><Typography>Decoding Section</Typography></TableCell>
              </TableRow>
              <TableRow>
                <TableCell> <Box sx={{ padding: "5px", margin: "10px", borderRadius: "12px", bgcolor: "#919191"}}> <Typography textAlign="center">Reading Test</Typography> </Box>  </TableCell>
                { test_words && test_words.length > 0 && test_words.map((wordData, index) => {
                    if (index < 3)
                    return (
                        <TableCell>
                            <ReadTestTable wordsData={wordData} level={index + 1} />
                        </TableCell>
                    )
                })}
              </TableRow>
              <TableRow>
                { test_words && test_words.length > 0 && test_words.map((wordData, index) => {
                    if (index >= 3 && index <= 6)
                    return (
                        <TableCell>
                            <ReadTestTable wordsData={wordData} level={index + 1} />
                        </TableCell>
                    )
                })}
              </TableRow>
              <TableRow>
                { test_words && test_words.length > 0 && test_words.map((wordData, index) => {
                    if (index >= 7 && index <= 10)
                    return (
                        <TableCell>
                            <ReadTestTable wordsData={wordData} level={index + 1} />
                        </TableCell>
                    )
                })}
              </TableRow>
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {/* <TableCell colSpan={1}>{`Reading Raw Score: ${reading_level}`}</TableCell> */}
                <TableCell colSpan={1}>{`DESD Grade Level: ${reading_level}`}</TableCell>
                <TableCell colSpan={1}>{`DESD Grade Number: ${getGradeNumber(reading_level)}`}</TableCell>
              </TableRow>
          </TableBody>
        </Table>
        </div>
    );
  }

  const ReadTestTable = ({wordsData, level}) => {
    const words = wordsData.words;
    const grade  = wordsData.level;

    return (
        <Table>
            <TableHead>
                <TableRow >
                    <TableCell sx={{border: "solid 1px", py: "5px"}}>{`${grade} (${level})`}</TableCell>
                    <TableCell sx={{border: "solid 1px", py: "5px"}} width="20px">Y</TableCell>
                    <TableCell sx={{border: "solid 1px", py: "5px"}} width="20px">N</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                { words && Object.keys(words).length > 0 && Object.keys(words).map((key, index) => (
                    <TableRow>
                        <TableCell sx={{border: "solid 1px", py: "5px"}}>{`${index + 1}. ${key}`}</TableCell>
                        <TableCell sx={{border: "solid 1px", py: "5px"}} width="20px">{words[key] ? "-" : ""}</TableCell>
                        <TableCell sx={{border: "solid 1px", py: "5px"}} width="20px">{words[key] ? "" : "-"}</TableCell>   
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
  }