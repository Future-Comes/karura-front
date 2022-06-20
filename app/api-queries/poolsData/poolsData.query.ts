import { poolParams } from "~/api-queries/poolData";

export const poolsDataQuery = () => {
  return `
query poolsData {
  pools {
    ${poolParams()}
  }
}`;
};
