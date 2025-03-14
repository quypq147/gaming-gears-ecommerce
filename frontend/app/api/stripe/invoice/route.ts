import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const { customerEmail, cartItems } = await req.json();

    // Check if a Stripe customer exists
    const customers = await stripe.customers.list({ email: customerEmail });
    let customer = customers.data.length ? customers.data[0] : null;

    if (!customer) {
      customer = await stripe.customers.create({
        email: customerEmail,
      });
    }

    // Create invoice items
    for (const item of cartItems) {
      await stripe.invoiceItems.create({
        customer: customer.id,
        amount: item.price * 100, // Convert to cents
        currency: "usd",
        description: item.name,
      });
    }

    // Create an invoice
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      auto_advance: true, // Automatically finalize
    });

    // Finalize the invoice
    await stripe.invoices.finalizeInvoice(invoice.id);

    return NextResponse.json({ success: true, invoiceUrl: invoice.hosted_invoice_url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to create invoice" });
  }
}
