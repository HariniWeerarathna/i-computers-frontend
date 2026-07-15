import {Route,Routes} from "react-router-dom";
import Header from "../components/header";
import ProductsPage from "./productsPage";
import ProductOverview from "./productOverview";
import CartPage from "./cartPage";
import CheckoutPage from "./checkoutPage";


export default function HomePage() {
    return(
        <div className="min-h-full w-full bg-primary">
        <Header/>
            <Routes>
                <Route path="/" element={<h1>Home Page</h1>} />
                <Route path="/about" element={<h1>About Page</h1>} />
                <Route path="/products" element={<ProductsPage/>} />
                <Route path="/overview/:productId" element={<ProductOverview/>} />
                <Route path="/cart" element={<CartPage/>} />
                <Route path="/checkout" element={<CheckoutPage/>} /> 
                <Route path="/*" element={<h1>404 Not Found</h1>} />
            </Routes>
        </div>
    )
}

//element - use the Function name (component) ex:CheckoutPage, 
//        - not File name                     ex:CheckoutPage.jsx.