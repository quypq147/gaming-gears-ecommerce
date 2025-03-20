"use server";

export default async function getOrders() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/orders?populate=products`, {
        headers: {
            Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
    });

    if (!res.ok) {
        throw new Error("Không thể tải danh sách đơn hàng!");
    }

    return await res.json();
}
