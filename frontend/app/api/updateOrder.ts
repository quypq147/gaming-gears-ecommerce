"use server";

export default async function updateOrder(orderId: string, updateData: object) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({ data: updateData }),
    });

    if (!res.ok) {
        throw new Error("Cant update order!");
    }

    return await res.json();
}
