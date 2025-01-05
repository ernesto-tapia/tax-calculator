'use client';
import React, { useState } from 'react';
import TaxForm from './taxForm';
import bigDecimal from 'js-big-decimal';
import TaxBreakdown from './taxBreakdownTable';
import { Skeleton } from '@mui/material';
import ResultBox from './resultBox';
interface TaxBracket {
  max?: number;
  min: number;
  rate: number;
}

interface FederalIncomeTax extends TaxBracket {
  tax: string;
  taxableAmount: number;
}

export interface TaxBreakdown {
  taxes: FederalIncomeTax[];
  sumTaxes: number;
  sumTaxableAmount: number;
  error?: string;
}

const defaultState = {
  taxes: [],
  sumTaxableAmount: 0,
  sumTaxes: 0,
};
export default function TaxCalculator() {
  const [taxBreakdown, setTaxBreakdown] = useState(
    defaultState as TaxBreakdown
  );
  const [loading, setLoading] = useState(false);

  const handleError = (message: string) => {
    setTaxBreakdown({ ...defaultState, error: message });
  };

  const getTaxBrackets = async (year: number) => {
    const apiTaxBracketsData = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/tax-calculator/tax-year/${year}`
    );
    if (apiTaxBracketsData.status !== 200) {
      const { status, statusText } = apiTaxBracketsData;
      throw new Error(
        `${statusText}, Status:${status}. There was an error while fetching the tax brackets, please wait a moment and try again`
      );
    }
    const apiTaxBrackets = await apiTaxBracketsData.json();
    return apiTaxBrackets?.tax_brackets;
  };

  const calculateTaxes = (brackets: TaxBracket[], annualSalary: number) => {
    let remainingIncome = annualSalary;
    let sumTaxableAmount = 0;
    let sumTaxes = 0;
    const taxes = brackets.map((bracket: TaxBracket) => {
      if (remainingIncome <= 0)
        return { tax: '0', ...bracket, taxableAmount: 0 };
      const limit = bracket?.max || annualSalary;
      const maxTaxableAmount = limit - bracket.min;
      const taxableAmount = Math.min(remainingIncome, maxTaxableAmount);
      const tax = bigDecimal.multiply(taxableAmount, bracket.rate);
      sumTaxableAmount += Number(taxableAmount);
      sumTaxes += Number(tax);
      remainingIncome -= taxableAmount;

      return {
        tax: tax,
        taxableAmount: taxableAmount,
        ...bracket,
      };
    });
    return { taxes, sumTaxableAmount, sumTaxes };
  };

  const handleSubmit = async (year: number, annualSalary: number) => {
    setLoading(true);
    try {
      const taxBrackets = await getTaxBrackets(year);
      const taxBreakdowns = calculateTaxes(taxBrackets, annualSalary);
      setTaxBreakdown(taxBreakdowns);
    } catch (e) {
      if (e instanceof Error) {
        handleError(e.message);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <TaxForm handleSubmit={handleSubmit} disableSubmit={loading}/>
      {loading && (
        <div className='max-w-3xl mx-auto mt-5'>
          <Skeleton variant='rectangular' width={768} height={500} />
        </div>
      )}
      {(taxBreakdown?.taxes.length > 0 || taxBreakdown.error) && !loading && (
        <ResultBox
          totalTaxes={taxBreakdown.sumTaxes}
          error={taxBreakdown?.error}
        />
      )}
      {taxBreakdown?.taxes.length > 0 && !loading && !taxBreakdown?.error && (
        <TaxBreakdown taxBreakdown={taxBreakdown} />
      )}
    </>
  );
}
