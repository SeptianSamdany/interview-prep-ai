// DashboardLayout.jsx
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";

const DashboardLayout = ({children}) => {
    const { user } = useContext(UserContext); 
    
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar /> 
            {user ? (
                <main className="relative">
                    {children}
                </main>
            ) : (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Authentication Required
                        </h2>
                        <p className="text-gray-600">
                            Please log in to access your dashboard
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DashboardLayout;
