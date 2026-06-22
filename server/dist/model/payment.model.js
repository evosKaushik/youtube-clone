import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    razorpayPaymentId: {
        type: String,
        default: null,
        index: true,
    },
    razorpaySignature: {
        type: String,
        default: null,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    currency: {
        type: String,
        default: "INR",
    },
    plan: {
        type: String,
        enum: ["Free", "Bronze", "Silver", "Gold"],
        required: true
    },
    isYearly: {
        type: Boolean,
        required: true
    },
    status: {
        type: String,
        enum: [
            "created",
            "pending",
            "paid",
            "failed",
            "cancelled",
        ],
        default: "created",
        index: true,
    },
    paidAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
