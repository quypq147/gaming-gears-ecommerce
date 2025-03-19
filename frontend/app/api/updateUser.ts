// /app/api/updateUser.ts
"use server";

export default async function updateUser(userId: string, updatedData: any) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`, // Thêm token nếu API yêu cầu
        },
        body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
        throw new Error("Failed to update user data");
    }

    return await res.json();
}
