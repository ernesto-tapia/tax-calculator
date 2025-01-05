export const fetchTaxBracket = async (year: number) => {
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