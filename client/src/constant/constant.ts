import { Subscription } from "@/types/subscription";

export const subscription: Subscription[] = [
  {
    plan: "Free",
    watchTimeInMinutes: 5,
    noOfDownloads: 0,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for occasional downloads",
    features: [
      "No Video Download",
      "Access All Videos",
      "Only 5 Minutes Watch Time Daily",
    ],
  },
  {
    plan: "Bronze",
    watchTimeInMinutes: 7,
    noOfDownloads: 1,
    monthlyPrice: 49,
    yearlyPrice: 499,
    description: "Limited downloads with basic access",
    features: [
      "1 Video Download Daily",
      "Access All Videos",
      "Priority Download Queue",
    ],
  },
  {
    plan: "Silver",
    watchTimeInMinutes: 10,
    noOfDownloads: 10,
    monthlyPrice: 99,
    yearlyPrice: 999,
    description: "Balanced plan for regular users",
    features: [
      "10 Video Downloads Daily",
      "Higher Watch Limit",
      "Faster Processing",
    ],
  },
  {
    plan: "Gold",
    watchTimeInMinutes: Infinity,
    noOfDownloads: Infinity,
    monthlyPrice: 199,
    yearlyPrice: 1999,
    description: "Unlimited everything",
    features: [
      "Unlimited Downloads",
      "Unlimited Watch Time",
      "Priority Support",
    ],
  },
];