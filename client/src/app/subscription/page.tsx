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

export default function Page() {
  const [isYearly, setIsYearly] = useState(false);
  const router = useRouter();

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for occasional downloads",
      monthlyPrice: "₹0",
      yearlyPrice: "₹0",
      features: [
        "1 Video Download Daily",
        "Access All Videos",
        "Standard Download Speed",
      ],
      button: {
        text: "Current Plan",
        url: "#",
      },
    },
    {
      id: "premium",
      name: "Premium",
      description: "Unlimited downloads for power users",
      monthlyPrice: "₹99",
      yearlyPrice: "₹999",
      popular: true,
      features: [
        "Unlimited Downloads",
        "No Daily Limits",
        "Priority Download Queue",
      ],
      button: {
        text: "Upgrade Now",
        url: "/premium",
      },
      onClick: async () => {
        
        
        const order = await createOrderApi();

        await loadRazorPayScript();

        const options: RazorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,

          name: "Youtube Clone",
          description: "Premium Subscription",

          handler: async (response: RazorpayPaymentResponse) => {
            const data = await verifyPayment(response);
            if(data?.success){
              toast.success("Payment successful")
              router.replace("/");
            }
          },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.open();
      },
    },
  ];

  return (
    <section className="min-h-[100dvh] flex items-center py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 text-center">
          <h1 className="text-3xl font-bold md:text-5xl lg:text-6xl">
            Download Without Limits
          </h1>

          <p className="max-w-2xl text-muted-foreground text-base md:text-lg">
            Start for free with one video download every day. Upgrade to Premium
            for unlimited downloads, priority access, and a seamless experience.
          </p>

          <div className="rounded-xl border bg-muted/40 px-4 py-3">
            <p className="font-medium text-sm">
              Free Plan → 1 Download Every 24 Hours
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Premium users enjoy unlimited downloads with no restrictions.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm md:text-base">
            <span>Monthly</span>

            <label className="relative inline-flex cursor-pointer items-center bg-text/20 rounded-full">
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

          <div className="flex w-full flex-col items-center justify-center gap-6 md:flex-row">
            {plans.map((plan) => {
              const currentPrice = isYearly
                ? plan.yearlyPrice
                : plan.monthlyPrice;

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
                      <span className="text-5xl font-bold">{currentPrice}</span>

                      {plan.id === "premium" && (
                        <span className="ml-2 text-muted-foreground">
                          {isYearly ? "/year" : "/month"}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {isYearly
                        ? "Billed yearly and save more"
                        : "Flexible monthly billing"}
                    </p>
                  </div>

                  <hr className="my-6" />

                  <div className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <FaCheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 border border-text/50  rounded-xl cursor-pointer">
                    <button
                      className={`cursor-pointer flex w-full items-center justify-center rounded-lg px-4 py-3 font-medium transition-all
                      ${
                        plan.popular
                          ? "bg-primary text-primary-foreground hover:opacity-90"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                      onClick={plan.onClick}
                    >
                      {plan.button.text}
                      <FaArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2 text-center">
            <p className="text-sm text-muted-foreground">
              Secure payments powered by Razorpay. Upgrade instantly and unlock
              unlimited downloads.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
