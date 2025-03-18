"use client";

import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function SignUpPage() {
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
      <SignUp path="/sign-up" />
    </div>
  );
}
