const { saveQuestion, findAllQuestions, findQuestionById } = require("../repositories/question.repository");
const { saveAnswer, getAllAnswers } = require("../repositories/answer.repository");
const { generateHTML, transcribeAudio } = require("../services/openai.client");
const { htmlToPdfBuffer } = require("../services/puppeteer.client");
const { SUCCESS_MESSAGE, NOT_FOUND_MESSAGE } = require("../utils/constants");
const { saveCV, findCVsByUser } = require("../repositories/cv.repository");
const { saveImage, getCachedImage, deleteImageByUserId } = require("../repositories/image.repository");

const postQuestion = async (req, res) => {
    const { content } = req.body;
    const question = await saveQuestion({ content });
    res.json({
        message: SUCCESS_MESSAGE,
        question
    });
}

const postAnswer = async (req, res) => {
    const { questionId, content } = req.body;
    const userId = req.userId;
    const question = await findQuestionById(questionId);
    if(!question){
        res.status(404).json({
            message: NOT_FOUND_MESSAGE
        });
        return;
    }
    const answer = await saveAnswer(userId, questionId, question.content, content);
    res.json({
        message: SUCCESS_MESSAGE,
        answer
    });
}

const getAnswers = async (req, res) => {
    const userId = req.userId;
    const answers = await getAllAnswers(userId);
    res.json({
        message: SUCCESS_MESSAGE,
        answers
    });
}

const getQuestions = async (req, res) => {
    const questions = await findAllQuestions();
    res.json({
        message: SUCCESS_MESSAGE,
        questions
    });
}

const getPDF = async (req, res) => {
    try {
        const userId = req.userId;
        const templateName = req.body?.templateName || "harvard";
        
        // Get the photo URL if available
        const photoUrl = await getCachedImage(userId);
        console.log('Photo URL from getCachedImage:', photoUrl);
        const validPhotoUrl = (photoUrl && photoUrl.includes('res.cloudinary.com')) ? photoUrl : null;
        console.log('Valid photo URL being sent to OpenAI:', validPhotoUrl);
        
        // Pass photo URL to OpenAI for intelligent placement
        //const html = await generateHTML(userId, { templateName, photoUrl: validPhotoUrl });
        
        //const pdfBuffer = await htmlToPdfBuffer(html);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=resume.pdf");
        //res.send(pdfBuffer);
        res.send(html);
        saveCV(userId, pdfBuffer, templateName).catch(() => {});
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: error.message });
        }
    }
}

const getCVs = async (req, res) => {
    try {
        const userId = req.userId;
        const { page = 1, limit = process.env.CV_PAGINATION_LIMIT || 10 } = req.query;
        const result = await findCVsByUser(userId, { page, limit });
        res.json({
            message: SUCCESS_MESSAGE,
            ...result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getTemplates = (req, res) => {
    const templates = [
        { id: "harvard", name: "Harvard", description: "Estilo clásico, enfoque académico." },
        { id: "modern", name: "Modern", description: "Diseño moderno oscuro con tarjetas." }
    ];
    res.json({ templates });
}

const transcribe = async (req, res) => {
    try {
        const { audioBase64, mimeType, language } = req.body;
        const text = await transcribeAudio({ audioBase64, mimeType, language });
        res.json({ text });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const uploadImage = async (req, res) => {
    try {
        const { image } = req.body;
        const userId = req.userId;
        console.log('Uploading image for user:', userId);
        console.log('Image data type:', typeof image);
        console.log('Image data length:', image?.length);
        const imageUrl = await saveImage(userId, image);
        console.log('Image uploaded successfully:', imageUrl);
        res.json({
            message: SUCCESS_MESSAGE,
            image: imageUrl
        });
    } catch (error) {
        console.error('Image upload error:', error);
        const msg = error?.message || 'Upload failed';
        res.status(400).json({ message: msg });
    }
}

const getImage = async (req, res) => {
    const userId = req.userId;
    const image = await getCachedImage(userId);
    res.json({
        message: SUCCESS_MESSAGE,
        image
    });
}   

const deleteImage = async (req, res) => {
    const userId = req.userId;
    await deleteImageByUserId(userId);
    res.json({
        message: SUCCESS_MESSAGE
    });
}

module.exports = {
    postQuestion,
    postAnswer,
    getAnswers,
    getQuestions,
    getPDF,
    getTemplates,
    transcribe,
    getCVs,
    uploadImage,
    getImage,
    deleteImage
}