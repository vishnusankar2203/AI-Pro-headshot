import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { hookUrl } = await request.json();

  // POST request to Replicate to start the image restoration generation process
  let startResponse = await fetch(hookUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + process.env.REPLICATE_API_KEY,
    }
  });

  let jsonResponse = await startResponse.json();
  console.log("Predict")
  console.log(jsonResponse)

  if (jsonResponse.status === "succeeded") {
    return NextResponse.json(jsonResponse.output);
  } else if (jsonResponse.status === "failed") {
    return NextResponse.json("Failed to restore image");
  } else
    return NextResponse.json("processing")

}
