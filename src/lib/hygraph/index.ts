import { GraphQLClient } from "graphql-request";
import { getSdk } from "./__generated/graphql";

const endpoint = process.env.HYGRAPH_ENDPOINT || "";

const createHygraphClient = (isDraftMode = false) => {
  if (!endpoint) {
    throw new Error("HYGRAPH_ENDPOINT is not defined");
  }

  const client = new GraphQLClient(endpoint);

  if (isDraftMode) {
    client.setHeader(
      "Authorization",
      `Bearer ${process.env.HYGRAPH_PREVIEW_TOKEN}`
    );
  }

  return getSdk(client);
};

export const getHygraphSDK = (isDraftMode = false) => {
  return createHygraphClient(isDraftMode);
};
