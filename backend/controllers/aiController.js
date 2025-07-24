const { GoogleGenerativeAI } = require("@google/generative-ai");
const { conceptExplainPrompt, questionAnswerPrompt } = require('../utils/prompts');

// Initialize Google AI with proper class name
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to clean and parse AI response
const cleanAndParseJSON = (rawText) => {
    try {
        let cleanedText = rawText.trim();
        
        // Remove markdown code blocks (case insensitive)
        cleanedText = cleanedText.replace(/^```json\s*/i, "");
        cleanedText = cleanedText.replace(/^```\s*/i, "");
        cleanedText = cleanedText.replace(/```\s*$/i, "");
        cleanedText = cleanedText.trim();
        
        // Find the actual JSON content by looking for array/object boundaries
        const arrayStart = cleanedText.indexOf('[');
        const arrayEnd = cleanedText.lastIndexOf(']');
        const objectStart = cleanedText.indexOf('{');
        const objectEnd = cleanedText.lastIndexOf('}');
        
        // Determine if it's an array or object and extract accordingly
        if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
            // It's an array
            cleanedText = cleanedText.substring(arrayStart, arrayEnd + 1);
        } else if (objectStart !== -1 && objectEnd !== -1 && objectEnd > objectStart) {
            // It's an object
            cleanedText = cleanedText.substring(objectStart, objectEnd + 1);
        }
        
        // Parse the JSON
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("JSON cleaning and parsing failed:", error);
        console.error("Raw text length:", rawText.length);
        console.error("Raw text preview:", rawText.substring(0, 200) + "...");
        throw new Error("Failed to parse AI response as JSON");
    }
};
 
const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, numberOfQuestions } = req.body; 

        // Validate required fields
        if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
            return res.status(400).json({ 
                message: "Missing required fields: role, experience, topicsToFocus, numberOfQuestions" 
            }); 
        }

        // Generate prompt
        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);
        
        // Get model instance
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Make API call
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text();

        // Clean and parse response using helper function
        const data = cleanAndParseJSON(rawText);

        res.status(200).json(data); 
    } catch (error) {
        console.error("Error generating interview questions:", error);
        
        // More specific error handling
        if (error.message.includes("API key")) {
            return res.status(500).json({
                message: "AI service configuration error",
                error: "Invalid or missing API key"
            });
        } else if (error.message.includes("quota")) {
            return res.status(500).json({
                message: "AI service quota exceeded",
                error: "Please try again later"
            });
        } else if (error.message.includes("Failed to parse AI response")) {
            return res.status(500).json({
                message: "AI response parsing error",
                error: "The AI returned an invalid response format"
            });
        }
        
        res.status(500).json({
            message: "Failed to generate questions", 
            error: error.message 
        }); 
    }
}; 

const generateConceptExplanation = async (req, res) => { 
    try {
        const { question } = req.body; 
        
        if (!question) { 
            return res.status(400).json({ 
                message: "Missing required field: question" 
            }); 
        }

        const prompt = conceptExplainPrompt(question); 
        
        // Get model instance
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Make API call
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text();

        // Clean and parse response - more robust cleaning
        let cleanedText = rawText.trim();
        
        // Remove markdown code blocks
        cleanedText = cleanedText.replace(/^```json\s*/i, "");
        cleanedText = cleanedText.replace(/```\s*$/i, "");
        cleanedText = cleanedText.trim();
        
        // Find the actual JSON content by looking for array/object boundaries
        const jsonStart = cleanedText.indexOf('[') !== -1 ? cleanedText.indexOf('[') : cleanedText.indexOf('{');
        const jsonEnd = cleanedText.lastIndexOf(']') !== -1 ? cleanedText.lastIndexOf(']') + 1 : cleanedText.lastIndexOf('}') + 1;
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            cleanedText = cleanedText.substring(jsonStart, jsonEnd);
        }
        
        let data;
        try {
            data = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Raw text length:", rawText.length);
            console.error("Cleaned text:", cleanedText);
            console.error("First 100 chars:", cleanedText.substring(0, 100));
            console.error("Last 100 chars:", cleanedText.substring(cleanedText.length - 100));
            throw new Error("Invalid JSON response from AI");
        }

        res.status(200).json(data); 
    } catch (error) {
        console.error("Error generating concept explanation:", error);
        
        // More specific error handling
        if (error.message.includes("API key")) {
            return res.status(500).json({
                message: "AI service configuration error",
                error: "Invalid or missing API key"
            });
        } else if (error.message.includes("quota")) {
            return res.status(500).json({
                message: "AI service quota exceeded", 
                error: "Please try again later"
            });
        } else if (error.message.includes("Failed to parse AI response")) {
            return res.status(500).json({
                message: "AI response parsing error",
                error: "The AI returned an invalid response format"
            });
        }
        
        res.status(500).json({
            message: "Failed to generate explanation",
            error: error.message 
        }); 
    }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };