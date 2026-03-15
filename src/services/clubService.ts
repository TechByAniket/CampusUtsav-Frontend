import axios from "axios";

export const getClubsByCollege = async () =>{
  try {
    const response =await axios.get(`${import.meta.env.VITE_BACKEND_URL}/colleges/clubs`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch clubs:", error);
    throw error;
  }
}

export const getClubById = async (collegeId:number, clubId:number) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/colleges/${collegeId}/clubs/${clubId}`,{
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return res.data; // whatever backend returns
  } catch (error) {
    console.warn("Backend not responding, using sample club");
    // fallback: find matching club from sampleClubs by ID
    return sampleClubs.find((c) => String(c.id) === String(clubId)) || sampleClubs[0];
  }
};


export const sampleClubs = [
  {
    id: 1010,
    name: "VESIT Entrepreneurship Cell",
    username: "1002E-CELLVESIT",
    shortForm: "E-CELL",
    adminName: "Sneha Kulkarni",
    facultyCoordinatorName: "Prof. Amit Singh",
    facultyCoordinatorEmail: "amit.singh@ves.ac.in",
    adminEmail: "ecell.admin@vesit.edu",
    adminPhone: "7738099112",
    description:
      "The E-Cell at VESIT acts as an incubator for budding entrepreneurs. We provide a platform for students to pitch their startup ideas, connect with venture capitalists, and participate in business-model competitions like 'Biz-Quest'. Through our networking sessions and E-Summits, we empower students to transform their innovative technical solutions into commercially viable business ventures.",
    logoUrl:
      "https://sbejcortwiilfsgynhvw.supabase.co/storage/v1/object/public/CampusUtsav/46d9d251-8432-4461-ae81-2401f39a1ba4.png",
    websiteUrl: "https://vesit.ves.ac.in/ecell",
    instagramUrl: "https://www.instagram.com/ecell_vesit",
    linkedInUrl: "https://www.linkedin.com/company/vesit-ecell",
    emailVerified: false,
    phoneVerified: false,
    createdAt: "2026-01-28T11:38:29.386742",
    updatedAt: "2026-01-28T11:38:29.386742",
    college: {
      id: 1002,
      name: "Vivekanand Education Society Institute of Technology",
      shortForm: "VESIT",
      city: "Mumbai",
      district: "Mumbai City",
      state: "Maharashtra",
    },
  },
  {
    id: 1009,
    name: "VESIT Music Council",
    username: "1002MUSIC-VESIT",
    shortForm: "MUSIC-VESIT",
    adminName: "Sahil Deshmukh",
    facultyCoordinatorName: "Prof. Ramesh Gupta",
    facultyCoordinatorEmail: "ramesh.gupta@ves.ac.in",
    adminEmail: "music.admin@vesit.edu",
    adminPhone: "9876543210",
    description:
      "The VESIT Music Council is a student-led body promoting musical talent across the college through events, workshops, and competitions.",
    logoUrl:
      "https://sbejcortwiilfsgynhvw.supabase.co/storage/v1/object/public/CampusUtsav/0194f247-93b6-481b-8aea-7d55cca851ac.avif",
    websiteUrl: "https://vesit.ves.ac.in/music",
    instagramUrl: "https://www.instagram.com/music_vesit",
    linkedInUrl: "https://www.linkedin.com/company/music-vesit",
    emailVerified: false,
    phoneVerified: false,
    createdAt: "2026-01-28T11:40:10.123456",
    updatedAt: "2026-01-28T11:40:10.123456",
    college: {
      id: 1002,
      name: "Vivekanand Education Society Institute of Technology",
      shortForm: "VESIT",
      city: "Mumbai",
      district: "Mumbai City",
      state: "Maharashtra",
    },
  },
];
