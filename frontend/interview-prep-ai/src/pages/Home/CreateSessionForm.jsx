import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const CreateSessionForm = ({ onSuccess, onClose }) => { // Added props
    const [formData, setFormData] = useState({
        role: "", 
        experience: "", 
        topicsToFocus: "", 
        description: "", 
    }); 

    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState(null); 

    const navigate = useNavigate(); 

    const handleChange = (key, value) => {
        setFormData((prevData) => ({
            ...prevData, 
            [key]: value, 
        })); 
        
        // Clear error when user starts typing
        if (error) {
            setError(null);
        }
    }; 

    const handleCreateSession = async (e) => {
        e.preventDefault(); 

        const { role, experience, topicsToFocus } = formData; 

        // Improved validation with trim
        if (!role.trim() || !experience.trim() || !topicsToFocus.trim()) {
            setError("Please fill all the required fields.");
            return; 
        }

        setError(""); 
        setIsLoading(true); 

        try {
            // First API call - Generate questions
            const aiResponse = await axiosInstance.post(
                API_PATHS.AI.GENERATE_QUESTIONS, 
                {
                    role: role.trim(), 
                    experience: experience.trim(), 
                    topicsToFocus: topicsToFocus.trim(), 
                    numberOfQuestions: 10, 
                }
            ); 

            const generatedQuestions = aiResponse.data; 

            // Second API call - Create session
            const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
                ...formData,
                role: formData.role.trim(),
                experience: formData.experience.trim(), 
                topicsToFocus: formData.topicsToFocus.trim(),
                description: formData.description.trim(),
                questions: generatedQuestions, 
            });

            if (response.data?.session?._id) {
                // Call success callback if provided
                if (onSuccess) {
                    onSuccess(response.data.session);
                }
                
                // Close modal if callback provided
                if (onClose) {
                    onClose();
                }
                
                // Navigate to interview prep
                navigate(`/interview-prep/${response.data.session._id}`); 
            } else {
                setError("Session created but no ID received. Please try again.");
            }
        } catch (error) {
            console.error("Create session error:", error);
            
            if (error.response?.data?.message) {
                setError(error.response.data.message); 
            } else if (error.code === "ECONNABORTED") {
                setError("Request timeout. Please check your connection and try again.");
            } else if (error.code === "ERR_NETWORK") {
                setError("Network error. Please check your internet connection.");
            } else {
                setError("Something went wrong. Please try again."); 
            } 
        } finally {
            setIsLoading(false);
        }
    }; 

    return (
        <div className="w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-black">
                Start a New Interview Journey 
            </h3>
            <p className="text-xs text-slate-700 mt-[5px] mb-3">
                Fill out a few quick details and unlock your personalized set of interview questions!
            </p>

            <form onSubmit={handleCreateSession} className="flex flex-col gap-3"> 
                <Input 
                    value={formData.role}
                    onChange={({target}) => handleChange("role", target.value)}
                    label="Target Role"
                    placeholder="(e.g., Frontend Developer, UI/UX Designer, etc.)"
                    type="text"
                    required
                />

                <Input 
                    value={formData.experience}
                    onChange={({target}) => handleChange("experience", target.value)}
                    label="Years of Experience"
                    placeholder="(e.g., 1 year, 3 years, 5 years, etc.)"
                    type="text" // Changed from number to text for flexibility
                    required
                />

                <Input 
                    value={formData.topicsToFocus}
                    onChange={({target}) => handleChange("topicsToFocus", target.value)}
                    label="Topics to Focus on"
                    placeholder="(Comma-separated, e.g., React, Node.js, MongoDB)"
                    type="text"
                    required
                />

                <Input 
                    value={formData.description}
                    onChange={({target}) => handleChange("description", target.value)}
                    label="Description"
                    placeholder="(Any specific goals or notes for this session)" // Fixed typo
                    type="text"
                />
                
                {error && (
                    <div className="text-red-500 text-xs pb-2.5 bg-red-50 p-3 rounded border border-red-200">
                        {error}
                    </div>
                )}

                <div className="flex gap-3 mt-2">
                    {onClose && (
                        <button
                            type="button"
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    )}
                    
                    <button
                        type="submit"
                        className={`btn-primary flex-1 flex items-center justify-center gap-2 ${
                            onClose ? '' : 'w-full'
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading && <SpinnerLoader />}
                        {isLoading ? "Creating Session..." : "Create Session"}
                    </button>
                </div>
            </form>
        </div>
    );
}; 

export default CreateSessionForm;