"use client";

import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";

export default function SignUpPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { getToken } = useAuth(); // Lấy JWT từ Clerk
  const router = useRouter();

  // Hàm kiểm tra hoặc tạo user trong Strapi
  const checkOrCreateUserInStrapi = async () => {
    if (!user) return;

    const email = user.emailAddresses[0].emailAddress;
    const username = user.username || email.split("@")[0];
    const avatarUrl = user.imageUrl;
    let userRole = "Member"; // Mặc định là Member

    // Kiểm tra role từ Clerk Metadata
    const clerkRole = user.publicMetadata?.role;
    if (clerkRole === "Staff") {
      userRole = "Staff";
    }

    try {
      const clerkToken = await getToken(); // Lấy JWT từ Clerk

      // Kiểm tra user có trong Strapi chưa
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users?email=${email}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
      });

      const userData = await response.json();

      if (userData.length === 0) {
        // Nếu user chưa có, tạo user mới trong Strapi với JWT
        const createResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            username,
            email,
            password: clerkToken, // Lưu JWT thay vì mật khẩu
            confirmed: true,
            blocked: false,
            role: userRole,
            avatar: avatarUrl,
          }),
        });

        if (!createResponse.ok) throw new Error("Failed to create user in Strapi");
      }

      // Chuyển hướng theo role
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
    if (isLoaded && isSignedIn) {
      checkOrCreateUserInStrapi();
    }
  }, [isSignedIn, isLoaded, user]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <SignUp
        path="/sign-up"
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


