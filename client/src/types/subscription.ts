export type SubscriptionPlan = "Free" | "Bronze" | "Silver" | "Gold";

export type Subscription = {
  plan: SubscriptionPlan;
  watchTimeInMinutes: number;
  noOfDownloads: number;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
};