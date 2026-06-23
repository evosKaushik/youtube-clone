import axiosInstance from "./axiosInstance";

export const subscribeToChannelApi = async (channelId: string) => {
    try {
        const { data } = await axiosInstance.post(`/subscriptions/${channelId}/subscribe`);
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const unsubscribeFromChannelApi = async (channelId: string) => {
    try {
        const { data } = await axiosInstance.post(`/subscriptions/${channelId}/unsubscribe`);
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getMySubscriptionsApi = async () => {
    try {
        const { data } = await axiosInstance.get("/subscriptions/my-subscriptions");
        return data || [];
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const checkSubscriptionApi = async (channelId: string) => {
    try {
        const { data } = await axiosInstance.get(`/subscriptions/${channelId}/check`);
        return data;
    } catch (error) {
        console.error(error);
        return { subscribed: false };
    }
};
