import { translate } from '@vitalets/google-translate-api';
const translateToEnglishController = async (req, res) => {
    const { text: textPayload } = req?.body;
    if (!textPayload)
        return res.status(400).json({ error: "enter valid text" });
    try {
        const { text } = await translate(textPayload, { to: 'en' });
        if (!text)
            return res.status(400).json({ error: "Unable to translate" });
        return res.status(200).json({
            translatedText: text,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Translation failed" });
    }
};
export { translateToEnglishController };
