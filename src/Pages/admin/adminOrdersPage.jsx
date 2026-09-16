import { useEffect, useState } from "react";
import api from "../../lib/api";
import LoadingAnimation from "../../components/loadingAnimation";
import getFormattedPrice from "../../lib/price-format";
import formatTimestamp from "../../lib/date-format";
import AdminOrderDetailsModal from "../../components/adminOrderDetailsModal";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageSize, setPageSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("/orders/"+pageSize+"/"+currentPage, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                setOrders(response.data.orders);
                setTotalPages(response.data.totalPages);
                setTotalOrders(response.data.totalCount);
            })
            .catch(() => setOrders([]))
            .finally(() => setIsLoading(false));
    }, [pageSize, currentPage, refreshKey]);


   
    
    return (
        <div className="w-full max-h-full flex flex-col items-start gap-0 overflow-y-scroll p-3 sm:p-4">
            

            <div className="mb-5 flex min-h-[100px] w-full flex-col justify-center gap-4 rounded-md bg-white p-4 shadow-md sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                {isLoading && <LoadingAnimation />}
                <h1 className="text-2xl font-semibold text-secondary">Orders</h1>

                <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-center">
                    <span>{totalOrders} Orders</span>
                    <button
                        onClick={() => {
                            setIsLoading(true);
                            setRefreshKey((key) => key + 1);
                        }}
                        className="bg-accent text-white px-4 py-2 rounded-md"
                    >
                        Refresh
                    </button>
                </div>
            </div>
            <div className="mb-[100px] w-full overflow-x-auto rounded-md bg-white shadow-md">
            <table className="min-w-[1100px] w-full overflow-hidden text-center text-sm">
                <thead className="bg-accent text-white h-[60px]">
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>City</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Item count</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((item) => {
                        return (
                            <tr key={item.orderId} className="odd:bg-gray-200 h-[50px]">
                                
                                <td>{item.orderId}</td>
                                <td>{formatTimestamp(item.date)}</td>
                                <td>{item.email}</td>
                                <td>{item.firstName}</td>
                                <td>{item.lastName}</td>
                                <td>{item.city}</td>
                                <td>{item.phone}</td>
                                <td>{item.status}</td>
                                <td>{item.items.length}</td>
                                <td>{getFormattedPrice(item.totalAmount)}</td>
                                <td>
                                    <div className="flex justify-center items-center gap-2">
                                        <AdminOrderDetailsModal order={item} refresh={() => { setIsLoading(true); setRefreshKey((key) => key + 1); }} />
                                    </div>
                                    
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </div>
            <div className="fixed bottom-20 left-3 right-3 z-10 flex justify-center sm:bottom-8 sm:left-[360px] sm:right-4">
               <div className="grid w-full max-w-[560px] grid-cols-2 gap-1 rounded-xl bg-white p-1.5 shadow-2xl sm:flex sm:h-[52px] sm:items-stretch sm:justify-between">
                    <div className="col-span-2 flex items-center justify-center rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-secondary sm:order-2 sm:col-span-1 sm:bg-transparent sm:py-0">
                        Page {currentPage} of {totalPages}
                    </div>
                    <button className="rounded-lg px-3 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:order-1"
                        disabled={currentPage === 1}
                        onClick={
                            ()=>{
                                setIsLoading(true)
                                setCurrentPage((page) => page - 1)
                            }
                        }>
                        ← Previous
                    </button>
                    <div className="flex items-center justify-center gap-1 rounded-lg px-2 text-sm font-semibold text-accent sm:order-3">
                        <label htmlFor="pageSize">Rows:</label>
                        <select id="pageSize" className="rounded-md border border-slate-200 bg-white px-1.5 py-1 text-accent outline-none focus:border-accent"
                            value={pageSize}
                            onChange={(e) => {
                                setIsLoading(true);
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                            }
                        }>
                            <option value={3}>3</option>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                        </select>
                    </div>

                    <button
                        disabled={currentPage >= totalPages}
                        onClick={()=>{
                            setIsLoading(true)
                            setCurrentPage((page) => page + 1)
                        }}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:order-4" >
                      Next →
                    </button>
               </div>
            </div>
            
        </div>
    );
}







/* //?Explain Use effect:

useEffect(() => {
    const token = localStorage.getItem("token");

    //* Send a GET request to fetch paginated orders
    //* URL format: /orders/{pageSize}/{currentPage}
    api.get("/orders/" + pageSize + "/" + currentPage, {
        headers: {
            //* Include the token in the Authorization header
            //* so the backend can verify the user
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        // Only update the state if the page is currently loading 
        if (isLoading) {
            // Display the API response in the browser console (for debugging)
            console.log(response.data);

            // Store the list of orders returned by the API
            setOrders(response.data.orders);

            // Store the total number of available pages
            setTotalPages(response.data.totalPages);

            // Store the total number of orders in the database
            setTotalOrders(response.data.totalCount);

            // Loading is complete, so stop showing the loading state
            setIsLoading(false);
        }
    });
}, [isLoading]); // Runs when the component first loads and whenever isLoading changes */
