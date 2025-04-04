import { CodegenConfig } from "@graphql-codegen/cli";

export const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.HYGRAPH_ENDPOINT || "",
  documents: "src/lib/hygraph/queries/*.graphql",
  generates: {
    "src/lib/hygraph/__generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
    },
  },
};

export default config;
