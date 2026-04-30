/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'customer' | 'practitioner' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  stripeAccountId?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PractitionerProfile extends UserProfile {
  bio: string;
  specialties: string[];
  pricePerSession: number;
  currency: string;
  rating?: number;
  reviews?: Review[];
  totalSessions: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  availability: string[] | Record<string, { active: boolean; start: string; end: string }>; // Array of days (legacy) or structured object
  businessHours?: {
    start: string;
    end: string;
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
  credentialsUrl?: string;
  bankingInfo?: {
    accountHolderName: string;
    accountNumber: string;
    routingNumber: string;
  };
  stripeAccountId?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  practitionerId: string;
  practitionerName: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  completionVerifiedByAdmin?: boolean;
  completionProof?: string;
  completionTimestamp?: string;
  amount: number;
  commission: number; // 8%
  practitionerEarnings: number; // 92%
  date: string;
  time: string;
  createdAt: string;
  rating?: number;
  comment?: string;
  reminders?: {
    twentyFourHour: boolean;
    oneHour: boolean;
  };
}
