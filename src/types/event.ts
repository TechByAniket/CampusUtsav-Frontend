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

export interface EventSummary {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  eventCategory: string;
  eventType: string;
  venue: string;
  remarks: string | null;
  status: string;
  posterUrl: string;
  clubId: number;
  clubNameShortForm: string;
  clubLogoUrl: string;
  clubName: string;
}

export interface AdminEventDetail {
  id: number;
  title: string;
  eventCategory: string;
  eventType: string;
  fees: number;
  description: string;
  posterUrl: string;
  venue: string;
  date: string;
  registrationDeadline: string;
  startTime: string;
  endTime: string;
  teamEvent: boolean;
  teamSize: number;
  maxParticipants: number;
  publicAttachments: Record<string, string>;
  privateAttachments: Record<string, string>;
  tags: string[] | null;
  status: string;
  registrationLink: string;
  contactDetails: Record<string, { email: string; phone: string }>;
  extraInfo: string | null;
  club: {
    id: number;
    name: string;
    shortForm: string;
    adminName: string;
    managedBy: string;
    status: string;
    logoUrl: string;
  };
  collegeId: number;
  allowedBranches: Record<string, string>;
  allowedYears: Record<string, string>;
  active: boolean;
  featured: boolean;
}

