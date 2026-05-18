import Container from "@/Page/Shared/Responsive/Container";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { FaEnvelope, FaSignInAlt, FaUser, FaHeartbeat, FaShieldAlt, FaTimes, FaLock } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuth from "@/Hook/useAuth";
import useAxiosSecure from "@/Hook/useAxiosSecure";

type Inputs = {
  email: string;
  password: string;
};

type AdminInputs = {
  adminEmail: string;
  adminPassword: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const {
    register: registerAdmin,
    handleSubmit: handleAdminSubmit,
    formState: { errors: adminErrors },
    reset: resetAdmin,
  } = useForm<AdminInputs>();

  const { loginUser, signinWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const axiosSecure = useAxiosSecure();

  if (user) {
    return <Navigate to={location.state || "/"} />;
  }

  const onInputSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      if (!data.email || !data.password) {
        toast.error("Email and password are required.");
        return;
      }
      await loginUser(data.email, data.password);
      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
      toast.success("Successfully signed in!");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const onAdminSubmit: SubmitHandler<AdminInputs> = async (data) => {
    setIsAdminLoading(true);
    try {
      await loginUser(data.adminEmail, data.adminPassword);

      // Check if this user is actually admin
      const roleRes = await axiosSecure.get(`/user/${data.adminEmail}/role`);
      if (roleRes.data.role !== "admin") {
        toast.error("Access denied. You are not an admin.");
        setIsAdminLoading(false);
        return;
      }

      toast.success("Admin login successful!");
      setShowAdminModal(false);
      resetAdmin();
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("Invalid admin credentials.");
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      const result = await signinWithGoogle();
      const userData = result?.user;
      const userInfo = {
        name: userData.displayName,
        email: userData.email,
        photo: userData.photoURL,
        role: "donor",
        status: "active",
        provider: "google",
      };
      await axiosSecure.post("/register-user", userInfo);
      navigate(location.state || "/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-4xl">
          {/* Left Column */}
          <div className="text-center lg:text-left col-span-1">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
              <FaSignInAlt className="text-3xl" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Welcome Back to <span className="text-primary">Zindagi Daan</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Sign in to your account to continue saving lives through blood donation.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <FaHeartbeat />
                </div>
                <span className="text-foreground">Track your donation history</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <FaUser />
                </div>
                <span className="text-foreground">Manage your profile</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <FaEnvelope />
                </div>
                <span className="text-foreground">Respond to donation requests</span>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="bg-card/50 rounded-md shadow-md p-8 border border-secondary col-span-1">
            <form onSubmit={handleSubmit(onInputSubmit)} className="space-y-6">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your valid email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label>Password</Label>
                <div>
                  <Input
                    type="password"
                    placeholder="Enter your valid password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/80">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <Button type="submit" disabled={isLoading} className="flex-1 py-3 px-4 font-medium flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={handleLoginWithGoogle}
                  variant="outline"
                  className="flex-1 rounded">
                  Login with Google
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Register here
                </Link>
              </p>
              {/* Admin Login - clickable */}
              <button
                type="button"
                onClick={() => setShowAdminModal(true)}
                className="text-xs text-muted-foreground/60 mt-3 hover:text-primary transition-colors duration-200 cursor-pointer underline-offset-2 hover:underline"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </Container>

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => { setShowAdminModal(false); resetAdmin(); }}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-8">
            {/* Close button */}
            <button
              type="button"
              onClick={() => { setShowAdminModal(false); resetAdmin(); }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <FaShieldAlt className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Admin Access</h2>
              <p className="text-sm text-muted-foreground mt-1">Enter admin credentials to continue</p>
            </div>

            {/* Admin Form */}
            <form onSubmit={handleAdminSubmit(onAdminSubmit)} className="space-y-5">
              <div>
                <Label htmlFor="adminEmail">Admin Email</Label>
                <div className="relative mt-1">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="Enter admin email"
                    className={`pl-9 ${adminErrors.adminEmail ? "border-destructive" : ""}`}
                    {...registerAdmin("adminEmail", {
                      required: "Admin email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </div>
                {adminErrors.adminEmail && (
                  <p className="mt-1 text-sm text-destructive">{adminErrors.adminEmail.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="adminPassword">Admin Password</Label>
                <div className="relative mt-1">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                  <Input
                    id="adminPassword"
                    type="password"
                    placeholder="Enter admin password"
                    className={`pl-9 ${adminErrors.adminPassword ? "border-destructive" : ""}`}
                    {...registerAdmin("adminPassword", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                </div>
                {adminErrors.adminPassword && (
                  <p className="mt-1 text-sm text-destructive">{adminErrors.adminPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isAdminLoading}
                className="w-full flex items-center justify-center gap-2"
              >
                {isAdminLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  <>
                    <FaShieldAlt />
                    Sign In as Admin
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;