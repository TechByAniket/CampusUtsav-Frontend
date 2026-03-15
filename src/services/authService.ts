import axios from "axios";

// ***********LOGIN AUTH SERVICE ***********
export const login = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, data);
  return response.data;
}