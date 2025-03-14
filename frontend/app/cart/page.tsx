"use client";

import { useWishlistCartStore } from "@/app/store/useWishlistCartStore";
import Header from "@/components/header";
import ProductDetails from "@/components/product-details";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity } = useWishlistCartStore();
  const [couponCode, setCouponCode] = useState("");

  // Calculate totals with rounding to prevent floating-point errors
  const subtotal = cart.reduce((acc, product) => acc + product.price * product.quantity, 0);
  const salesTax = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + salesTax;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Your Cart ({cart.length} items)</h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500">No items in cart.</p>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <div className="space-y-6">
                {cart.map((product) => (
                  <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
                    {/* Product Details */}
                    <ProductDetails product={product} />

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartQuantity(product.id, Math.max(product.quantity - 1, 1))}
                        disabled={product.quantity === 1}
                      >
                        ➖
                      </Button>
                      <span className="w-8 text-center">{product.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartQuantity(product.id, product.quantity + 1)}
                      >
                        ➕
                      </Button>
                    </div>

                    {/* Remove Item */}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="ml-4"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary Section */}
            <div className="bg-white p-6 rounded-lg shadow-md h-fit">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{subtotal.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax:</span>
                  <span>{salesTax.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Grand Total:</span>
                  <span className="font-bold text-lg">{grandTotal.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                </div>
              </div>

              {/* Coupon Input */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Enter Coupon Code"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button className="w-full mt-2" disabled={!couponCode.trim()}>Apply Coupon</Button>
              </div>

              <p className="text-green-600 text-sm mt-4">🎉 Congrats, you’re eligible for Free Shipping</p>
              
              {/* Checkout Button */}
              <Button className="w-full mt-6">Proceed to Checkout</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


