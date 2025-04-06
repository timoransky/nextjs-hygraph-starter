import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  // Parse query string parameters
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const model = searchParams.get("model");
  const slug = searchParams.get("slug");

  if (secret !== process.env.HYGRAPH_PREVIEW_SECRET && (!model || !slug)) {
    return new Response("Missing parameters", { status: 400 });
  }

  // Enable Draft Mode by setting the cookie
  const draft = await draftMode();
  draft.enable();

  // Update the cookie and set same site to none so we can render it inside Hygraph
  const cookieStore = await cookies();
  const cookie = cookieStore.get("__prerender_bypass");
  cookieStore.set({
    name: "__prerender_bypass",
    value: cookie?.value ?? "",
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
  });

  let modelUrl = "";
  if (model === "page") {
    modelUrl = "/";
  } else if (model === "post") {
    modelUrl = "/post/";
  }

  // Redirect to the path
  redirect(`${modelUrl}${slug}`);
}
