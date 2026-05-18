import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplet, MapPin, Calendar, Clock, Eye } from "lucide-react";
import type { bloodDonation } from "@/types/blog";
import { Link } from "react-router-dom";

// Type Definition
interface DonationRequestCardProps {
  donationdata: bloodDonation;
}

const DonationRequestCard: React.FC<DonationRequestCardProps> = ({
  donationdata,
}) => {
 const {
    bloodGroup,
    donationDate,
    donationTime,
    recipientDistrict,
    fullAddressLine,
    _id,
  } = donationdata || {};
const displayDate = donationDate || donationdata.neededDate;
const displayTime = donationTime;
// Organ request ke liye neededDate use karo:

  // Format date - "20 Dec, 2024"
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format time - "2:30 PM"
  const formatTime = (timeString?: string) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <Card className="overflow-hidden  rounded-md bg-card/50  hover:-translate-y-2 transition-all duration-300 border-2 border-secondary hover:border-primary/30 group">
      <CardContent>
        <div className="flex  flex-col">
          {/* Blood Group Badge - Top */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-linear-to-r from-primary to-destructive text-primary-foreground rounded-full font-bold shadow-lg">
                <Droplet className="w-4 h-4" />
                {bloodGroup || "N/A"}
              </div>
            </div>

            {/* Recipient Name */}
            <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors truncate">
              {donationdata.recipientName || donationdata.patientName || "Unknown Recipient"}
            </h3>

            {/* Details */}
            <div className="space-y-3 mb-6">
              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground/90 line-clamp-2">
                    {donationdata.cityName && donationdata.provinceName
                   ? `${donationdata.cityName}, ${donationdata.provinceName}`
                   : recipientDistrict && fullAddressLine
                     ? `${recipientDistrict}, ${fullAddressLine}`
                            : recipientDistrict || fullAddressLine || "Location not specified"}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm text-foreground/80 font-medium">
                  {formatDate(displayDate)}
                </p>
              </div>

              {/* Time */}
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm text-foreground/80 font-medium">
                  {formatTime(displayTime)}
                </p>
              </div>
            </div>
          </div>
          {/* View Details Button */}
                <Link to={donationdata.organType?`/organ-request/${_id}`: `/donation-request-details/${_id}`}>
            <Button className="w-full cursor-pointer ">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationRequestCard;
