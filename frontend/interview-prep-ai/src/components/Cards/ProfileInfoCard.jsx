// ProfileInfoCard.jsx - FIXED
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import PROFILE_IMG from "../../assets/avatar.png";

const ProfileInfoCard = () => {
    const { user, clearUser } = useContext(UserContext); 
    const navigate = useNavigate(); 

    const handleLogout = () => {
        localStorage.clear(); 
        clearUser(); 
        navigate("/"); 
    }; 

    // Jika tidak ada user, return null
    if (!user) return null;

    return (
        <div className="flex items-center">
            <img
                src={user.profileImageUrl || PROFILE_IMG} // Fallback image
                alt={`${user.name || "User"}'s profile`} // Dynamic alt text
                className="w-11 h-11 bg-gray-300 rounded-full mr-3 object-cover"
                onError={(e) => {
                    e.target.src = PROFILE_IMG; // FIXED: Remove curly braces
                }}
            />
            <div>
                <div className="text-[15px] text-black font-bold leading-5">
                    {user.name || "Anonymous User"}
                </div>
                <button
                    className="text-amber-600 text-sm font-semibold cursor-pointer hover:underline transition-colors"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ProfileInfoCard;