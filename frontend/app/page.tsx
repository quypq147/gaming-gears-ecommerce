import Image from "next/image";
import getBrand from "@/app/api/getBrand";
import getProducts from "@/app/api/getProduct";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import ProductList from "@/components/product-list";
import Footer from "@/components/footer";
import Link from "next/link";
import TestMotion from "@/components/TestMotion";

export async function HomePage() {
  const brands = await getBrand();
  const products = await getProducts();

  const categories = [
    { name: "All", value: null },
    { name: "CPU", value: "cpu" },
    { name: "VGA", value: "vga" },
    { name: "Headphone", value: "headphone" },
    { name: "Mouse", value: "mouse" },
    { name: "Keyboard", value: "keyboard" },
    { name: "Monitor", value: "monitor" },
  ];

  const productsByCategory = await Promise.all(
    categories.map(async (category) => ({
      name: category.name,
      products: category.value
        ? await getProducts({ category: category.value })
        : products,
    }))
  );

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
            Upgrade your gaming experience!
          </p>
          <Link href="/shop">
            <Button className="w-full md:w-1/4 z-10 cursor-pointer">
              Shop Now Here!
            </Button>
          </Link>
        </div>
      </section>

      {/* Popular Brands Section */}
      <section className="bg-gray-100 p-4 md:p-6 rounded-lg relative bottom-5 text-center w-11/12 md:w-5/6 mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Popular Brands
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
          Top Product
        </h2>
        <ProductList
          products={products.filter((p: any) => p.trending).slice(0, 4)}
        />
      </section>

      {/* Featured Products with Tabs */}
      <section className="featured-product bg-gray-100 p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">
          If you like
        </h2>
        <Tabs defaultValue="All">
          <TabsList className="gap-4 md:gap-10 flex flex-wrap justify-center md:justify-between">
            {categories.map((category) => (
              <TabsTrigger
                key={category.name}
                value={category.name}
                className="text-sm md:text-base"
              >
                {category.name.toUpperCase()}
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
              View More
            </Button>
          </Link>
        </div>
      </section>

      {/* Test Framer Motion */}
      <TestMotion />
      <Footer />
    </main>
  );
}

export default HomePage;
