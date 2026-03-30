"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  useTitleDetail,
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useWatchlist,
  useCreateReview,
  type Title,
} from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function MovieDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const movieId = Array.isArray(id) ? id[0] : (id as string | undefined);
  const { data: movie, isLoading, error } = useTitleDetail(movieId || null);
  const { data: watchlistData = [] } = useWatchlist();
  const watchlist = Array.isArray(watchlistData) ? (watchlistData as Title[]) : [];
  const addToWatchlistMutation = useAddToWatchlist();
  const removeFromWatchlistMutation = useRemoveFromWatchlist();
  const createReviewMutation = useCreateReview();

  const isInWatchlist = watchlist.some((item: Title) => item.id === movieId);

  const handleAddToWatchlist = async () => {
    if (!isAuthenticated || !movieId) {
      router.push("/auth/login");
      return;
    }
    try {
      addToWatchlistMutation.mutate(movieId);
    } catch (err) {
      console.error("Failed to add to watchlist", err);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    if (!movieId) return;
    try {
      removeFromWatchlistMutation.mutate(movieId);
    } catch (err) {
      console.error("Failed to remove from watchlist", err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !movieId) {
      router.push("/auth/login");
      return;
    }

    if (!comment.trim()) return;

    try {
      createReviewMutation.mutate({
        titleId: movieId,
        rating,
        comment,
      });
      setComment("");
      setRating(5);
    } catch (err) {
      console.error("Failed to create review", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-linear-to-b from-background to-muted">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-96 rounded-lg bg-muted" />
            <div className="h-8 w-3/4 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex-1 bg-linear-to-b from-background to-muted">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="text-destructive">Movie not found or error loading details.</p>
            <Link href="/movies">
              <Button className="mt-4">Back to Movies</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-linear-to-b from-background to-muted">
      <div className="mx-auto max-w-4xl px-6 py-8 sm:px-10">
        {/* Back Button */}
        <Link href="/movies" className="inline-flex items-center gap-2 text-sm hover:text-primary mb-6">
          ← Back to Movies
        </Link>

        {/* Hero Section */}
        <div className="grid gap-8 md:grid-cols-3 mb-12">
          {/* Poster */}
          <div className="md:col-span-1">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="rounded-lg border shadow-lg w-full"
            />
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-semibold">{movie.title}</h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>{new Date(movie.releaseDate).getFullYear()}</span>
                {movie.genres && movie.genres.length > 0 && (
                  <span>{movie.genres[0]}</span>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="text-4xl font-semibold">
                ⭐ {movie.rating.toFixed(1)}
              </div>
              {movie.aggregateRating && (
                <div className="text-sm text-muted-foreground">
                  <p>Based on {movie.aggregateRating.totalReviews} reviews</p>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {movie.description}
            </p>

            {/* Platforms */}
            {movie.platforms && movie.platforms.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Available on:</p>
                <div className="flex flex-wrap gap-2">
                  {movie.platforms.map((platform: string) => (
                    <span
                      key={platform}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              {isInWatchlist ? (
                <Button
                  onClick={handleRemoveFromWatchlist}
                  variant="outline"
                >
                  ✓ In Watchlist
                </Button>
              ) : (
                <Button onClick={handleAddToWatchlist}>
                  + Add to Watchlist
                </Button>
              )}
              {movie.trailerUrl && (
                <a href={movie.trailerUrl} target="_blank" rel="noreferrer">
                  <Button variant="outline">Watch Trailer</Button>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t pt-12">
          <h2 className="text-2xl font-semibold mb-6">Reviews</h2>

          {/* Submit Review */}
          {isAuthenticated && (
            <div className="mb-8 rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Leave a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium mb-2">
                    Rating: {rating} / 5
                  </label>
                  <input
                    id="rating"
                    type="range"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium mb-2">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    placeholder="Share your thoughts about this movie..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={createReviewMutation.isPending || !comment.trim()}
                >
                  {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {movie.reviews && movie.reviews.length > 0 ? (
            <div className="space-y-4">
              {movie.reviews.map((review) => (
                <div key={review.id} className="rounded-lg border bg-card p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">⭐ {review.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {review.likes} likes
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No reviews yet. Be the first to review!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
