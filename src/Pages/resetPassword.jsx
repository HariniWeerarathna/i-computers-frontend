import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingAnimation from "../components/loadingAnimation";
import toast from "react-hot-toast";
import api from "../lib/api";
import { FiArrowLeft, FiEye, FiEyeOff, FiKey, FiLock, FiMail } from "react-icons/fi";

export default function ResetPasswordPage(){

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    async function handleOTPRequest(){
        if (!email.trim()) {
            toast.error("Enter the email address for your account");
            return;
        }
        setIsLoading(true);
        try{

            await api.post("/users/otp", { email : email });
            setIsOtpSent(true);
            toast.success("A verification code has been sent to your email");

        }catch(err){
            console.log(err);
            toast.error("Something went wrong");
        }

        setIsLoading(false);

    }

    async function handlePasswordReset(){
        if (!otp.trim() || !newPassword || !confirmPassword) {
            toast.error("Complete all fields to reset your password");
            return;
        }
        setIsLoading(true);
        try{
            if(newPassword !== confirmPassword){
                toast.error("Passwords do not match");
                setIsLoading(false);
                return;
            }

            await api.post("/users/reset-password", { email : email, otp : otp, newPassword : newPassword });
            navigate("/login");
            toast.success("Password reset successful");
        }catch(err){
            console.log(err);
            toast.error("Something went wrong");
        }
        setIsLoading(false);
    }

    return(
        <div className="min-h-full w-full bg-[url('/bg.jpg')] bg-cover bg-center px-4 py-8 flex justify-center items-center">

            {
                isOtpSent ?            
            <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/40 bg-white/95 shadow-2xl">
                <div className="bg-secondary px-7 py-6 text-white"><div className="mb-4 flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15"><FiLock /></div><span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Step 2 of 2</span></div><h1 className="text-2xl font-bold">Create a new password</h1><h2 className="mt-2 text-sm text-white/75">Enter the code sent to {email}</h2></div>
                <div className="p-7 flex flex-col justify-center items-center gap-4">
                <div className="flex w-full gap-2"><span className="h-1.5 flex-1 rounded-full bg-accent"/><span className="h-1.5 flex-1 rounded-full bg-accent"/></div>
                <div className="w-[80%] flex flex-col gap-2">
                    <label htmlFor="otp" className="flex items-center gap-2 font-semibold text-secondary"><FiKey /> Verification code</label>
                    <input autoFocus inputMode="numeric" maxLength="6" type="text" name="otp" id="otp" placeholder="Enter 6-digit code" className="reset-input tracking-[0.2em]" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} />
                </div>
                <div className="w-[80%] flex flex-col gap-2">
                    <label htmlFor="newPassword" className="flex items-center gap-2 font-semibold text-secondary"><FiLock /> New password</label>
                    <div className="relative"><input type={showPassword ? "text" : "password"} name="newPassword" id="newPassword" placeholder="At least 8 characters" className="reset-input pr-11" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /><button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 text-gray-500">{showPassword ? <FiEyeOff /> : <FiEye />}</button></div>
                </div>
                <div className="w-[80%] flex flex-col gap-2">
                    <label htmlFor="confirmPassword" className="flex items-center gap-2 font-semibold text-secondary"><FiLock /> Confirm password</label>
                    <div className="relative"><input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" id="confirmPassword" placeholder="Repeat your new password" className="reset-input pr-11" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /><button type="button" aria-label="Toggle confirmation visibility" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 text-gray-500">{showConfirmPassword ? <FiEyeOff /> : <FiEye />}</button></div>
                </div>
                <button disabled={isLoading} onClick={handlePasswordReset} className="w-[80%] reset-button">{isLoading ? "Resetting password..." : "Reset password"}</button>
                <button type="button" onClick={() => setIsOtpSent(false)} className="text-sm font-semibold text-secondary hover:text-accent">Use a different email</button>
                <Link to="/login" className="flex items-center gap-2 text-sm font-semibold text-accent"><FiArrowLeft /> Back to Login</Link>

                </div>
            </div>:
            <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/40 bg-white/95 shadow-2xl">
                <div className="bg-secondary px-7 py-6 text-white"><div className="mb-4 flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15"><FiLock /></div><span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Step 1 of 2</span></div><h1 className="text-2xl font-bold">Forgot your password?</h1><p className="mt-2 text-sm text-white/75">We’ll email you a secure verification code.</p></div>
                <div className="p-7 flex flex-col justify-center items-center gap-5">
                <div className="flex w-full gap-2"><span className="h-1.5 flex-1 rounded-full bg-accent"/><span className="h-1.5 flex-1 rounded-full bg-gray-200"/></div>
                <div className="w-[80%] flex flex-col gap-2">
                    <label htmlFor="email" className="flex items-center gap-2 font-semibold text-secondary"><FiMail /> Email address</label>
                    <input autoFocus type="email" name="email" id="email" placeholder="you@example.com" className="reset-input" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleOTPRequest()} />
                </div>
                <button disabled={isLoading} className="w-[80%] reset-button" onClick={handleOTPRequest}>{isLoading ? "Sending code..." : "Send verification code"}</button>
                <Link to="/login" className="flex items-center gap-2 text-sm font-semibold text-accent"><FiArrowLeft /> Back to Login</Link>
                </div>
            </div>
            }
            {
                isLoading && <LoadingAnimation />
            }
        </div>
    )
}
