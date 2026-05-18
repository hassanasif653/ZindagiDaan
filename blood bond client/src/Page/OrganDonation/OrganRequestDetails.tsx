import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useRole from "@/Hook/useRole";
import {
  Droplet,
  MapPin,
  Calendar,
  User,
  Mail,
  Building2,
  MessageSquare,
  AlertCircle,
  ArrowLeft,
  Heart,
  Stethoscope,
  Zap,
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
import DashboardSpinner from "@/Page/Shared/Spinner/DashboardSpinner";

interface OrganRequest {
  _id: string;
  patientName: string;
  organType: string;
  bloodGroup: string;
  hospitalName: string;
  provinceName?: string;
  cityName?: string;
  neededDate: string;
  urgency: string;
  requestStatus: string;
  requesterEmail: string;
  requesterName: string;
  requestMessage?: string;
  donorName?: string;
  donorEmail?: string;
}

const OrganRequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { role } = useRole();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: organRequest,
    isLoading,
    error,
  } = useQuery<OrganRequest>({
    queryKey: ["organ-request", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/organ-request/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const confirmDonationMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Organ request id is missing");
      await axiosSecure.patch(`/organ-request/${id}/status`, {
        requestStatus: "inprogress",
        donorName: user?.displayName || user?.email,
        donorEmail: user?.email,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organ-request", id] });
      toast.success("Organ donation confirmed successfully!");
      setIsModalOpen(false);
    },
    onError: (mutationError) => {
      console.error("Error confirming organ donation:", mutationError);
      toast.error("Failed to confirm donation. Please try again.");
    },
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "inprogress": return "bg-blue-500";
      case "fulfilled": return "bg-green-500";
      case "rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Critical": return "bg-red-500";
      case "High": return "bg-orange-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  if (isLoading) return <DashboardSpinner />;

  if (error || !organRequest) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md mx-4 border-destructive bg-card/50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Request Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The organ request you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate(-1)} className="cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    patientName,
    organType,
    bloodGroup,
    hospitalName,
    provinceName,
    cityName,
    neededDate,
    urgency,
    requestStatus,
    requesterName,
    requesterEmail,
    requestMessage,
    donorName,
    donorEmail,
  } = organRequest;

  return (
    <Container>
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-6 border-2 cursor-pointer">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-4 shadow-xl">
          <Stethoscope className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Organ Donation Request Details
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status Card */}
          <Card className="bg-card/50 border-2 border-secondary rounded-md">
            <CardHeader>
              <CardTitle className="text-xl">Request Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <Badge className={`${getStatusColor(requestStatus)} text-lg px-6 py-1`}>
                  {requestStatus?.toUpperCase() || "PENDING"}
                </Badge>
              </div>

              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground mb-2">Urgency Level</p>
                <Badge className={`${getUrgencyColor(urgency)} text-base px-4 py-1`}>
                  <Zap className="w-4 h-4 mr-1" />
                  {urgency}
                </Badge>
              </div>

              <div className="text-center pt-2 border-t">
                <p className="text-sm text-muted-foreground mb-2">Required Blood Group</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-linear-to-r from-primary to-destructive text-primary-foreground rounded-full font-bold text-xl shadow-lg">
                  <Droplet className="w-6 h-6" />
                  {bloodGroup}
                </div>
              </div>

              <div className="text-center pt-2 border-t">
                <p className="text-sm text-muted-foreground mb-2">Organ Needed</p>
                <p className="font-bold text-primary text-lg">{organType}</p>
              </div>
            </CardContent>
          </Card>

          {/* Requester Info */}
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
                <p className="text-sm text-foreground break-all">{requesterEmail}</p>
              </div>
            </CardContent>
          </Card>

          {/* Donor Info */}
          {requestStatus === "inprogress" && donorName && (
            <Card className="border-2 border-blue-500/50 bg-blue-50 dark:bg-blue-950">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Heart className="w-5 h-5 text-blue-500" />
                  Donor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Donor Name</p>
                  <p className="font-semibold text-foreground">{donorName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Donor Email</p>
                  <p className="text-sm text-foreground break-all">{donorEmail}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-secondary bg-card/50 rounded-md">
            <CardHeader>
              <CardTitle className="text-2xl">Patient & Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                  <User className="w-4 h-4" />
                  Patient Name
                </Label>
                <p className="text-lg font-semibold text-foreground">{patientName}</p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  Needed By Date
                </Label>
                <p className="text-base font-medium text-foreground">{formatDate(neededDate)}</p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4" />
                  Hospital Name
                </Label>
                <p className="text-base font-medium text-foreground">{hospitalName}</p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </Label>
                <p className="text-base font-medium text-foreground">
                  {cityName && provinceName ? `${cityName}, ${provinceName}` : "Not specified"}
                </p>
              </div>

              {requestMessage && (
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
              )}
            </CardContent>
          </Card>

          {/* Donate Button - only donor */}
          {requestStatus === "pending" && user && role === "donor" && (
            <Card className="border border-primary rounded-md bg-linear-to-br from-primary/5 to-destructive/5">
              <CardContent className="p-6 flex items-center justify-center flex-col">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Ready to Save a Life?
                  </h3>
                  <p className="text-muted-foreground">
                    Click the button below to confirm your organ donation and help {patientName}
                  </p>
                </div>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  size="lg"
                  className="rounded-md cursor-pointer">
                  <Heart className="w-6 h-6 mr-3" />
                  I Want to Donate Organ
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Inprogress Message */}
          {requestStatus === "inprogress" && (
            <Card className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-foreground mb-2">Donation Inprogress</h3>
                <p className="text-muted-foreground">
                  A donor has accepted this request and the donation process is ongoing.
                </p>
                {(role === "volunteer" || role === "admin") && (
                  <div className="flex gap-3 mt-4 justify-center">
                    <Button
                      onClick={async () => {
                        try {
                          await axiosSecure.patch(`/organ-request/${id}/status`, {
                            requestStatus: "fulfilled",
                          });
                          queryClient.invalidateQueries({
                            queryKey: ["organ-request", id],
                          });
                          toast.success("Donation marked as fulfilled!");
                        } catch (error) {
                          console.error(error);
                          toast.error("Failed to update status");
                        }
                      }}
                    >
                      ✅ Mark as Fulfilled
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        try {
                          await axiosSecure.patch(`/organ-request/${id}/status`, {
                            requestStatus: "rejected",
                          });
                          queryClient.invalidateQueries({
                            queryKey: ["organ-request", id],
                          });
                          toast.success("Donation marked as rejected!");
                        } catch (error) {
                          console.error(error);
                          toast.error("Failed to update status");
                        }
                      }}
                    >
                      ❌ Mark as Rejected
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              Confirm Organ Donation
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Please review your information before confirming the donation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
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

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm text-foreground">
                  <p className="font-semibold mb-1">Important:</p>
                  <p>
                    By confirming, you agree to donate <strong>{organType}</strong> for patient{" "}
                    <strong>{patientName}</strong> at <strong>{hospitalName}</strong>.
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
              {confirmDonationMutation.isPending ? "Confirming..." : "Confirm Donation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default OrganRequestDetails;