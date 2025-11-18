import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // YOUR BACKEND URL
});

export default API;
