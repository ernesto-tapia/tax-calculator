export const convertIntoCurrency = (value: string | number) => {
    return Number(value).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
      roundingMode:'ceil'
    });
  };