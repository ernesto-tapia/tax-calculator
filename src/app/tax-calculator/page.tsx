'use client';
import React, { useEffect, useState } from 'react';

export default function TaxCalculator() {
  const [taxMargins, setTaxMargins] = useState({});
  const [annualSalary, setAnnualSalary] = useState(0);
  const [year, setYear] = useState(2019);

  const getTaxMargins = async () => {
    const apiTaxMarginsData = await fetch(
      'http://localhost:5001/tax-calculator/tax-year/2019'
    );
    const apiTaxMargins = await apiTaxMarginsData.json();
    setTaxMargins(apiTaxMargins);
  };

  useEffect(() => {
    getTaxMargins();
  }, []);

  const handleSalaryChange = (value: string) => {
    setAnnualSalary(Number(value));
  };

  const labelClass = 'block mb-2 mt-2 text-sm font-medium text-gray-500';
  const textInputClass =
    'shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5';
  return (
    <>
      <div className='max-w-sm mx-auto p-2 shadow-2xl rounded-lg'>
        <div className='mb-5'>
          <label className={labelClass}>Annual Salary:</label>
          <input
            onChange={(event) => {
              handleSalaryChange(event.target.value);
            }}
            type='annualSalary'
            id='year'
            className={textInputClass}
            placeholder='200000'
            required
          />
          <label className={labelClass}>Year:</label>
          <input
            onChange={(event) => {
              handleSalaryChange(event.target.value);
            }}
            type='year'
            id='year'
            className={textInputClass}
            placeholder='2019'
            required
          />
        </div>
        <div className='container flex flex-col items-center'>
          <button
            className=' text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
            onClick={() => {}}
          >
            Calculate taxes
          </button>
        </div>
      </div>
    </>
  );
}
