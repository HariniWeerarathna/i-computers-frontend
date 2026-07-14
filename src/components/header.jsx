import { Link } from "react-router-dom";
import { PiShoppingCartSimpleLight } from "react-icons/pi";

export default function Header(){
    return(
        <header className="w-full h-[100px] bg-accent flex p-4 justify-between">
            <Link to="/" className="h-full">
                <img src="/logo-white.png" alt="Logo" className="h-full"/>
            </Link>

            <div className="h-full text-primary flex items-center">
                
                <Link to="/" className="h-full flex items-center px-4 hover:bg-accent-dark">Home</Link>
                <Link to="/products" className="h-full flex items-center px-4 hover:bg-accent-dark">Products</Link>
                <Link to="/about" className="h-full flex items-center px-4 hover:bg-accent-dark">About</Link>
            </div>

            <div className="w-[200px] h-full border   flex items-center">
                <Link to="/cart">
                    <PiShoppingCartSimpleLight className="text-white text-4xl" />
                </Link>
            </div>

        </header>
    )
    
}

//justify-between ----> Space between child elements - placing the first child at the start and the last child at the end of the container.