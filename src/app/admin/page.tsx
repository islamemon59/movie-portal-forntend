"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import {
  BarChart3,
  FileText,
  Film,
  Settings,
  Users,
  Eye,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative space-y-8 px-6 py-8 sm:px-10 lg:py-12">
          {/* Header Section */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="text-lg text-slate-400">
              Welcome back, <span className="text-blue-400 font-semibold">{user?.name}</span>. Here&apos;s what&apos;s happening on your platform.
            </p>
          </div>

          {/* Stats Cards - Modern Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Pending Reviews"
              value="12"
              trend="+2 from yesterday"
              icon={<FileText className="h-5 w-5" />}
              href="/admin/reviews"
              color="from-blue-500 to-cyan-500"
            />
            <StatCard
              label="Total Movies"
              value="256"
              trend="+5 this month"
              icon={<Film className="h-5 w-5" />}
              href="/admin/movies"
              color="from-purple-500 to-pink-500"
            />
            <StatCard
              label="Active Users"
              value="1,234"
              trend="+43 this week"
              icon={<Users className="h-5 w-5" />}
              href="/admin/users"
              color="from-green-500 to-emerald-500"
            />
            <StatCard
              label="Platform Views"
              value="45.2K"
              trend="+12% this week"
              icon={<TrendingUp className="h-5 w-5" />}
              href="/admin/analytics"
              color="from-orange-500 to-red-500"
            />
          </div>

          {/* Quick Actions Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <QuickActionCard
                title="Manage Reviews"
                description="Approve or reject pending user reviews"
                icon={<CheckCircle className="h-6 w-6" />}
                href="/admin/reviews"
                color="text-blue-400"
                bgColor="bg-blue-500/10"
              />
              <QuickActionCard
                title="Manage Movies"
                description="Add, edit, or remove movies/series"
                icon={<Film className="h-6 w-6" />}
                href="/admin/movies"
                color="text-purple-400"
                bgColor="bg-purple-500/10"
              />
              <QuickActionCard
                title="View Analytics"
                description="Monitor engagement and metrics"
                icon={<BarChart3 className="h-6 w-6" />}
                href="/admin/analytics"
                color="text-green-400"
                bgColor="bg-green-500/10"
              />
              <QuickActionCard
                title="Manage Users"
                description="View accounts and user activity"
                icon={<Users className="h-6 w-6" />}
                href="/admin/users"
                color="text-orange-400"
                bgColor="bg-orange-500/10"
              />
              <QuickActionCard
                title="Platform Stats"
                description="Real-time platform statistics"
                icon={<Eye className="h-6 w-6" />}
                href="/admin/analytics"
                color="text-pink-400"
                bgColor="bg-pink-500/10"
              />
              <QuickActionCard
                title="Settings"
                description="Configure platform settings"
                icon={<Settings className="h-6 w-6" />}
                href="/admin/settings"
                color="text-slate-400"
                bgColor="bg-slate-500/10"
              />
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-800/30 backdrop-blur text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  System Status
                </CardTitle>
                <CardDescription className="text-slate-400">All systems operational</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <p className="text-sm text-slate-300">Last updated: Just now</p>
              </div>
            </Card>

            <Card className="border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-800/30 backdrop-blur text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                  Admin Info
                </CardTitle>
                <CardDescription className="text-slate-400">You&apos;re logged in as an administrator</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <p className="text-sm text-slate-300">Email: {user?.email}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

function StatCard({ label, value, trend, icon, href, color }: StatCardProps) {
  return (
    <Link href={href}>
      <Card className="cursor-pointer border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-800/30 backdrop-blur text-white group hover:shadow-2xl transition-all duration-300 hover:shadow-blue-500/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <p className="text-sm font-medium text-slate-400">{label}</p>
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className={`text-xs font-medium bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                {trend}
              </p>
            </div>
            <div className={`p-3 rounded-lg bg-gradient-to-br ${color} text-white/90 group-hover:scale-110 transition-transform shadow-lg`}>
              {icon}
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  bgColor: string;
}

function QuickActionCard({
  title,
  description,
  icon,
  href,
  color,
  bgColor,
}: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Card className="cursor-pointer border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-800/30 backdrop-blur hover:from-slate-800/80 hover:to-slate-800/50 text-white transition-all group p-6 h-full flex flex-col justify-between hover:shadow-2xl hover:shadow-blue-500/20 duration-300">
        <div className="space-y-4 flex-1">
          <div className={`w-fit p-3 rounded-lg ${bgColor} group-hover:scale-110 transition-transform shadow-md`}>
            <div className={`${color}`}>{icon}</div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">{title}</h3>
            <p className="text-sm text-slate-400 mt-1">{description}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-fit text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors mt-4"
        >
          Access →
        </Button>
      </Card>
    </Link>
  );
}
