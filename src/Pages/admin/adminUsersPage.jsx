import { useEffect, useState } from "react";
import api from "../../lib/api";
import LoadingAnimation from "../../components/loadingAnimation";
import BlockUserModal from "../../components/blockUserModal";
import ChangeRoleOfUserModal from "../../components/changeRoleOfUserModal";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageSize, setPageSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("/users/"+pageSize+"/"+currentPage, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (isLoading) {
                console.log(response.data);
                setUsers(response.data.users);
                setTotalPages(response.data.totalPages);
                setTotalUsers(response.data.totalCount);
                setIsLoading(false);
            }
        });
    }, [isLoading, currentPage, pageSize]);

    return (
        <div className="w-full max-h-full flex flex-col items-start gap-0 overflow-y-scroll p-3 sm:p-4">
            

            <div className="mb-5 flex min-h-[100px] w-full flex-col justify-center gap-4 rounded-md bg-white p-4 shadow-md sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                {isLoading && <LoadingAnimation />}
                <h1 className="text-2xl font-semibold text-secondary">Users</h1>

                <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-center">
                    <span>{totalUsers} Users</span>
                    <button
                        onClick={() => {
                            setIsLoading(true);
                        }}
                        className="bg-accent text-white px-4 py-2 rounded-md"
                    >
                        Refresh
                    </button>
                </div>
            </div>
            <div className="mb-[100px] w-full overflow-x-auto rounded-md bg-white shadow-md">
            <table className="min-w-[850px] w-full overflow-hidden text-center">
                <thead className="bg-accent text-white h-[60px]">
                    <tr>
                        <th></th>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Role</th>
                        <th>Email Verification</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((item) => {
                        return (
                            <tr key={item.email} className="odd:bg-gray-200 h-[50px]">
                                
                                <td>
                                    <img src={item.image} className="h-[40px] w-[40px] p-2 border border-accent m-1 rounded-full" />
                                </td>
                                <td>{item.email}</td>
                                <td>{item.firstName}</td>
                                <td>{item.lastName}</td>
                                <td>{item.isAdmin?"Admin":"User"}</td>
                                <td>{item.isEmailVerified?"Verified":"Not Verified"}</td>
                                <td>{item.isBlocked?"Blocked":"Active"}</td>
                                <td>
                                    <BlockUserModal refresh={() => setIsLoading(true)} user={item}/>
                                    <ChangeRoleOfUserModal refresh={() => setIsLoading(true)} user={item}/>                                                              
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </div>
            <div className="sticky bottom-3 z-10 mt-auto w-full px-1 sm:fixed sm:bottom-10 sm:left-[360px] sm:right-4 sm:w-auto">
               <div className="mx-auto grid w-full max-w-[500px] grid-cols-2 overflow-hidden rounded-xl bg-white text-sm shadow-2xl sm:flex sm:h-[50px] sm:flex-nowrap sm:justify-between">
                    <button className="min-h-11 px-3 text-accent transition-colors hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-full sm:px-4"
                        disabled={currentPage == 1}
                        onClick={
                            ()=>{

                                const newPageNumber = currentPage - 1
                                setCurrentPage(newPageNumber)
                                setIsLoading(true)
                            }
                        }>
                        Previous
                    </button>
                    <div className="flex min-h-11 items-center justify-center gap-1 text-accent sm:h-full">
                        <label htmlFor="pageSize">Size</label>
                        <select id="pageSize" className="rounded border border-slate-200 bg-white px-1 py-1 text-accent outline-none sm:h-full sm:border-0"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(e.target.value);
                                setIsLoading(true);
                            }
                        }>
                            <option value={3}>3</option>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                        </select>
                    </div>

                    <div className="flex min-h-11 items-center justify-center px-3 text-accent sm:h-full sm:px-4">
                        <span>Page {currentPage} of {totalPages}</span>
                    </div>
                    
                    <button
                        disabled={currentPage == totalPages}
                        onClick={()=>{
                            const newPageNumber = currentPage + 1
                            setCurrentPage(newPageNumber)
                            setIsLoading(true)
                        }}
                    className="min-h-11 px-3 text-accent transition-colors hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-full sm:px-4" >
                      Next
                    </button>
               </div>
            </div>
            
        </div>
    );
}
