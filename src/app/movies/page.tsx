"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTitles } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";

export default function MoviesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { data: titles = [], isLoading, error } = useTitles({
    page,
    limit: 12,
    search: searchTerm,
  });

  const filteredTitles = useMemo(() => {
    if (!titles) return [];
    if (!searchTerm) return titles;
    return titles.filter(
      (title) =>
        title.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        title.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [titles, searchTerm]);

  return (
    <div className="flex-1 bg-linear-to-br from-background to-muted">
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold sm:text-4xl">Discover Movies</h1>
          <p className="mt-2 text-muted-foreground">
            Browse and explore our collection of movies
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search movies by title or description..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border bg-background px-4 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
            Failed to load movies. Please try again.
          </div>
        )}

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

        {/* Movies Grid */}
        {!isLoading && filteredTitles.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTitles.map((title) => (
              <Link key={title.id} href={`/movies/${title.id}`}>
                <div className="group cursor-pointer overflow-hidden rounded-lg border bg-card transition-all hover:border-primary hover:shadow-lg">
                  {/* Movie Poster */}
                  <div className="relative h-56 overflow-hidden bg-muted">
                    <img
                      src={title.posterUrl}
                      alt={title.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>

                  {/* Movie Info */}
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {title.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {title.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">
                          ⭐ {title.rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(title.releaseDate).getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTitles.length === 0 && !error && (
          <div className="rounded-lg border border-dashed bg-card/50 p-12 text-center">
            <p className="text-muted-foreground">
              {searchTerm
                ? "No movies found matching your search."
                : "No movies available."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredTitles.length > 0 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="flex items-center px-4">Page {page}</span>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={filteredTitles.length < 12}
              variant="outline"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
