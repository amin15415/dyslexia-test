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


export default function TestResultReports({submissionData}) {

    // refs for creating the PDF from each report
    const readingTestRef = React.useRef();
    const spellingTestRef = React.useRef();

    const testResultRef = React.useRef();


    return (
        <Stack sx={{width: "100%"}} justifyContent="center" alignItems="center">
            <Typography variant='h3'>Thank You!</Typography>
            <Typography variant='body1'>You can download the results by clicking on the following button:</Typography>
            <Stack direction="row" >
                {/* <button  onClick={() => convertAndDownloadPDF(readingTestRef, 'Reading Test', "Amin Omidvar", [297,300])}>Reading Result</button>
                <button  onClick={() => convertAndDownloadPDF(spellingTestRef, 'Spelling Test', "Amin Omidvar", [297,180])}>Spelling Result</button> */}
                <button onClick={() => convertAndDownloadPDF(testResultRef, 'Spelling Test', "Amin Omidvar", [297,550])}>Test Result</button>
            </Stack>
            <Stack sx={{overflow: 'auto', maxHeight: "300px", maxWidth: "90%", mt: "24px", p: "12px"}} >
                <Stack spacing={4} ref={testResultRef}>
                    <TestResultReadingReport contentRef={readingTestRef} submissionData={submissionData} />
                    <TestResultSpellingReport contentRef={spellingTestRef} submissionData={submissionData} />
                </Stack>
            </Stack>
        </Stack>
    );
  }
