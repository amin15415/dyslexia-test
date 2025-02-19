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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';


// const eideticResults = {
//     "car": {
//         "correct": true,
//         "userInput": "car"
//     }
// }

// const phoneticResults = {
//     "was": {
//         "correct": false,
//         "userInput": "big"
//     },
//     "daddy": {
//         "correct": true,
//         "userInput": "daddy"
//     },
//     "book": {
//         "correct": false,
//         "userInput": "cook"
//     },
//     "good": {
//         "correct": false,
//         "userInput": "bad"
//     },
//     "doll": {
//         "correct": false,
//         "userInput": "jar"
//     }
// }
// const eideticCorrect = 1;
// const phoneticCorrect = 2;

export default function TestResultSpellingReport({contentRef, submissionData}) {


    const {first_name, last_name, age, education, eidetic_result, phonetic_correct, eidetic_correct, phonetic_result } = submissionData;

    // const [eideticResults] = useSessionStorage('eideticResults', null);
    // const [phoneticResults] = useSessionStorage('phoneticResults', null);
    // const [eideticCorrect] = useSessionStorage('eideticCorrect', '');
    // const [phoneticCorrect] = useSessionStorage('phoneticCorrect', '');

   
    const getResultRate = (resultSet, correctNums) => {
        if (resultSet && Object.keys(resultSet).length > 0 ) {
            const theSize = Object.keys(resultSet).length;
            return Math.round(correctNums / theSize * 10000) / 100  ;
        }
        return 0;
    }


    return (
        <div ref={contentRef} className="page">

        <Table sx={{ minWidth: "1000px", border: "solid 1px" }} aria-label="Result Table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={4} align='center'>
                <Stack justifyContent="center" alignItems="center">
                    <div className="logo-text-container">
                        <img src={logo} alt="Logo" className="logo"/>
                        <p className='logo-report-text'>gryfn</p>
                    </div>
                    <Typography variant='h4'>DESD Spelling Response Form</Typography>
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align='left'>Test Taker's Name: {first_name + ' ' + last_name}</TableCell>
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
                <TableCell colSpan={2} sx={{verticalAlign: "top"}}>
                    <ReadTestTable  header={"Sight-Word Spelling"} wordsData={eidetic_result}/>
                </TableCell>  
                <TableCell colSpan={2} sx={{verticalAlign: "top"}}>
                    <ReadTestTable  header={"Phonetic Spelling"} wordsData={phonetic_result}/>
                </TableCell>
              </TableRow>


              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell colSpan={2} align='center'>{`Raw Score: ${getResultRate(eidetic_result, eidetic_correct)}%`}</TableCell>
                <TableCell colSpan={2} align='center'>{`Raw Score: ${getResultRate(phonetic_result, phonetic_correct)}%`}</TableCell>

              </TableRow>
          </TableBody>
        </Table>
        </div>
    );
  }

  const ReadTestTable = ({header, wordsData}) => {

    return (
        <Table>
            <TableHead>
                <TableRow >
                    <TableCell align="center"><Typography>{header}</Typography></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                { wordsData && Object.keys(wordsData).length > 0 && Object.keys(wordsData).map((key, index) => (
                    <TableRow key={index}>
                        <TableCell sx={{border: "solid 1px", py: "5px"}}>
                          <Stack direction="row" sx={{width: "100%"}} justifyContent="space-between">
                            <Typography>{`${index + 1}. ${key} - ${wordsData[key].userInput}`}</Typography>
                            {wordsData[key].correct ?<CheckCircleOutlineIcon /> : <HighlightOffIcon />}
                          </Stack>
                          
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
  }