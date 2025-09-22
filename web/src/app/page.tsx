"use client";
import { LoginForm, SignUpForm } from "@/components/auth-forms";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function Home() {
  const { data: session, isPending: isLoading } = authClient.useSession();
  const [activeForm, setActiveForm] = useState<"signIn" | "signUp">("signIn");

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-lg font-semibold text-gray-700">
        Loading...
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            Welcome, {session.user?.name}
          </h1>
          <p className="mb-6 text-gray-600">You are logged in.</p>
          <button
            onClick={() => authClient.signOut()}
            className="rounded-lg bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
          Welcome to Our App
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Please log in or create an account to continue.
        </p>

        {/* Toggle buttons */}
        <div className="mb-6 flex justify-center gap-4">
          <button
            onClick={() => setActiveForm("signIn")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeForm === "signIn"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveForm("signUp")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeForm === "signUp"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Active form */}
        {activeForm === "signIn" ? <LoginForm /> : <SignUpForm />}
      </div>
    </div>
  );
}
