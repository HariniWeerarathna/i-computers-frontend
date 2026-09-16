import { useState } from "react"
import { IoEyeOutline } from "react-icons/io5"
import Modal from 'react-modal';
import getFormattedPrice from "../lib/price-format";
import formatTimestamp from "../lib/date-format";
import toast from "react-hot-toast";
import api from "../lib/api";


export default function AdminOrderDetailsModal(props){

    const refresh = props.refresh
    const order = props.order
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [status, setStatus] = useState(order.status)


    async function updateOrderStatus(){
        try{

            const token = localStorage.getItem("token")

            await api.put("/orders/"+order.orderId+"/"+status, {}, {
                headers : {
                    "Authorization" : `Bearer ${token}`
                }
            })

            toast.success("Order status updated successfully")
            refresh()
            setIsModalOpen(false)

        }catch(err){
            console.log(err)
            toast.error("Failed to update order status")
        }
    }




    return(
        <>
           <IoEyeOutline className="text-secondary hover:text-accent cursor-pointer text-xl"
           onClick={() => setIsModalOpen(true)} />
            <Modal
                isOpen={isModalOpen}
                onRequestClose={()=>{setIsModalOpen(false)}}
                className="mx-auto my-3 max-h-[calc(100vh-1.5rem)] w-[calc(100%-1rem)] max-w-xl overflow-y-auto rounded-2xl bg-primary shadow-2xl outline-none sm:my-8 sm:w-[calc(100%-2rem)]"
                overlayClassName="fixed inset-0 z-50 overflow-y-auto bg-slate-950/55 px-2 backdrop-blur-sm"
                style={ 
                    {
                        content : {
                            padding : '0px',
                            backgroundColor : 'transparent',
                            border : 'none'
                        }
                    }
                }
            >
                <div className='w-full min-h-full overflow-hidden rounded-2xl bg-primary flex flex-col'>

                        <div className='w-full min-h-[70px] bg-accent rounded-t-2xl flex'>
                            {/*  order summary*/}
                            <div className='w-full h-full flex flex-col justify-center items-center'>
                                <h1 className='text-xl font-semibold text-white'>Order Summary</h1>
                            </div>
                        </div>
                                    
                        {/* total */}
                        <div className='w-full bg-[#7979b8] flex flex-wrap justify-center px-2 py-2'>
                                <div className='w-full sm:w-1/3 flex flex-row justify-center items-center gap-2 break-all text-center'>
                                    <span className='text-sm sm:text-lg text-white'>{order.orderId}</span>
                                </div>
                            
                                <div className='w-1/2 sm:w-1/3 flex flex-row justify-center items-center gap-2'>
                                    <span className='text-base sm:text-lg text-white'>{getFormattedPrice(order.totalAmount)}</span>
                                </div>

                                <div className='w-1/2 sm:w-1/3 flex flex-row justify-center items-center gap-2'>
                                    <h1 className='text-base sm:text-lg text-white'>{order.items.length} Items</h1>
                                </div>

                                <div className='w-full   flex flex-row justify-center items-center gap-2 border-t-2 border-white'>
                                    <h1 className='text-lg  text-white'>{formatTimestamp(order.date)}</h1>                                                
                                </div>

                                <div className='w-full flex flex-row justify-center items-center gap-2 text-center border-t-2 border-white py-2 px-2'>
                                    <h1 className='text-sm sm:text-lg text-white'>
                                        {order.firstName} {order.lastName}, {order.addressLine1}, {order.addressLine2}, {order.city}, {order.postalCode}, {order.country}
                                        ({order.phone} / {order.secondaryPhone})
                                    </h1>                                                
                                </div>


                                <div className='w-full flex flex-wrap justify-center items-center gap-2 text-center border-t-2 border-white py-2 text-white'>
                                    Order Status : 
                                    <select className="bg-accent text-white rounded-lg px-2 py-1" value={status} 
                                    onChange={(e) => {
                                        setStatus(e.target.value)
                                        }}>
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                    </select>
                                </div>  
                            </div>


                        <div className="min-h-[80px] w-full break-words p-4 text-sm sm:text-base">
                            Notes : {order.customerNotes}
                        </div>
                            {
                                order.items.map((item, index) => (
                                    <div key={index} className='w-full flex flex-row gap-3 border-t border-slate-200 p-3 text-secondary'>
                                        <img src={item.product.image} className='h-20 w-20 shrink-0 rounded-md object-cover sm:h-[100px] sm:w-[100px]' />
                                        <div className='min-w-0 flex-1 flex flex-col justify-center items-start'>
                                            <h1 className='break-words text-base font-semibold sm:text-lg'>{item.product.name}</h1>
                                            <h1 className='text-sm sm:text-base'>{getFormattedPrice(item.product.price)} x {item.qty} = {getFormattedPrice(item.product.price * item.qty)}</h1>
                                        </div>                                          
                                    </div>
                                ))
                            
                            }
                        {status != order.status&& <button className="sticky bottom-0 w-full bg-green-500 p-3 text-white font-semibold shadow-2xl hover:bg-green-600" onClick={updateOrderStatus}>
                            Update Status
                        </button>}
                </div>
            </Modal>

        </>
    )

}
