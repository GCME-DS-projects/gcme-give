"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderOpen, Target, Plus, Loader2 } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering to avoid SSG issues with hooks
export const dynamic = 'force-dynamic';

export default function AdminPage() {

  return (
    <div className="min-h-screen bg-[#f4f8fb] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#001F54] mb-2">Admin Dashboard</h1>
          <p className="text-[#001F54] opacity-80">
            Manage missionaries, projects, and strategies for GCME
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Missionaries Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#001F54]">
                <Users className="h-6 w-6" />
                Missionaries
              </CardTitle>
              <CardDescription>
                Manage missionary profiles and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/admin/missionaries">
                  <Button className="w-full bg-[#001F54] hover:bg-[#001F54]/90">
                    Manage Missionaries
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Projects Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#001F54]">
                <FolderOpen className="h-6 w-6" />
                Projects
              </CardTitle>
              <CardDescription>
                Manage donation projects and campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/admin/projects">
                  <Button className="w-full bg-[#001F54] hover:bg-[#001F54]/90">
                    Manage Projects
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Strategies Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#001F54]">
                <Target className="h-6 w-6" />
                Strategies
              </CardTitle>
              <CardDescription>
                Manage ministry strategies and approaches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/admin/strategies">
                  <Button className="w-full bg-[#001F54] hover:bg-[#001F54]/90">
                    Manage Strategies
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
