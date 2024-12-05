import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { adtWords, desdWords } from '../../data/TestWords';
import {FormControlLabel , Checkbox, FormGroup, Typography, TextField, Stack, Box } from '@mui/material';
import './SelectTest.css';

export default function SelectTest() {
  const [, setTestWords] = useSessionStorage('testWords', null);
  const [, setTestName] = useSessionStorage('testName', '');
  const [, setUserAge] = useSessionStorage('userAge', null);

  const navigate = useNavigate();

  const [age, setAge] = React.useState('');
  const [isConfirmed, setConfirmed] = React.useState(false);
  const [checkboxStatus, setCheckBoxStatus] = React.useState({});

  const nextStepEnabled = useMemo(() => {
    if (isConfirmed) {
      if (!Boolean(checkboxStatus["terms"])) return false;
      if (age <= 13) return Boolean( checkboxStatus["guardian"] && checkboxStatus["coppa"] );
      return true;
    } else return false;
  }, [isConfirmed, checkboxStatus, age] );

  const startTest = async (name, words) => {
    sessionStorage.clear();
    setUserAge(age);
    setTestName(name);
    setTestWords(words);
    navigate('/decoding');
  };

  const handleChangeAge = (event) => {
    if ((event.target.value && /^\d+$/.test(event.target.value) && event.target.value > 0 && event.target.value < 100 ) || !event.target.value)
      setAge(event.target.value);
  };

  return (
    <div className='test-selection-container'>
      <Stack spacing={2} justifyContent='center' alignItems='center'>
        <Stack spacing={2} direction="row" alignItems="center">
          <TextField
            id="outlined-age-input"
            label="Age"
            value={age}
            sx={{width: "100px"}}
            disabled={isConfirmed}
            slotProps={{
              input: { inputProps: { style: {fontSize: "40px", textAlign: "center"} } },
              formHelperText: { formHelperTextProps : {style : {fontSize: "40px"} } }
            }}
            onChange={handleChangeAge}
          />
          { !isConfirmed && <button disabled={!age} onClick={() => {if (age) setConfirmed(!isConfirmed)} }>Confirm</button> }
        </Stack>
        { isConfirmed && age > 5 &&
        <Box sx={{border: "solid 1px", padding: "12px", borderRadius: "15px", width: "70%"}}>
          <Typography sx={{maxHeight: "30vh", overflowY: "auto"}}>
            This online dyslexia test is a preliminary screening tool designed for informational and educational purposes only. It is not intended to provide a medical diagnosis or to replace a professional evaluation by a licensed healthcare provider, such as a doctor, psychologist, or educational specialist.
            While the test may indicate signs consistent with dyslexia, only a qualified professional can make a definitive diagnosis and recommend an appropriate course of action. Results from this test should not be used as the sole basis for decisions regarding medical, educational, or therapeutic interventions.
            If you have concerns about dyslexia or other learning differences, we strongly encourage you to consult a qualified healthcare or educational professional for a comprehensive evaluation. By taking this test, you acknowledge and agree that it is provided "as is" without any guarantees, and we assume no liability for its use or interpretation of results.
          </Typography>
        </Box>
        }
        { isConfirmed && age > 5 &&
          <FormGroup>
            { age <= 13 &&
              <Stack>
                <FormControlLabel required control={<Checkbox checked={Boolean(checkboxStatus["guardian"])} onChange={(event) => setCheckBoxStatus({ ...checkboxStatus, guardian: event.target.checked })} />} label="I have the permission of a parent or guardian to proceed." />
                <FormControlLabel required control={<Checkbox checked={Boolean(checkboxStatus["coppa"])} onChange={(event) => setCheckBoxStatus({ ...checkboxStatus, coppa: event.target.checked })} />} label="I have read and understood the COPPA notice." />
              </Stack>
            }
            <FormControlLabel required control={<Checkbox checked={Boolean(checkboxStatus["terms"])} onChange={(event) => setCheckBoxStatus({ ...checkboxStatus, terms: event.target.checked })} />} label="I agree to the Terms of Service and Privacy Policy." />
          </FormGroup>
        }
        { isConfirmed && age > 17 &&
          <button disabled={!nextStepEnabled} onClick={() => startTest('ADT', adtWords)}>Adult Test</button>
        }
        { isConfirmed && age > 5 && age <= 17 &&
          <button disabled={!nextStepEnabled} onClick={() => startTest('DESD', desdWords)}>Child Test</button>
        }
        { isConfirmed && age <= 5 &&
          <Typography>Sorry you are too young to take the test.</Typography>
        }
      </Stack>
    </div>
  );
}