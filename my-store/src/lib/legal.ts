import { BRAND } from "@/lib/brand";

export const LAST_UPDATED = "12 October 2026";

/**
 * Company details used across the legal pages. Replace the bracketed values
 * with the registered particulars before launch.
 */
export const COMPANY = {
  legalName: "NaSO [Registered company name]",
  registration: "[Company registration number]",
  address: "[Registered business address]",
  email: BRAND.supportEmail,
  informationOfficer: "[Name of Information Officer]",
  informationOfficerEmail: BRAND.supportEmail,
} as const;
