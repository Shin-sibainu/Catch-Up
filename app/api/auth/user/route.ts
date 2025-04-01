import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function GET() {
  try {
    const { userId, user } = auth();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      id: userId,
      email: user.emailAddresses[0]?.emailAddress,
      name: user.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : undefined,
      imageUrl: user.imageUrl,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
