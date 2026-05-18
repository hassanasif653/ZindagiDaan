import Container from "@/Page/Shared/Responsive/Container";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaTint,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import useAuth from "@/Hook/useAuth";
import axios from "axios";
import useAxiosSecure from "@/Hook/useAxiosSecure";
import {
  loadPakistanLocations,
  type City,
  type Province,
} from "@/lib/pakistanLocations";

type Inputs = {
  name: string;
  email: string;
  avatar: FileList;
  bloodGroup: string;
  provinces: string;
  district: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const [allProvinces, setAllProvinces] = useState<Province[]>([]);
  const [allCities, setAllCities] = useState<City[]>([]);
  const [selectedRole, setSelectedRole] = useState<"donor" | "volunteer">(
    "donor"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    resetField,
  } = useForm<Inputs>({
    defaultValues: {
      district: "",
      bloodGroup: "",
      provinces: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);

  const { registerUser, profileUpdate, signinWithGoogle } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();

  const password = watch("password");
  const selectedProvince = watch("provinces");

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
    if (selectedProvince) {
      const filtered = allCities.filter(
        (city) => city.province_id === selectedProvince
      );
      setFilteredCities(filtered);
      resetField("district");
    } else {
      setFilteredCities([]);
      resetField("district");
    }
  }, [selectedProvince, allCities, resetField]);

  // ✅ FIXED onSubmit — navigate ab bilkul end mein
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      const profileImage = data.avatar[0];
      const isVolunteer = selectedRole === "volunteer";

      // Step 1: Register karo
      await registerUser(data.email, data.password);

      // Step 2: Image upload karo
      const formData = new FormData();
      formData.append("image", profileImage);
      const imageApiUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`;
      const res = await axios.post(imageApiUrl, formData);
      const photoURL = res.data.data.url;

      // Step 3: DB mein user save karo
      const createAt = new Date();
      const userInfo = {
        name: data.name,
        email: data.email,
        bloodGroup: data.bloodGroup,
        division: allProvinces.find(p => p.id === data.provinces)?.name || data.provinces,
        district: data.district,
        createAt,
        photoURL,
        role: isVolunteer ? ("volunteer" as const) : ("donor" as const),
        provider: "normal-register" as const,
        status: isVolunteer ? ("pending" as const) : ("active" as const),
      };
      await axiosSecure.post("/register-user", userInfo);
      if (isVolunteer) {
  const volunteerApplication = {
    name: data.name,
    email: data.email,
    bloodGroup: data.bloodGroup,
    division: allProvinces.find(p => p.id === data.provinces)?.name || data.provinces,
    district: data.district,
    photoURL,
    phone: "",
    status: "pending",
    appliedDate: new Date().toISOString(),
  };
  await axiosSecure.post("/volunteer-applications", volunteerApplication);
      }
      // Step 4: Firebase profile update karo (photo set hogi)
      await profileUpdate({
        displayName: data.name,
        photoURL,
      });

      // Step 5: Ab navigate karo
      toast.success("Signup successfully");
      navigate(location.state?.from?.pathname || "/");

    } catch (error: any) {
      toast.error(error.message || "Network error please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      const result = await signinWithGoogle();
      navigate(location.state?.from?.pathname || "/");
      const userData = result.user;
      const isVolunteer = selectedRole === "volunteer";
      const userInfo = {
        name: userData.displayName || "",
        email: userData.email || "",
        photo: userData.photoURL || "",
        role: isVolunteer ? ("volunteer" as const) : ("donor" as const),
        status: isVolunteer ? ("pending" as const) : ("active" as const),
        provider: "google" as const,
      };
      await axiosSecure.post("/register-user", userInfo);
      toast.success("Google login successful");
    } catch (error: any) {
      toast.error("Google login failed");
    }
  };

  return (
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        {/* Left Column */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
            <FaUserPlus className="text-3xl" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Join Our <span className="text-primary">Life-Saving</span> Community
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            Become a donor and help save lives. Your registration will connect
            you with people in need of blood in your area.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                <FaTint />
              </div>
              <span className="text-foreground">All blood groups welcome</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                <FaMapMarkerAlt />
              </div>
              <span className="text-foreground">Location-based matching</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                <FaUser />
              </div>
              <span className="text-foreground">Track your donation impact</span>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="bg-card rounded-md shadow-lg p-8 border border-border">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base">Choose Registration Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole("donor")}
                  className={`w-full text-left rounded-md border p-4 transition-colors ${
                    selectedRole === "donor"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <FaTint className="text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        Register as Donor
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Donate blood and save lives
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("volunteer")}
                  className={`w-full text-left rounded-md border p-4 transition-colors ${
                    selectedRole === "volunteer"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <FaHeart className="text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        Apply as Volunteer
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Help manage donation requests
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Name & Email */}
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex-1">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Hassan Asif"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="email">Email</Label>
                <InputGroup>
                  <InputGroupInput
                    id="email"
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
                </InputGroup>
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Avatar & Blood Group */}
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex-1">
                <Label htmlFor="avatar">Profile Photo</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  {...register("avatar", {
                    required: "Profile photo is required",
                    validate: (files?: FileList) =>
                      (files && files.length > 0) || "Profile photo is required",
                  })}
                />
                {errors.avatar && (
                  <p className="mt-1 text-sm text-destructive">{errors.avatar.message}</p>
                )}
              </div>
              <div className="flex-1">
                <Label>Blood Group</Label>
                <Controller
                  name="bloodGroup"
                  control={control}
                  rules={{ required: "Blood group is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <SelectTrigger className={error ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select your blood group</SelectLabel>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                              <SelectItem key={group} value={group}>
                                {group}
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

            {/* Province & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
                <Label>Province</Label>
                <Controller
                  name="provinces"
                  control={control}
                  rules={{ required: "Province is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <SelectTrigger className={error ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select your province</SelectLabel>
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
                  name="district"
                  control={control}
                  rules={{ required: selectedProvince ? "City is required" : false }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={!selectedProvince}
                      >
                        <SelectTrigger className={error ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select your city</SelectLabel>
                            {filteredCities.length === 0 && selectedProvince ? (
                              <SelectItem value="no-city" disabled>
                                <span className="text-muted-foreground italic">
                                  No city available
                                </span>
                              </SelectItem>
                            ) : (
                              filteredCities.map((city) => (
                                <SelectItem key={city.id} value={city.name}>
                                  {city.name}
                                </SelectItem>
                              ))
                            )}
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

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
              <div className="w-full">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Creating Account..." : "Register"}
              </Button>
              <Button
                type="button"
                onClick={handleLoginWithGoogle}
                variant="outline"
                className="flex-1"
                disabled={isLoading}
              >
                <span className="mr-2">Google</span>Login
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center pt-6 border-t border-border">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default RegisterPage;
