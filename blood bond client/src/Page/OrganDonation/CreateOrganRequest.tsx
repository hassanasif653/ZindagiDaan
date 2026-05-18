import React, { useEffect, useState } from "react";
import {
  HeartPulse,
  MapPin,
  Calendar,
  MessageSquare,
  AlertTriangle,
  User,
  Mail,
  PlusCircle,
  Stethoscope,
} from "lucide-react";
import { toast } from "react-toastify";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
import useRole from "@/Hook/useRole";
import {
  loadPakistanLocations,
  type City,
  type Province,
} from "@/lib/pakistanLocations";

const organTypes = ["Kidney", "Liver", "Heart", "Lungs", "Pancreas", "Cornea", "Bone Marrow"];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = ["Low", "Medium", "High", "Critical"];

type OrganRequestForm = {
  patientName: string;
  organType: string;
  bloodGroup: string;
  hospitalName: string;
  provinceId: string;
  cityId: string;
  neededDate: string;
  urgency: string;
  requestMessage: string;
};

const CreateOrganRequest: React.FC = () => {
  const { user } = useAuth();
  const { role, status } = useRole();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);

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

  const form = useForm<OrganRequestForm>({
    defaultValues: {
      patientName: "",
      organType: "",
      bloodGroup: "",
      hospitalName: "",
      provinceId: "",
      cityId: "",
      neededDate: "",
      urgency: "",
      requestMessage: "",
    },
  });

  const { control, handleSubmit, watch, setValue, formState } = form;

  const selectedProvinceId = watch("provinceId");

  useEffect(() => {
    if (selectedProvinceId) {
      const filteredCities = cities.filter(
        (city) => String(city.province_id) === String(selectedProvinceId)
      );
      setAvailableCities(filteredCities);
      setValue("cityId", "");
    } else {
      setAvailableCities([]);
    }
  }, [selectedProvinceId, cities, setValue]);

  const onSubmit: SubmitHandler<OrganRequestForm> = async (data) => {
    try {
      const selectedProvince = provinces.find(
        (p) => String(p.id) === String(data.provinceId)
      );
      const selectedCity = availableCities.find(
        (c) => String(c.id) === String(data.cityId)
      );

      const organRequestInfo = {
        ...data,
        provinceName: selectedProvince?.name || "",
        cityName: selectedCity?.name || "",
        requesterEmail: user?.email || "",
        requesterName: user?.displayName || "",
        requestStatus: "pending",
        createdAt: new Date(),
      };

      await axiosSecure.post("/organ-request", organRequestInfo);
      toast.success("Organ request created successfully!");
      form.reset();

      setTimeout(() => {
        navigate("/dashboard/my-organ-requests");
      }, 1500);
    } catch (error) {
      console.error("Error creating organ request:", error);
      toast.error("Failed to create organ request. Please try again.");
    }
  };

  if (status === "block") {
    return (
      <div className="p-12 min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="max-w-xl mx-auto bg-card shadow-2xl rounded-xl p-10 text-center border-t-4 border-destructive">
          <AlertTriangle className="w-12 h-12 mx-auto text-destructive mb-4" />
          <h2 className="text-3xl font-bold text-destructive">Account Blocked</h2>
          <p className="mt-4 text-lg text-foreground/80">
            Sorry, your account is currently blocked. You cannot create organ
            requests. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  if (role === "volunteer" && status !== "active") {
    return (
      <div className="p-12 min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="max-w-xl mx-auto bg-card shadow-2xl rounded-xl p-10 text-center border-t-4 border-yellow-500">
          <AlertTriangle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-3xl font-bold text-yellow-500">
            Volunteer Approval Pending
          </h2>
          <p className="mt-4 text-lg text-foreground/80">
            Admin has not approved your volunteer account yet. You cannot create
            organ requests until approval.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <header className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground flex items-center gap-3">
          <PlusCircle className="w-7 h-7 md:w-8 md:h-8 text-primary" />
          Create Organ Donation Request
        </h1>
        <p className="mt-2 text-base md:text-xl text-muted-foreground">
          Fill in the details to find an organ donor and save a life.
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
                    value={user?.displayName || ""}
                    readOnly
                    className="cursor-not-allowed bg-muted/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center text-muted-foreground text-sm">
                    <Mail className="w-4 h-4 mr-1 shrink-0" /> Email Address
                  </Label>
                  <Input
                    value={user?.email || ""}
                    readOnly
                    className="cursor-not-allowed bg-muted/50 border-border"
                  />
                </div>
              </div>
              <p className="mt-5 text-xs text-muted-foreground border-t border-border pt-4">
                These fields are locked as you are logged in as the requester.
              </p>
            </div>

            {/* RIGHT COLUMN: Organ & Patient Details */}
            <div className="lg:col-span-2 bg-card p-6 md:p-8 rounded-xl shadow-2xl border border-border">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary shrink-0" />
                Organ & Patient Details
              </h2>

              {/* Patient Name & Organ Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
                <FormField
                  control={control}
                  name="patientName"
                  rules={{ required: "Patient name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter patient's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="organType"
                  rules={{ required: "Organ type is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organ Type <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select organ type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Available Organs</SelectLabel>
                            {organTypes.map((o) => (
                              <SelectItem key={o} value={o}>{o}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Blood Group & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
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

                <FormField
                  control={control}
                  name="urgency"
                  rules={{ required: "Urgency level is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency Level <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Urgency</SelectLabel>
                            {urgencyLevels.map((u) => (
                              <SelectItem key={u} value={u}>{u}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Hospital Name & Needed Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
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

                <FormField
                  control={control}
                  name="neededDate"
                  rules={{ required: "Needed date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        Needed By Date <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          {...field}
                        />
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
                        placeholder="Write in detail why organ donation is needed and any critical information..."
                        {...field}
                        className="min-h-[120px] resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="mt-8 flex justify-center">
                <Button type="submit" disabled={formState.isSubmitting}>
                  {formState.isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <HeartPulse className="w-5 h-5 mr-2" />
                      Submit Organ Request
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

export default CreateOrganRequest;