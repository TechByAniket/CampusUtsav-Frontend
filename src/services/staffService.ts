import axios from "axios";

// --- FETCH ROLES ---
export const fetchAvailableRoles = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/roles`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch available roles", error);
    throw error;
  }
};

// --- FETCH ACCOUNT STATUSES ---
export const fetchAccountStatuses = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/account-statuses`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch available account statuses", error);
    throw error;
  }
};

// --- FETCH STAFF MEMBERS  ---
export const fetchStaffMembers = async () =>{
  try {
    const response =await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/staff`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch staff members:", error);
    throw error;
  }
}

// --- UPDATE STAFF MEMBER ROLE ---
export const updateStaffRole = async (id, role) => {
  const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/admin/staff/${id}/role`, { role }, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
  return response.data;
};

// --- UPDATE STAFF MEMBER STATUS ---
export const updateStaffStatus = async (id, status) => {
  // PATCH is best for partial updates like status
  const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/admin/staff/${id}/status`, { status }, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
  return response.data;
};

// --- UPDATE STAFF MEMBER CLUB ASSIGNMENT ---
export const updateStaffClubAssignment = async (id, clubId) => {
  const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/admin/staff/${id}/club`, { clubId }, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
  return response.data;
};

