/**
 * Axios instance with interceptors, base URL, auth header injection
 */
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
// TODO: Add request/response interceptors
