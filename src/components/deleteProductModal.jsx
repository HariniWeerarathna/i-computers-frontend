import { useState } from "react";
import { CiTrash } from "react-icons/ci";
import api from "../lib/api";
import toast from "react-hot-toast";



//* 3. Deleting a Product Using a modal

export default function DeleteProductModal(props){ //child component - DeleteProductModal is the child component of AdminProductsPage

    const [showModal , setShowModal] = useState(false)
    const refresh = props.refresh //In React, props are used to pass data from a parent component to a child component.
    const product = props.product

    async function handleDelete(){
	  const token = localStorage.getItem("token");

	  try{
	    await api.delete(`/products/${product.productId}`, {
	      headers: {
	        Authorization: `Bearer ${token}`,
	      }
	    });
	    toast.success("Product deleted successfully");
	    refresh()
	  }catch(error){
	    console.log(error);
	  }finally{
        setShowModal(false);
      }

	}


    
    return(
        <>
            <CiTrash
                onClick={() => setShowModal(true)}
                className="cursor-pointer hover:text-red-600"/>

            {showModal&&<div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-black/50">
                <div className="flex h-[200px] w-[400px] flex-col items-center justify-between gap-4 rounded-md bg-white shadow-md">
                    <div className="flex h-[40px] w-full items-center justify-between rounded-t-md bg-accent text-white">
                        <h1 className="px-2">Delete Confirmation</h1>
                        <button onClick={() => setShowModal(false)} className="cursor-pointer p-2 hover:text-red-600">X</button>
                    </div>
                    <p className="px-2">Are you sure you want to delete this product with ID {product.productId}?</p>
                    <div className="flex gap-2 pb-2">
                        <button className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700" onClick={() => setShowModal(false)}>Cancel</button>
                        <button onClick={handleDelete} className="cursor-pointer rounded-md bg-green-600 p-2 text-white hover:bg-green-700">Confirm</button>
                    </div>
                </div>
            </div>}

        </> // React Fragments(empty tag) - They let you return multiple elements without creating an extra <div>.
    )
}
