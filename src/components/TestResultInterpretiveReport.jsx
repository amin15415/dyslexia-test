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
import LessEqualSign from '../assets/images/less-equal-sign';
import GreatEqualSign from '../assets/images/greater-equal-sign';
import {readingScorePercentileList} from '../data/readingScorePercentileList';



const percentiles = [
    {text: "100%", value: 100, pivotPoint: 1}, 
    {text: "80%", value: 80, pivotPoint: 2}, 
    {text: "60%", value: 60, pivotPoint: 3}, 
    {text: "40%", value: 40, pivotPoint: 4},
    {text: "20%", value: 20, pivotPoint: 5}, 
    {text: "0%", value: 0, pivotPoint: 6}];
const differences = [1,2,3,4,5,6,7];

const differenceEstimatedRanges = [
    [null, null, 100, 86, 71, 57, 43, 29],
    [null, 100, 86, 71, 57, 43, 29, 14],
    [100,86,71,57,43,29,14,0],
    [86,71,57,43,29,14,0, null],
    [71,57,43,29,14,0,null,null],
    [57,43,29,14,0,null,null,null],
    [43,29,14,0,null,null,null,null]
  ];

const rankOfSeverities = ["Above Normal", "Normal", "Borderline-Normal", "Mild Severity", "Mild-Moderate", "Moderate", "Moderate-Mark", "Marked Severity"];


function roundPercentage(value, thresholds) {
    // const thresholds = [0, 20, 40, 60, 80, 100];
    let nearest = thresholds[0];
    let minDiff = Math.abs(value - nearest);

    for (let i = 1; i < thresholds.length; i++) {
        const diff = Math.abs(value - thresholds[i]);
        if (diff <= minDiff) {
            minDiff = diff;
            nearest = thresholds[i];
        }
    }

    return nearest;
}

function getDiffTextAndColor(diff, pivotPoint) {
    let theText = "XXXX";
    let backColor = "$FFFFFF";
    
    const pivotDifference = diff - pivotPoint;
    if (pivotDifference == -1) {theText = "Mildly Below"; backColor = "#b8b5b5"}
    if (pivotDifference == -2) {theText = "Moderately Below"; backColor = "#b8b5b5"}
    if (pivotDifference < -2) {theText = "Markably Below"; backColor = "#b8b5b5"}
    if (pivotDifference == 0) {theText = "Borderline"; backColor = "#d5d5d5"}
    if (pivotDifference == 1) theText = "Normal";
    if (pivotDifference > 1) theText = "Above Normal";
    return {text: theText, color: backColor};
}

export default function TestResultInterpretiveReport({submissionData}) {

    const {name, age, education, test_words, reading_level, eidetic_result, phonetic_correct, eidetic_correct, phonetic_result, test } = submissionData;

    const getGradeNumber = (levelName) => {
        if (test_words && test_words.length > 0 ) {
            for (let index in test_words) {
                if (test_words[index].level == levelName) return (Number(index) + 1);
            }
        }
    }

    const getChildAnalysisOutcomeWord = (gradeDifference, sightWordPercentile, phoneticPercentile) => {
        let sightWordAnalysis = null;
        let phoneticAnalysis = null;
        percentiles.map((part, index) => {
            differences.map((diff, index) => {
                    // the default text of this cell
                    const {text: theText, color :backColor} = getDiffTextAndColor(diff, part.pivotPoint);
             
                    // Check if the difference matches with our grade difference
                    if ( (diff == 1 && gradeDifference <= -3) || 
                        ( (diff - 4) == gradeDifference) || 
                        (diff == 7 && gradeDifference >= 3) ) {
                        // Now check for percentage of sight-word
                        if (roundPercentage(sightWordPercentile, [0, 20, 40, 60, 80, 100]) == part.value) sightWordAnalysis = theText;
                        if (roundPercentage(phoneticPercentile, [0, 20, 40, 60, 80, 100]) == part.value) phoneticAnalysis = theText;
                    }
            })
        })
        return {sightWordAnalysis, phoneticAnalysis};
    }

    const getAdultAnalysisOutcomeWord = (gradeDifference, sightWordPercentile, phoneticPercentile) => {
        let sightWordAnalysis = null;
        let phoneticAnalysis = null;

        
        // first we should find the index
        let gradeIndex = -1;
        if (gradeDifference <= -6) gradeIndex = 0;
        if (gradeDifference == -5 || gradeDifference == -4) gradeIndex = 1;
        if (gradeDifference == -3 || gradeDifference == -2) gradeIndex = 2;
        if (gradeDifference == -1) gradeIndex = 3;
        if (gradeDifference == 0) gradeIndex = 4;
        if (gradeDifference == 1) gradeIndex = 5;
        if (gradeDifference >= 2) gradeIndex = 6;

        // now get the percentages
        if (gradeIndex < 0 || gradeIndex > 6) throw "Error in calculating the analysis indices";
        const rangesArray = differenceEstimatedRanges[gradeIndex];

        // now search for the index of the Severity
        let sightSeverityIndex = -1;
        let phoneticSeverityIndex = -1;
        const sightWordPercentileRound = roundPercentage(sightWordPercentile, rangesArray);
        const phoneticPercentileRound = roundPercentage(phoneticPercentile, rangesArray);

        for (let index in rangesArray) {
            if (rangesArray[index] == sightWordPercentileRound) sightSeverityIndex = index;
            if (rangesArray[index] == phoneticPercentileRound) phoneticSeverityIndex = index;
        }

        sightWordAnalysis = rankOfSeverities[sightSeverityIndex];
        phoneticAnalysis = rankOfSeverities[phoneticSeverityIndex];

        return {sightWordAnalysis, phoneticAnalysis};
    }

    const calculateReadingScore = (testWords) => {
        let theScore = 0;
        if (testWords && testWords.length > 0 ) {
            for (let index in testWords) {

                if (testWords[index].words && Object.keys(testWords[index].words).length > 0)
                    for (let index2 in testWords[index].words) {
                        if (testWords[index].words[index2]) 
                            theScore = theScore + 1;
                    }
                
            }
        }
        return theScore;
    }

    const getEducationNumber = (education) => {
        const educationLevels = {
            'Kindergarten': 0 ,
            '1st grade': 1,
            '2nd grade': 2,
            '3rd grade': 3,
            '4th grade': 4,
            '5th grade': 5,
            '6th grade': 6,
            '7th grade or 8th grade': 7,
            'High School': 8,
            'College': 9,
            'Graduate School' : 10,
            'Doctorate' : 11,
            'Post-Doctorate': 12
        };
        
        if (educationLevels[education]) return educationLevels[education];
        else return 0;
    }

    const getResultRate = (resultSet, correctNums) => {
        if (resultSet && Object.keys(resultSet).length > 0 ) {
            const theSize = Object.keys(resultSet).length;
            return Math.round(correctNums / theSize * 10000) / 100  ;
        }
        return 0;
    }

    const getReadingScorePercentile = (rawScore, gradeNumber) => {
        const rawScoreText = rawScore.toString();
        const gradeNumberText = gradeNumber.toString();
        let result = -1;
        if (gradeNumber <= 8 && readingScorePercentileList[gradeNumberText] && readingScorePercentileList[gradeNumberText][rawScoreText])
            result = readingScorePercentileList[gradeNumberText][rawScoreText].percentile;

        return result;
    }

    const reading_score = calculateReadingScore(test_words);
    const gradeNumber = getGradeNumber(reading_level);
    const educationNumber = getEducationNumber(education);
    const sightWordPercentile = getResultRate(eidetic_result, eidetic_correct);
    const phoneticPercentile = getResultRate(phonetic_result, phonetic_correct);
    const gradeDifference = gradeNumber - educationNumber;
    const readingScorePercentile = getReadingScorePercentile(reading_score, educationNumber);
    const {sightWordAnalysis, phoneticAnalysis} = 
        test == "ADT" 
            ? getAdultAnalysisOutcomeWord(gradeDifference, sightWordPercentile, phoneticPercentile)
            : getChildAnalysisOutcomeWord(gradeDifference, sightWordPercentile, phoneticPercentile);

    return (
        <div>
        <Table   sx={{ minWidth: "1000px", border: "solid 1px" }} aria-label="Result Interpretive Table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={4} align='center'>
                <Stack justifyContent="center" alignItems="center">
                    <div className="logo-text-container">
                        <img src={logo} alt="Logo" className="logo"/>
                        <p className='logo-report-text'>gryfn</p>
                    </div>
                    <Typography variant='h4'>Interpretive Summary</Typography>
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
                <TableCell colSpan={4} align="center">
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{border: "unset"}} colSpan={2} align='center'><Typography sx={{fontWeight: 800}}>Raw Scores</Typography></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{border: "unset"}}>
                                    <Stack>
                                        <Typography sx={{fontWeight: 600}}>Decoding Section</Typography>
                                        <Typography>{`Reading Raw Score: ${reading_score}`}</Typography>
                                        <Typography>{`DESD Grade Level: ${reading_level ? reading_level : "Not Available"}`}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell sx={{border: "unset", border: "unset"}}>
                                    <Stack>
                                        <Typography sx={{fontWeight: 600}}>Encoding Section</Typography>
                                        <Typography>{`Sight-Word Spelling Raw Score: ${sightWordPercentile}%`}</Typography>
                                        <Typography>{`Phonetic Spelling Raw Score: ${phoneticPercentile}%`}</Typography>
                                    </Stack>
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell sx={{bgcolor: "#909090"}}>
                                    <Stack>
                                        <Typography>{`DESD Grade Number: ${gradeNumber}`}</Typography>
                                        <Typography>{`Actual Grade Placement: ${educationNumber}`}</Typography>
                                        <Typography>{`Difference (D): ${gradeDifference}`}</Typography>
                                        <Typography>(D = DESD Grade Number - Actual Grade Placement)</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell sx={{border: "unset"}}></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    
                </TableCell>
              </TableRow>
              

              <TableRow>
                <TableCell colSpan={4}>
                    <Stack alignItems="center" sx={{width: "100%"}} spacing={2}>
                        <Typography sx={{fontWeight: 800}}>Reading Standard Score</Typography>
                        <Stack direction="row" sx={{width: "100%"}} spacing={8}>
                            <Typography>{`Reading Standard Score: ${reading_score}`}</Typography>
                            <Typography>{readingScorePercentile > -1 ? `%ile Rank: ${readingScorePercentile}%` : "Not Applicable"}</Typography>
                        </Stack>
                    </Stack>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={4}>
                    <Stack  alignItems="center" sx={{width: "100%"}} spacing={2}>
                        <Typography sx={{fontWeight: 800}}>Word Analysis Skills</Typography>
                        <Stack sx={{width: "100%"}} spacing={2}>
                            { test == "ADT" &&
                                <AdultTestTable 
                                    sightWordAnalysis={sightWordAnalysis} 
                                    phoneticAnalysis={phoneticAnalysis} 
                                />
                            }
                            { test == "DESD" &&
                                <ChildTestTable 
                                    gradeDifference={gradeDifference} 
                                    sightWordPercentile={sightWordPercentile} 
                                    phoneticPercentile ={phoneticPercentile}
                                />
                            }

                            <Stack direction="row" spacing={2}>
                                <Typography>{`Sight-Word Analysis Skills: `}</Typography>
                                <Typography sx={{color: "#04f100"}}>{sightWordAnalysis ? sightWordAnalysis : "Not Recognized"}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <Typography>{`Phonetic Analysis Skills: `}</Typography>
                                <Typography sx={{color: "#002cf1"}}>{phoneticAnalysis? phoneticAnalysis : "Not Recognized"}</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </TableCell>
              </TableRow>


          </TableBody>
        </Table>
        </div>
    );
  }



  const ChildTestTable = ({gradeDifference, sightWordPercentile, phoneticPercentile  }) => {

    return (
        <Stack spacing={2}>
            <Typography>Screening Chart</Typography>
            <Table>
                <TableHead>
                    <TableRow >
                        <TableCell sx={{border: "solid 1px", py: "5px" }} width="100px"><Typography>Spelling Raw Score</Typography></TableCell>
                        <TableCell sx={{border: "solid 1px", py: "5px"}} width="20px">
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Typography fontSize="0.875rem">D</Typography>
                                <LessEqualSign />
                                <Typography fontSize="0.875rem">-3</Typography>
                            </Stack>
                        </TableCell>
                        <TableCell sx={{border: "solid 1px", py: "5px"}} width="20px">{`D = -2`}</TableCell>
                        <TableCell sx={{border: "solid 1px", py: "5px"}} width="20px">{`D = -1`}</TableCell>
                        <TableCell sx={{border: "solid 1px", py: "5px"}} width="20px">{`D = 0`}</TableCell>
                        <TableCell sx={{border: "solid 1px", py: "5px"}} width="20px">{`D = +1`}</TableCell>
                        <TableCell sx={{border: "solid 1px", py: "5px"}} width="20px">{`D = +2`}</TableCell>
                        <TableCell sx={{border: "solid 1px", py: "5px"}} width="20px">
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Typography fontSize="0.875rem">D</Typography>
                                <GreatEqualSign />
                                <Typography fontSize="0.875rem">+3</Typography>
                            </Stack>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { percentiles.map((part, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{border: "solid 1px", py: "5px"}}>{part.text}</TableCell>
                            { differences.map((diff, index) => {
                                // the default text of this cell
                                const {text: theText, color :backColor} = getDiffTextAndColor(diff, part.pivotPoint);

                                let hasPhonetic = false;
                                let hasSight = false;
                                // Check if the difference matches with our grade difference
                                if ( (diff == 1 && gradeDifference <= -3) || 
                                    ( (diff - 4) == gradeDifference) || 
                                    (diff == 7 && gradeDifference >= 3) ) {
                                    // Now check for percentage of sight-word
                                    if (roundPercentage(sightWordPercentile, [0, 20, 40, 60, 80, 100]) == part.value) hasSight = true;
                                    if (roundPercentage(phoneticPercentile, [0, 20, 40, 60, 80, 100]) == part.value) hasPhonetic = true;
                                }

                                return (
                                    <TableCell key={index+100} sx={{bgcolor: backColor, border: hasPhonetic ? "solid 2px #002cf1" : hasSight ? "solid 2px #04f100" : "solid 1px", py: "5px"}} width="20px">{theText}</TableCell>
                                )
                            })}
                            
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </Stack>

    )
  };


  const AdultTestTable = ({ sightWordAnalysis, phoneticAnalysis }) => {

    return (
        <Stack spacing={2}>
            <Typography>Screening Chart</Typography>
            <Table>
                <TableHead>
                    <TableRow >
                        <TableCell sx={{border: "solid 1px", py: "5px" }} width="100px"><Typography>Rank of Severity</Typography></TableCell>
                        <TableCell sx={{border: "solid 1px", py: "5px"}} width="20px">
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Typography fontSize="0.875rem">D</Typography>
                                <LessEqualSign />
                                <Typography fontSize="0.875rem">-6</Typography>
                            </Stack>
                        </TableCell>
                        <TableCell sx={{border: "solid 1px", py: "5px"}} width="20px">{`D = -4 or -5`}</TableCell>
                        <TableCell sx={{border: "solid 1px", py: "5px"}} width="20px">{`D = -3 or -2`}</TableCell>
                        <TableCell sx={{border: "solid 1px", py: "5px"}} width="20px">{`D = -1`}</TableCell>
                        <TableCell sx={{border: "solid 1px", py: "5px"}} width="20px">{`D = 0`}</TableCell>
                        <TableCell sx={{border: "solid 1px", py: "5px"}} width="20px">{`D = +1`}</TableCell>
                        <TableCell sx={{border: "solid 1px", py: "5px"}} width="20px">
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Typography fontSize="0.875rem">D</Typography>
                                <GreatEqualSign />
                                <Typography fontSize="0.875rem">+2</Typography>
                            </Stack>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { rankOfSeverities.map((severityTitle, index) => { 
                        let hasPhonetic = false;
                        let hasSight = false;
                        if (severityTitle == sightWordAnalysis) hasSight = true;
                        if (severityTitle == phoneticAnalysis) hasPhonetic = true;

                        return (
                            <TableRow key={index}>
                                <TableCell sx={{border: hasPhonetic ? "solid 2px #002cf1" : hasSight ? "solid 2px #04f100" : "solid 1px", py: "5px"}}>{severityTitle}</TableCell>
                                { differenceEstimatedRanges.map((rangeArray, index2) => { 
                                    let theText = "---";
                                    if (rangeArray[index] !== null) theText = rangeArray[index] + "%";
                                    if (index == 7 && rangeArray[index] && rangeArray[index] > 0) 
                                        theText = <Stack direction="row" alignItems="center">
                                            <LessEqualSign />
                                            {theText}
                                        </Stack>
                                    return (
                                        <TableCell key={index2} sx={{border: "solid 1px", py: "5px"}}>{theText}</TableCell>
                                )})}
        
                            </TableRow>
                    )})}
                </TableBody>
            </Table>

        </Stack>

    )
  };


  const sampleSubmissionData = 
    {
        "name": "ami omi",
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