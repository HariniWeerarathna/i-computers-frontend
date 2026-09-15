import { useState } from "react";
import { Link } from "react-router-dom";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import UserData from "./userData";
import { CiBoxList, CiHome, CiPhone, CiShoppingCart } from "react-icons/ci";
import { FiMenu, FiX } from "react-icons/fi";


export default function Header(){
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    return(
        <>
            <header className="relative w-full h-[100px] bg-accent flex p-4 justify-center lg:justify-between">
                
                <Link to="/" className="h-full">
                    <img src="/logo-white.png" referrerPolicy="no-referrer" alt="Logo" className="h-full"/>
                </Link>

                <div className="h-full text-primary hidden lg:flex items-center">
   
                    <Link to="/" className="h-full flex items-center px-4 hover:bg-accent-dark">Home</Link>
                    <Link to="/products" className="h-full flex items-center px-4 hover:bg-accent-dark">Products</Link>
                    <Link to="/about" className="h-full flex items-center px-4 hover:bg-accent-dark">About</Link>
                    <Link to="/reviews" className="h-full flex items-center px-4 hover:bg-accent-dark">Reviews</Link>
                </div>

                <div className="h-full hidden lg:flex items-center justify-between gap-6">
                    <Link to="/cart">
                        <PiShoppingCartSimpleLight className="text-white text-4xl" />
                    </Link>
                    <UserData />
                </div>

                <button onClick={() => setMobileMenuOpen((isOpen) => !isOpen)} className="absolute right-4 top-7 flex items-center gap-1 rounded-md px-2 py-2 text-white lg:hidden" aria-label="Open navigation menu" aria-expanded={mobileMenuOpen}>
                    {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
                </button>

                {mobileMenuOpen && (
                    <nav className="absolute right-4 top-[88px] z-40 w-48 rounded-lg bg-white py-2 shadow-xl lg:hidden">
                        <Link onClick={() => setMobileMenuOpen(false)} to="/about" className="block px-5 py-3 font-medium text-accent hover:bg-slate-100">About</Link>
                        <Link onClick={() => setMobileMenuOpen(false)} to="/reviews" className="block px-5 py-3 font-medium text-accent hover:bg-slate-100">Reviews</Link>
                    </nav>
                )}

            </header>


            <div className="fixed bottom-0 flex lg:hidden w-screen h-[80px] z-30 bg-white shadow-2xl shadow-black justify-evenly">
                
                <Link className="h-full min-w-0 flex-1 flex flex-col items-center justify-center" to="/">
                    <CiHome className="text-3xl text-accent" />
                    <span className="whitespace-nowrap text-[10px] text-accent">Home</span>
                </Link>

                <Link className="h-full min-w-0 flex-1 flex flex-col items-center justify-center" to="/products">
                    <CiBoxList className="text-3xl text-accent" />
                    <span className="whitespace-nowrap text-[10px] text-accent">Products</span>
                </Link>

                <Link className="h-full min-w-0 flex-1 flex flex-col items-center justify-center" to="/cart">
                    <CiPhone className="text-3xl text-accent" />
                    <span className="whitespace-nowrap text-[10px] text-accent">Contact</span>
                </Link>

                <Link className="h-full min-w-0 flex-1 flex flex-col items-center justify-center" to="/cart">
                    <CiShoppingCart className="text-3xl text-accent" />
                    <span className="whitespace-nowrap text-[10px] text-accent">Cart</span>
                </Link>
                <UserData />

            </div>

        </>

    )
    
}

//justify-between ----------------------> Space between child elements - placing
// hidden lg:flex ----------------------> hidden on small screens, flex on large screens
//justify-center lg:justify-between ----> Center on small screens, space between on large screens
