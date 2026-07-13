import { useState, useEffect } from "react"
import LoadingAnimation from "../components/loadingAnimation";
import api from "../lib/api";
import toast from "react-hot-toast";
import ProductCard from "../components/productCard";

export default function ProductsPage() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);//loading state to show a loading indicator while fetching data

     useEffect(
        ()=>{
            if(loading){
                api.get("/products").then((response)=>{
                    setProducts(response.data);
                    setLoading(false);
                }).catch(()=>{
                    toast.error("Error fetching products");
                })
            }
        }
        ,[loading]//dependency array - this effect will run only when the loading state changes
    )

    return(
        <div className="w-full flex flex-wrap p-8 justify-center">
        {
            loading?<LoadingAnimation/>
            :<>
                {
                    products.map((product)=>{
                        return(
                            <ProductCard product={product} key={product.productId}/>
                        )
                    })
                }
            </>
        }
        </div>
    )
}
