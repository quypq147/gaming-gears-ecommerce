import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { WishlistCartProvider } from "@/context/WishlistCartContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gamesome - Shop",
  description: "Gamesome - Shop for your gaming needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className={`${inter} antialiased`}>
      <WishlistCartProvider>{children}</WishlistCartProvider>
    </section>
  );
}
