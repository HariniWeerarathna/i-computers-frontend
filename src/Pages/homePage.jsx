import {Route,Routes} from "react-router-dom";
import Header from "../components/header";
import ProductsPage from "./productsPage";
import ProductsOverview from "./productsOverview";

export default function HomePage() {
    return(
        <div className="min-h-full w-full bg-primary">
        <Header/>
            <Routes>
                <Route path="/" element={<h1>Home Page</h1>} />
                <Route path="/about" element={<h1>About Page</h1>} />
                <Route path="/products" element={<ProductsPage/>} />
                <Route path="/*" element={<h1>404 Not Found</h1>} />
                <Route path="/overview/:productId" element={<ProductsOverview/>} />
            </Routes>
        </div>
    )
}