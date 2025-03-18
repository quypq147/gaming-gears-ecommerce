import ProductServer from "@/components/ProductServer";
import { Suspense } from "react";
import Loading from "@/app/loading";

export default function ProductPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <ProductServer params={params} />
    </Suspense>
  )
}
