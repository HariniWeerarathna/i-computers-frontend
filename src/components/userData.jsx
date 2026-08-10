import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import toast from "react-hot-toast";

export default function UserData(){

    const [user, setUser] = useState(null);
    const [selectedOption, setSelectedOption] = useState("name");
    const navigate = useNavigate();

    useEffect(
        ()=>{
            const token = localStorage.getItem("token");

            if(token !=null){

                api.get("/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((res)=>{

                    setUser(res.data.user);

                }).catch((err)=>{
                    
                    toast.error("Please login again");
                    localStorage.removeItem("token");
                    setUser(null);
                })

            }
        }
        ,[]
    )

    return (
        <>
            {user == null ?
                <div className="text-white p-2">
                    <Link to="/login">Login </Link>
                    |
                    <Link to="/register"> Register</Link>
                </div>
            :
                <div className="flex gap-2">
                    <img src={user.image} alt="Avatar" className="w-[40px] h-[40px] rounded-full border border-white p-2"/>
                    <select
                        value={selectedOption}
                        onChange={(e) => {
                            if(e.target.value === "settings"){
                                navigate("/settings");
                            }else if(e.target.value === "my-orders"){
                                navigate("/my-orders");
                            }else if(e.target.value === "logout"){
                                localStorage.removeItem("token");
                                setUser(null);
                                navigate("/login");
                            }
                        }}
                        className="bg-accent text-white p-2 rounded">
                        <option value="name">{user.firstName} {user.lastName}</option>
                        <option value="settings">Settings</option>
                        <option value="my-orders">My Orders</option>
                        <option value="logout">Logout</option>
                    </select>
                </div>
            }

            
        </>
    )
}
