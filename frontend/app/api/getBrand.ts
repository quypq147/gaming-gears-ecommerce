'use server'

export default async function getBrand() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/brands?populate=*`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data from server");
  }
  const json = await res.json();
  return json.data;
}

