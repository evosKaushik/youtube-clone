import { createOrderService, verifyPaymentService } from "../services/payment.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const createOrder = async (req, res, next) => {
    try {
        const subscriptionPlan = req.query.plan;
        const isYearlySubscriptionPlan = req?.query?.isYearly === "true";
        const userId = req.user._id;
        const order = await createOrderService(userId, subscriptionPlan, isYearlySubscriptionPlan);
        return res.status(200).json(new ApiResponse(200, order, "Order created successfully"));
    }
    catch (error) {
        next(error);
    }
};
const verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user._id;
        await verifyPaymentService(userId, razorpay_order_id, razorpay_payment_id, razorpay_signature);
        return res.status(200).json(new ApiResponse(200, null, "Payment verified successfully"));
    }
    catch (error) {
        next(error);
    }
};
export { createOrder, verifyPayment };
