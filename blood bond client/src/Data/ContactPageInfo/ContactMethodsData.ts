import { Mail, MapPin, Phone } from "lucide-react";

export const ContactMethodsData = [
  {
    icon: Mail,
    title: "Email Support",
    details: ["muhammadhassanasif769@gmail.com", "info@bloodconnect.org"],
    description: "We typically respond within 24 hours",
    action: "muhammadhassanasif769@gmail.com",
    color: "text-blue-600",
  },
  {
    icon: Phone,
    title: "Phone Support",
    details: ["0342 2945655 (Main)", "+92 300 1234567 (Emergency)"],
    description: "Available 24/7 for emergencies",
    action: "tel:+923422945655",
    color: "text-green-600",
  },
  {
    icon: MapPin,
    title: "Visit Our Office",
    details: [
      "BloodConnect HQ, Road 10, Sector 12, Gulistan-e-johar, Karachi, Pakistan",
    ],
    description: "Monday - Friday, 9:00 AM - 6:00 PM",
    action: "#",
    color: "text-red-600",
  },
];
