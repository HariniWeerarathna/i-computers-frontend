import { useContext, useState } from 'react';
import Modal from 'react-modal';
import { clearCart, getCartTotal } from '../lib/cart';
import getFormattedPrice from '../lib/price-format';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/api';
import UserContext from '../context/userContext';


export default function OrderModal(props){

    const userData = useContext(UserContext)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [firstName, setFirstName] = useState(userData.user?.firstName ||"")
    const [lastName, setLastName] = useState(userData.user?.lastName ||"")
    const [addressLine1, setAddressLine1] = useState("")
    const [addressLine2, setAddressLine2] = useState("")
    const [city, setCity] = useState("")
    const [postalCode, setPostalCode] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState("")
    const [specialNotes, setSpecialNotes] = useState("")
    // const [file, setFile] = useState(null)
    const navigate = useNavigate()


    async function handleConfirmOrder(){
        const token = localStorage.getItem("token")
        if(!token){
            toast.error("Please login to place an order")
            navigate("/login")
            return
        }
        
        const orderData = {
            firstName : firstName,
            lastName : lastName,
            addressLine1 : addressLine1,
            addressLine2 : addressLine2,
            city : city,
            postalCode : postalCode,
            phone : phoneNumber,
            secondaryPhone : secondaryPhoneNumber,//white one is backend calling one so ---> white name = backend name
            customerNotes : specialNotes,
            items : []
        }
        
        for(let i=0; i<props.cart.length; i++){

            orderData.items.push({
                productId : props.cart[i].product.productId,
                qty : props.cart[i].qty
            })
        }

        try{
            await api.post("/orders", orderData, {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            })
            clearCart()
            toast.success("Order placed successfully")
            setModalIsOpen(false)
            navigate("/products", { replace: true })

        }catch(err){
            console.log(err)
            toast.error("Failed to place order")
        }
    }

    return(

        <>
            <button
            onClick={()=>{setModalIsOpen(true)}}
            className="bg-accent/75 hover:bg-accent cursor-pointer transition-colors duration-300 text-white px-4 py-2 rounded-md font-semibold">
                        Order
            </button>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={()=>{setModalIsOpen(false)}}
                className="mx-auto my-3 max-h-[calc(100vh-1.5rem)] w-[calc(100%-1rem)] max-w-3xl overflow-y-auto rounded-2xl bg-primary shadow-2xl outline-none sm:my-8 sm:w-[calc(100%-2rem)]"
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
                <div className='overflow-hidden rounded-2xl bg-white text-secondary'>
                    <div className='bg-accent px-5 py-5 text-white sm:px-7'>
                        <p className='text-xs font-semibold uppercase tracking-[0.18em] text-blue-100'>Checkout</p>
                        <h1 className='mt-1 text-2xl font-bold'>Order summary</h1>
                    </div>

                    <div className='grid grid-cols-2 divide-x divide-indigo-200 bg-indigo-50 text-center'>
                        <div className='p-4'>
                            <p className='text-xs font-medium uppercase tracking-wide text-slate-500'>Total</p>
                            <p className='mt-1 text-lg font-bold text-accent'>{getFormattedPrice(getCartTotal(props.cart))}</p>
                        </div>
                        <div className='p-4'>
                            <p className='text-xs font-medium uppercase tracking-wide text-slate-500'>Items</p>
                            <p className='mt-1 text-lg font-bold text-accent'>{props.cart.length}</p>
                        </div>
                    </div>

                    <div className='grid gap-4 p-5 sm:grid-cols-2 sm:p-7'>
                            <div className='flex flex-col gap-1.5'>
                                <label className="text-sm font-medium">First name</label>
                                <input
                                value={firstName}
                                onChange={(e)=>{setFirstName(e.target.value)}}
                                placeholder='John'
                                className='h-11 w-full rounded-lg border border-slate-300 px-3 text-black outline-none transition focus:border-accent focus:ring-2 focus:ring-blue-100'
                                />
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <label className="text-sm font-medium">Last name</label>
                                <input
                                value={lastName}
                                onChange={(e)=>{setLastName(e.target.value)}}
                                placeholder='Doe'
                                className='h-11 w-full rounded-lg border border-slate-300 px-3 text-black outline-none transition focus:border-accent focus:ring-2 focus:ring-blue-100'
                                />
                            </div>
                            <div className='flex flex-col gap-1.5 sm:col-span-2'>
                                <label className="text-sm font-medium">Address line 1</label>
                                <input
                                value={addressLine1}
                                onChange={(e)=>{setAddressLine1(e.target.value)}}
                                placeholder='123 Main St'
                                className='h-11 w-full rounded-lg border border-slate-300 px-3 text-black outline-none transition focus:border-accent focus:ring-2 focus:ring-blue-100'
                                />
                            </div>
                            <div className='flex flex-col gap-1.5 sm:col-span-2'>
                                <label className="text-sm font-medium">Address line 2 <span className="font-normal text-slate-400">(optional)</span></label>
                                <input
                                value={addressLine2}
                                onChange={(e)=>{setAddressLine2(e.target.value)}}
                                placeholder='Apt 4B'
                                className='h-11 w-full rounded-lg border border-slate-300 px-3 text-black outline-none transition focus:border-accent focus:ring-2 focus:ring-blue-100'
                                />
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <label className="text-sm font-medium">City</label>
                                <input
                                value={city}
                                onChange={(e)=>{setCity(e.target.value)}}
                                placeholder='Colombo'
                                className='h-11 w-full rounded-lg border border-slate-300 px-3 text-black outline-none transition focus:border-accent focus:ring-2 focus:ring-blue-100'
                                />
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <label className="text-sm font-medium">Postal code</label>
                                <input
                                value={postalCode}
                                onChange={(e)=>{setPostalCode(e.target.value)}}
                                placeholder='12345'
                                className='h-11 w-full rounded-lg border border-slate-300 px-3 text-black outline-none transition focus:border-accent focus:ring-2 focus:ring-blue-100'
                                />
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <label className="text-sm font-medium">Phone</label>
                                <input
                                value={phoneNumber}
                                onChange={(e)=>{setPhoneNumber(e.target.value)}}
                                placeholder='+94 123 456 789'
                                className='h-11 w-full rounded-lg border border-slate-300 px-3 text-black outline-none transition focus:border-accent focus:ring-2 focus:ring-blue-100'
                                />
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <label className="text-sm font-medium">Secondary phone <span className="font-normal text-slate-400">(optional)</span></label>
                                <input
                                value={secondaryPhoneNumber}
                                onChange={(e)=>{setSecondaryPhoneNumber(e.target.value)}}
                                placeholder='+94 987 654 321'
                                className='h-11 w-full rounded-lg border border-slate-300 px-3 text-black outline-none transition focus:border-accent focus:ring-2 focus:ring-blue-100'
                                />
                            </div>
                            <div className='flex flex-col gap-1.5 sm:col-span-2'>
                                <label className="text-sm font-medium">Special notes <span className="font-normal text-slate-400">(optional)</span></label>
                                <textarea
                                value={specialNotes}
                                onChange={(e)=>{setSpecialNotes(e.target.value)}}
                                placeholder='Any special instructions for delivery...'
                                className='min-h-28 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-black outline-none transition focus:border-accent focus:ring-2 focus:ring-blue-100'
                                />
                            </div>
                    </div>
                        <div className='flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:flex-row sm:justify-end sm:px-7'>
                            <button
                            onClick={handleConfirmOrder}
                            className='rounded-lg bg-accent px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-900'>
                                Confirm Order
                            </button>

                            {/* cancel */}
                            <button
                            onClick={()=>{
                                setModalIsOpen(false)
                            }}
                            className='rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-slate-100'>
                                Cancel
                            </button>             
                        </div>

                </div>  
            </Modal>
        </>

    )
}
