import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"
import { CiCircleInfo } from "react-icons/ci";
import toast from "react-hot-toast";
import uploadMedia from "../../lib/uploadMedia";
import api from "../../lib/api";
import LoadingAnimation from "../../components/loadingAnimation";


export default function AddProductForm(){

    const [productId, setProductId] = useState("")
    const [name, setName] = useState("")
    const [altNames, setAltNames] = useState("")
    const [description, setDescription] = useState("")
    const [images, setImages] = useState([])
    const [price, setPrice] = useState("")
    const [labelledPrice, setLabelledPrice] = useState("")
    const [stock, setStock] = useState("")
    const [isAvailable, setIsAvailable] = useState(true)
    const [category, setCategory] = useState("Laptop")
    const [brand, setBrand] = useState("")
    const [model, setModel] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    async function handleSave(){
        
        const token = localStorage.getItem("token")
        if(token == null){
            toast.error("You are not logged in")
            navigate("/login")
            return
        }

        const productData = {
            productId : productId,
            name : name,
            altNames : [],
            description : description,
            images : [],
            price : price,
            labelledPrice : labelledPrice,
            stock : stock,
            isAvailable : isAvailable,
            category : category,
            brand : brand,
            model : model
        }

        try{
            const imageUploadPromises = []
            //toast.success(images.length) - images count is appear in toast.

            for(let i=0; i<images.length; i++){
                imageUploadPromises[i] = uploadMedia(images[i])
            }
            console.log(imageUploadPromises)


            const uploadedImageUrls = await Promise.all(imageUploadPromises)
            //const fastestUploadedImageUrl = await Promise.race(imageUploadPromises) - give fast upload one.
            
            productData.images = uploadedImageUrls
            productData.altNames = altNames.split(",")



            const res = await api.post("/products", productData , 
                {
                    headers : {
                        Authorization : "Bearer "+token
                    }
                }
            )
            //In token you must do ---> "Bearer "+token

            console.log(res)
            toast.success("Product added successfully")
            navigate("/admin/products")

        }catch(err){
            console.log(err)
            toast.error("Failed to add product")
            setLoading(false)
        }

    }



    return(

        <div className="w-full max-h-full flex flex-wrap items-start gap-0 overflow-y-scroll p-3 pb-20 sm:p-4 sm:pb-4 max-sm:[&>div]:!w-full">
             
            {/* 1. flex-wrap             -->  Allow items to move to next line when there is not enough space.
                2. overflow-y-scroll     -->  Adds scrollbars when content exceeds the container size. 
                    (x & Y scrollbars)
                                                
                3.overflow-y-scroll      -->  Vertical scroll (y) - for overflow content.
            */}



            {loading && <LoadingAnimation />}


            <div className="mb-5 flex min-h-[100px] w-full flex-col justify-center gap-4 rounded-md bg-white p-4 shadow-md sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-semibold text-secondary">Add Product</h1>
              
                <div className="flex w-full gap-2 sm:w-auto">
                    <Link to="/admin/products" className="flex-1 rounded-md bg-red-600 p-2 text-center text-white hover:bg-red-700 sm:flex-none">Cancel</Link>
                    <button className="flex-1 cursor-pointer rounded-md bg-green-600 p-2 text-white hover:bg-green-700 sm:flex-none" onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>





        {/*____Product Details____*/}


            <div className="w-[15%] flex flex-col h-[100px] p-2">
                <label className="text-secondary text-lg font-semibold mb-2">Product ID</label>
                <input type="text" value={productId} onChange={(e)=>setProductId(e.target.value)} className="w-full h-[40px] rounded-md border-2 border-gray-300 p-2 mb-4" />
            </div>


            <div className="w-[40%] flex flex-col h-[100px]  p-2 ">
                <label className="text-secondary text-lg font-semibold mb-2">Product Name</label>
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className="w-full h-[40px] rounded-md border-2 border-gray-300 p-2 mb-4" />
            </div>


            <div className="w-[45%] flex flex-col h-[100px]  p-2 ">
                <label className="text-secondary text-lg font-semibold mb-2 flex items-center gap-2 ">Alternative Names <div className="flex justify-center items-center  h-full italic font-thin tooltip"><CiCircleInfo /> <div className="tooltip-text">Comma-separated</div></div></label>
                <input type="text" value={altNames} onChange={(e)=>setAltNames(e.target.value)} className="w-full h-[40px] rounded-md border-2 border-gray-300 p-2 mb-4" />
            </div>



            <div className="w-full flex flex-col p-2">
                <label className="text-secondary text-lg font-semibold mb-2">Description</label>
                <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full h-[100px] rounded-md border-2 border-gray-300 p-2 mb-4" />  
            </div>
            {/*description - textarea*/}



            <div className="w-[40%] flex flex-col h-[100px]  p-2 ">
                <label className="text-secondary text-lg font-semibold mb-2">Images</label>
                <input type="file" multiple={true} onChange={(e)=>{setImages(e.target.files)}} className="w-full h-[40px] rounded-md border-2 border-gray-300 p-2 mb-4" />
            </div>
            

            <div className="w-[30%] flex flex-col h-[100px]  p-2 ">
                <label className="text-secondary text-lg font-semibold mb-2">Price</label>
                <input type="number" value={price} onChange={(e)=>setPrice(e.target.value)} className="w-full h-[40px] rounded-md border-2 border-gray-300 p-2 mb-4" />
            </div>


            <div className="w-[30%] flex flex-col h-[100px]  p-2 ">
                <label className="text-secondary text-lg font-semibold mb-2">Labelled Price</label>
                <input type="number" value={labelledPrice} onChange={(e)=>setLabelledPrice(e.target.value)} className="w-full h-[40px] rounded-md border-2 border-gray-300 p-2 mb-4" />
            </div>


            <div className="w-1/4 flex flex-col h-[100px]  p-2 ">
                <label className="text-secondary text-lg font-semibold mb-2">Stock</label>
                <input type="number" value={stock} onChange={(e)=>setStock(e.target.value)} className="w-full h-[40px] rounded-md border-2 border-gray-300 p-2 mb-4" />
            </div>



         {/*Availability:

            <div className="w-1/4 flex flex-col h-[100px]  p-2 ">
                <label className="text-secondary text-lg font-semibold mb-2">Availability</label>
                <input type="checkbox" checked={isAvailable} onChange={(e)=>setIsAvailable(e.target.checked)} className="w-full h-[40px] rounded-md border-2 border-gray-300 p-2 mb-4" />
            </div>*/}

            <div className="w-1/4 flex flex-col h-[100px]  p-2 ">
                <label className="text-secondary text-lg font-semibold mb-2">Availability</label>
                <select value={isAvailable} onChange={(e)=>setIsAvailable(e.target.value)} className="w-full h-[40px] rounded-md border-2 border-gray-300 p-2 mb-4">                     
                    <option value={true}>Available</option>
                    <option value={false}>Not Available</option>   
                </select>
            </div>
            
            <div className="w-1/2  flex flex-col h-[100px]  p-2 "> {/*Empty Div - for space in UI*/}
            </div>



            <div className="w-1/4 flex flex-col h-[100px]  p-2 ">
                <label className="text-secondary text-lg font-semibold mb-2">Category</label>
                <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full h-[40px] rounded-md border-2 border-gray-300 p-2 mb-4">
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Keyboard">Keyboard</option>
                    <option value="Mouse">Mouse</option>
                    <option value="Graphics Card">Graphics Card</option>
                    <option value="Processor">Processor</option>
                    <option value="Motherboard">Motherboard</option>
                    <option value="Power Supply">Power Supply</option>
                    <option value="RAM">RAM</option>
                    <option value="Storage">Storage</option>
                </select>
            </div>



             <div className="w-1/4 flex flex-col h-[100px]  p-2 ">
                <label className="text-secondary text-lg font-semibold mb-2">Brand</label>
                <input type="text" value={brand} onChange={(e)=>setBrand(e.target.value)} className="w-full h-[40px] rounded-md border-2 border-gray-300 p-2 mb-4" />
            </div>


            <div className="w-1/4 flex flex-col h-[100px]  p-2 ">
                <label className="text-secondary text-lg font-semibold mb-2">Model</label>
                <input type="text" value={model} onChange={(e)=>setModel(e.target.value)} className="w-full h-[40px] rounded-md border-2 border-gray-300 p-2 mb-4" />
            </div>


        </div>
    )
}
