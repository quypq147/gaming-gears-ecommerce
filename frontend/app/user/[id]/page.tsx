import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface UserProps {
  params: { id: string };
}

export default async function UserProfile({ params }: UserProps) {
  const session = await getServerSession(authOptions);

  // 🔹 Redirect if not authenticated
  if (!session) return redirect("/sign-in");

  const userId = params.id;

  try {
    // 🔹 Fetch user data from Strapi
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`, // Ensure accessToken is set in session
      },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return notFound();
      throw new Error("Failed to fetch user data");
    }

    const user = await res.json();

    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold">{user.username || "Unknown User"}</h1>
        <p>Email: {user.email}</p>
        <p>Location: {user.location || "Not provided"}</p>
      </div>
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return <p className="text-red-500">Error loading user profile. Please try again later.</p>;
  }
}


