import { Ratelimit } from "@upstash/ratelimit";
import redis from "../../utils/redis";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Create a new ratelimiter, that allows 3 requests per 24 hours
const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.fixedWindow(3, "1440 m"),
      analytics: true,
    })
  : undefined;

export async function POST(request: Request) {
  // Rate Limiter Code
  if (ratelimit) {
    const headersList = headers();
    const ipIdentifier = headersList.get("x-real-ip");

    const result = await ratelimit.limit(ipIdentifier ?? "");

    if (!result.success) {
      return new Response(
        "Too many uploads in 1 day. Please try again in 24 hours.",
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": result.limit,
            "X-RateLimit-Remaining": result.remaining,
          } as any,
        }
      );
    }
  }

  const { imageUrl, theme } = await request.json();

  // POST request to Replicate to start the image restoration generation process
  let startResponse = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + process.env.REPLICATE_API_KEY,
    },
    body: JSON.stringify({
      version:
        "60f361009ed29b4d85ddefdf0eb7c3af98ad39da7e0c29b3ede6636ee10a5d52",
      input: {
        image: imageUrl,
        gender: theme.toLowerCase(),
        seed: 0
      },
    }),
  });

  let jsonStartResponse = await startResponse.json();

  let endpointUrl = jsonStartResponse.urls.get;

  return NextResponse.json(endpointUrl);
}
