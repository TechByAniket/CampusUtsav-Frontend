import type { Event, UpcomingEventCardProps } from "@/types/event";


export const sampleEvents: Event[] = [
  {
    id: "alegria-2026",

    /* ===== Ticket UI ===== */
    title: "Alegria 2026 – Cultural & Technical Fest",
    posterUrl: "/event/AlegriaEvent.jpg",

    organizerName: "Alegria Cultural Committee",
    clubLogoUrl: "/clubs/alegria.png",

    status: "Upcoming",
    isPaid: true,

    venue: "XYZ College Campus, Pune",
    date: "February 20–22, 2026",
    time: "All Day",
    category: "Cultural",

    teamSize: "Individual / Group",
    type: "Festival",

    registrationDeadline: "February 10, 2026",

    /* ===== Details Section ===== */
    description: `
Alegria 2026 is a national-level cultural and technical festival that brings
together students from across India for three days of creativity, innovation,
and celebration.

The festival features live music concerts, dance battles, drama performances,
fashion shows, hackathons, robotics challenges, photography contests, and
industry-led workshops.

With over 50+ events, Alegria aims to provide a platform for young talent,
encourage collaboration, and create unforgettable experiences on campus.
    `.trim(),

    contact: {
      phone: "+91 98765 43210",
      email: "events@xyzcollege.edu",
    },

    organizer: {
      name: "Alegria Cultural Committee",
      subtitle: "Department of Student Affairs",
      logoUrl: "/clubs/alegria.png",
    },

    collegeName: "XYZ College of Engineering, Pune",
    collegeMeta: "Autonomous • NAAC A+ • AICTE Approved",

    socials: {
      instagram: "https://instagram.com/alegria_xyz",
      twitter: "https://twitter.com/alegria_xyz",
    },
  },

  {
    id: "code-clash-2026",

    /* ===== Ticket UI ===== */
    title: "Code Clash 2026",
    posterUrl: "/event/CodeClashEvent.jpg",

    organizerName: "CSI Student Chapter",
    clubLogoUrl: "/clubs/csi.png",

    status: "Upcoming",
    isPaid: false,

    venue: "Main Auditorium",
    date: "March 12, 2026",
    time: "10:00 AM – 5:00 PM",
    category: "Technical",

    teamSize: "Team of 2–3",
    type: "Hackathon",

    registrationDeadline: "March 8, 2026",

    /* ===== Details Section ===== */
    description: `
Code Clash 2026 is an intense competitive programming and problem-solving
hackathon designed to challenge students’ logic, speed, and teamwork.

Participants will compete in algorithmic rounds, debugging challenges, and
real-world problem statements curated by industry mentors.
    `.trim(),

    contact: {
      phone: "+91 91234 56789",
      email: "csi@xyzcollege.edu",
    },

    organizer: {
      name: "CSI",
      subtitle: "Computer Society of India",
      logoUrl: "/clubs/csi.png",
    },

    collegeName: "XYZ College of Engineering, Pune",
    collegeMeta: "Autonomous • NAAC A+ • AICTE Approved",

    socials: {
      instagram: "https://instagram.com/csi_xyz",
      linkedin: "https://linkedin.com/company/csi-xyz",
    },
  },
];


export const upcomingEvents: UpcomingEventCardProps[] = [
  {
    id: "alegria-2026",
    title: "Spring Fest 2024",
    category: "Technical",
    imageUrl: "/event/CodeClashEvent.jpg",
    venue: "College Auditorium",
    organizer: "CSI",
    date: "March 12, 2024",
    time: "10:00 AM - 5:00 PM",
  },
  {
    id: "techverse-2026",
    title: "TechVerse 2026",
    category: "Technical",
    imageUrl: "/event/TechVerse.jpg",
    venue: "Main Seminar Hall",
    organizer: "CSE Dept",
    date: "April 5, 2024",
    time: "9:00 AM - 6:00 PM",
  },
]


export const eventRequests = [
    {
      id: "1",
      title: "Tech Fest 2025",
      club: "Coding Club",
      date: "12 Jan 2025",
      requestDate: "05 Jan 2025",
      status: "pending",
    },
    {
      id: "2",
      title: "Cultural Night",
      club: "Dance Club",
      date: "18 Jan 2025",
      requestDate: "10 Jan 2025",
      status: "needs-change",
    },
    {
      id: "3",
      title: "AI Workshop",
      club: "AI Society",
      date: "20 Jan 2025",
      requestDate: "15 Jan 2025",
      status: "approved",
    },
    {
      id: "4",
      title: "SpringBoot Exclusive Workshop",
      club: "Google Developer Groups - GDG",
      date: "20 Jan 2025",
      requestDate: "15 Jan 2025",
      status: "rejected",
    },
  ]
