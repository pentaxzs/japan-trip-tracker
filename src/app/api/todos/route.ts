import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();
const DATA_KEY = "japan-trip-tracker:data";
const ARCHIVE_KEY = "japan-trip-tracker:archive";

// GET — load trip data or archive
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "archive") {
    const archive = await redis.get(ARCHIVE_KEY);
    return NextResponse.json(archive ?? []);
  }

  const data = await redis.get(DATA_KEY);
  return NextResponse.json(data ?? null);
}

// POST — save trip data, archive, or delete archive
export async function POST(request: Request) {
  const body = await request.json();
  const { action } = body;

  if (action === "save") {
    await redis.set(DATA_KEY, body.data);
    return NextResponse.json({ ok: true });
  }

  if (action === "archive") {
    const existing = (await redis.get<unknown[]>(ARCHIVE_KEY)) ?? [];
    existing.unshift(body.trip);
    await redis.set(ARCHIVE_KEY, existing);
    // Reset main data
    await redis.del(DATA_KEY);
    return NextResponse.json({ ok: true });
  }

  if (action === "delete-archive") {
    const existing = (await redis.get<{ id: string }[]>(ARCHIVE_KEY)) ?? [];
    const filtered = existing.filter((t) => t.id !== body.id);
    await redis.set(ARCHIVE_KEY, filtered);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
