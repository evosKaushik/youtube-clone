"use client";

import { createOrderApi, verifyPayment } from "@/api/paymentApi";
import { loadRazorPayScript } from "@/libs/utils";
import { useState } from "react";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import type {
  RazorpayOptions,
  RazorpayPaymentResponse,
} from "@/types/razorpay";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { subscription } from "@/constant/constant";

export default function Page() {
  const [isYearly, setIsYearly] = useState(false);
  const router = useRouter();

  const plans = subscription.map((s) => {
    const isPopular = s.plan === "Silver";

    const isFree = s.plan === "Free";

    return {
      id: s.plan.toLowerCase(),
      name: s.plan,
      description: s.description,

      // keep raw numbers (important fix)
      monthlyPrice: s.monthlyPrice,
      yearlyPrice: s.yearlyPrice,

      features: s.features,
      popular: isPopular,

      button: {
        text: isFree ? "Current Plan" : "Upgrade Now",
      },

      onClick: isFree
        ? undefined
        : async () => {
            try {
              const order = await createOrderApi(s?.plan, isYearly);

              await loadRazorPayScript();

              const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: order.amount,
                currency: order.currency,
                order_id: order.id,
                name: "Youtube Clone",
                description: `${s.plan} Subscription`,

                handler: async (response: RazorpayPaymentResponse) => {
                  const data = await verifyPayment(response);
                  if (data?.success) {
                    toast.success("Payment successful");
                    router.replace("/");
                  }
                },
              };

              const razorpay = new window.Razorpay(options);
              razorpay.open();
            } catch (err) {
              toast.error("Payment failed");
            }
          },
    };
  });

  return (
    <section className="min-h-[100dvh] flex items-center py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 text-center">
          <h1 className="text-3xl font-bold md:text-5xl lg:text-6xl">
            Download Without Limits
          </h1>

          <p className="max-w-2xl text-muted-foreground text-base md:text-lg">
            Start free with limited downloads. Upgrade for full access.
          </p>

          {/* Toggle */}
          <div className="flex items-center gap-3 text-sm md:text-base">
            <span>Monthly</span>

            <label className="relative inline-flex cursor-pointer items-center rounded-full">
              <input
                type="checkbox"
                checked={isYearly}
                onChange={() => setIsYearly(!isYearly)}
                className="peer sr-only"
              />

              <div className="h-6 w-11 rounded-full bg-muted-foreground/30 transition peer-checked:bg-primary">
                <div
                  className={`mt-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    isYearly ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </label>

            <span>Yearly</span>

            {isYearly && (
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                Save 16%
              </span>
            )}
          </div>

          {/* PLANS */}
          <div className="flex w-full flex-col items-center justify-center gap-6 md:flex-row">
            {plans.map((plan) => {
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

              const priceLabel = isYearly ? "/year" : "/month";

              return (
                <div
                  key={plan.id}
                  className={`flex w-full max-w-sm flex-col rounded-2xl border bg-background p-6 transition-all
                  ${
                    plan.popular
                      ? "border-primary shadow-xl md:scale-105"
                      : "border-border shadow-sm"
                  }`}
                >
                  {plan.popular && (
                    <span className="mb-4 inline-flex w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {plan.description}
                    </p>

                    <div className="mt-5">
                      <span className="text-5xl font-bold">₹{price}</span>
                      <span className="ml-2 text-muted-foreground">
                        {priceLabel}
                      </span>
                    </div>
                  </div>

                  <hr className="my-6" />

                  {/* FEATURES */}
                  <div className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <FaCheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* BUTTON */}
                  <div className="mt-6">
                    <button
                      disabled={!plan.onClick}
                      onClick={plan.onClick}
                      className={`flex w-full items-center justify-center rounded-lg px-4 py-3 font-medium transition-all cursor-pointer
                      ${
                        plan.popular
                          ? "bg-primary text-white hover:opacity-90"
                          : "bg-secondary hover:bg-secondary/80"
                      }
                      ${!plan.onClick ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {plan.button.text}
                      <FaArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-sm text-muted-foreground">
            Secure payments powered by Razorpay
          </p>
        </div>
      </div>
    </section>
  );
}
