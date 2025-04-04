import { GraphQLClient } from "graphql-request";
import { getSdk } from "./__generated/graphql";

export const endpoint = process.env.HYGRAPH_ENDPOINT || "";

export const HygraphClient = (
  { preview }: { preview: boolean } = { preview: false }
) => {
  if (!endpoint) {
    throw new Error("HYGRAPH_ENDPOINT is not defined");
  }

  const client = new GraphQLClient(endpoint);

  if (preview) {
    client.setHeader(
      "Authorization",
      `Bearer ${process.env.HYGRAPH_PREVIEW_TOKEN}`
    );
  }

  return client;
};

export const hygraph = getSdk(HygraphClient({ preview: false }));
