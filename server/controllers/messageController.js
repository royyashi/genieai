

import axios from "axios"
import Chat from "../models/Chat.js"
import User from "../models/User.js"
import imagekit from "../configs/imagekit.js"
import genAI from "../configs/openai.js"
//Text based AI chat message controller


export const textMessageController = async (req, res)=>{

    try {
        const userId = req.user._id
        const {chatId, prompt} =  req.body
        const chat= await Chat.findOne({userId, _id:chatId})
        chat.messages.push({role: "user", content: prompt, timestamp: Date.now(), isImage: false})

    const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
        });

            const result = await model.generateContent(prompt);

            const response = result.response.text();

            const reply = {
                role: "assistant",
                content: response,
                timestamp: Date.now(),
                isImage: false
            };
        res.json({success: true, reply})

        chat.messages.push(reply)
        await chat.save()

        // await User.updateOne({_id:userId})


        
    } catch (error) {
        res.json({success:false, message:error.message})
        
    }

}

export const imageMessageController = async (req, res) => {

    try {

        const userId = req.user._id;

        const { prompt, chatId, isPublished } = req.body;

        const chat = await Chat.findOne({
            userId,
            _id: chatId
        });

        if (!chat) {
            return res.json({
                success: false,
                message: "Chat not found"
            });
        }

        // Save user message
        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });

        // FREE AI IMAGE API
        const imageUrl =
            `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

        // Download generated image
        const aiImageResponse = await axios.get(
            imageUrl,
            {
                responseType: "arraybuffer"
            }
        );

        // Convert image to base64
        const base64Image =
            `data:image/png;base64,${Buffer.from(
                aiImageResponse.data
            ).toString("base64")}`;

        // Upload to ImageKit
        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "genieai"
        });

        const reply = {
            role: "assistant",
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        };

        // Save reply
        chat.messages.push(reply);

        await chat.save();

        // Send response
        res.json({
            success: true,
            reply
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: error.message
        });

    }

};