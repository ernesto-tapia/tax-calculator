import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { TaxBreakdown } from './page';
import { convertIntoCurrency } from '../utils/currencyConversion';

const HEADERS = Object.freeze(['Bracket', 'Tax Rate', 'Taxable Amount', 'Tax']);

interface TaxBreakdownProps {
  taxBreakdown: TaxBreakdown;
}

export default function TaxBreakdownTable({
  taxBreakdown: { taxes, sumTaxableAmount, sumTaxes },
}: TaxBreakdownProps) {
  const getTaxableAmountLabel = (min: number, max: number | undefined) => {
    return `From $${min} ${max ? `to $${max}` : 'onwards'}`;
  };

  return (
    <div className='max-w-fit mx-auto mt-5'>
      <Paper>
        <div className='container flex flex-col justify-between p-4'>
          <Table sx={{ minWidth: '50vw' }}>
            <TableHead>
            <TableRow>
              {HEADERS.map((label) => (
                <TableCell key={label}>{label}</TableCell>
              ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {taxes.map((bracket) => (
                <TableRow key={bracket.min}>
                  <TableCell>
                    {getTaxableAmountLabel(bracket.min, bracket?.max)}
                  </TableCell>
                  <TableCell>{bracket.rate}</TableCell>
                  <TableCell>
                    {convertIntoCurrency(bracket.taxableAmount || 0)}
                  </TableCell>
                  <TableCell>{convertIntoCurrency(bracket.tax)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell></TableCell>
                <TableCell>{convertIntoCurrency(sumTaxableAmount)}</TableCell>
                <TableCell>{convertIntoCurrency(sumTaxes)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Paper>
    </div>
  );
}
