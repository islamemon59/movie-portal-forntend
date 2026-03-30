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
    <main className="flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 lg:py-32">
          <div className="space-y-8">
            <div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-tight">
                Discover Your Next
                <br />
                <span className="text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text font-black">
                  Favorite Movie
                </span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed font-medium">
                Explore a vast collection of movies, read reviews from fellow enthusiasts,
                and curate your personal watchlist.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
              <Link href="/movies" className={buttonVariants({ size: "lg", className: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold" })}>
                Browse Movies
              </Link>
              {!isAuthenticated && (
                <Link
                  href="/auth/signup"
                  className={buttonVariants({ variant: "outline", size: "lg", className: "border-blue-400/50 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 font-semibold" })}
                >
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Featured Movies Section */}
        {featuredMovies.length > 0 && (
          <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
            <div className="mb-10">
              <h2 className="text-5xl font-bold text-white mb-2">Featured Movies</h2>
              <p className="text-lg text-slate-400 font-medium">Explore what&apos;s trending right now in the world of cinema</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredMovies.map((movie) => (
                <Link key={movie.id} href={`/movies/${movie.id}`}>
                  <div className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-700/30 bg-slate-800/40 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/30 hover:bg-slate-800/60 duration-300">
                    <div className="relative h-72 overflow-hidden bg-slate-800">
                      <Image
                        src={movie.posterUrl}
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg line-clamp-2 text-white group-hover:text-cyan-300 transition-colors duration-200">
                        {movie.title}
                      </h3>
                      <p className="mt-3 text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {movie.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-bold text-amber-400 flex items-center gap-1 bg-amber-400/10 px-3 py-1 rounded-full">
                          <span>⭐</span>
                          {movie.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold bg-slate-700/50 px-3 py-1 rounded-full">
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
          <div className="mb-12">
            <h2 className="text-5xl font-bold text-white mb-2">Why Choose Us</h2>
            <p className="text-lg text-slate-400 font-medium">Everything you need for the ultimate movie experience</p>
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
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-blue-600/15 via-cyan-600/10 to-purple-600/15 backdrop-blur-sm p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome back, <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text font-black">{user?.name}</span>!
            </h2>
            <p className="text-slate-200 mb-8 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
              Explore thousands of movies and build your personalized watchlist. Discover what&apos;s trending and rate your favorites.
            </p>
            <Link href="/movies" className={buttonVariants({ size: "lg", className: "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold" })}>
              Start Exploring Now
            </Link>
          </div>
        </section>
      ) : (
        <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm p-12 text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">Ready to Discover?</h2>
            <p className="text-slate-200 mb-10 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              Create an account to unlock personalized recommendations, manage your watchlist, and join our community of movie enthusiasts.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/auth/signup" className={buttonVariants({ size: "lg", className: "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold" })}>
                Get Started Free
              </Link>
              <Link
                href="/auth/login"
                className={buttonVariants({ variant: "outline", size: "lg", className: "border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 font-semibold" })}
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
    <div className="rounded-2xl border border-slate-700/30 bg-slate-800/40 backdrop-blur-sm p-8 text-center hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20 hover:bg-slate-800/60 transition-all duration-300 group">
      <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">{icon}</div>
      <h3 className="font-bold text-xl mb-3 text-white group-hover:text-cyan-300 transition-colors">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed font-medium">{description}</p>
    </div>
  );
}
