import { getProducts } from "@/src/api/product";
import ShopPageClient from "@/src/components/shop-page-client";

export default async function ShopPage() {
  const products = await getProducts();

  return <ShopPageClient products={products} />; 
}



