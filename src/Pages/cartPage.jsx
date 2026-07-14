import { useState } from "react"
import { addToCart, getCart } from "../lib/cart"
import getFormattedPrice from "../lib/price-format"

export default function CartPage(){

    const [cart , setCart] = useState(getCart())

    return(
        <div className="w-full h-[calc(100vh-100px)] overflow-y-scroll flex flex-col items-center">
            {
                cart.map(
                    (item,index)=>{
                        return(
                            <div key={index} className="w-[550px] h-[130px] bg-white my-4 shadow-md rounded-md flex flex-row">

                                <img src={item.product.image} className="h-full w-[130px] object-cover"/>
                               


                                <div className="w-[420px] h-full p-1 flex flex-col">
                                    <h1 className="font-semibold">{item.product.name}</h1>
                                    {
                                        item.product.labelledPrice > item.product.price &&
                                        <span className="text-lg font-normal line-through text-gray-500">{getFormattedPrice(item.product.labelledPrice)}</span>
                                    }
                                    <span className="text-lg font-semibold text-accent">{getFormattedPrice(item.product.price)}</span>



                                    {/* Quantity controls and total price */}

                                    <div className="w-full h-[40px]  flex justify-between items-center pr-2">
                                        <div className="w-[120px] h-[40px] border border-accent rounded-md overflow-hidden flex flex-row">
                                            <button
                                            onClick={
                                                ()=>{
                                                    addToCart(item.product,-1) //remove 1 qty
                                                    setCart(getCart()) //update the cart state after adding the product to the cart
                                                }
                                            }
                                            className="w-[40px] h-full hover:bg-accent hover:text-white cursor-pointer text-accent font-semibold hover:bg-accent-dark transition-colors duration-300">-</button>
                                            <span className="w-[40px] h-full flex justify-center items-center">{item.qty}</span>
                                            <button
                                            onClick={
                                                ()=>{
                                                    addToCart(item.product,1) //add 1 qty
                                                    setCart(getCart())
                                                }
                                            }
                                            className="w-[40px] h-full hover:bg-accent hover:text-white cursor-pointer text-accent font-semibold hover:bg-accent-dark transition-colors duration-300">+</button>
                                        </div>
                                        <p className="text-lg font-normal text-gray-600">{getFormattedPrice(item.product.price*item.qty)}</p>
                                    </div>
                              

                                </div>
                            </div>
                        )
                    }
                )
            }
        </div>
    )
}