"use client";

import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function SignInPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Hàm kiểm tra và tạo user trong Strapi
  const checkOrCreateUserInStrapi = async () => {
    if (!user) return;

    const email = user.emailAddresses[0].emailAddress;
    const username = user.username || email.split("@")[0]; // Lấy username từ Clerk hoặc email
    const avatarUrl = user.imageUrl;
    let userRole = "Member"; // Mặc định là Member

    // Nếu bạn lưu role trong Clerk metadata, hãy lấy nó
    const clerkRole = user.publicMetadata?.role; // Ví dụ nếu Clerk có lưu role
    if (clerkRole === "Staff") {
      userRole = "Staff";
    }

    try {
      // Kiểm tra user có tồn tại trong Strapi không
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users?email=${email}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
      });

      const userData = await response.json();

      if (userData.length === 0) {
        // Nếu user chưa có, tạo user mới trong Strapi
        const createResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            username,
            email,
            password: Math.random().toString(36).slice(-8), // Mật khẩu ngẫu nhiên
            confirmed: true,
            blocked: false,
            role: userRole, // Gán role
            avatar: avatarUrl,
          }),
        });

        if (!createResponse.ok) throw new Error("Failed to create user in Strapi");
      }

      // Sau khi kiểm tra/tạo user, chuyển hướng đúng trang
      if (userRole === "Staff") {
        router.push("/staff");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error checking/creating user:", error);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        checkOrCreateUserInStrapi();
      } else {
        setLoading(false);
      }
    }
  }, [isSignedIn, isLoaded, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-700">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <SignIn
        path="/sign-in"
        appearance={{
          elements: {
            formButtonPrimary: "bg-black text-white hover:bg-gray-800",
            formFieldInput: "border-gray-300 focus:ring-black focus:border-black",
          },
        }}
      />
    </div>
  );
}


