import {
  FaUserPlus,
  FaSearch,
  FaHandHoldingHeart,
  FaHeartbeat,
} from "react-icons/fa";

export const HowtoWorkStepData = [
  {
    icon: <FaUserPlus className="text-3xl" />,
    title: "Register as Donor",
    description:
      "Create your account with your blood group and location details to become part of our life-saving community.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: <FaSearch className="text-3xl" />,
    title: "Find Requests",
    description:
      "Browse blood donation requests in your area or get notified when someone needs your blood type.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: <FaHandHoldingHeart className="text-3xl" />,
    title: "Donate Blood",
    description:
      "Respond to donation requests, schedule your donation, and make a difference in someone's life.",
    color: "bg-red-100 text-red-600",
  },
  {
    icon: <FaHeartbeat className="text-3xl" />,
    title: "Save Lives",
    description:
      "Your donation can save up to three lives. Track your impact and become a hero in your community.",
    color: "bg-purple-100 text-purple-600",
  },
];
