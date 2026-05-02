import { handleServiceError } from "@/utils/errorUtils";
import axios from "axios";

// =================================
// GET REGISTRATION META
// =================================
export const getRegistrationMeta = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/public/meta/registrations`);
        return res.data;
    } catch (error: any) {
        throw new Error(handleServiceError(error, "Fetching Registration Meta"));
    }
}   


// =================================
// GET TEAMS META
// =================================
export const getTeamMeta = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/public/meta/teams`);
        return res.data;
    } catch (error: any) {
        throw new Error(handleServiceError(error, "Fetching Team Meta Data"));
    }
}

