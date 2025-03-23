"use client";

import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { IoIosReturnLeft } from "react-icons/io";
import Link from "next/link";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!captchaVerified) return setError("Please verify the CAPTCHA");

    setLoading(true);

    
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    console.log("🔹 Login Response:", res);

    setLoading(false);  
    if (res?.error) setError("Invalid email or password");
    else router.push("/");

    const session = await getSession();
    setLoading(false);

    if (session?.user?.id) {
      router.push(`/user/${session.user.id}`); // Redirect to user profile
    } else {
      router.push("/"); // Fallback to homepage
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800"
    >
      {/* Return to Home */}
      <Link
        href="/"
        className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition"
      >
        <IoIosReturnLeft className="w-5 h-5" />
        <span className="font-medium">Return to Home</span>
      </Link>

      {/* Sign-In Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md bg-opacity-10 backdrop-blur-lg border border-gray-700 shadow-xl rounded-xl text-white">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">
              Sign In to GameSome
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 text-center mb-2">{error}</p>}
            <form onSubmit={handleSignIn} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                className="bg-gray-800 border-gray-600 focus:ring-2 focus:ring-blue-500 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                className="bg-gray-800 border-gray-600 focus:ring-2 focus:ring-blue-500 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* reCAPTCHA */}
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                onChange={() => setCaptchaVerified(true)}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 transition"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Forgot Password */}
            <div className="mt-2 text-center">
              <Link
                href="/forgot-password"
                className="text-blue-400 hover:text-blue-300 transition text-sm"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600"></span>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-900 px-2 text-gray-400">OR</span>
              </div>
            </div>

            {/* Google Sign-In */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center gap-2 border-gray-600 text-white hover:bg-gray-700 transition"
              onClick={() => signIn("google")}
            >
              <FcGoogle className="w-5 h-5" />
              <p className="text-black">Sign in with Google</p>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sign-Up Prompt */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-gray-400"
      >
        New to <span className="font-semibold text-white">GameSome</span>?{" "}
        <Link
          href="/sign-up"
          className="text-blue-500 hover:text-blue-400 transition font-medium"
        >
          Join Now
        </Link>
      </motion.p>
    </motion.div>
  );
}
