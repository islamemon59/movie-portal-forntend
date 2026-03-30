"use client";

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
import { Mail, Calendar, Activity } from "lucide-react";

export default function AdminUsersPage() {
  const users = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "USER",
      reviews: 12,
      joinDate: "2024-01-15",
      lastActive: "2 hours ago",
      status: "Active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "USER",
      reviews: 28,
      joinDate: "2024-01-10",
      lastActive: "1 hour ago",
      status: "Active",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "USER",
      reviews: 5,
      joinDate: "2024-02-01",
      lastActive: "1 day ago",
      status: "Inactive",
    },
    {
      id: "4",
      name: "Alice Williams",
      email: "alice@example.com",
      role: "USER",
      reviews: 34,
      joinDate: "2023-12-20",
      lastActive: "30 minutes ago",
      status: "Active",
    },
    {
      id: "5",
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "USER",
      reviews: 8,
      joinDate: "2024-01-25",
      lastActive: "3 days ago",
      status: "Inactive",
    },
  ];

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative space-y-8 px-6 py-8 sm:px-10 lg:py-12">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">Manage Users</h1>
              <p className="mt-2 text-slate-400">
                View and manage user accounts and activity
              </p>
            </div>
            <Link href="/admin">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">← Back</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="border-0 bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur rounded-lg p-6 text-white">
              <p className="text-sm font-medium text-slate-400">Total Users</p>
              <p className="text-4xl font-bold mt-2 text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">{users.length}</p>
            </div>
            <div className="border-0 bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur rounded-lg p-6 text-white">
              <p className="text-sm font-medium text-slate-400">Active Users</p>
              <p className="text-4xl font-bold mt-2 text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
                {users.filter((u) => u.status === "Active").length}
              </p>
            </div>
            <div className="border-0 bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur rounded-lg p-6 text-white">
              <p className="text-sm font-medium text-slate-400">Total Reviews</p>
              <p className="text-4xl font-bold mt-2 text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                {users.reduce((sum, u) => sum + u.reviews, 0)}
              </p>
            </div>
          </div>

          {/* Users Table */}
          <Card className="border-0 bg-slate-800/50 backdrop-blur overflow-hidden">
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-white text-2xl">User Accounts</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white">
                <thead className="border-b border-slate-700/50 bg-slate-700/30">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Name</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Email</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Role</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Reviews</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Joined</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Last Active</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-700/30 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <p className="font-semibold">{user.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-400" />
                          <span className="text-xs text-slate-300">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-purple-500/30 text-purple-300 border-purple-500/50">{user.role}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-cyan-400">{user.reviews}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="h-4 w-4" />
                          {new Date(user.joinDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <Activity className="h-4 w-4 text-green-400" />
                          {user.lastActive}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={user.status === "Active" ? "bg-green-500/30 text-green-300 border-green-500/50" : "bg-slate-500/30 text-slate-300 border-slate-500/50"}
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
