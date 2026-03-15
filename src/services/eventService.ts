import type { Event, UpcomingEventCardProps } from "@/types/event";
import axios from "axios";

// Fetch event categories and types
export const fetchEventMetaData = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/categories-types`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch event metadata", error);
    throw error;
  }
};

// List an Event
export const createEvent = async (eventData : FormData, clubId: number) =>{
  try{
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/events/${clubId}/new-event`, eventData, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch(error:any){
    console.error("Failed to create event", error);
    throw error;
  }
}
// ************************* Get Team Members Meta Data for Event Registrations **********************
export const fetchTeamMembersMetaData = async (
  identificationNumber: string
) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/student/${identificationNumber}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch team member metadata", error);
    throw error;
  }
};


// Generate AI-based event description
export const generateEventDescriptionAI = async (payload: { prompt: string;
                                                            tone: "PROFESSIONAL" | "CASUAL" | "FESTIVE";
                                                            maxLength: number;
}) => {
  try{
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/events/ai/generate`, payload,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );

  return response.data;
}
  catch(error:any){
    console.error("Failed to generate event description with AI", error);
    throw error;
  }
}


export const sampleEvents: Event[] = [
  {
    id: 1,
    title: "Alegria 2026 – Cultural & Technical Fest",
    description: `
**Alegria 2026** is the premier national-level cultural and technical festival, serving as a vibrant crossroads for creativity, innovation, and celebration. Hosted annually by **XYZ College**, this flagship event attracts thousands of students from across India to showcase their diverse talents in a competitive yet festive environment.

✨ **What makes it special?**
- Over 50+ meticulously curated cultural and technical events.
- High-energy celebrity concerts, professional hackathons, and industry-led workshops.
- A massive platform for networking with peers from top-tier institutions.

Join us to experience an unforgettable blend of talent, innovation, and campus spirit that defines the Alegria legacy.
`.trim(),
    posterUrl: "/event/CodeClashEvent.jpg",
    venue: "XYZ College Campus, Pune",
    date: "2026-02-20",
    startTime: "10:00",
    endTime: "18:00",
    eventCategory: "CULTURAL",
    eventType: "FEST",
    status: "UPCOMING",
    fees: 300,
    teamEvent: true,
    teamSize: 5,
    maxParticipants: 500,
    registrationLink: "https://alegria.xyz/register",
    attachments: ["Rulebook.pdf", "Schedule.pdf"],
    tags: ["fest", "cultural", "technical"],
    isFeatured: true,
    isActive: true,
    contactDetails: [
      { name: "General Secretary", phone: "+91 9876543210", email: "alegria@xyzcollege.edu" },
      { name: "Technical Head", phone: "+91 9999911111", email: "tech.alegria@xyzcollege.edu" }
    ],
    club: { id: 101, name: "Alegria Cultural Committee", logoUrl: "/clubs/alegria.png" },
    college: {
      name: "XYZ College of Engineering",
      shortForm: "XYZ COE",
      logoUrl: "/college/pcelogo.png",
      address: "Pune, Maharashtra",
      instagramUrl: "https://instagram.com/xyzcollege",
      linkedinUrl: "https://linkedin.com/school/xyz-college-of-engineering",
      websiteUrl: "https://xyzcollege.edu",
    },
    instagramUrl: "https://instagram.com/alegria_fest",
    linkedinUrl: "https://linkedin.com/company/alegria-fest",
    websiteUrl: "https://alegria.xyz",
    registrationDeadline: "2026-02-15",
  },
  {
    id: 2,
    title: "Code Clash 2026",
    description: `
**Code Clash 2026** is a high-intensity competitive programming hackathon specifically designed for the next generation of algorithmic wizards and problem solvers. Organized by the **Computer Society of India (CSI)**, this event challenges participants to solve complex real-world logic puzzles under tight time constraints.

💻 **Event Highlights**
- Multi-tier algorithmic challenges ranging from basic logic to advanced data structures.
- Specialized debugging rounds to test code optimization and efficiency.
- Problem statements inspired by real-world industry scenarios.

🏆 **Why participate?**
- Go head-to-head with top-tier programmers nationwide.
- Earn certificates and recognition from the prestigious CSI chapter.
- Win exclusive tech prizes and career-boosting opportunities.
`.trim(),
    posterUrl: "/event/CodeClashEvent.jpg",
    venue: "Main Auditorium",
    date: "2026-03-12",
    startTime: "09:30",
    endTime: "17:30",
    eventCategory: "TECHNICAL",
    eventType: "HACKATHON",
    status: "UPCOMING",
    fees: 0,
    teamEvent: true,
    teamSize: 3,
    maxParticipants: 150,
    registrationLink: "https://codeclash.xyz/register",
    attachments: ["ProblemStatement.pdf"],
    tags: ["coding", "hackathon"],
    isFeatured: false,
    isActive: true,
    contactDetails: [
      { name: "CSI Coordinator", phone: "+91 9123456789", email: "csi@xyzcollege.edu" },
      { name: "Event Lead", phone: "+91 8888877777", email: "lead.csi@xyzcollege.edu" }
    ],
    club: { id: 102, name: "Computer Society of India", logoUrl: "/clubs/csi.png" },
    college: {
      name: "XYZ College of Engineering",
      shortForm: "XYZ COE",
      logoUrl: "/college/pcelogo.png",
      address: "Pune, Maharashtra",
      instagramUrl: "https://instagram.com/xyzcollege",
      linkedinUrl: "https://linkedin.com/school/xyz-college-of-engineering",
      websiteUrl: "https://xyzcollege.edu",
    },
    instagramUrl: "https://instagram.com/csi_xyz",
    linkedinUrl: "https://linkedin.com/company/csi-xyz-chapter",
    websiteUrl: "https://csi-xyz.org",
    registrationDeadline: "2026-03-05",
  },
  {
    id: 3,
    title: "AI & ML Workshop",
    description: `
Unlock the potential of modern technology with our **AI & Machine Learning Workshop**. This hands-on session is meticulously crafted to bridge the gap between theoretical concepts and practical industry applications. Participants will dive deep into the fundamentals of neural networks and predictive modeling through interactive coding sessions.

🤖 **What you’ll learn**
- Fundamental principles of Machine Learning and Data Science.
- Analysis of real-life industry use cases and deployment strategies.
- Live model building, training, and performance evaluation.

This workshop is the perfect launchpad for aspiring data scientists and tech enthusiasts eager to master the tools shaping our digital future.
`.trim(),
    posterUrl: "/event/CodeClashEvent.jpg",
    venue: "CSE Seminar Hall",
    date: "2026-01-25",
    startTime: "11:00",
    endTime: "15:00",
    eventCategory: "TECHNICAL",
    eventType: "WORKSHOP",
    status: "UPCOMING",
    fees: 100,
    teamEvent: false,
    teamSize: 1,
    maxParticipants: 80,
    registrationLink: "https://aiworkshop.xyz/register",
    attachments: [],
    tags: ["ai", "ml", "workshop"],
    isFeatured: true,
    isActive: true,
    contactDetails: [{ name: "Workshop Lead", phone: "+91 9988776655", email: "ai@xyzcollege.edu" }],
    club: { id: 103, name: "AI Society", logoUrl: "/clubs/ai.png" },
    college: {
      name: "XYZ College of Engineering",
      shortForm: "XYZ COE",
      logoUrl: "/college/pcelogo.png",
      address: "Pune, Maharashtra",
      instagramUrl: "https://instagram.com/xyzcollege",
      linkedinUrl: "https://linkedin.com/school/xyz-college-of-engineering",
      websiteUrl: "https://xyzcollege.edu",
    },
    instagramUrl: "https://instagram.com/aisociety_xyz",
    linkedinUrl: "",
    websiteUrl: "https://aisociety.xyz",
    registrationDeadline: "2026-01-20",
  },
  {
    id: 4,
    title: "Robo-Sumo Challenge",
    description: `
Prepare for a clash of metal and engineering brilliance at the **Robo-Sumo Challenge**. This high-octane robotics competition demands both mechanical durability and strategic programming. Teams must design and build autonomous robots capable of identifying and pushing their opponents out of a traditional sumo ring using advanced sensor integration.

⚙️ **Challenge Format**
- Custom design and construction phase following strict weight classes.
- Intensive head-to-head matches testing mechanical torque and control systems.
- Double-elimination rounds to ensure the most resilient robot triumphs.

A must-attend arena for robotics enthusiasts and engineering students looking to test their hardware integration skills in a competitive environment.
`.trim(),
    posterUrl: "/event/CodeClashEvent.jpg",
    venue: "College Quadrangle",
    date: "2026-04-05",
    startTime: "09:00",
    endTime: "17:00",
    eventCategory: "TECHNICAL",
    eventType: "COMPETITION",
    status: "UPCOMING",
    fees: 200,
    teamEvent: true,
    teamSize: 4,
    maxParticipants: 40,
    registrationLink: "https://robosumo.xyz/register",
    attachments: ["Rulebook.pdf"],
    tags: ["robotics", "engineering"],
    isFeatured: true,
    isActive: true,
    contactDetails: [
      { name: "Robotics Club Head", phone: "+91 7766554433", email: "robotics@xyzcollege.edu" },
      { name: "Operations Manager", phone: "+91 9000000001", email: "ops.robotics@xyzcollege.edu" }
    ],
    club: { id: 104, name: "Robotics Club", logoUrl: "/clubs/robotics.png" },
    college: {
      name: "XYZ College of Engineering",
      shortForm: "XYZ COE",
      logoUrl: "/college/pcelogo.png",
      address: "Pune, Maharashtra",
      instagramUrl: "https://instagram.com/xyzcollege",
      linkedinUrl: "https://linkedin.com/school/xyz-college-of-engineering",
      websiteUrl: "https://xyzcollege.edu",
    },
    instagramUrl: "https://instagram.com/robotics_xyz",
    linkedinUrl: "https://linkedin.com/company/robotics-club-xyz",
    websiteUrl: "",
    registrationDeadline: "2026-03-30",
  },
  {
    id: 5,
    title: "Photography Masterclass",
    description: `
Master the art of visual storytelling with our comprehensive **Photography Masterclass**. Led by professional visual artists, this session is designed to transform your perspective from taking snapshots to creating intentional art. Whether you use a DSLR or a smartphone, you will learn the fundamental principles that separate professional work from amateur captures.

📸 **Topics Covered**
- Advanced lighting techniques and creative rule-of-thirds composition.
- Technical mastery over camera settings like aperture, shutter speed, and ISO.
- Fundamental post-processing workflows to enhance your final images.

Ideal for beginners and aspiring photographers who want to sharpen their technical skills and build a compelling professional portfolio.
`.trim(),
    posterUrl: "/event/CodeClashEvent.jpg",
    venue: "Studio Room 4",
    date: "2026-02-10",
    startTime: "14:00",
    endTime: "18:00",
    eventCategory: "CULTURAL",
    eventType: "WORKSHOP",
    status: "UPCOMING",
    fees: 50,
    teamEvent: false,
    teamSize: 1,
    maxParticipants: 30,
    registrationLink: "https://photo.xyz/register",
    attachments: [],
    tags: ["photography", "art"],
    isFeatured: false,
    isActive: true,
    contactDetails: [{ name: "Photo Club Lead", phone: "+91 8877665544", email: "photo@xyzcollege.edu" }],
    club: { id: 105, name: "Lens & Shutter Society", logoUrl: "/clubs/photography.png" },
    college: {
      name: "XYZ College of Engineering",
      shortForm: "XYZ COE",
      logoUrl: "/college/pcelogo.png",
      address: "Pune, Maharashtra",
      instagramUrl: "https://instagram.com/xyzcollege",
      linkedinUrl: "https://linkedin.com/school/xyz-college-of-engineering",
      websiteUrl: "https://xyzcollege.edu",
    },
    instagramUrl: "https://instagram.com/photography_xyz",
    linkedinUrl: "",
    websiteUrl: "",
    registrationDeadline: "2026-02-05",
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
