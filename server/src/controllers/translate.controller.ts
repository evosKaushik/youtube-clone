import { Request, Response } from "express";
import { translate } from '@vitalets/google-translate-api';

const translateToEnglishController = async (req: Request, res: Response) => {
    const { text: textPayload } = req?.body

    if (!textPayload) return res.status(400).json({ error: "enter valid text" })
    try {
        const { text } = await translate(textPayload, { to: 'en' });

        if(!text) return res.status(400).json({error: "Unable to translate"})
        
        res.status(200).json({
            translatedText: text
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}
export { translateToEnglishController }