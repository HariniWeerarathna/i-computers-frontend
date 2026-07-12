import { Link } from "react-router-dom";
import getFormattedPrice from "../lib/price-format";

export default function ProductCard(props){//P-capital only

    const product = props.product;

    return(
        <Link to={"/overview/"+product.productId} state={ product } className="bg-white w-[390px] h-[500px] m-6 shadow-2xl rounded-xl hover:[&_.primary-image]:opacity-0 flex flex-col overflow-hidden">
            <div className="w-full h-[350px] relative">

                <img src={product.images[0]} className="w-full h-full absolute"/>
                <img src={product.images[1]} className="w-full h-full absolute bg-white primary-image transition-opacity duration-700"/>
            </div>

            <span className="text-sm text-gray-400 font-thin px-2 mt-2">{product.productId}</span>
            <h1 className="text-lg font-semibold px-2">{product.name}</h1>  

            {
                product.labelledPrice > product.price && <span className="text-sm text-gray-500 mt-2 line-through px-2">{getFormattedPrice(product.labelledPrice)}</span>
            }
            <span className="text-xl font-bold text-green-500 px-2">${getFormattedPrice(product.price)}</span>
        </Link>
    )
}



//hover:[&_.primary-image]:opacity-0 ---> when the user hovers on the product card, the second image (with class name "primary-image") will become fully transparent (opacity 0), revealing the first image underneath.

//primary-image transition-opacity duration-700 ---> primary-image - class name for the second image, transition-opacity - smooth transition effect for opacity change, duration-700 - transition duration of 700 milliseconds.