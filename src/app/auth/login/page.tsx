"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, LogIn } from "lucide-react";

import { Input } from "@/components/ui/Forms";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store/useStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (email && password) {
        // Mock success
        login(email, email.split("@")[0]);
        toast.success("Successfully logged in!");
        router.push("/dashboard");
      } else {
        toast.error("Please enter email and password");
      }
    } catch {
      toast.error("Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white">
              <BookOpen className="h-7 w-7" />
            </div>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link href="/auth/register" className="font-semibold text-primary-600 hover:text-primary-500">
              create a free account
            </Link>{" "}
            to start tracking scholarships
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Input
                id="email"
                type="email"
                label="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              leftIcon={<LogIn className="h-5 w-5" />}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Demo Login Info</span>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-gray-50 p-4 text-center text-xs text-gray-600 border border-gray-200">
              <p>For MVP presentation, any email and password will work.</p>
              <p className="mt-1 font-semibold text-gray-900">Try: student@example.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
