import useSWR from "swr";
import type { SWRConfiguration } from "swr";
import { Sdk } from "./__generated/graphql";

// Extract return types from the SDK
type SdkReturnTypes = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof Sdk]: Sdk[K] extends (variables?: any) => Promise<infer R>
    ? R
    : never;
};

// Extract operation types from the SDK
type SdkOperationTypes = keyof Sdk;

interface SdkQuery {
  op: SdkOperationTypes;
  variables?: Record<string, unknown>;
}

const fetcher = async ({ op, variables }: SdkQuery) => {
  console.log(`[Client] Fetching ${op}`, variables);

  const res = await fetch("/api/hygraph", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ op, variables }),
  });

  const json = await res.json();

  if (!res.ok) {
    console.error(`[Client] Error fetching ${op}:`, json.error);
    throw new Error(json.error || "Failed to fetch");
  }

  console.log(`[Client] Received data for ${op}`);
  return json;
};

export function useHygraphSdk<T extends keyof SdkReturnTypes>(
  op: T,
  variables?: Parameters<Sdk[T]>[0],
  swrOptions?: SWRConfiguration
) {
  const key = variables ? [op, JSON.stringify(variables)] : op;

  return useSWR<SdkReturnTypes[T]>(
    key,
    () => fetcher({ op, variables }) as Promise<SdkReturnTypes[T]>,
    {
      revalidateOnFocus: process.env.NODE_ENV !== "development",
      revalidateIfStale: true,
      ...swrOptions,
    }
  );
}
