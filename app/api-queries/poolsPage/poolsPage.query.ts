import { poolParams } from "~/api-queries/poolData";

export const poolsPageQuery = () => {
  return `
query poolsPage {
  pools(limit: 5) {
    ${poolParams()}
  }
  poolsData: poolsConnection(orderBy: id_ASC) {
    totalCount
  }
}`;
};
