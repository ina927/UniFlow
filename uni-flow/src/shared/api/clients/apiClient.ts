import axios from "axios";

// Get the base URL from environment variable or default to empty string
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Create axios instance with base URL and default headers
export const apiClient = axios.create({
  baseURL,
  headers: { 
    "Content-Type": "application/json",
    "user-id": typeof window !== 'undefined' ? localStorage.getItem("user-id") || '' : ''
  },
});
