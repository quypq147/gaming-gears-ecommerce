import { notFound } from "next/navigation";
import getProductBySlug from "@/app/api/getProductBySlug";
import ProductClient from "./ProductClient";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug?: string };
}): Promise<Metadata> {
  if (!params?.slug) return {};

  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  return {
    title: product.name,  
    description:
      product.description || "Find great deals on high-quality products.",
    openGraph: {
      title: product.name,
      description:
        product.description || "Find great deals on high-quality products.",
      images: product.image?.length
        ? [`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${product.image[0].url}`]
        : [],
    },
  };
}

export default async function ProductServer({
  params,
}: {
  params: { slug?: string };
}) {
  if (!params?.slug) return notFound();

  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();

  return <ProductClient product={product} />;
}
