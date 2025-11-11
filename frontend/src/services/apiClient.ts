import axios from "axios";

/**
 * Shared Axios instance for the frontend.
 *
 * Preconditions:
 * - `VITE_API_BASE_URL` should be set; falls back to `http://localhost:3000`.
 *
 * Postconditions:
 * - All service modules import this instance, ensuring headers/interceptors apply globally.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
