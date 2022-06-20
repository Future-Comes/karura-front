import { currencyParams } from "~/api-queries/currencyData";

export const currenciesPageQuery = () => {
  return `
query currenciesPage {
  currencies {
    ${currencyParams()}
  }
}`;
};
