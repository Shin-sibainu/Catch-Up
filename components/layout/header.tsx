import Link from "next/link";
import { Rocket } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import HeaderCredits from "./HeaderCredits";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

export default async function Header() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Catch Up
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <ThemeToggle />
            {isSignedIn ? (
              <>
                <HeaderCredits />
                <UserMenu />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="outline">ログイン</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>新規登録</Button>
                </SignUpButton>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
