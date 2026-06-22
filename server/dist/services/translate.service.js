import { translate } from "@vitalets/google-translate-api";
import { ApiError } from "../utils/ApiError.js";
export const translateToEnglishService = async (textPayload) => {
    if (!textPayload) {
        throw new ApiError(400, "Enter valid text");
    }
    try {
        const { text } = await translate(textPayload, { to: "en" });
        if (!text) {
            throw new ApiError(400, "Unable to translate");
        }
        return text;
    }
    catch (error) {
        throw new ApiError(500, "Translation failed");
    }
};
