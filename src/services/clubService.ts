import type { Club } from "@/types/club";

export const sampleClubs: Club[] = [
  {
    id: 1,
    name: "Computer Society of India",
    shortForm: "CSI",
    description:
  "The Coding Club is a student-driven technical community focused on competitive programming, data structures & algorithms, hackathons, and hands-on development. The club regularly conducts coding contests, DSA practice sessions, peer-to-peer learning workshops, and technical talks by industry professionals and experienced seniors. It aims to build strong problem-solving skills, promote collaborative learning, and prepare students for internships, placements, and real-world software development challenges."
    ,

    logoUrl: "/clubs/csi.png",
    websiteUrl: "https://codingclub.college.edu",
    instagramUrl: "https://instagram.com/codingclub",
    linkedInUrl: "https://linkedin.com/company/codingclub",

    adminName: "Rahul Sharma",
    adminEmail: "rahul.codingclub@college.edu",
    adminPhone: "+91 9876543210",

    facultyCoordinatorName: "Dr. Anil Verma",
    facultyCoordinatorEmail: "anil.verma@college.edu",

    username: "codingclub",
    passwordHash: "$2a$10$abcdef123456",

    verificationCode: "ABC123",
    emailVerified: true,
    phoneVerified: true,

    collegeId: 101,
    userId: 9000000001,

    createdAt: "2025-01-10T10:30:00Z",
    updatedAt: "2025-02-01T08:15:00Z",
  },
  {
    id: 2,
    name: "Cultural Committee",
    shortForm: "CULCOM",
    description: "Dance, drama, music, cultural nights and annual fests",

    logoUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    websiteUrl: "https://cultural.college.edu",
    instagramUrl: "https://instagram.com/culturalclub",
    linkedInUrl: "https://linkedin.com/company/culturalclub",

    adminName: "Sneha Patil",
    adminEmail: "sneha.cultural@college.edu",
    adminPhone: "+91 9123456789",

    facultyCoordinatorName: "Prof. Meera Joshi",
    facultyCoordinatorEmail: "meera.joshi@college.edu",

    username: "culturalclub",
    passwordHash: "$2a$10$xyz987654321",

    verificationCode: "XYZ789",
    emailVerified: true,
    phoneVerified: false,

    collegeId: 101,
    userId: 9000000002,

    createdAt: "2025-01-12T09:00:00Z",
    updatedAt: "2025-02-05T12:45:00Z",
  },
];
