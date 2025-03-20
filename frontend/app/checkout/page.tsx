"use client";

import { useWishlistCartStore } from "@/app/store/useWishlistCartStore";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, clearCart } = useWishlistCartStore();
  const router = useRouter();

  // Checkout Form State
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate totals
  const subtotal = cart.reduce((acc, product) => acc + product.price * product.quantity, 0);
  const salesTax = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + salesTax;

  // Generate Order Code
  const generateOrderCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Handle Order Submission
  const handleOrderSubmit = async () => {
    if (!name || !address) {
      alert("Please fill in all required fields!");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      orderCode: generateOrderCode(),
      customerName: name,
      address,
      paymentMethod,
      totalAmount: grandTotal,
      products: cart.map((product) => ({
        id: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: orderData }),
      });

      if (!res.ok) throw new Error("Failed to place order");

      alert("Order placed successfully!");
      clearCart();
      router.push("/order-success");
    } catch (error) {
      alert("Error placing order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Order Summary Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Mini Cart Total</h2>

            {/* Cart Total Breakdown */}
            <div className="space-y-2 border-b pb-4">
              {cart.map((product) => (
                <div key={product.id} className="flex justify-between">
                  <span>
                    {product.name} ({product.quantity} × {product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })})
                  </span>
                  <span className="font-medium">
                    {(product.quantity * product.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 mt-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{subtotal.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax:</span>
                <span>{salesTax.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-lg">Grand Total:</span>
                <span className="font-bold text-lg">{grandTotal.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Billing & Shipping Info</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                className="w-full px-4 py-2 border rounded-md"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cod">Cash on Delivery (COD)</option>
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="momo">MoMo</option>
              </select>
            </div>

            {/* Checkout Button */}
            <Button className="w-full" onClick={handleOrderSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


