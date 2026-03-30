"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useWatchlist, useRemoveFromWatchlist, type Title } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";

export default function WatchlistPage() {
  const { isAuthenticated } = useAuth();
  const { data: watchlistData = [] } = useWatchlist();
  const watchlist = Array.isArray(watchlistData) ? (watchlistData as Title[]) : [];
  const { isLoading } = useWatchlist();
  const removeFromWatchlistMutation = useRemoveFromWatchlist();

  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-linear-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">
            Please sign in to view your watchlist
          </p>
          <Link href="/auth/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleRemove = async (movieId: string) => {
    try {
      removeFromWatchlistMutation.mutate(movieId);
    } catch (err) {
      console.error("Failed to remove from watchlist", err);
    }
  };

  return (
    <div className="flex-1 bg-linear-to-br from-background to-muted">
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold sm:text-4xl">My Watchlist</h1>
          <p className="mt-2 text-muted-foreground">
            Movies you want to watch
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        )}

        {/* Watchlist Grid */}
        {!isLoading && watchlist.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {watchlist.map((movie: Title) => (
              <div
                key={movie.id}
                className="group overflow-hidden rounded-lg border bg-card transition-all hover:border-primary hover:shadow-lg"
              >
                {/* Movie Poster */}
                <Link href={`/movies/${movie.id}`}>
                  <div className="relative h-56 overflow-hidden bg-muted cursor-pointer">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Link>

                {/* Movie Info */}
                <div className="p-4">
                  <Link href={`/movies/${movie.id}`}>
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
                      {movie.title}
                    </h3>
                  </Link>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">
                      ⭐ {movie.rating.toFixed(1)}
                    </span>
                    <button
                      onClick={() => handleRemove(movie.id)}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && watchlist.length === 0 && (
          <div className="rounded-lg border border-dashed bg-card/50 p-12 text-center">
            <p className="mb-4 text-muted-foreground">
              Your watchlist is empty
            </p>
            <Link href="/movies">
              <Button>Browse Movies</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
