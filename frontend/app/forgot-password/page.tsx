"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { IoIosReturnLeft } from "react-icons/io";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("A password reset link has been sent to your email.");
      } else {
        setError(data?.error?.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800">
      {/* Return to Sign-In */}
      <Link href={"/sign-in"} className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition">
        <IoIosReturnLeft className="w-5 h-5" />
        <span className="font-medium">Back to Sign In</span>
      </Link>

      {/* Forgot Password Card */}
      <Card className="w-full max-w-md bg-opacity-10 backdrop-blur-lg border border-gray-700 shadow-xl rounded-xl text-white">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          {message && <p className="text-green-500 text-center mb-2">{message}</p>}
          {error && <p className="text-red-500 text-center mb-2">{error}</p>}
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-gray-800 border-gray-600 focus:ring-2 focus:ring-blue-500 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 transition" disabled={loading}>
              {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
