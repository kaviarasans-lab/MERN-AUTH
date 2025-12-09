import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
    const [isloggedin, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null); 
    
    const backendurl = import.meta.env.VITE_BACKEND_URL;

    const getAuthState = async () => {

    try {
   
         axios.defaults.withCredentials=true;
        const { data } = await axios.get(
            `${backendurl}/api/auth/is-auth`,
            {},
            { withCredentials: true }
        );

        if (data.success) {
            setIsLoggedIn(true);
            getUserData();
        }
    } catch (error) {
        toast.error(error.message);
    }
};


    const getUserData = async () => {
        try {
            const response = await axios.get(`${backendurl}/api/user/data`,{},{ withCredentials: true });
            
            
            console.log("API Response:", response);
            
            
            if (response.data.success) {
                setUserData(response.data.userData || response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message || "Failed to fetch user data");
            console.error("Error fetching user data:", error);
        }
    };

   useEffect(()=>{
         getAuthState();
   },[]);

    const value = { 
        backendurl,
        isloggedin,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData
    };

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    );
};

export default AppContent;