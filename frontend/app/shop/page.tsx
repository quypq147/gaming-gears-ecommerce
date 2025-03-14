import getProducts from "@/app/api/getProduct";
import ShopPageClient from "@/components/shop-page-client";

export default async function ShopPage() {
  const products = await getProducts();

  return <ShopPageClient products={products} />; 
}



