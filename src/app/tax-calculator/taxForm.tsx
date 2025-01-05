import React, { useState } from 'react';
import { TextField, MenuItem, Button, Paper } from '@mui/material';
const AVAILABLE_YEARS = Object.freeze([
  {
    value: '2019',
    label: '2019',
  },
  {
    value: '2020',
    label: '2020',
  },
  {
    value: '2021',
    label: '2021',
  },
  { value: '2022', label: '2022' },
]);

interface TaxFormProps {
  handleSubmit: (year: number, annualSalary: number) => Promise<void>;
}
export default function TaxForm({ handleSubmit }: TaxFormProps) {
  const [annualSalary, setAnnualSalary] = useState(0);
  const [year, setYear] = useState(2019);

  const handleSalaryChange = (value: string) => {
    setAnnualSalary(Number(value));
  };

  const handleYearChange = (value: string) => {
    setYear(Number(value));
  };

  return (
    <div className='max-w-md mx-auto'>
      <Paper>
        <div className='container flex flex-col justify-between p-4'>
          <div className='mb-5'>
            <h1>Tax Calculator Form</h1>
          </div>
          <div className='m-2'>
            <TextField
              id='annual-salary-input'
              required
              label='Please type your annual salary (USD)'
              type='number'
              inputProps={{ step: 1000 }}
              fullWidth
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleSalaryChange(event.currentTarget.value)
              }
            />
          </div>
          <div className='m-2'>
            <TextField
              id='year-selector'
              label='Please select a supported Year'
              fullWidth
              select
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleYearChange(event.target.value)
              }
              defaultValue={2019}
            >
              {AVAILABLE_YEARS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className='container flex flex-col items-center'>
            <Button
              variant='contained'
              disabled={!annualSalary}
              onClick={() => handleSubmit(year, annualSalary)}
            >
              Calculate Taxes
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
}
