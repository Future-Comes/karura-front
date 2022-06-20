import { poolParams } from "~/api-queries/poolData";
import { currencyParams } from "~/api-queries/currencyData";

export const searchDataQuery = (search: string | null = "") => {
  return `
query poolsData {
  currencies(limit: 3, where: {currencyName_contains: "${search}"}) {
    ${currencyParams()}
  }
  pools(limit: 3, where: {currencyOne: {currencyName_contains: "${search}"}, OR: {currencyZero: {currencyName_contains: "${search}"}}}) {
    ${poolParams()}
  }
}`;
};
