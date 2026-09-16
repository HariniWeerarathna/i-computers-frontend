import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import { useContext } from "react";
import UserContext from "../context/userContext";
import { CiBoxList, CiShoppingCart } from "react-icons/ci";
import { FiHome, FiInfo, FiLogOut, FiPackage, FiSettings, FiStar, FiUser } from "react-icons/fi";
import NotificationBell from "./notificationBell";


export default function Header(){
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const desktopLinkClass = ({ isActive }) => `h-full flex items-center px-4 transition-colors hover:bg-accent-dark ${isActive ? "bg-accent-dark font-semibold" : ""}`;
    const mobileLinkClass = ({ isActive }) => `relative h-full min-w-0 flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${isActive ? "text-accent" : "text-slate-700"}`;
    function closeMenu() {
        setMobileMenuOpen(false);
    }

    function logout() {
        localStorage.removeItem("token");
        closeMenu();
        navigate("/login");
    }
    
    return(
        <>
            <header onClick={mobileMenuOpen ? closeMenu : undefined} className="relative z-50 w-full h-[100px] bg-accent flex p-4 justify-center lg:justify-between">
                
                <Link to="/" className="h-full">
                    <img src="/logo-white.png" referrerPolicy="no-referrer" alt="Logo" className="h-full"/>
                </Link>

                <div className="h-full text-primary hidden lg:flex items-center">
   
                    <NavLink to="/" end className={desktopLinkClass}>Home</NavLink>
                    <NavLink to="/products" className={desktopLinkClass}>Products</NavLink>
                    <NavLink to="/about" className={desktopLinkClass}>About us</NavLink>
                    <NavLink to="/reviews" className={desktopLinkClass}>Reviews</NavLink>
                </div>

                <div className="h-full hidden lg:flex items-center justify-between gap-6">
                    <NotificationBell buttonClassName="text-white" showViewAll={false} notificationTypes={["new-product"]} autoClearReadAt={user?.isAdmin ? undefined : 5} />
                    <Link to="/cart">
                        <PiShoppingCartSimpleLight className="text-white text-4xl" />
                    </Link>
                    <button onClick={(event) => { event.stopPropagation(); setMobileMenuOpen((isOpen) => !isOpen); }} className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white/70 bg-white/15 shadow-sm" aria-label="Open account menu" aria-expanded={mobileMenuOpen}>
                        {user?.image ? <img src={user.image} alt="Your profile" className="h-full w-full object-cover" /> : <FiUser className="text-2xl text-white" />}
                    </button>
                </div>

                <div className="absolute left-4 top-6 lg:hidden">
                    <NotificationBell buttonClassName="text-white" showViewAll={false} notificationTypes={["new-product"]} autoClearReadAt={user?.isAdmin ? undefined : 5} />
                </div>

                <button onClick={(event) => { event.stopPropagation(); setMobileMenuOpen((isOpen) => !isOpen); }} className="absolute right-4 top-6 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white/70 bg-white/15 shadow-sm lg:hidden" aria-label="Open account menu" aria-expanded={mobileMenuOpen}>
                    {user?.image ? <img src={user.image} alt="Your profile" className="h-full w-full object-cover" /> : <FiUser className="text-2xl text-white" />}
                </button>

                {mobileMenuOpen && (
                    <nav onClick={(event) => event.stopPropagation()} className="absolute right-3 top-[88px] z-50 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white p-1.5 shadow-2xl" aria-label="Account menu">
                        {user && <>
                            <p className="px-2.5 pb-1 pt-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{user.firstName}'s account</p>
                            <NavLink onClick={closeMenu} to="/settings" className={({ isActive }) => `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold ${isActive ? "bg-blue-50 text-accent" : "text-slate-700 hover:bg-slate-50"}`}>
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600"><FiSettings /></span>Settings
                            </NavLink>
                            <NavLink onClick={closeMenu} to="/my-orders" className={({ isActive }) => `mt-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold ${isActive ? "bg-blue-50 text-accent" : "text-slate-700 hover:bg-slate-50"}`}>
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-violet-600"><FiPackage /></span>My orders
                            </NavLink>
                            <div className="my-1 border-t border-slate-100" />
                        </>}

                        {user?.isAdmin && <NavLink onClick={closeMenu} to="/admin" className="mt-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-accent"><FiPackage /></span>Admin dashboard
                        </NavLink>}
                        <div className="my-1 border-t border-slate-100" />
                        {user ? <button onClick={logout} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50"><FiLogOut /></span>Logout
                        </button> : <Link onClick={closeMenu} to="/login" className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-accent"><FiUser /></span>Log in or register
                        </Link>}
                    </nav>
                )}

            </header>
            {mobileMenuOpen && <button className="fixed inset-0 z-40 cursor-default" onClick={closeMenu} aria-label="Close account menu" />}


            <nav className="fixed inset-x-0 bottom-0 z-30 flex h-[76px] items-stretch border-t border-slate-300 bg-slate-50/95 px-1 shadow-[0_-8px_24px_rgba(15,23,42,0.18)] backdrop-blur lg:hidden" aria-label="Main navigation">
                
                <NavLink end className={mobileLinkClass} to="/">
                    <FiHome className="text-[25px]" />
                    <span>Home</span>
                </NavLink>

                <NavLink className={mobileLinkClass} to="/products">
                    <CiBoxList className="text-[28px]" />
                    <span>Products</span>
                </NavLink>

                <NavLink className={mobileLinkClass} to="/about">
                    <FiInfo className="text-[25px]" />
                    <span>About</span>
                </NavLink>

                <NavLink className={mobileLinkClass} to="/reviews">
                    <FiStar className="text-[25px]" />
                    <span>Reviews</span>
                </NavLink>

                <NavLink className={mobileLinkClass} to="/cart">
                    <CiShoppingCart className="text-[28px]" />
                    <span>Cart</span>
                </NavLink>
            </nav>

        </>

    )
    
}

//justify-between ----------------------> Space between child elements - placing
// hidden lg:flex ----------------------> hidden on small screens, flex on large screens
//justify-center lg:justify-between ----> Center on small screens, space between on large screens
