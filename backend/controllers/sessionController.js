const Session = require('../models/Session'); 
const Question = require('../models/Question'); 

exports.createSession = async (req, res) => {
    try {
        console.log("Create session request body:", req.body);
        console.log("User from request:", req.user);
        
        const { role, experience, topicsToFocus, description, questions } = req.body; 
        
        // Use consistent user ID property
        const userId = req.user._id || req.user.id;
        
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "User not authenticated" 
            });
        }

        // Validate required fields
        if (!role || !experience || !topicsToFocus) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields: role, experience, topicsToFocus" 
            });
        }

        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Questions array is required and cannot be empty" 
            });
        }

        console.log("Creating session with userId:", userId);

        // Create session first
        const session = await Session.create({
            user: userId, 
            role, 
            experience, 
            topicsToFocus, 
            description: description || "", 
        }); 

        console.log("Session created:", session._id);

        // Create questions and collect their IDs
        const questionDocs = await Promise.all(
            questions.map(async (q) => {
                if (!q.question || !q.answer) {
                    throw new Error("Each question must have both question and answer");
                }
                
                const question = await Question.create({
                    session: session._id, 
                    question: q.question, 
                    answer: q.answer, 
                }); 
                return question._id; 
            })
        ); 

        console.log("Questions created:", questionDocs.length);

        // Update session with question IDs (if your Session model has questions field)
        if (session.questions !== undefined) {
            session.questions = questionDocs;
            await session.save();
        }

        // Return session with populated questions - CONSISTENT FORMAT
        const populatedSession = await Session.findById(session._id).populate('questions');
        
        res.status(201).json({ 
            success: true, 
            session: populatedSession || session,
            message: "Session created successfully"
        });

    } catch (error) {
        console.error("Create session error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to create session",
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }); 
    }
}; 

exports.getMySession = async (req, res) => {
    try {
        console.log("Get my sessions - User:", req.user);
        
        // Use consistent user ID property
        const userId = req.user._id || req.user.id;
        
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "User not authenticated" 
            });
        }

        console.log("Fetching sessions for userId:", userId);

        const sessions = await Session.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("questions")
            .lean(); // Use lean() for better performance
            
        console.log("Found sessions:", sessions.length);
        
        // FIXED: Return consistent format
        res.status(200).json({
            success: true,
            sessions: sessions,
            count: sessions.length
        });
    } catch (error) {
        console.error("Get sessions error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to fetch sessions",
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }); 
    }
}; 

exports.getSessionById = async (req, res) => {
    try {
        const sessionId = req.params.id;
        const userId = req.user._id || req.user.id;
        
        console.log("Get session by ID:", sessionId, "for user:", userId);

        if (!sessionId) {
            return res.status(400).json({ 
                success: false, 
                message: "Session ID is required" 
            });
        }

        // FIXED: Add error handling for invalid ObjectId
        if (!sessionId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid session ID format" 
            });
        }

        const session = await Session.findById(sessionId)
            .populate({
                path: "questions", 
                options: { sort: { isPinned: -1, createdAt: 1 }}, 
            })
            .exec(); 
        
        if (!session) {
            return res.status(404).json({ 
                success: false, 
                message: "Session not found" 
            }); 
        }

        // Check if user owns this session
        if (session.user.toString() !== userId.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: "Not authorized to access this session" 
            });
        }

        // CONSISTENT FORMAT - already correct
        res.status(200).json({ 
            success: true, 
            session: session 
        }); 
    } catch (error) {
        console.error("Get session by ID error:", error);
        
        // Handle specific MongoDB errors
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid session ID format" 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to fetch session",
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }); 
    }
}; 

exports.deleteSession = async (req, res) => {
    try {
        const sessionId = req.params.id;
        const userId = req.user._id || req.user.id;
        
        console.log("Delete session:", sessionId, "by user:", userId);

        // FIXED: Add validation for sessionId format
        if (!sessionId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid session ID format" 
            });
        }

        const session = await Session.findById(sessionId); 

        if (!session) {
            return res.status(404).json({ 
                success: false, 
                message: "Session not found" 
            }); 
        }

        // Check if the logged-in user owns this session 
        if (session.user.toString() !== userId.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: "Not authorized to delete this session" 
            }); 
        }

        // First, delete all questions linked to this session 
        const deletedQuestions = await Question.deleteMany({ session: session._id }); 
        console.log("Deleted questions:", deletedQuestions.deletedCount);

        // Then delete the session 
        await session.deleteOne(); 
        console.log("Session deleted successfully");

        res.status(200).json({ 
            success: true, 
            message: "Session deleted successfully",
            deletedQuestionsCount: deletedQuestions.deletedCount
        }); 
    } catch (error) {
        console.error("Delete session error:", error);
        
        // Handle specific MongoDB errors
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid session ID format" 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to delete session",
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }); 
    }
};