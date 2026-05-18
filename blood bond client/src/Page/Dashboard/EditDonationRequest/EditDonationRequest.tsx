import React, { useEffect, useState } from "react";
import {
  HeartPulse,
  MapPin,
  Calendar,
  Clock,
  MessageSquare,
  User,
  Mail,
  Edit,
} from "lucide-react";
import { toast } from "react-toastify";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// shadcn/ui components
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

import useAuth from "@/Hook/useAuth";
import useAxiosSecure from "@/Hook/useAxiosSecure";
import type { bloodDonation } from "@/types/blog";
import {
  loadPakistanLocations,
  type City,
  type Province,
} from "@/lib/pakistanLocations";
import DashboardSpinner from "@/Page/Shared/Spinner/DashboardSpinner";

// Blood Groups
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const EditDonationRequest: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  // Load Pakistan locations
  useEffect(() => {
    loadPakistanLocations()
      .then(({ provinces, cities }) => {
        setProvinces(provinces);
        setCities(cities);
      })
      .catch((error) => {
        console.error("Failed to load location data:", error);
        setProvinces([]);
        setCities([]);
      });
  }, []);

  // Fetch existing donation request
  const { data: existingRequest, isLoading } = useQuery({
    queryKey: ["donation-request", id],
    queryFn: async () => {
      const response = await axiosSecure.get(`/donation-request/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const form = useForm<bloodDonation>({
    defaultValues: {
      recipientName: "",
      bloodGroup: "",
      donationDate: "",
      donationTime: "",
      hospitalName: "",
      provinceId: "",
      cityId: "",
      requestMessage: "",
    },
  });

  const { control, handleSubmit, watch, reset, formState } = form;

  const selectedProvinceId = watch("provinceId");

  // Populate form when existing request loads
  useEffect(() => {
    if (existingRequest) {
      reset({
        recipientName: existingRequest.recipientName || "",
        bloodGroup: existingRequest.bloodGroup || "",
        donationDate: existingRequest.donationDate || "",
        donationTime: existingRequest.donationTime || "",
        hospitalName: existingRequest.hospitalName || "",
        provinceId: existingRequest.provinceId || "",
        cityId: existingRequest.cityId || "",
        requestMessage: existingRequest.requestMessage || "",
      });
    }
  }, [existingRequest, reset]);

  // Filter cities when province changes
  useEffect(() => {
    if (selectedProvinceId) {
      const filteredCities = cities.filter(
        (city) => String(city.province_id) === String(selectedProvinceId)
      );
      setAvailableCities(filteredCities);
    } else {
      setAvailableCities([]);
    }
  }, [selectedProvinceId, cities]);

  const onSubmit: SubmitHandler<bloodDonation> = async (data) => {
    try {
      const selectedProvince = provinces.find(
        (p) => String(p.id) === String(data.provinceId)
      );
      const selectedCity = availableCities.find(
        (c) => String(c.id) === String(data.cityId)
      );

      const updatedInfo = {
        ...data,
        provinceName: selectedProvince?.name || existingRequest?.provinceName || "",
        cityName: selectedCity?.name || existingRequest?.cityName || "",
      };

      await axiosSecure.put(`/donation-request/${id}`, updatedInfo);
      toast.success("Donation request updated successfully!");

      setTimeout(() => {
        navigate("/dashboard/all-blood-donation-request");
      }, 1500);
    } catch (error) {
      console.error("Error updating donation request:", error);
      toast.error("Failed to update donation request. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <DashboardSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <header className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground flex items-center gap-3">
          <Edit className="w-7 h-7 md:w-8 md:h-8 text-primary" />
          Edit Donation Request
        </h1>
        <p className="mt-2 text-base md:text-xl text-muted-foreground">
          Update the details of this blood donation request.
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

            {/* LEFT COLUMN: Requester Info */}
            <div className="lg:col-span-1 bg-card p-6 rounded-xl shadow-lg h-fit border-l-4 border-primary">
              <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 shrink-0" />
                <span className="truncate">Requester Information</span>
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center text-muted-foreground text-sm">
                    <User className="w-4 h-4 mr-1 shrink-0" /> Requester Name
                  </Label>
                  <Input
                    value={existingRequest?.requesterName || user?.displayName || ""}
                    readOnly
                    className="cursor-not-allowed bg-muted/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center text-muted-foreground text-sm">
                    <Mail className="w-4 h-4 mr-1 shrink-0" /> Email Address
                  </Label>
                  <Input
                    value={existingRequest?.requesterEmail || user?.email || ""}
                    readOnly
                    className="cursor-not-allowed bg-muted/50 border-border"
                  />
                </div>
              </div>
              <p className="mt-5 text-xs text-muted-foreground border-t border-border pt-4">
                These fields are locked and cannot be changed.
              </p>
            </div>

            {/* RIGHT COLUMN: Recipient & Donation */}
            <div className="lg:col-span-2 bg-card p-6 md:p-8 rounded-xl shadow-2xl border border-border">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-primary shrink-0" />
                Donation & Recipient Details
              </h2>

              {/* Recipient Name & Blood Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
                <FormField
                  control={control}
                  name="recipientName"
                  rules={{ required: "Recipient name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter patient's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="bloodGroup"
                  rules={{ required: "Blood group is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Available Blood Groups</SelectLabel>
                            {bloodGroups.map((g) => (
                              <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
                <FormField
                  control={control}
                  name="donationDate"
                  rules={{ required: "Donation date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        Donation Date <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="donationTime"
                  rules={{ required: "Donation time is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        Donation Time <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Hospital Name */}
              <div className="mb-6">
                <FormField
                  control={control}
                  name="hospitalName"
                  rules={{ required: "Hospital name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospital Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., PNS Shifa Hospital" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Province & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
                <FormField
                  control={control}
                  name="provinceId"
                  rules={{ required: "Province is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        Province <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Province" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Provinces</SelectLabel>
                            {provinces.map((p) => (
                              <SelectItem key={p.id} value={String(p.id)}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="cityId"
                  rules={{ required: "City is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        City <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedProvinceId}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={!selectedProvinceId ? "cursor-not-allowed opacity-60" : ""}
                          >
                            <SelectValue
                              placeholder={
                                selectedProvinceId ? "Select City" : "Select Province first"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Cities</SelectLabel>
                            {availableCities.map((city) => (
                              <SelectItem key={city.id} value={String(city.id)}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Request Message */}
              <FormField
                control={control}
                name="requestMessage"
                rules={{ required: "Request message is required" }}
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      Request Message <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write in detail why blood is needed..."
                        {...field}
                        className="min-h-[120px] resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Buttons */}
              <div className="mt-8 flex justify-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/all-blood-donation-request")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={formState.isSubmitting}>
                  {formState.isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="w-5 h-5 mr-2" />
                      Update Request
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditDonationRequest;
