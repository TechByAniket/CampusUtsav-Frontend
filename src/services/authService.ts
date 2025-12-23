import axios from "axios";

// ***********COLLEGE LOGIN AUTH SERVICE ***********
export const collegeLogin = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, data);
  return response.data;
}