"use client"

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    }
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">My Orders</h1>
      <ul>
        {orders.map((order: any) => (
          <li key={order.id} className="border p-2 my-2">
            <p>Order ID: {order.id}</p>
            <p>Total: ${order.total_price}</p>
            <p className={`font-bold ${order.status === "paid" ? "text-green-500" : "text-red-500"}`}>
              {order.status}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
