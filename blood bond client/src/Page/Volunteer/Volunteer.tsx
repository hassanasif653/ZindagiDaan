import Container from "@/Page/Shared/Responsive/Container";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  FaHeartbeat,
  FaHandHoldingHeart,
  FaUsers,
  FaAward,
} from "react-icons/fa";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useAuth from "@/Hook/useAuth";
import useAxiosSecure from "@/Hook/useAxiosSecure";
import {
  loadPakistanLocations,
  type City,
  type Province,
} from "@/lib/pakistanLocations";

type VolunteerFormInputs = {
  name: string;
  email: string;
  phone?: string;
  bloodGroup: string;
  age: string;
  provinceId: string;
  city: string;
};

const Volunteer = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isLoading, setIsLoading] = useState(false);
  const [allProvinces, setAllProvinces] = useState<Province[]>([]);
  const [allCities, setAllCities] = useState<City[]>([]);
  const [availableCities, setAvailableCities] = useState<City[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<VolunteerFormInputs>({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      provinceId: "",
      city: "",
    },
  });

  const selectedProvinceId = watch("provinceId");

  useEffect(() => {
    loadPakistanLocations()
      .then(({ provinces, cities }) => {
        setAllProvinces(provinces);
        setAllCities(cities);
      })
      .catch((error) => {
        console.error("Failed to load location data:", error);
        setAllProvinces([]);
        setAllCities([]);
      });
  }, []);

  useEffect(() => {
    if (selectedProvinceId) {
      const filtered = allCities.filter(
        (city) => city.province_id === selectedProvinceId
      );
      setAvailableCities(filtered);
      setValue("city", "");
    } else {
      setAvailableCities([]);
      setValue("city", "");
    }
  }, [selectedProvinceId, allCities, setValue]);

  const onSubmit = async (data: VolunteerFormInputs) => {
    setIsLoading(true);
    try {
      const selectedProvince = allProvinces.find(
        (province) => province.id === data.provinceId
      );

      await axiosSecure.post("/volunteer-applications", {
        ...data,
        bloodGroup: "AB+",
        division: selectedProvince?.name || "",
        district: data.city,
        status: "pending",
        appliedDate: new Date().toISOString(),
      });
      toast.success("Volunteer application submitted successfully!");
      reset();
    } catch (error) {
      console.error("Error submitting volunteer application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="flex flex-col lg:flex-row gap-8 items-stretch max-w-7xl mx-auto">
        {/* Left Side - Info Section */}
        <div className="lg:w-2/5 flex flex-col justify-center text-center lg:text-left">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6 ">
            <FaHeartbeat className="text-3xl" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Join Our <span className="text-primary">Volunteer</span> Team
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
            Be a part of something bigger. Help save lives and make a difference
            in your community through volunteer work.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <FaHandHoldingHeart className="text-primary" />
              </div>
              <span className="text-foreground">Make an Impact</span>
            </div>
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <FaUsers className="text-primary" />
              </div>
              <span className="text-foreground">Join Community</span>
            </div>
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <FaAward className="text-primary" />
              </div>
              <span className="text-foreground">Get Recognition</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-3/5 bg-card/50 rounded-md shadow-lg p-8 border border-secondary">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Volunteer Application
            </h2>
            <p className="text-muted-foreground">
              Fill out the form below to apply as a volunteer
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 flex flex-col h-full">
            <div className="space-y-6 flex-2">
              {/* Name & Email */}
              <div className="flex flex-col md:flex-row gap-5">
                <div className="w-full">
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Phone & age */}
              <div className="flex flex-col md:flex-row gap-5">
                <div className="w-full">
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    {...register("phone")}
                  />
                </div>
                <div className="w-full">
                  <Label>Your age</Label>
                  <Input
                    type="text"
                    placeholder="Enter your age"
                    {...register("age", {
                      required: "Age is required",
                    })}
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.age.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Province & City */}
              <div className="flex flex-col md:flex-row gap-5">
                <div className="w-full">
                  <Label>Province</Label>
                  <Controller
                    name="provinceId"
                    control={control}
                    rules={{ required: "Province is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}>
                          <SelectTrigger className={error ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Provinces</SelectLabel>
                              {allProvinces.map((province) => (
                                <SelectItem key={province.id} value={province.id}>
                                  {province.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {error && (
                          <p className="mt-1 text-sm text-destructive">{error.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>

                <div className="w-full">
                  <Label>City</Label>
                  <Controller
                    name="city"
                    control={control}
                    rules={{ required: selectedProvinceId ? "City is required" : false }}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                          disabled={!selectedProvinceId}>
                          <SelectTrigger className={error ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Cities</SelectLabel>
                              {availableCities.map((city) => (
                                <SelectItem key={city.id} value={city.name}>
                                  {city.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {error && (
                          <p className="mt-1 text-sm text-destructive">{error.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex justify-center pt-2 flex-1">
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="w-full md:w-auto px-8 py-3 font-medium">
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Volunteer;
