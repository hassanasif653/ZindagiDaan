import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useRole from "@/Hook/useRole"
import {
  Droplet,
  MapPin,
  Calendar,
  Clock,
  User,
  Mail,
  Building2,
  MessageSquare,
  AlertCircle,
  ArrowLeft,
  Heart,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import useAuth from "@/Hook/useAuth";
import useAxiosSecure from "@/Hook/useAxiosSecure";
import Container from "@/Page/Shared/Responsive/Container";
import type { DonationRequest } from "@/types/blog";
import DashboardSpinner from "@/Page/Shared/Spinner/DashboardSpinner";

const DonationRequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { role } = useRole(); 
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch donation request details
  const {
    data: donationRequest,
    isLoading,
    error,
  } = useQuery<DonationRequest>({
    queryKey: ["donation-request", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donation-requests-details/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const confirmDonationMutation = useMutation({
    mutationFn: async () => {
      if (!id) {
        throw new Error("Donation request id is missing");
      }

      await axiosSecure.patch(`/donation-request/${id}/status`, {
        donationStatus: "inprogress",
        donorName: user?.displayName || "Anonymous Donor",
        donorEmail: user?.email || "",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donation-request", id] });
      toast.success("Donation confirmed successfully!");
      setIsModalOpen(false);
    },
    onError: (mutationError) => {
      console.error("Error confirming donation:", mutationError);
      toast.error("Failed to confirm donation. Please try again.");
    },
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "inprogress":
        return "bg-blue-500";
      case "done":
        return "bg-green-500";
      case "canceled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Loading state
  if (isLoading) {
    return <DashboardSpinner />;
  }

  //? !if id to navigate search page

  // Error state
  if (error || !donationRequest) {
    return (
      <div className="flex items-center justify-center">
        <Card className="max-w-md mx-4 border-destructive bg-card/50 ">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Request Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              The donation request you're looking for doesn't exist or has been
              removed.
            </p>
            <Link to={"/dashboard/donation-requests"}>
              <Button className="cursor-pointer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Requests
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    requesterName,
    requesterEmail,
    recipientName,
    recipientDistrict,
    hospitalName,
    fullAddressLine,
    bloodGroup,
    donationDate,
    donationTime,
    requestMessage,
    donationStatus,
    donorName,
    donorEmail,
  } = donationRequest || {};

  return (
    <Container>
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-6 border-2 cursor-pointer">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-4 shadow-xl">
          <Droplet className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Blood Donation Request Details
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Status & Blood Group */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status Card */}
          <Card className=" bg-card/50 border-2 border-secondary rounded-md">
            <CardHeader>
              <CardTitle className="text-xl">Request Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <Badge
                  className={`${getStatusColor(
                    donationStatus
                  )} text-lg px-6 py-1`}>
                  {donationStatus?.toUpperCase() || "pending"}
                </Badge>
              </div>

              {/* Blood Group */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Required Blood Group
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-linear-to-r from-primary to-destructive text-primary-foreground rounded-full font-bold text-xl shadow-lg">
                  <Droplet className="w-6 h-6" />
                  {bloodGroup}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requester Info Card */}
          <Card className="bg-card/50 rounded-md border-2 border-secondary">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Requester Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                <p className="font-semibold text-foreground">{requesterName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="text-sm text-foreground break-all">
                  {requesterEmail}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Donor Info Card (if status is inprogress) */}
          {donationStatus === "inprogress" && donorName && (
            <Card className="border-2 border-blue-500/50 bg-blue-50 dark:bg-blue-950">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Heart className="w-5 h-5 text-blue-500" />
                  Donor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Donor Name
                  </p>
                  <p className="font-semibold text-foreground">{donorName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Donor Email
                  </p>
                  <p className="text-sm text-foreground break-all">
                    {donorEmail}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Request Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recipient Details Card */}
          <Card className="border-2 border-secondary bg-card/50 rounded-md">
            <CardHeader>
              <CardTitle className="text-2xl">Recipient Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recipient Name */}
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                  <User className="w-4 h-4" />
                  Recipient Name
                </Label>
                <p className="text-lg font-semibold text-foreground">
                  {recipientName}
                </p>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    Donation Date
                  </Label>
                  <p className="text-base font-medium text-foreground">
                    {formatDate(donationDate)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4" />
                    Donation Time
                  </Label>
                  <p className="text-base font-medium text-foreground">
                    {formatTime(donationTime)}
                  </p>
                </div>
              </div>

              {/* Hospital Name */}
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4" />
                  Hospital Name
                </Label>
                <p className="text-base font-medium text-foreground">
                  {hospitalName}
                </p>
              </div>

              {/* Location */}
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </Label>
                <p className="text-base font-medium text-foreground mb-1">
                  {recipientDistrict}
                </p>
                <p className="text-sm text-muted-foreground">
                  {fullAddressLine}
                </p>
              </div>

              {/* Request Message */}
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Request Message
                </Label>
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {requestMessage}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donate Button - Only show if status is pending */}
          {donationStatus === "pending" && user && role === "donor" && (
            <Card className="border border-primary rounded-md bg-linear-to-br from-primary/5 to-destructive/5">
              <CardContent className="p-6 flex items-center justify-center flex-col">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Ready to Save a Life?
                  </h3>
                  <p className="text-muted-foreground">
                    Click the button below to confirm your donation and help{" "}
                    {recipientName}
                  </p>
                </div>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  size="lg"
                  className="rounded-md cursor-pointer">
                  <Heart className="w-6 h-6 mr-3" />I Want to Donate Blood
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Already Donated Message */}
          {donationStatus === "inprogress" && (
            <Card className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Donation In Progress
                </h3>
                <p className="text-muted-foreground">
                  This request is currently being fulfilled. Thank you for your
                  interest!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Donation Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              Confirm Blood Donation
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Please review your information before confirming the donation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Donor Name (Read Only) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <User className="w-4 h-4 text-primary" />
                Donor Name
              </Label>
              <Input
                value={user?.displayName || ""}
                readOnly
                className="cursor-not-allowed bg-muted/50"
              />
            </div>

            {/* Donor Email (Read Only) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Mail className="w-4 h-4 text-primary" />
                Donor Email
              </Label>
              <Input
                value={user?.email || ""}
                readOnly
                className="cursor-not-allowed bg-muted/50"
              />
            </div>

            {/* Info Alert */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm text-foreground">
                  <p className="font-semibold mb-1">Important:</p>
                  <p>
                    By confirming, you agree to donate blood on{" "}
                    <strong>{formatDate(donationDate)}</strong> at{" "}
                    <strong>{formatTime(donationTime)}</strong> at{" "}
                    <strong>{hospitalName}</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={confirmDonationMutation.isPending}
              className="flex-1">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => confirmDonationMutation.mutate()}
              disabled={confirmDonationMutation.isPending}
              className="flex-1 bg-linear-to-r from-primary to-destructive hover:from-primary/90 hover:to-destructive/90">
              {confirmDonationMutation.isPending
                ? "Confirming..."
                : "Confirm Donation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default DonationRequestDetails;
