import './App.css'
import HomePage from './Pages/homePage';
import LoginPage from './Pages/loginPage';
import RegisterPage from './Pages/registerPage';
import { Routes, Route } from 'react-router-dom';
import AdminPage from './Pages/adminPage';
import TestPage from './Pages/testPage';
import { useEffect, useState } from "react";
import UserContext from './context/userContext';
import toast, { Toaster } from "react-hot-toast";
import api from "./lib/api";
import { GoogleOAuthProvider } from '@react-oauth/google';
import ResetPasswordPage from "./Pages/resetPassword";


function App() {

    const [user, setUser] = useState(null);
    const [userLoadingFinished, setUserLoadingFinished] = useState(false);

    useEffect(() => {
		const token = localStorage.getItem("token");

		    api.get("/users/me", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				setUser(res.data.user);
				setUserLoadingFinished(true);
			})
			.catch(() => {
				toast.error("Please login again");
				localStorage.removeItem("token");
				setUser(null);
				setUserLoadingFinished(true);
			});
	}, []);


  
    return (
        <GoogleOAuthProvider clientId="778686215223-64q64u8n161lpgu7osgp17h1jt2i3hiq.apps.googleusercontent.com">
            <UserContext value={
                {
                user: user,
                setUser: setUser,
                    userLoadingFinished: userLoadingFinished,
                }
            }>

                <div className="w-full h-screen bg-primary"> {/* 1st Div  -->  h-screen */}
                    <Toaster position="top-right" />
                    <Toaster toasterId="delete-confirmations" position="top-center" containerStyle={{ top: "50%", transform: "translateY(-50%)" }} />

                    <Routes>
                        <Route path="/*" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/admin/*" element={<AdminPage />} />
                        <Route path="/test" element={<TestPage />} />
                    </Routes> 
                </div>

            </UserContext>
        </GoogleOAuthProvider>
    )
}

export default App



// 778686215223-64q64u8n161lpgu7osgp17h1jt2i3hiq.apps.googleusercontent.com
