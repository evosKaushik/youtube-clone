import axiosInstance from "./axiosInstance";

export const getSearchSuggestionsApi = async (q: string) => {
    if (!q || q.trim().length < 2) return [];
    try {
        const { data } = await axiosInstance.get(`/video/suggestions?q=${encodeURIComponent(q)}`);
        return data || [];
    } catch (error) {
        console.error(error);
        return [];
    }
};
