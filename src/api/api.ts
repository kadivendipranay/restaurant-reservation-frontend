
import axios from "axios";
import { getSession } from "../utils/auth";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://restaurant-reservation-backend-6va5.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const session = getSession();

  if (session) {
    req.headers.Authorization = `Bearer ${session.token}`;
  } else {
    delete req.headers.Authorization;
  }

  return req;
});

export default API;
