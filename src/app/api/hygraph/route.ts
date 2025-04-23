import { NextResponse } from "next/server";
import { getHygraphSdk } from "@/lib/hygraph";

export async function POST(req: Request) {
  try {
    const { op, variables } = await req.json();

    console.log(`[API] Hygraph operation requested: ${op}`, variables);

    // Get the SDK instance
    const sdk = getHygraphSdk();

    // Check if the operation exists in the SDK
    if (typeof sdk[op as keyof typeof sdk] !== "function") {
      console.error(`[API] Invalid operation: ${op}`);
      return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
    }

    // Dynamically call the SDK function with variables
    const data = await sdk[op as keyof typeof sdk](variables || {});
    console.log(`[API] Successfully executed ${op}`);

    return NextResponse.json(data);
  } catch (e: unknown) {
    const error = e as Error;
    console.error(`[API] Error in Hygraph API:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
