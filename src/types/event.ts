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
  id: string;

  /* ===== Key / Ticket UI ===== */
  title: string;
  posterUrl: string;

  organizerName: string;
  clubLogoUrl: string;

  status: "Upcoming" | "Completed";
  isPaid: boolean;

  venue: string;
  date: string;
  time: string;
  category: string;

  teamSize?: string;
  type: string;

  registrationDeadline: string;

  /* ===== Details Section ===== */
  description: string;

  contact: {
    phone: string;
    email: string;
  };

  organizer: {
    name: string;
    subtitle?: string;
    logoUrl: string;
  };

  collegeName: string;
  collegeMeta: string;

  socials: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
};
