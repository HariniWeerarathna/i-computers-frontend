import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Replace with your backend API URL
})

export default api