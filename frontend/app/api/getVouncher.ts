'use server'

interface Vouncher {
  id: number;
  attributes: {
    vouncher_code: string;
    isActive: boolean;
    discount: number;
    StartTime: string;
    EndTime: string;
  };
}

export default async function getVounchers(): Promise<Vouncher[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/vounchers?filters[isActive][$eq]=true`,
      { cache: "no-store" } // Ensure fresh data
    );

    if (!res.ok) {
      throw new Error("Failed to fetch vouchers");
    }

    const json = await res.json();
    return json.data || []; // Return empty array if no vouchers found
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return [];
  }
}
