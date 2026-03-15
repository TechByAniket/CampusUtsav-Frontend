export interface Organizer {
  name: string
  subtitle?: string
  logoUrl?: string
}

export interface ContactInfo {
  phone?: string
  email?: string
}

export interface SocialLinks {
  instagram?: string
  twitter?: string
}

// src/types/event.ts
export interface EventDetailsPageProps {
  id: string
  description: string
  contact: ContactInfo
  organizer: Organizer
  collegeName: string
  collegeMeta?: string
  socials?: SocialLinks
}

// src/types/eventCard.ts
export interface UpcomingEventCardProps {
  id: string
  title: string
  category: string
  imageUrl: string
  venue: string
  organizer: string
  date: string
  time: string
}

export type Event = {
  id: number;

  /* ===== Core Info ===== */
  title: string;
  description: string;
  posterUrl: string;

  venue: string;

  date: string;        // ISO date string (yyyy-MM-dd)
  startTime: string;   // HH:mm:ss
  endTime: string;     // HH:mm:ss

  /* ===== Classification ===== */
  eventCategory: string; // EventCategory enum from backend
  eventType: string;     // EventType enum from backend
  status: string;        // EventStatus enum

  /* ===== Participation ===== */
  fees: number;
  teamEvent: boolean;
  teamSize: number;
  maxParticipants: number;
  registrationLink: string;

  /* ===== Metadata ===== */
  attachments: string[];
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  instagramUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;

  /* ===== Contact ===== */
  contactDetails: Array<{
    name: string;
    phone: string;
    email: string;
  }>;
  // example:
  // {
  //   "John Doe": { "phone": "9999999999" }
  // }

  /* ===== Club ===== */
  club: {
    id: number;
    name: string;
    logoUrl: string;
  };

  college:{
    name: string;
    shortForm:string;
    logoUrl?:string;
    address?:string;
    instagramUrl?:string;
    websiteUrl?:string;
    linkedinUrl?:string;  
  }

  /* ===== Extra ===== */
  extraInfo?: string; // JSON string
  registrationDeadline?: string; // ISO date string 
};

