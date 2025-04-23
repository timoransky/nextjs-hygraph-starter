import { GraphQLClient } from "graphql-request";
import { getSdk } from "./__generated/graphql";

const endpoint = process.env.HYGRAPH_ENDPOINT || "";

const createHygraphClient = (isDraftMode = false) => {
  if (!endpoint) {
    throw new Error("HYGRAPH_ENDPOINT is not defined");
  }

  const client = new GraphQLClient(endpoint);

  if (isDraftMode) {
    const previewToken = process.env.HYGRAPH_PREVIEW_TOKEN || "";

    if (previewToken) {
      client.setHeader("Authorization", `Bearer ${previewToken}`);
    } else {
      console.error("HYGRAPH_PREVIEW_TOKEN is not defined while in draft mode");
    }
  }

  return getSdk(client);
};

export const getHygraphSdk = (isDraftMode = false) => {
  return createHygraphClient(isDraftMode);
};
