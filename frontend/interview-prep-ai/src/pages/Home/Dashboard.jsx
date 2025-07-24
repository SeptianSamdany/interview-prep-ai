import { LuPlus } from "react-icons/lu";
import { CARD_BG } from "../../utils/data"; 
import toast from "react-hot-toast";
import DashboardLayout from '../../components/Layouts/DashboardLayout'; 
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import Modal from "../../components/Modal";
import CreateSessionForm from "./CreateSessionForm";
import DeleteAlertContent from "../../components/DeleteAlertContent";
import SummaryCard from "../../components/Cards/SummaryCard";

const Dashboard = () => {
    const navigate = useNavigate(); 

    const [openCreateModal, setOpenCreateModal] = useState(false); 
    const [sessions, setSessions] = useState([]); 
    const [loading, setLoading] = useState(true);

    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        open: false, 
        data: null, 
    }); 

    const fetchAllSessions = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL); 
            setSessions(response.data.sessions || []); 
        } catch (error) {
            console.error("Error fetching session data.", error);
            toast.error("Failed to fetch sessions");
        } finally {
            setLoading(false);
        }
    };
    
    const deleteSessions = async (sessionData) => {
        try {
            await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id)); 
            toast.success("Session Deleted Successfully"); 
            setOpenDeleteAlert({
                open: false, 
                data: null, 
            }); 
            fetchAllSessions(); 
        } catch (error) {
            console.error("Error deleting session data", error); 
        }
    }; 

    useEffect(() => {
        fetchAllSessions(); 
    }, []); 

    return (
       <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 md:px-6 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Interview Preparation Dashboard
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Manage your interview sessions and track your progress
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 md:px-6 py-8">
                {loading ? (
                    // Loading State
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : sessions.length === 0 ? (
                    // Empty State
                    <div className="text-center py-20">
                        <div className="mb-6">
                            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <LuPlus className="text-4xl text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No Interview Sessions Yet
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Get started by creating your first interview preparation session
                            </p>
                        </div>
                        <button
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF9324] to-[#E99A4B] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                            onClick={() => setOpenCreateModal(true)}
                        >
                            <LuPlus className="text-xl" />
                            Create First Session
                        </button>
                    </div>
                ) : (
                    // Sessions Grid
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Your Sessions ({sessions.length})
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sessions.map((data, index) => (
                                <div 
                                    key={data?._id}
                                    className="transform transition-all duration-200 hover:scale-105"
                                >
                                    <SummaryCard 
                                        colors={CARD_BG[index % CARD_BG.length]}
                                        role={data?.role || ""}
                                        topicsToFocus={data?.topicsToFocus || ""}
                                        experience={data?.experience || "-"}
                                        questions={data?.questions?.length || "-"}
                                        description={data?.description || "-"}
                                        lastUpdated={
                                            data?.updatedAt
                                            ? moment(data.updatedAt).format("Do MMM YYYY")
                                            : ""
                                        }
                                        onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                                        onDelete={() => setOpenDeleteAlert({ open: true, data })}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            {sessions.length > 0 && (
                <button
                    className="fixed bottom-6 right-6 md:bottom-8 md:right-8 h-14 w-14 md:h-16 md:w-16 bg-gradient-to-r from-[#FF9324] to-[#E99A4B] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 flex items-center justify-center group"
                    onClick={() => setOpenCreateModal(true)}
                >
                    <LuPlus className="text-2xl md:text-3xl group-hover:rotate-90 transition-transform duration-200" />
                </button>
            )}
        </div>

        {/* Create Session Modal */}
        <Modal
            isOpen={openCreateModal}
            onClose={() => setOpenCreateModal(false)}
            hideHeader
        >
            <CreateSessionForm 
                onSuccess={(newSession) => {
                    fetchAllSessions();
                }}
                onClose={() => setOpenCreateModal(false)}
            />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal 
            isOpen={openDeleteAlert?.open}
            onClose={() => {
                setOpenDeleteAlert({ open: false, data: null }); 
            }}
            title="Delete Session"
        >
            <div className="w-full max-w-md">
                <DeleteAlertContent
                    content="Are you sure you want to delete this session? This action cannot be undone."
                    onDelete={() => deleteSessions(openDeleteAlert.data)}
                />
            </div>
        </Modal>
       </DashboardLayout>
    )
}

export default Dashboard;