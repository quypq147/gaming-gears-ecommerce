import Image from "next/image";
import { fetchBrands } from "@/src/api/brand";
import {getProducts} from "@/src/api/product";
import { Button } from "@/src/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import Header from "@/src/components/header";
import ProductList from "@/src/components/product-list";
import Footer from "@/src/components/footer";
import Link from "next/link";

export default async function HomePage() {
  try {
    // Fetch brands and products directly in the Server Component
    const brands = await fetchBrands();
    const products = await getProducts();

    const categories = [
      { name: "All", value: null },
      { name: "Cpu", value: "cpu" },
      { name: "Vga", value: "vga" },
      { name: "Headphone", value: "headphone" },
      { name: "Mouse", value: "mouse" },
      { name: "Keyboard", value: "keyboard" },
      { name: "Monitor", value: "monitor" },
    ];

    // Group products by category
    const productsByCategory = categories.map((category) => ({
      name: category.name,
      products: category.value
        ? products.filter((p: any) => p.category === category.value)
        : products,
    }));

    return (
      <main className="bg-white">
        <Header />
        {/* Hero Section */}
        <section className="relative px-6 md:px-20 py-6 bg-[url(../assets/bg.jpg)] flex flex-col min-h-screen bg-cover bg-center bg-no-repeat">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="hero-content z-10 flex flex-col p-6 md:p-20 gap-4 text-center md:text-left">
            <h1 className="font-bold text-white text-4xl md:text-8xl">
              Gamesome
            </h1>
            <p className="text-white text-lg md:text-xl">
              Nâng cấp trải nghiệm gaming của bạn!
            </p>
            <Link href="/shop">
              <Button className="w-full md:w-1/4 z-10 cursor-pointer">
                Mua ngay đây!
              </Button>
            </Link>
          </div>
        </section>

        {/* Popular Brands Section */}
        <section className="bg-gray-100 p-4 md:p-6 rounded-lg relative bottom-5 text-center w-11/12 md:w-5/6 mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Các hãng nổi tiếng
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-center items-center">
            {brands.slice(0, 6).map((brand: any) => (
              <Image
                key={brand.id}
                src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${brand.brand_logo.url}`}
                alt={brand.brand_name}
                width={120}
                height={50}
                className="h-auto object-contain max-w-[150px] mx-auto"
              />
            ))}
          </div>
        </section>

        {/* Top Products Section */}
        <section className="p-4 md:p-5">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">
            Sản phẩm trending
          </h2>
          <ProductList
            products={products.filter((p: any) => p.trending).slice(0, 4)}
          />
        </section>

        {/* Featured Products with Tabs */}
        <section className="featured-product bg-gray-100 p-4 md:p-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">
            Nếu bạn muốn
          </h2>
          <Tabs defaultValue="All">
            <TabsList className="gap-4 md:gap-10 flex flex-wrap justify-center md:justify-between">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.name}
                  value={category.name}
                  className="text-sm md:text-base"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {productsByCategory.map((categoryData) => (
              <TabsContent key={categoryData.name} value={categoryData.name}>
                <ProductList products={categoryData.products.slice(0, 4)} />
              </TabsContent>
            ))}
          </Tabs>
          <div className="flex justify-center p-6">
            <Link href="/shop">
              <Button className="w-full md:w-auto cursor-pointer">
                Xem tất cả sản phẩm
              </Button>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <p>Đã xảy ra lỗi khi tải dữ liệu.</p>;
  }
}
