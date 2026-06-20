import razorpay from "../config/razorpay.js";
import Payment from "../model/payment.model.js";
import crypto from "crypto";
import dotenv from "dotenv";
import User from "../model/user.model.js";
import { SubscriptionPlan } from "../types/subscriptions.js";
import { subscription } from "../constant/constant.js";
import { ApiError } from "../utils/ApiError.js";

dotenv.config();

export const createOrderService = async (
  userId: string,
  subscriptionPlan: SubscriptionPlan,
  isYearlySubscriptionPlan: boolean
) => {
  const subscriptionDetail = subscription.find(
    (sub) => sub.plan === subscriptionPlan
  );

  if (!subscriptionDetail) {
    throw new ApiError(404, "Subscription plan not found");
  }

  const price = isYearlySubscriptionPlan
    ? subscriptionDetail.yearlyPrice
    : subscriptionDetail.monthlyPrice;

  const options = {
    amount: price * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  await Payment.create({
    userId,
    razorpayOrderId: order.id,
    amount: price,
    status: "created",
    plan: subscriptionPlan,
    isYearly: isYearlySubscriptionPlan,
  });

  return order;
};

export const verifyPaymentService = async (
  userId: string,
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) => {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(400, "Payment verification failed");
  }

  const payment = await Payment.findOne({
    razorpayOrderId: razorpay_order_id,
  })
    .sort({ createdAt: -1 })
    .lean();

  if (!payment) {
    throw new ApiError(404, "Payment record not found");
  }

  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + (payment.isYearly ? 12 : 1));

  const subscriptionDetail = subscription.find(
    (sub) => sub.plan === payment.plan
  );

  await User.findByIdAndUpdate(userId, {
    "subscription.plan": payment.plan,
    "subscription.status": "active",
    "subscription.watchTimeInMinutes": subscriptionDetail?.watchTimeInMinutes,
    "subscription.noOfDownloads": subscriptionDetail?.noOfDownloads,
    "subscription.expiresAt": expiry,
  });

  await Payment.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    {
      razorpayPaymentId: razorpay_payment_id,
      status: "paid",
      paidAt: new Date(),
    }
  );

  return true;
};
