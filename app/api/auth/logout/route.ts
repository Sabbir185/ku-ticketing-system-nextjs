import { NextResponse } from "next/server";
import { cookieName } from "@/lib/auth";

export async function POST() {
  try {
    const response = NextResponse.json(
      { status: 200, error: false, msg: "Logout successful" },
      { status: 200 }
    );

    // Clear the auth cookie
    response.cookies.set(cookieName, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,         // expire immediately
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json(
      { status: 500, error: true, msg: "Logout failed. Please try again." },
      { status: 500 }
    );
  }
}
