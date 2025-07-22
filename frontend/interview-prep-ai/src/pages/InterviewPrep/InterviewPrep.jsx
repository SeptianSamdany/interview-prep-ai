import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion"; 
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import RoleInfoHeader from "./components/RoleInfoHeader";

const InterviewPrep = () => {
    const { sessionId } = useParams(); 

    const [sessionData, setSessionData] = useState(null); 
    const [errorMsg, setErrorMsg] = useState(""); 

    const [openLeanMoreDrawer, setopenLeanMoreDrawer] = useState(false); 
    const [explanation, setexplanation] = useState(null); 

    const [isLoading, setIsLoading] = useState(false); 
    const [isUpdateLoader, setIsUpdateLoader] = useState(false); 

    // Fetch session data by session id 
    const fetchSessionDetailById = async () => {

    }; 

    // Generate Concept Explanation 
    const generateConceptExplanation = async (question) => {

    };

    // Pin Question 
    const toggleQuestionPinStatus = async (questionId) => {

    }; 

    // Add More questions to a session 
    const uploadMoreQuestions = async () => {

    }; 

    useEffect(() => {
        if (sessionId) {
            fetchSessionDetailById(); 
        }

        return () => {}; 
    }, []); 

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
       </DashboardLayout>
    )
}

export default InterviewPrep;