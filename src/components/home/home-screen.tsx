"use client";

import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useAuth, useTitles } from "@/hooks";

export function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const { data: titles = [] } = useTitles({ limit: 6 });

  const featuredMovies = titles.slice(0, 3);

  return (
    <main className="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:py-28">
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                Discover Your Next
                <br />
                <span className="text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
                  Favorite Movie
                </span>
              </h1>
              <p className="mt-6 text-xl text-slate-400 max-w-2xl">
                Explore a vast collection of movies, read reviews from the community,
                and build your personal watchlist.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/movies" className={buttonVariants({ size: "lg", className: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white" })}>
                Browse Movies
              </Link>
              {!isAuthenticated && (
                <Link
                  href="/auth/signup"
                  className={buttonVariants({ variant: "outline", size: "lg", className: "border-slate-600 text-white hover:bg-slate-800" })}
                >
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Featured Movies Section */}
        {featuredMovies.length > 0 && (
          <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10">
            <div className="mb-10">
              <h2 className="text-4xl font-bold text-white">Featured Movies</h2>
              <p className="text-slate-400 mt-2">Check out what&apos;s trending right now</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredMovies.map((movie) => (
                <Link key={movie.id} href={`/movies/${movie.id}`}>
                  <div className="group cursor-pointer overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur transition-all hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 duration-300">
                    <div className="relative h-72 overflow-hidden bg-slate-800">
                      <Image
                        src={movie.posterUrl}
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg line-clamp-2 text-white group-hover:text-blue-400 transition-colors">
                        {movie.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                        {movie.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-semibold text-yellow-400 flex items-center gap-1">
                          <span>⭐</span>
                          {movie.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded">
                          {new Date(movie.releaseDate).getFullYear()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-white">Why Choose Us</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="🎬"
              title="Extensive Library"
              description="Access a vast collection of movies across all genres and eras"
            />
            <FeatureCard
              icon="⭐"
              title="Community Reviews"
              description="Read and write reviews from passionate movie enthusiasts"
            />
            <FeatureCard
              icon="📋"
              title="Personal Watchlist"
              description="Keep track of movies you want to watch"
            />
          </div>
        </section>

      {/* CTA Section */}
      {isAuthenticated ? (
        <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
          <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Welcome back, <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">{user?.name}</span>!
            </h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Explore thousands of movies and build your personalized watchlist. Discover what&apos;s trending and rate your favorites.
            </p>
            <Link href="/movies" className={buttonVariants({ className: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white size-lg" })}>
              Start Exploring Now
            </Link>
          </div>
        </section>
      ) : (
        <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-600/10 to-blue-700/10 backdrop-blur p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to Discover?</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto text-lg">
              Create an account to unlock personalized recommendations, manage your watchlist, and join our community of movie enthusiasts.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/auth/signup" className={buttonVariants({ size: "lg", className: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white" })}>
                Get Started Free
              </Link>
              <Link
                href="/auth/login"
                className={buttonVariants({ variant: "outline", size: "lg", className: "border-blue-500/50 text-blue-300 hover:bg-blue-500/10" })}
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}
      </div>
    </main>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur p-8 text-center hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group">
      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-bold text-lg mb-2 text-white">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}
