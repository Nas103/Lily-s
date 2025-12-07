import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * API route to get Gravatar URL from email
 * This allows client-side code to get Gravatar URLs
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const size = parseInt(searchParams.get("size") || "200", 10);

  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  // Trim and lowercase email
  const trimmedEmail = email.trim().toLowerCase();
  
  // Create MD5 hash of email
  const hash = crypto.createHash("md5").update(trimmedEmail).digest("hex");
  
  // Return Gravatar URL
  const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon&r=pg`;

  return NextResponse.json({ url: gravatarUrl });
}

