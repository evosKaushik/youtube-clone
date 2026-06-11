import razorpay from "../config/razorpay.js";
import Payment from "../model/payment.model.js";
import crypto from "crypto";
import dotenv from "dotenv";
import User from "../model/user.model.js";
import { subscription } from "../constant/constant.js";
dotenv.config();
const createOrder = async (req, res) => {
    const subscriptionPlan = req.query.plan;
    const isYearlySubscriptionPlan = req?.query?.isYearly === "true";
    const subscriptionDetail = subscription.find((sub) => sub.plan === subscriptionPlan);
    if (!subscriptionDetail) {
        return res.status(404).json({
            message: "Subscription plan not found",
        });
    }
    const price = isYearlySubscriptionPlan
        ? subscriptionDetail.yearlyPrice
        : subscriptionDetail.monthlyPrice;
    const options = {
        amount: price * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    };
    try {
        const order = await razorpay.orders.create(options);
        await Payment.create({
            userId: req.user._id,
            razorpayOrderId: order.id,
            amount: price,
            status: "created",
            plan: subscriptionPlan,
            isYearly: isYearlySubscriptionPlan
        });
        res.status(200).json(order);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error" });
    }
};
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, } = req.body;
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id +
            "|" +
            razorpay_payment_id)
            .digest("hex");
        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }
        const payment = await Payment.findOne({
            razorpayOrderId: razorpay_order_id,
        }).sort({ createdAt: -1 }).lean();
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found",
            });
        }
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + (payment.isYearly ? 12 : 1));
        const subscriptionDetail = subscription.find((sub) => sub.plan === payment.plan);
        await User.findByIdAndUpdate(req.user._id, {
            "subscription.plan": payment.plan,
            "subscription.status": "active",
            "subscription.watchTimeInMinutes": subscriptionDetail?.watchTimeInMinutes,
            "subscription.noOfDownloads": subscriptionDetail?.noOfDownloads,
            "subscription.expiresAt": expiry,
        });
        await Payment.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, {
            razorpayPaymentId: razorpay_payment_id,
            status: "paid",
            paidAt: new Date(),
        });
        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Internal Server Error",
        });
    }
};
export { createOrder, verifyPayment };
