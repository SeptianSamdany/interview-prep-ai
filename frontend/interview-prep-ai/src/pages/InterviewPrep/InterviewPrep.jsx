import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion"; 
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import RoleInfoHeader from "./components/RoleInfoHeader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import QuestionCard from "../../components/Cards/QuestionCard";
import AIResponsePreview from "./components/AIResponsePreview";
import Drawer from "../../components/Drawer";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";

const InterviewPrep = () => {
    const { sessionId } = useParams(); 

    const [sessionData, setSessionData] = useState(null); 
    const [errorMsg, setErrorMsg] = useState(""); 

    const [openLeanMoreDrawer, setopenLeanMoreDrawer] = useState(false); 
    const [explanation, setExplanation] = useState(null); 

    const [isLoading, setIsLoading] = useState(false); 
    const [isUpdateLoader, setIsUpdateLoader] = useState(false); 
    const [isSessionLoading, setIsSessionLoading] = useState(true);

    const fetchSessionDetailById = async () => {
        try {
            setIsSessionLoading(true);
            setErrorMsg("");
            
            const response = await axiosInstance.get(
                API_PATHS.SESSION.GET_ONE(sessionId)
            ); 

            console.log("Session response:", response.data);

            if (response.data && response.data.session) {
                setSessionData(response.data.session); 
            } else if (response.data) {
                setSessionData(response.data);
            }
        } catch (error) {
            console.error("Error fetching session:", error); 
            
            if (error.response?.data?.message) {
                setErrorMsg(error.response.data.message);
            } else if (error.response?.status === 404) {
                setErrorMsg("Session not found");
            } else if (error.response?.status === 403) {
                setErrorMsg("Not authorized to access this session");
            } else {
                setErrorMsg("Failed to fetch session data");
            }
        } finally {
            setIsSessionLoading(false);
        }
    };

    const generateConceptExplanation = async (question) => {
        try {
            setErrorMsg(""); 
            setExplanation(null); 

            setIsLoading(true); 
            setopenLeanMoreDrawer(true);

            const response = await axiosInstance.post(
                API_PATHS.AI.GENERATE_EXPLANATION, 
                {
                    question, 
                }
            ); 

            if (response.data) {
                setExplanation(response.data); 
            }
        } catch (error) {
            setExplanation(null); 
            setErrorMsg("Failed to generate explanation, Try again later"); 
            console.log("Error :", error); 
        } finally {
            setIsLoading(false); 
        }
    };

    const toggleQuestionPinStatus = async (questionId) => {
        try {
            const response = await axiosInstance.post(
                API_PATHS.QUESTION.PIN(questionId)
            ); 

            console.log(response);

            if (response.data && response.data.question) {
                fetchSessionDetailById(); 
            }
        } catch (error) {
            console.log("Error :", error); 
            toast.error("Failed to toggle pin status");
        }
    }; 

    const uploadMoreQuestions = async () => {
        try {
            setIsUpdateLoader(true); 

            const aiResponse = await axiosInstance.post(
                API_PATHS.AI.GENERATE_QUESTIONS, 
                {
                    role: sessionData?.role, 
                    experience: sessionData?.experience, 
                    topicsToFocus: sessionData?.topicsToFocus, 
                    numberOfQuestions: 10, 
                }
            ); 

            const generatedQuestions = aiResponse.data; 

            const response = await axiosInstance.post(
                API_PATHS.QUESTION.ADD_TO_SESSION, 
                {
                    sessionId, 
                    questions: generatedQuestions, 
                }
            ); 

            if (response.data) {
                toast.success("Added More Q&A!"); 
                fetchSessionDetailById(); 
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setErrorMsg(error.response.data.message); 
            } else {
                setErrorMsg("Something went wrong");
            }
            toast.error("Failed to add more questions");
        } finally {
            setIsUpdateLoader(false); 
        }
    }; 

    useEffect(() => {
        if (sessionId) {
            fetchSessionDetailById(); 
        }
    }, [sessionId]);

    if (isSessionLoading) {
        return (
            <DashboardLayout>
                <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <SpinnerLoader />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (errorMsg && !sessionData) {
        return (
            <DashboardLayout>
                <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
                    <div className="flex flex-col justify-center items-center min-h-[400px]">
                        <LuCircleAlert className="text-4xl text-red-500 mb-4" />
                        <p className="text-red-600 text-center">{errorMsg}</p>
                        <button 
                            onClick={fetchSessionDetailById}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <RoleInfoHeader
                role={sessionData?.role || ""}
                topicsToFocus={sessionData?.topicsToFocus || ""}
                experience={sessionData?.experience || "-"}
                questions={sessionData?.questions?.length || "-"}
                description={sessionData?.description || ""}
                lastUpdated={
                    sessionData?.updatedAt
                        ? moment(sessionData.updatedAt).format("Do MMM YYYY")
                        : ""
                }
            />

            <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
                {/* FIXED: Perbaiki CSS class */}
                <h2 className="text-lg font-semibold text-black">Interview Q & A</h2>

                <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
                    {/* FIXED: Perbaiki grid layout */}
                    <div 
                        className={`col-span-12 ${openLeanMoreDrawer ? "md:col-span-8" : "md:col-span-12"}`}
                    >
                        {!sessionData?.questions || sessionData.questions.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No questions available for this session.</p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {sessionData.questions.map((data, index) => (
                                    <motion.div 
                                        key={data._id || index}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        layout
                                        layoutId={`question-${data._id || index}`}
                                    >
                                        <QuestionCard
                                            question={data?.question}
                                            answer={data?.answer}    
                                            onLearnMore={() => 
                                                generateConceptExplanation(data.question)
                                            }
                                            isPinned={data?.isPinned}
                                            onTogglePin={() => toggleQuestionPinStatus(data._id)}
                                        />

                                        {!isLoading && 
                                            sessionData?.questions?.length === index + 1 && (
                                                <div className="flex items-center justify-center mt-5">
                                                    <button 
                                                        className="flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer hover:bg-gray-800"
                                                        onClick={uploadMoreQuestions}
                                                        disabled={isUpdateLoader}
                                                    >
                                                        {isUpdateLoader ? (
                                                            <SpinnerLoader />
                                                        ) : (
                                                            <LuListCollapse className="text-lg" />
                                                        )}{" "}
                                                        Load More
                                                    </button>
                                                </div>
                                            )
                                        }
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>

                    {/* FIXED: Tambah grid class untuk drawer container */}
                    {openLeanMoreDrawer && (
                        <div className="col-span-12 md:col-span-4">
                            <Drawer 
                                isOpen={openLeanMoreDrawer}
                                onClose={() => setopenLeanMoreDrawer(false)}
                                title={!isLoading && explanation?.title}
                            >
                                {errorMsg && (
                                    <p className="flex gap-2 text-sm text-amber-600 font-medium">
                                        <LuCircleAlert className="mt-1" /> {errorMsg}
                                    </p>
                                )}
                                {isLoading && <SkeletonLoader />}
                                {!isLoading && explanation && (
                                    <AIResponsePreview content={explanation?.explanation} />
                                )}
                            </Drawer>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default InterviewPrep;