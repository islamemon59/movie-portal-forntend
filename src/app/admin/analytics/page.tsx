"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, FileText, Eye } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="flex-1 space-y-8 px-6 py-8 sm:px-10 lg:py-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="mt-2 text-muted-foreground">
              Platform performance and user engagement metrics
            </p>
          </div>
          <Link href="/admin">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        {/* Main Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Users"
            value="2,543"
            change="+12%"
            trend="up"
            icon={<Users className="h-4 w-4" />}
          />
          <MetricCard
            title="Total Reviews"
            value="3,891"
            change="+8%"
            trend="up"
            icon={<FileText className="h-4 w-4" />}
          />
          <MetricCard
            title="Page Views"
            value="45.2K"
            change="+23%"
            trend="up"
            icon={<Eye className="h-4 w-4" />}
          />
          <MetricCard
            title="Avg Rating"
            value="7.8/10"
            change="+0.3"
            trend="up"
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>

        {/* Charts & Tables */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Rated Movies */}
          <Card>
            <CardHeader>
              <CardTitle>Top Rated Movies</CardTitle>
              <CardDescription>Highest rated titles this month</CardDescription>
            </CardHeader>
            <div className="p-6 pt-0">
              <div className="space-y-4">
                {[
                  { title: "Inception", rating: 9.2, reviews: 156 },
                  { title: "The Shawshank Redemption", rating: 9.3, reviews: 234 },
                  { title: "The Dark Knight", rating: 9.0, reviews: 189 },
                  { title: "Pulp Fiction", rating: 8.9, reviews: 142 },
                  { title: "Forrest Gump", rating: 8.8, reviews: 167 },
                ].map((movie) => (
                  <div
                    key={movie.title}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{movie.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {movie.reviews} reviews
                      </p>
                    </div>
                    <Badge variant="success">⭐ {movie.rating}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Most Reviewed Movies */}
          <Card>
            <CardHeader>
              <CardTitle>Most Reviewed</CardTitle>
              <CardDescription>Titles with most user reviews</CardDescription>
            </CardHeader>
            <div className="p-6 pt-0">
              <div className="space-y-4">
                {[
                  { title: "The Shawshank Redemption", reviews: 234, users: 212 },
                  { title: "Inception", reviews: 156, users: 143 },
                  { title: "The Dark Knight", reviews: 189, users: 167 },
                  { title: "Interstellar", reviews: 178, users: 156 },
                  { title: "Avatar", reviews: 165, users: 148 },
                ].map((movie) => (
                  <div
                    key={movie.title}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{movie.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {movie.users} unique reviewers
                      </p>
                    </div>
                    <Badge variant="default">{movie.reviews}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* User Activity */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity Trends</CardTitle>
            <CardDescription>Last 7 days activity summary</CardDescription>
          </CardHeader>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {[
                { date: "Today", reviews: 34, users: 89 },
                { date: "Yesterday", reviews: 28, users: 76 },
                { date: "2 days ago", reviews: 42, users: 95 },
                { date: "3 days ago", reviews: 31, users: 82 },
                { date: "4 days ago", reviews: 26, users: 71 },
                { date: "5 days ago", reviews: 39, users: 88 },
                { date: "6 days ago", reviews: 45, users: 102 },
              ].map((day) => (
                <div
                  key={day.date}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-sm font-medium">{day.date}</span>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-primary rounded-full" style={{ width: `${day.reviews * 2}px` }} />
                      <span className="text-sm text-muted-foreground">{day.reviews} reviews</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-secondary rounded-full" style={{ width: `${day.users * 1.5}px` }} />
                      <span className="text-sm text-muted-foreground">{day.users} users</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}

function MetricCard({ title, value, change, trend, icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="text-muted-foreground">{icon}</div>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold">{value}</p>
          <Badge variant={trend === "up" ? "success" : "destructive"}>
            {trend === "up" ? "↑" : "↓"} {change}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
}
