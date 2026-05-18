import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Droplet,
  Users,
  Clock,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";
import useAuth from "@/Hook/useAuth";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { FaSearch } from "react-icons/fa";

const VideoLikeHeroBanner: React.FC = () => {
  const { user } = useAuth();
  const [activeMetric, setActiveMetric] = useState(0);

  // Auto-rotate metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      icon: Users,
      value: "10,000+",
      label: "Active Donors",
      color: "text-blue-600",
    },
    {
      icon: HeartPulse,
      value: "3,500+",
      label: "Lives Saved",
      color: "text-red-600",
    },
    {
      icon: Shield,
      value: "50+",
      label: "Partner Hospitals",
      color: "text-green-600",
    },
  ];

  const features = [
    "Verified Donors",
    "24/7 Availability",
    "Nationwide Network",
    "Emergency Response",
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-destructive/5 -z-10"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-96 h-96 bg-destructive/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="container mx-auto px-4 my-10 md:my-0 ">
        <div className="text-center max-w-5xl mx-auto">
          {/* 1. Enhanced Tagline/Pre-Header */}
          <div
            className="inline-flex items-center text-xs uppercase tracking-widest font-semibold mb-6 p-2 px-4 rounded-full bg-linear-to-r from-destructive/10 to-primary/10 text-destructive border border-destructive/20 backdrop-blur-sm"
            data-aos="fade-down"
            data-aos-duration="800"
            data-aos-delay="100">
            <HeartPulse className="w-4 h-4 mr-2" />
            Connecting Hearts, Saving Futures.
            <Sparkles className="w-4 h-4 ml-2" />
          </div>

          {/* 2. Powerful Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight md:leading-tighter mb-4 md:mb-6">
            <span className="block">
              Connect{" "}
              <span className="relative">
                <span className="bg-linear-to-r from-primary to-destructive bg-clip-text text-transparent">
                  Instantly.
                </span>
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-linear-to-r from-primary to-destructive rounded-full animate-pulse"></span>
              </span>
            </span>
            <span className="block mt-2 md:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="bg-linear-to-r from-destructive to-primary bg-clip-text text-transparent">
                Save
              </span>{" "}
              A Life Today
            </span>
          </h1>

          {/* 3. Detailed Sub-headline */}
          <h2 className="text-md sm:text-lg md:text-lg lg:text-xl text-muted-foreground mb-8 max-w-4xl lg:max-w-5xl mx-auto px-4">
            We bridge the critical gap between urgent patient needs and verified
            donors, making emergency blood access simple and fast across all
            regions.
          </h2>

          {/* 4. Key Features */}
          <div
            className="flex flex-wrap justify-center gap-3 mb-8"
            data-aos="fade-up"
            data-aos-delay="300">
            {features.map((feature, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="gap-1 py-1.5 px-3">
                <CheckCircle className="w-3 h-3" />
                {feature}
              </Badge>
            ))}
          </div>

          {/* 5. CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-5 justify-center mb-10"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="500">
            {/* Primary CTA */}
            <Link to={"/search-page"}>
              <Button size="lg" className="group px-8 py-6 text-lg">
                <FaSearch className="mr-2" />
                Search Donors
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            {/* Secondary CTA */}
            {user ? (
              <Link to={"/volunteer"}>
                <Button
                  variant={"outline"}
                  size="lg"
                  className="group px-8 py-6 text-lg">
                  <Droplet className="mr-2" />
                  Join as a Volunteer
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <Link to={"/register"}>
                <Button
                  variant={"outline"}
                  size="lg"
                  className="group px-8 py-6 text-lg">
                  <Droplet className="mr-2" />
                  Join as a donor
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </div>

          {/* 6. Dynamic Metrics Display */}
          <div className="flex justify-center mb-8">
            <Card className="bg-linear-to-r from-card/50 to-transparent border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-6">
                  {metrics.map((metric, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 transition-all duration-500 ${
                        activeMetric === index
                          ? "scale-110"
                          : "scale-100 opacity-60"
                      }`}
                      onMouseEnter={() => setActiveMetric(index)}>
                      <metric.icon className={`w-6 h-6 ${metric.color}`} />
                      <div className="text-left">
                        <div className="text-2xl font-bold text-foreground">
                          {metric.value}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">
                          {metric.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 7. Social Proof Section */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground"
            data-aos="fade-up"
            data-aos-delay="700">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground ml-1">4.9/5</span>
              <span>from 2,500+ reviews</span>
            </div>

            <div className="hidden sm:block w-px h-4 bg-border"></div>

            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span>100% Verified Donors</span>
            </div>

            <div className="hidden sm:block w-px h-4 bg-border"></div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Average 30min Response Time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLikeHeroBanner;
