import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WishlistCartProvider } from "@/context/WishlistCartContext";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

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
    <ClerkProvider>
    <html lang="en">
    <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
      <body className={`${inter} antialiased`}>
        <WishlistCartProvider>
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </WishlistCartProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
