// Navbar.jsx
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between">
                <Link 
                    to="/dashboard"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                    <div className="w-8 h-8 bg-gradient-to-r from-[#FF9324] to-[#E99A4B] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">AI</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Interview Prep AI
                    </h2>
                </Link>

                <ProfileInfoCard />
            </div>
        </nav>
    )
}

export default Navbar;
