import { Reason } from "~/api-queries/transactionsData/transactionsData.transform";

export const transactionParams = `
    timestamp
    reason
    amountOne
    amountZero
    currencyZero {
        name: currencyName
    }
    currencyOne {
        name: currencyName
    }
    account
    totalValue
    hash
    eventId
`;

export const transactionsDataQuery = (
  id: string | [string, string],
  cursor: string = "0",
  reasons: string = [Reason.SWAP, Reason.ADD, Reason.REMOVE].toString(),
  limit = 10
) => {
  let whereCurrency = `
        {
            currencyOne: {id_eq: "${id}"},
            OR: {currencyZero: {id_eq: "${id}"}}
        }
    `;

  if (typeof id !== "string") {
    whereCurrency = `
        {
          currencyZero: {id_eq: "${id[0]}"}, OR: {currencyOne: {id_eq: "${id[1]}"}},
          AND: {currencyZero: {id_eq: "${id[1]}"}, OR: {currencyOne: {id_eq: "${id[0]}"}}}
        }
    `;
  }

  return `
query transactionsData {
    transactions: liquidityChangesConnection(
        first: ${limit},
        after: "${cursor}"
        orderBy: timestamp_DESC,
        where: {
            reason_in: [${reasons}],
            AND: ${whereCurrency}
        }
    ) {
        totalCount
        pageInfo {
            endCursor
            startCursor
            hasNextPage
            hasPreviousPage
        }
        edges {
            node {
                ${transactionParams}
            }
        }
    }
}`;
};
