import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import api from "../../lib/api";
import LoadingAnimation from "../../components/loadingAnimation";
import DeleteProductModal from "../../components/deleteProductModal";

export default function AdminProductsPage(){//parent component - AdminProductsPage is the parent component of DeleteProductModal
  
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      api.get("/products").then((response) => {       
        if (isLoading) {
          console.log(response.data);
          setProducts(response.data);
          setIsLoading(false);
        }
      });
	}, 
    [isLoading]);


    //make a backend call to get all products
	  //update the products variable's value with response from backend



  //? delete product functions:

    //* 1. Deleting a Product Using JavaScript confirm() Dialog

      /*async function handleDelete(productId){
        const token = localStorage.getItem("token");
        const confirmed = confirm("Are you sure you want to delete this product?");

        if(!confirmed){
          return;
        }
        try{
          await api.delete(`/products/${productId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          toast.success("Product deleted successfully");
          setIsLoading(true);
        }catch(error){
          console.log(error);
        }
      }*/


    //* 2. Deleting a Product Using react-hot-toast
    
      /*function handleDelete(productId) {
        toast(
          (t) => {
            return (
              <div className="w-[250px] h-[150px]  flex flex-col justify-center items-center gap-4">
                <h1 className="text-lg font-semibold text-secondary">
                  Are you sure you want to delete this product with ID: {productId}?
                </h1>
                <div className="flex gap-4 justify-center items-center">
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      try {
                        await api.delete(`/products/${productId}`, {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        });
                        toast.success("Product deleted successfully");
                        setIsLoading(true);
                        toast.dismiss(t.id); // Dismiss the toast after successful deletion
                      } catch (error) {
                        console.log(error);
                        toast.dismiss(t.id); // Dismiss the toast if there's an error
                        toast.error("Failed to delete product"); // Show error toast if deletion fails
                      }
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-gray-300 text-black px-4 py-2 rounded-md"
                    onClick={() => {
                      toast.dismiss(t.id); // Dismiss the toast on cancel
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            );
          },
          {
            position: "top-center",
            duration: Infinity,
          },
        );
      }*/


        

  return(
    <div className="w-full max-h-full flex flex-col items-start gap-0 overflow-y-scroll p-3 sm:p-4">

            {
                // products.map( // .map() works only on arrays - loop through an array and create a new array.(inside return)
				//     (item,index)=>{
				//         return <div key={item.productId} className="bg-red-300 mb-2"> 
				//             <h1>{item.name}</h1>
				//             <h1>{item.price}</h1>
				//         </div>

                       /* II Method:
                        (item,index)=>{
				            return <div key={index}*/
				//     }
				// )   
            }

        <div className="mb-5 flex min-h-[100px] w-full flex-col justify-center gap-4 rounded-md bg-white p-4 shadow-md sm:flex-row sm:items-center sm:justify-between">
            {isLoading && <LoadingAnimation />}
            
            <h1 className="text-2xl font-semibold text-secondary">Products</h1>  
            
            <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-center">       
                <span>{products.length} Products</span>
                <button
                  onClick={() => {
                    //window.location.reload()

                    //rerun the function inside the useEffect

                    setIsLoading(true);
                  }}
                  className="bg-accent text-white px-4 py-2 rounded-md">
                    Refresh
                </button>
            </div>
        </div>




        <div className="w-full overflow-x-auto rounded-md bg-white shadow-md">
        <table className="min-w-[1050px] w-full overflow-hidden text-center">
            <thead className="bg-accent text-white h-[60px]">
                <tr>
                    <th>Image</th>
                    <th>ProductID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Labelled Price</th>
                    <th>Stock</th>
                    <th>Availability</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
            {products.map((item) => {
                return (
                <tr key={item.productId} className="odd:bg-gray-200">
                    <td>
                    <img src={item.images[0]} alt={item.name} className="w-[50px] h-[50px] object-cover rounded-md" />
                    </td>                
                    <td>{item.productId}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.labelledPrice}</td>
                    <td>{item.stock}</td>
                    <td>{item.isAvailable?"Available":"Not Available"}</td>
                    <td>{item.category}</td>
                    <td>{item.brand}</td>
                    <td>{item.model}</td>

                    <td>                
                    {/* icons only */}
                      <div className="flex gap-2 justify-center items-center">
                          {/* navigate("/admin/edit-product" , {state: item}) */}
                        <Link
                          state={item}
                          to="/admin/edit-product"><CiEdit />
                        </Link>
                          
                        {/* <CiTrash
                            className="hover:text-red-600 cursor-pointer"
                            onClick={() => handleDelete(item.productId)}
                        /> */}
                        <DeleteProductModal product={item} refresh={()=>{setIsLoading(true)}}/>
                      </div>
                    </td>    

                </tr>
            );
            })}
            </tbody>
	      </table>
        </div>
            

        <Link to="/admin/add-product" className="fixed bottom-20 right-4 z-30 flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-900 sm:bottom-[35px] sm:right-[35px] sm:h-[80px] sm:w-[80px] sm:px-0 sm:text-2xl" aria-label="Add product">
            <FaPlus />
            <span className="sm:hidden">Add product</span>
            </Link>             
    </div>
  )
}


/*<div className="w-full h-full flex flex-col">
    <button className="w-[80px] h-[80px] bg-accent text-white rounded-full text-2xl flex justify-center items-center fixed right-[35px] bottom-[35px]">
        <FaPlus />
        </button>
</div>*/


/*const sampleProducts = [
  {
    productId: "KB-001",
    name: "RGB Mechanical Gaming Keyboard",
    altNames: ["mechanical keyboard", "gaming keyboard", "rgb keyboard"],
    description:
      "Full-size RGB mechanical keyboard with tactile switches, anti-ghosting keys, and durable build quality for gaming and office use.",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"
    ],
    price: 14500,
    labelledPrice: 16500,
    stock: 18,
    isAvailable: true,
    category: "Keyboards",
    brand: "TechZone",
    model: "K900 RGB"
  },
  {
    productId: "MS-001",
    name: "Wireless Ergonomic Mouse",
    altNames: ["wireless mouse", "ergonomic mouse", "computer mouse"],
    description:
      "Comfortable wireless mouse with silent clicks, adjustable DPI, and long battery life for daily productivity.",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80"
    ],
    price: 3850,
    labelledPrice: 4500,
    stock: 35,
    isAvailable: true,
    category: "Mouse",
    brand: "ClickPro",
    model: "WM-120"
  },
  {
    productId: "HS-001",
    name: "Over-Ear Gaming Headset",
    altNames: ["gaming headset", "headphones", "mic headset"],
    description:
      "Over-ear gaming headset with cushioned ear cups, clear microphone, and powerful stereo sound for gaming and calls.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
    ],
    price: 8900,
    labelledPrice: 10500,
    stock: 22,
    isAvailable: true,
    category: "Headsets",
    brand: "SoundMax",
    model: "GMH-700"
  },
  {
    productId: "MP-001",
    name: "Large Gaming Mouse Pad",
    altNames: ["mouse pad", "gaming pad", "desk mat"],
    description:
      "Large anti-slip gaming mouse pad with smooth surface for accurate mouse movement and comfortable desk setup.",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80"
    ],
    price: 2200,
    labelledPrice: 2800,
    stock: 50,
    isAvailable: true,
    category: "Mouse Pads",
    brand: "DeskPro",
    model: "XL Speed"
  },
  {
    productId: "WC-001",
    name: "Full HD USB Webcam",
    altNames: ["webcam", "usb camera", "video call camera"],
    description:
      "1080p USB webcam with built-in microphone, wide-angle lens, and plug-and-play support for online meetings and classes.",
    images: [
      "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=800&q=80"
    ],
    price: 6750,
    labelledPrice: 7900,
    stock: 14,
    isAvailable: true,
    category: "Webcams",
    brand: "VisionCam",
    model: "VC-1080"
  },
  {
    productId: "HB-001",
    name: "USB-C Multiport Hub",
    altNames: ["usb hub", "type c hub", "multiport adapter"],
    description:
      "Compact USB-C hub with HDMI, USB 3.0, card reader, and charging support for laptops and tablets.",
    images: [
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80"
    ],
    price: 7250,
    labelledPrice: 8500,
    stock: 20,
    isAvailable: true,
    category: "Adapters & Hubs",
    brand: "PortLink",
    model: "UC-7IN1"
  },
  {
    productId: "HDMI-001",
    name: "High Speed HDMI Cable 2M",
    altNames: ["hdmi cable", "monitor cable", "tv cable"],
    description:
      "Durable 2-meter HDMI cable supporting Full HD and 4K output for monitors, TVs, projectors, and laptops.",
    images: [
      "https://images.unsplash.com/photo-1601737487795-dab272f52420?auto=format&fit=crop&w=800&q=80"
    ],
    price: 1450,
    labelledPrice: 1900,
    stock: 60,
    isAvailable: true,
    category: "Cables",
    brand: "CablePro",
    model: "HDMI-2M"
  },
  {
    productId: "SSD-001",
    name: "Portable External SSD 512GB",
    altNames: ["external ssd", "portable storage", "usb ssd"],
    description:
      "Fast and compact 512GB external SSD with USB 3.2 support for backups, file transfer, and portable storage.",
    images: [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80"
    ],
    price: 21500,
    labelledPrice: 24500,
    stock: 9,
    isAvailable: true,
    category: "Storage",
    brand: "FastDrive",
    model: "SSD-P512"
  },
  {
    productId: "LS-001",
    name: "Adjustable Laptop Stand",
    altNames: ["laptop stand", "notebook stand", "desk stand"],
    description:
      "Aluminium adjustable laptop stand designed to improve viewing angle, airflow, and desk ergonomics.",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80"
    ],
    price: 5900,
    labelledPrice: 7200,
    stock: 16,
    isAvailable: true,
    category: "Laptop Accessories",
    brand: "ErgoDesk",
    model: "LS-45"
  },
  {
    productId: "CP-001",
    name: "Laptop Cooling Pad",
    altNames: ["cooling pad", "laptop cooler", "cooler fan"],
    description:
      "USB-powered laptop cooling pad with dual fans, ergonomic tilt, and quiet airflow for better laptop performance.",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80"
    ],
    price: 4800,
    labelledPrice: 5600,
    stock: 25,
    isAvailable: true,
    category: "Laptop Accessories",
    brand: "CoolTech",
    model: "CP-200"
  },
  {
    productId: "SP-001",
    name: "Compact USB Speaker Set",
    altNames: ["computer speakers", "usb speakers", "desktop speakers"],
    description:
      "Compact USB-powered desktop speaker set with clear audio output for PCs, laptops, and small workstations.",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"
    ],
    price: 5200,
    labelledPrice: 6500,
    stock: 19,
    isAvailable: true,
    category: "Speakers",
    brand: "AudioBox",
    model: "SP-20"
  },
  {
    productId: "CH-001",
    name: "65W USB-C Laptop Charger",
    altNames: ["type c charger", "laptop charger", "65w charger"],
    description:
      "Universal 65W USB-C fast charger suitable for supported laptops, tablets, and smartphones with safe power delivery.",
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80"
    ],
    price: 8500,
    labelledPrice: 9900,
    stock: 12,
    isAvailable: true,
    category: "Chargers",
    brand: "PowerLink",
    model: "PD-65W"
  }
];*/
