import ProductServer from "@/components/ProductServer";

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductServer params={params} />;
}
