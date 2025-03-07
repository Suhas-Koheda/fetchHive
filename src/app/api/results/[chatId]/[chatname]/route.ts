import { Redis } from "@upstash/redis";
import { env } from "@/env";
import { NextResponse } from "next/server";

// Initialize Redis client
const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ chatId: string; chatname: string }> },
) {
  try {
    const { chatId, chatname } = await params;

    // Validate parameters
    if (!chatId || !chatname) {
      return NextResponse.json(
        { success: false, message: "Invalid chatId or chatname" },
        { status: 400 },
      );
    }

    // Get API data from Redis
    const key = `api/results/${chatId}/${chatname}`;
    const apiData = await redis.get(key);

    if (!apiData) {
      return NextResponse.json(
        { success: false, message: "API endpoint not found" },
        { status: 404 },
      );
    }

    // Parse the data if it's a string
    const parsedData =
      typeof apiData === "string" ? JSON.parse(apiData) : apiData;

    // Return the extracted data and metadata
    return NextResponse.json({
      success: true,
      data: parsedData.data,
    });
  } catch (error) {
    console.error("API fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
