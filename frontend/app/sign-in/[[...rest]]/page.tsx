"use client";

import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function SignInPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  // Redirect authenticated users
  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <SignIn path="/sign-in" />
    </div>
  );
}
