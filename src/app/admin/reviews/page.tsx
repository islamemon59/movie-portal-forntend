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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([
    {
      id: "1",
      movieTitle: "The Shawshank Redemption",
      authorName: "John Doe",
      rating: 9,
      comment:
        "An absolute masterpiece. This film tells an incredible story of hope and friendship...",
      status: "PENDING",
      createdAt: "2024-03-25T10:00:00Z",
      likes: 45,
    },
    {
      id: "2",
      movieTitle: "Inception",
      authorName: "Jane Smith",
      rating: 8,
      comment: "Mind-bending and visually stunning. Nolan is a genius...",
      status: "APPROVED",
      createdAt: "2024-03-24T15:30:00Z",
      likes: 67,
    },
    {
      id: "3",
      movieTitle: "The Dark Knight",
      authorName: "Bob Johnson",
      rating: 10,
      comment: "The best superhero film ever made...",
      status: "PENDING",
      createdAt: "2024-03-23T08:45:00Z",
      likes: 23,
    },
  ]);

  const handleApprove = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId ? { ...review, status: "APPROVED" } : review
      )
    );
  };

  const handleReject = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId ? { ...review, status: "REJECTED" } : review
      )
    );
  };

  const pendingReviews = reviews.filter((r) => r.status === "PENDING");

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="flex-1 space-y-8 px-6 py-8 sm:px-10 lg:py-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Manage Reviews
            </h1>
            <p className="mt-2 text-muted-foreground">
              Approve or reject user-submitted reviews
            </p>
          </div>
          <Link href="/admin">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Pending Reviews"
            value={pendingReviews.length}
            color="warning"
          />
          <StatCard
            label="Approved"
            value={reviews.filter((r) => r.status === "APPROVED").length}
            color="success"
          />
          <StatCard label="Total Reviews" value={reviews.length} color="info" />
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Pending Reviews ({pendingReviews.length})
          </h2>

          {pendingReviews.length === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>All Caught Up</AlertTitle>
              <AlertDescription>
                No pending reviews. All reviews have been moderated.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {review.movieTitle}
                        </CardTitle>
                        <CardDescription>
                          By {review.authorName} •{" "}
                          {new Date(review.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant="warning">PENDING</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">
                          ⭐ {review.rating}/10
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {review.likes} likes
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(review.id)}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(review.id)}
                        className="gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          {/* Approved Reviews */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">
              Approved Reviews (
              {reviews.filter((r) => r.status === "APPROVED").length})
            </h2>
            <div className="space-y-4">
              {reviews
                .filter((r) => r.status === "APPROVED")
                .map((review) => (
                  <Card key={review.id} className="opacity-75">
                    <CardHeader className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">
                            {review.movieTitle}
                          </CardTitle>
                          <CardDescription>
                            By {review.authorName} •{" "}
                            {new Date(review.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant="success">APPROVED</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ⭐ {review.rating}/10 • {review.likes} likes
                      </p>
                    </CardHeader>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color: "warning" | "success" | "info";
}

function StatCard({ label, value, color }: StatCardProps) {
  const colorMap = {
    warning: "bg-yellow-50 dark:bg-yellow-900/20",
    success: "bg-green-50 dark:bg-green-900/20",
    info: "bg-blue-50 dark:bg-blue-900/20",
  };

  return (
    <Card className={colorMap[color]}>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <p className="text-3xl font-bold">{value}</p>
      </CardHeader>
    </Card>
  );
}
