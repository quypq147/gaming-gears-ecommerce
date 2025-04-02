import Image from "next/image";
import placeholderImg from "@/src/assets/placeholder.png";

interface Product {
  id: string;
  name: string;
  brand: {
    brand_name: string;
  };
  price: number;
  image: { url: string }[];
}

const ProductDetails = ({ product }: { product: Product }) => {
  const imageUrl =
    product.image?.length > 0 ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${product.image[0].url}` : placeholderImg;
  if (!product) return <p>Sản phẩm không tìm thấy.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-600">{product.brand?.brand_name}</p>
      <Image
        src={imageUrl}
        alt={product.name}
        width={400}
        height={300}
        className="rounded-lg"
      />
      <p className="text-xl font-bold mt-4">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(product.price)}
      </p>
    </div>
  );
};

export default ProductDetails;
