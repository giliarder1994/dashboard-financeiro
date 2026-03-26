import axios from "axios";

// URL do backend — configure a variável VITE_API_URL
// no painel do Vercel com a URL do seu backend
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000"
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;