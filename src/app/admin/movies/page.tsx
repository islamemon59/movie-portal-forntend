"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Plus } from "lucide-react";

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState([
    {
      id: "1",
      title: "The Shawshank Redemption",
      genre: "Drama",
      year: 1994,
      director: "Frank Darabont",
      platform: "Netflix",
      rating: 9.3,
      status: "Published",
    },
    {
      id: "2",
      title: "The Dark Knight",
      genre: "Action",
      year: 2008,
      director: "Christopher Nolan",
      platform: "HBO Max",
      rating: 9.0,
      status: "Published",
    },
    {
      id: "3",
      title: "Inception",
      genre: "Sci-Fi",
      year: 2010,
      director: "Christopher Nolan",
      platform: "Amazon Prime",
      rating: 8.8,
      status: "Published",
    },
    {
      id: "4",
      title: "Pulp Fiction",
      genre: "Crime",
      year: 1994,
      director: "Quentin Tarantino",
      platform: "Disney+",
      rating: 8.9,
      status: "Draft",
    },
  ]);

  const handleDelete = (movieId: string) => {
    setMovies((prev) => prev.filter((m) => m.id !== movieId));
  };

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="flex-1 space-y-8 px-6 py-8 sm:px-10 lg:py-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Manage Movies & Series
            </h1>
            <p className="mt-2 text-muted-foreground">
              Add, edit, or remove content from the library
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin">
              <Button variant="outline">← Back to Dashboard</Button>
            </Link>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Movie
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardDescription>Total Titles</CardDescription>
              <p className="text-3xl font-bold">{movies.length}</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Published</CardDescription>
              <p className="text-3xl font-bold">
                {movies.filter((m) => m.status === "Published").length}
              </p>
            </CardHeader>
          </Card>
        </div>

        {/* Movies Table */}
        <Card>
          <CardHeader>
            <CardTitle>Movies Library</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Title</th>
                  <th className="px-6 py-4 text-left font-medium">Genre</th>
                  <th className="px-6 py-4 text-left font-medium">Year</th>
                  <th className="px-6 py-4 text-left font-medium">Director</th>
                  <th className="px-6 py-4 text-left font-medium">Platform</th>
                  <th className="px-6 py-4 text-left font-medium">Rating</th>
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-6 py-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {movies.map((movie) => (
                  <tr
                    key={movie.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium">{movie.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{movie.genre}</Badge>
                    </td>
                    <td className="px-6 py-4">{movie.year}</td>
                    <td className="px-6 py-4">{movie.director}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{movie.platform}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold">⭐ {movie.rating}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          movie.status === "Published" ? "success" : "warning"
                        }
                      >
                        {movie.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-2"
                          onClick={() => handleDelete(movie.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
