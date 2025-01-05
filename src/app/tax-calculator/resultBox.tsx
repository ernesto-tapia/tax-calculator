import { Paper } from '@mui/material';
import { convertIntoCurrency } from '../utils/currencyConversion';

export default function ResultBox({
  totalTaxes,
  error,
}: {
  totalTaxes: number;
  error?: string;
}) {
  console.log(typeof error)
  return (
    <div className='max-w-md mx-auto'>
      <Paper>
          <div className='p-2 m-3'>
            <h1>
              {error
                ? error
                : `Total Taxes: ${convertIntoCurrency(totalTaxes)}`}
            </h1>
          </div>
      </Paper>
    </div>
  );
}
