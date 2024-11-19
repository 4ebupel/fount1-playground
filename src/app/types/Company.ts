import { BillingDetails } from "./BillingDetails";
import { GeoPoint } from "./GeoPoint";
import { SocialMedia } from "./SocialMedia";
import { XanoMinPicture } from "./XanoMinPicture";

export interface Company {
    id: number;
    created_at: number;
    name: string;
    description: string;
    billing_address: string;
    contact_email: string;
    contact_phone: string;
    website: string;
    employees: number;
    rating: number;
    amount_reviews: number;
    benefits: string[];
    logo: XanoMinPicture;
    banner: XanoMinPicture;
    location: GeoPoint;
    social_media?: SocialMedia[];
    billing_details: BillingDetails;
}