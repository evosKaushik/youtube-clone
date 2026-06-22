import { translateToEnglishService } from "../services/translate.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const translateToEnglishController = async (req, res, next) => {
    try {
        const { text: textPayload } = req?.body;
        const translatedText = await translateToEnglishService(textPayload);
        return res.status(200).json(new ApiResponse(200, { translatedText }, "Text translated successfully"));
    }
    catch (error) {
        next(error);
    }
};
export { translateToEnglishController };
