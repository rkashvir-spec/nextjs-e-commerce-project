"use server";

import { stripe } from "@/lib/stripe";
import { CartItem } from "@/store/cart-store";
import { redirect } from "next/navigation";

export const checkoutAction = async (formData: FormData): Promise<void> => {
  let sessionUrl: string | null = null;

  try {
    const itemsJson = formData.get("items") as string;
    if (!itemsJson) throw new Error("No items found in form data");

    const items = JSON.parse(itemsJson);
    
    const line_items = items.map((item: CartItem) => ({
      price_data: {
        currency: "zar",
        product_data: { name: item.name },
        // FIX 1: Convert to cents and ensure it is an integer
        unit_amount: Math.round(item.price * 100), 
      },
      quantity: item.quantity,
    }));

    // Ensure baseUrl is safely set
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
    });

    sessionUrl = session.url;
  } catch (error) {
    // This logs any API validation errors from Stripe directly into your terminal console
    console.error("Stripe Checkout Error:", error);
    throw error; 
  }

  // FIX 3: Always place redirect() OUTSIDE the try/catch block
  if (sessionUrl) {
    redirect(sessionUrl);
  }
};
