import toast from "react-hot-toast"
import axiosInstance from "./axiosInstance"
import axios from "axios"
import { SubscriptionPlan } from "@/types/subscription"



const createOrderApi = async (plan: SubscriptionPlan, isYearly: boolean) => {
    try {
        const { data } = await axiosInstance.post(`/payments/create-order?plan=${plan}&isYearly=${isYearly}`)
        return data
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.error || "Something went wrong")
        }
    }
}

const verifyPayment = async (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}) => {
    try {
        const {data} = await axiosInstance.post(`/payments/verify-payment`, response);
        return data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.error || "Something went wrong")
        }
    }
};
export { createOrderApi, verifyPayment }