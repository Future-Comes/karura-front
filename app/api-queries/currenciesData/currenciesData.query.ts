import { currencyParams } from "~/api-queries/currencyData";

export const currenciesDataQuery = () => {
  return `
query currenciesData {
  currencies {
    ${currencyParams()}
  }
}`;
};
