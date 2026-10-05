import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();
const DATA_KEY = "japan-trip-tracker:data";

export async function GET() {
  const data = await redis.get<{ updatedAt?: string }>(DATA_KEY);
  return NextResponse.json({ updatedAt: data?.updatedAt ?? null });
}
