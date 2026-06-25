import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function LoginPage() {

    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const navigate = useNavigate()

    function handleLogin(){
        /*toast.success(email)
        toast.success(password) - show your email amd password as tick (as toast)*/
    
       /* axios.post("http://localhost:3000/users/login", 
            {
                email:email,
                password:password
            }
        )*/

        api.post("/users/login",
            {
                email:email,
                password:password
            }   
        ).then(
            (res)=>{
                toast.success("Login successful.")
                console.log(res.data.token)
                console.log(res.data.isAdmin)

                //browser store
                localStorage.setItem("token", res.data.token)
                
                if(res.data.isAdmin){
                    //admin dashboard
                    //1. window.location.href = "/admin"
                    navigate("/admin")
                }else{
                    //home page 
                    //1. window.location.href = "/"
                    navigate("/")
                }
            }
        ).catch(
            (err)=>{
                console.log(err)
                toast.error("Login failed.")
            }
        )
    }

    return(
        <div className="w-full h-full bg-[url('/bg.jpg')] bg-cover bg-center flex justify-center items-center">
            
            <div className="w-[450px] h-[580px] backdrop-blur-md shadow-2xl rounded-lg p-6 flex flex-col items-center">

                <img src="logo.webp" className="w-[150px] h-[70px] object-cover bg-accent/40 rounded-lg"/>
                <h1 className="text-3xl font-bold text-secondary mt-5">Login</h1>


                <label className="w-full mt-5 text-lg text-secondary font-semibold">Email</label>
                <input
                onChange={
                    (e)=>{      
                        //toast.success(e.target.value) - show updated email value in toast
                        setEmail(e.target.value)  
                    }
                }
                 type="email" className="w-full h-12 rounded-lg bg-secondary/20 border-2 border-accent focus:border-accent outline-none px-2 text-secondary" placeholder="user@gmail.com"/>



                <label className="w-full mt-5 text-lg text-secondary font-semibold">Password</label>
                <input
                onChange={
                    (e)=>{
                        //toast.success(e.target.value)
                        setPassword(e.target.value)
                    }
                }
                type="password" className="w-full h-12 rounded-lg bg-secondary/20 border-2 border-accent focus:border-accent outline-none px-2 text-secondary" placeholder="••••••••"/>
                <p className="w-full  text-right">Forget Password? reset <Link to="/reset-password" className="text-accent font-bold">here</Link></p>
                

                
                <button onClick={handleLogin}  className="w-full h-12 bg-accent rounded-lg text-white font-bold mt-5 ">Login</button>
                <p className="w-full  text-right">Do not have an account? register <Link to="/register" className="text-accent font-bold">here</Link></p>

                <button  className="w-full h-12 bg-secondary/20 rounded-lg text-secondary font-bold mt-5 border-2 border-secondary hover:bg-secondary hover:text-white transition-colors flex items-center justify-center gap-2"><FcGoogle /> Login with Google</button>

            </div>     
        </div>
    )
}