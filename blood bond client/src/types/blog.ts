import type {  ReactNode } from "react";
import type { JSX } from "react/jsx-runtime";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  date: string;
  category: string;
  slug: string;
}

// all user data fetch type

export interface AllUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
   photoURL?: string;
  imageURL?: string;

  bloodGroup?: string;
  division?: string;
  district?: string;
  createAt?: string;
}

export interface AllRequester {
  fullAddress: ReactNode;
  recipientName: string;
  _id: string;
  imageURL: string;
  recipientEmail: string;
  donationDate: string;
  donationTime: string;
  hospitalName: string;
  recipientDistrict: string;
  fullAddressLine: string;
  requestMessage: string;
  requesterEmail: string;
  bloodGroup: string;
  requesterName: string;
  donationStatus: string;
  donorName?: string;
  donorEmail?: string;
}

export type Inputs = {
  userName: string;
  bloodGroup: string;
  district: string;
  division: string;
};

export interface Donor {
  _id: string;
  name: string;
  email: string;
  bloodGroup: string;
  district: string;
  upazila: string;
  avatar?: string;
  phone?: string;
}

export type bloodDonation = {
  _id: string;
  recipientName: string;
  bloodGroup: string;
  patientName?: string; 
  neededDate?: string; 
  provinceId: string;
  cityId: string;
  provinceName?: string;
  cityName?: string;      
  recipientDivision?: string;
  recipientDistrict?: string;
  recipientUpazila?: string;
   organType?: string;
  donationDate?: string;
  donationTime?: string;

  hospitalName?: string;
  fullAddressLine?: string;
  requestMessage?: string;
};

export interface DonationRequest {
  _id: string;
  requesterName: string;
  requesterEmail: string;
  recipientName: string;
  recipientDivision: string;
  recipientDistrict: string;
  organType?: string; 
  neededDate?: string; 
  hospitalName: string;
  fullAddressLine: string;
  bloodGroup: string;
  donationDate: string;
  donationTime: string;
  requestMessage: string;
  donationStatus: "pending" | "inprogress" | "done" | "canceled";
  donorName?: string;
  donorEmail?: string;
}

export type RegisterInput = {
  name: string;
  email: string;
  avatar: FileList;
  bloodGroup: string;
  division: string;
  district: string;
  upazila: string;
  password: string;
  confirmPassword: string;
};

export type ProvinceOption = {
  map(arg0: (d: unknown) => JSX.Element): ReactNode;
  id: string;
  name: string;
  bn_name: string;
  url: string;
};

export interface CityOption {
  id: string;
  province_id: string;
  name: string;
  bn_name: string;
  lat?: string;
  lon?: string;
  url: string;
}

//!  registration type

export type registration = {
  name: string;
  email: string;
  avatar: FileList;
  bloodGroup: string;
  division: string;
  district: string;
  password: string;
  confirmPassword: string;
};

export interface CtaButtonProps {
  to: string;
  label: string;
  Icon: React.ElementType;
  variant: "primary" | "secondary";
}

export interface VolunteerApplication {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bloodGroup: string;
  division: string;
  district: string;
  photoURL?: string;
  status?: string;
  appliedDate: string;
  experience?: string;
  motivation?: string;
}

export interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
}

export type FormData = {
  amount: number;
};

//  link props

export interface LinkProps {
  to: string;
  label: string;
  Icon: React.ElementType;
  isCollapsed: boolean;
}
