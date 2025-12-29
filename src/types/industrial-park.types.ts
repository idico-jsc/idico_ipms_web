/**
 * Industrial Park Type Definitions
 */

export interface ContactInfo {
  name: string;
  phone: string;
  role: string;
}

export interface IndustrialPark {
  id: string;
  name: string;
  address: string;
  area: string; // Diện tích
  occupancyRate: number; // Tỷ lệ lấp đầy (%)
  description?: string;
  contacts: {
    management: ContactInfo[];
    security: ContactInfo[];
    hotline: string;
  };
  image?: string;
}
