"use client";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, Rocket } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { isSignedIn } = useUser();

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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            {isSignedIn ? (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              />
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
};
