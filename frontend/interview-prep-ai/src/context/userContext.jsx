import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext(); 

const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        // Early return if user already exists
        if (user) {
            setLoading(false);
            return; 
        }

        const accessToken = localStorage.getItem("token"); 
        if (!accessToken) {
            setLoading(false); 
            return; 
        }

        const fetchUser = async () => {
            try { 
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE); 
                setUser(response.data); 
            } catch (error) {
                console.error("User not authenticated", error); 
                clearUser(); 
            } finally {
                setLoading(false); 
            }
        }; 

        fetchUser(); 
    }, [user]); // Added dependency for better effect management

    const updateUser = (userData) => {
        setUser(userData); 
        if (userData.token) {
            localStorage.setItem("token", userData.token); 
        }
        setLoading(false); 
    }; 

    const clearUser = () => {
        setUser(null); 
        localStorage.removeItem("token"); 
        setLoading(false); // Ensure loading is false after clearing
    }; 

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    )
};

export default UserProvider;
