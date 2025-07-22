import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

const Login = (setCurrentPage) => {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState(null); 

    const { updateUser } = useContext(UserContext); 

    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault(); 

        if (!validateEmail(email)) {
            setError("Please enter a valid email address."); 
            return; 
        }

        if (!password) {
            setError("Please enter the valid password"); 
            return; 
        }

        setError(""); 

        // Login API Call
        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email, 
                password, 
            }); 

            const { token } = response.data; 

            if (token) {
                localStorage.setItem("token", token); 
                updateUser(response.data)
                navigate("/dashboard"); 
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message); 
            } else {
                setError("Something went wrong. Please try again later :)")
            }
        } 
    }; 

    return (
        <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-black">Welcome Back Little Baby
            </h3>
            <p className="text-xs text-slate-700 mt-[5px] mb-6">
                Please Enter yout details to Login
            </p>

            <form onSubmit={handleLogin}>
                <Input
                value={email}
                onChange={( { target } ) => setEmail(target.vallue)}
                label="Email Address"
                placeholder="user@gmail.com"
                text="text"
                />

                <Input
                value={password}
                onChange={( { target } ) => setPassword(target.vallue)}
                label="Password"
                placeholder="Min. 8 Characters"
                text="password"
                />

                {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

                <button type="submit" className="btn-primary">
                    Login
                </button>

                <p className="text-[13px] text-slate-800 mt-3">
                    Don't have an account?("")
                    <button
                    className="font-medium text-primary underline cursor-pointer"
                    onClick={() => {
                        setCurrentPage("signup"); 
                    }}
                    >
                        Sign Up
                    </button>
                </p>
            </form>
        </div>
    )
}

export default Login;