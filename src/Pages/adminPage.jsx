import { BsBox, BsCart2 } from "react-icons/bs";
import { LuMessageSquareText, LuUsersRound } from "react-icons/lu";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import AdminProductsPage from "./admin/adminProductsPage";
import AddProductForm from "./admin/adminAddProductForm";
import EditProductForm from "./admin/adminEditProductForm";
import AdminOrdersPage from "./admin/adminOrdersPage";
import AdminUsersPage from "./admin/adminUsersPage";
import AdminReviewsPage from "./admin/adminReviewsPage";
import { useContext, useEffect } from "react";
import UserContext from "../context/userContext";


export default function AdminPage(){

    const userData = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!userData.user || !userData.user.isAdmin){
            navigate("/login");
        }
    }, [userData, navigate]);


    return(
        <div className="w-full h-full flex text-secondary">

            <div className="relative z-10 hidden h-full w-[340px] flex-col bg-white shadow-2xl sm:flex">
                <div className="w-full h-[60px] p-2 flex gap-2 items-end mb-2">
                    <img src="/logo.png" alt="logo" className=" h-full " />
                    <span className="text-2xl font-bold">Admin </span>
                </div>
                <Link to="/admin" className="w-full flex items-center p-2 text-xl gap-2 mb-2 hover:bg-accent hover:text-white"><BsCart2 className="text-3xl" /> Orders</Link>
                <Link to="/admin/products" className="w-full flex items-center p-2 text-xl gap-2 mb-2 hover:bg-accent hover:text-white"><BsBox className="text-3xl" /> Products</Link>
                <Link to="/admin/users" className="w-full flex items-center p-2 text-xl gap-2 mb-2 hover:bg-accent hover:text-white"><LuUsersRound className="text-3xl" /> Users</Link>
                <Link to="/admin/reviews" className="w-full flex items-center p-2 text-xl gap-2 mb-2 hover:bg-accent hover:text-white"><LuMessageSquareText className="text-3xl" /> Reviews</Link>
            </div>
            <div className="h-full w-full bg-primary pb-20 sm:w-[calc(100%-340px)] sm:pb-0">

                <Routes>
                    <Route path="/" element={<AdminOrdersPage />} />
                    <Route path="/products" element={<AdminProductsPage />} />
                    <Route path="/users" element={<AdminUsersPage />} />
                    <Route path="/reviews" element={<AdminReviewsPage />} />
                    <Route path="/add-product" element={<AddProductForm/>}/>
                    <Route path="/edit-product" element={<EditProductForm/>}/>
                </Routes>

            </div>
            <nav className="fixed inset-x-0 bottom-0 z-20 flex h-16 items-center justify-around border-t border-slate-200 bg-white px-2 shadow-lg sm:hidden" aria-label="Admin navigation">
                <Link to="/admin" className="flex min-w-14 flex-col items-center gap-0.5 text-xs font-medium text-accent"><BsCart2 className="text-xl" />Orders</Link>
                <Link to="/admin/products" className="flex min-w-14 flex-col items-center gap-0.5 text-xs font-medium text-accent"><BsBox className="text-xl" />Products</Link>
                <Link to="/admin/users" className="flex min-w-14 flex-col items-center gap-0.5 text-xs font-medium text-accent"><LuUsersRound className="text-xl" />Users</Link>
                <Link to="/admin/reviews" className="flex min-w-14 flex-col items-center gap-0.5 text-xs font-medium text-accent"><LuMessageSquareText className="text-xl" />Reviews</Link>
            </nav>
        </div>
    )
}



