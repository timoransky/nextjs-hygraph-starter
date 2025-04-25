import useSWR from "swr";
import { Sdk } from "./__generated/graphql";

// Define a generic type for SDK operations
type SdkOperation<T extends keyof Sdk> = Sdk[T];

// Combined type for extracting both parameter and return types
type SdkTypes = {
  [K in keyof Sdk]: {
    variables: Parameters<SdkOperation<K>>[0];
    result: Awaited<ReturnType<SdkOperation<K>>>;
  };
};

interface SdkQuery<T extends keyof Sdk> {
  op: T;
  variables?: SdkTypes[T]["variables"];
}

const fetcher = async <T extends keyof Sdk>({ op, variables }: SdkQuery<T>) => {
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

  return json;
};

export function useHygraphSdk<T extends keyof Sdk>(
  ...[op, variables]: undefined extends SdkTypes[T]["variables"]
    ? [op: T, variables?: SdkTypes[T]["variables"]]
    : [op: T, variables: SdkTypes[T]["variables"]]
) {
  // Create the SWR key based on presence of variables
  const key = variables ? [op, JSON.stringify(variables)] : op;

  return useSWR<SdkTypes[T]["result"]>(
    key,
    () => fetcher<T>({ op, variables }) as Promise<SdkTypes[T]["result"]>,
    {
      revalidateOnFocus: process.env.NODE_ENV !== "development",
      revalidateIfStale: true,
    }
  );
}
