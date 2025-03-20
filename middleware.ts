import { authMiddleware } from "@clerk/nextjs";
import { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // return NextResponse.redirect(new URL('/home', request.url))
}

export default authMiddleware({
  publicRoutes: ["/", "/api/webhook/clerk", "/api/webhook/stripe"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
