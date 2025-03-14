import type { Metadata } from "next";
import {Inter } from "next/font/google";
import { WishlistCartProvider } from "@/context/WishlistCartContext";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Gamesome - Upgrade your gaming experience!",
  description: "Gamesome - Upgrade your gaming experience!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter} antialiased`}
      >
        <WishlistCartProvider>
          
        {children}
        <Toaster position="top-right" reverseOrder={false} />
        </WishlistCartProvider>
      </body>
    </html>
  );
}
