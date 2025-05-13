export const RESTUARANT_SEARCHABLE_FIELDS = [];

export enum RESTAURANT_STATUS {
    UNVERIFIED = "unverified",  // After initial form submission
    PENDING = "pending",        // After OTP is verified
    ACTIVE = "acitve",      // After admin approval
    REJECTED = "rejected"       // Optional: if admin denies request
  }