"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { useRole } from "@/hooks/use-role";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { isAdmin } = useRole();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          🎬 Movie Portal
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          {isAuthenticated ? (
            <>
              <Link
                href="/movies"
                className="text-sm hover:text-primary transition-colors"
              >
                Movies
              </Link>
              <Link
                href="/watchlist"
                className="text-sm hover:text-primary transition-colors"
              >
                Watchlist
              </Link>
              {isAdmin() && (
                <Link
                  href="/admin"
                  className="text-sm hover:text-primary transition-colors flex items-center gap-1"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <Link
                href="/profile"
                className="text-sm hover:text-primary transition-colors"
              >
                {user?.name || "Profile"}
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-full border-b bg-background p-4 sm:hidden">
            <div className="flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/movies"
                    className="text-sm hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Movies
                  </Link>
                  <Link
                    href="/watchlist"
                    className="text-sm hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Watchlist
                  </Link>
                  {isAdmin() && (
                    <Link
                      href="/admin"
                      className="text-sm hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="text-sm hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
