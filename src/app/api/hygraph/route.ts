import { NextResponse } from "next/server";
import { getHygraphSdk } from "@/lib/hygraph";

// Define allowed operations, which are the names of the queries/mutations in your GraphQL schema
// that you want to expose through this API route.
// You can add more operations as needed, but be cautious about exposing sensitive data.
// Left empty if you want to allow all operations.

const ALLOWED_OPERATIONS = ["singlePage"];

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin");

    const { op, variables } = await req.json();

    if (
      !origin ||
      !origin.startsWith(
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost"
      ) ||
      (ALLOWED_OPERATIONS.length && !ALLOWED_OPERATIONS.includes(op))
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get the SDK instance
    const sdk = getHygraphSdk();

    // Check if the operation exists in the SDK
    if (typeof sdk[op as keyof typeof sdk] !== "function") {
      return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
    }

    // Dynamically call the SDK function with variables
    const data = await sdk[op as keyof typeof sdk](variables || {});

    return NextResponse.json(data);
  } catch (e: unknown) {
    const error = e as Error;
    console.error(`[API] Error in Hygraph API:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
