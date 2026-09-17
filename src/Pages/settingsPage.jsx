import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../context/userContext";
import uploadMedia from "../lib/uploadMedia";
import api from "../lib/api";
import LoadingAnimation from "../components/loadingAnimation";
import toast from "react-hot-toast";
import { FiUpload } from "react-icons/fi";

export default function SettingsPage() {

    const userInfo = useContext(UserContext);

    const [firstName, setFirstName] = useState(userInfo.user?.firstName || "");
    const [lastName, setLastName] = useState(userInfo.user?.lastName || "");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(userInfo.user?.image || "/images/default-profile.png");
    const previewUrlRef = useRef(null);
    const fileInputRef = useRef(null);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => () => {
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    }, []);

    function handleImageChange(event) {
        const selectedImage = event.target.files?.[0];
        if (!selectedImage) return;

        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = URL.createObjectURL(selectedImage);
        setImage(selectedImage);
        setImagePreview(previewUrlRef.current);
    }


    async function handleProfileUpdate() {
    
        const token = localStorage.getItem("token");
        if(token != null){
            try{
                setIsLoading(true);

                const data = {
                    firstName: firstName,
                    lastName: lastName,
                    image : userInfo.user?.image
                }

                if(image != null){
                    data.image = await uploadMedia(image);
                }

                await api.put("/users/update", data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                userInfo.setUser({ ...userInfo.user, firstName: data.firstName, lastName: data.lastName, image: data.image });
                setImage(null);
                setImagePreview(data.image || "/images/default-profile.png");
                toast.success("Profile updated successfully");
                setIsLoading(false);

            }catch(err){
                console.log(err);
                toast.error("Failed to update profile");
                setIsLoading(false);
            }
        }
    }

     async  function handlePasswordUpdate() {
    
        const token = localStorage.getItem("token");
        if(token != null){

            if(password != confirmPassword){
                toast.error("Passwords do not match");
                return;
            }

            try{
                setIsLoading(true);
                const data = {
                    password: password
                }

                await api.put("/users/password", data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                localStorage.removeItem("token");
                userInfo.setUser(null);
                toast.success("Password updated successfully. Please login again.");
                window.location.href = "/login";

            }catch(err){
                console.log(err);
                toast.error("Failed to update password");
                setIsLoading(false);
            }

        }

    }


    return (
        <div className="grid min-h-full w-full grid-cols-1 items-stretch justify-center gap-3 bg-primary p-3 pb-24 sm:p-6 lg:grid-cols-[repeat(2,minmax(0,28rem))]">
            <div className="flex h-full min-h-[26rem] w-full max-w-md flex-col justify-self-center rounded-xl bg-white p-4 shadow-xl sm:p-6">

                <h1 className="mb-5 text-2xl font-semibold text-secondary">Update Profile</h1>
                <div className="flex w-full flex-col gap-1.5">
                    <label className="text-sm font-semibold text-secondary">First Name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-11 w-full rounded-lg border border-gray-300 px-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-blue-100" />
                </div>
                <div className="mt-4 flex w-full flex-col gap-1.5">
                    <label className="text-sm font-semibold text-secondary">Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-11 w-full rounded-lg border border-gray-300 px-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-blue-100" />
                </div>
                <div className="mt-5 flex w-full flex-col gap-2">
                    <label className="text-sm font-semibold text-secondary">Profile Image</label>
                    <div className="relative mx-auto my-2 w-fit">
                        <img src={imagePreview} alt="Profile preview" className="h-28 w-28 rounded-full border-4 border-slate-100 object-cover shadow-sm" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-accent text-lg text-white shadow-md transition hover:scale-105 hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2" aria-label="Choose profile photo" title="Choose profile photo">
                            <FiUpload />
                        </button>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>
                <div className="mt-6 w-full">
                    <button className="h-12 w-full rounded-lg bg-accent font-semibold text-white transition-colors duration-300 hover:bg-accent-dark" onClick={handleProfileUpdate}>
                        Update Profile
                    </button>
                </div>


            </div>
             <div className="flex h-full min-h-[26rem] w-full max-w-md flex-col justify-self-center rounded-xl bg-white p-4 shadow-xl sm:p-6">
                <h1 className="mb-5 text-2xl font-semibold text-secondary">Change Password</h1>
                <div className="flex w-full flex-col gap-1.5">
                    <label className="text-sm font-semibold text-secondary">New Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 w-full rounded-lg border border-gray-300 px-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-blue-100" />
                </div>
                <div className="mt-4 flex w-full flex-col gap-1.5">
                    <label className="text-sm font-semibold text-secondary">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-11 w-full rounded-lg border border-gray-300 px-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-blue-100" />
                </div>
                <div className="mt-auto w-full pt-6">
                    <button className="h-12 w-full rounded-lg bg-accent font-semibold text-white transition-colors duration-300 hover:bg-accent-dark" onClick={handlePasswordUpdate}>
                        Change Password
                    </button>
                </div>
            </div>
            {
                isLoading && <LoadingAnimation />
            }
        </div>
    )
}