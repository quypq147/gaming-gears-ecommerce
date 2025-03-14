import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    console.log("Search Query:", query);
    console.log("Fetching from:", `${process.env.STRAPI_BASE_URL}/api/products?filters[name][$containsi]=${encodeURIComponent(query || '')}`);

    if (!query) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    const res = await fetch(
      `${process.env.STRAPI_BASE_URL}/api/products?filters[name][$containsi]=${encodeURIComponent(query)}`,
      { cache: "no-store" } // Avoid caching issues
    );

    if (!res.ok) {
      console.error("Error fetching products:", res.status, await res.text());
      return NextResponse.json({ error: "Failed to fetch products" }, { status: res.status });
    }

    const data = await res.json();
    console.log("Fetched Data:", data);

    return NextResponse.json({ products: data.data });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

