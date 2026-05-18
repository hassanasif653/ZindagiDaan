import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  ArrowRight,
  Coins,
  ShieldCheck,
  CheckCircle,
  Quote,
  Star,
  Globe,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "../Shared/Responsive/Container";
import useAxiosSecure from "@/Hook/useAxiosSecure";
import useAuth from "@/Hook/useAuth";
import type { FormData } from "@/types/blog";

import { ImpactAreasData } from "@/Data/Funding/ImpactAreasData";
import { TopDonorsData } from "@/Data/Funding/TopDonorsData";
import { Testimonials } from "@/Data/Funding/TestimonialsData";
import { RecentDonationsData } from "@/Data/Funding/RecentDonationsData";

const Funding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  //! Mock data - replace with actual API calls
  const fundingGoal = 50000;
  const currentFunding = 37500;
  const fundingPercentage = Math.round((currentFunding / fundingGoal) * 100);

  //!  Top donation json data
  const topDonors = TopDonorsData;
  // ! recent donation data
  const recentDonations = RecentDonationsData;
  const suggestedAmounts = [10, 25, 50, 100, 250];

  const impactAreas = ImpactAreasData;

  // ! Testimonials json data
  const testimonials = Testimonials;

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setValue("amount", amount);
  };

  const onSubmit = (data: FormData) => {
    const foundInfo = {
      found: data.amount,
      email: user?.email,
      photoURL: user?.photoURL,
      name: user?.displayName,
    };

    axiosSecure.post("/create-checkout-session", foundInfo).then((res) => {
      const paymentUrl = res.data.url;
      window.open(paymentUrl, "_blank");
      toast.success(`Redirecting to payment for $${data.amount}`);
      reset();
      setSelectedAmount(null);
      setIsModalOpen(false);
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Container>
      <div className="space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-black leading-tight"
            data-aos="fade-up">
            Fuel the <span className="text-primary">Mission</span>
          </h1>

          <p
            className="text-muted-foreground text-lg md:text-xl leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="100">
            Every dollar you contribute helps us maintain our blood bank
            operations and reach donors faster in emergencies.
          </p>

          {/* Funding Progress */}
          <div
            className="bg-card rounded-xl p-6 border border-border max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Campaign Progress</span>
              <span className="text-sm font-medium">{fundingPercentage}%</span>
            </div>
            <Progress value={fundingPercentage} className="h-3 mb-4" />
            <div className="flex justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">
                  ${currentFunding.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Raised</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  ${fundingGoal.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Goal</p>
              </div>
            </div>
          </div>

          <div className="pt-4" data-aos="fade-up" data-aos-delay="300">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg group cursor-pointer rounded">
                  Give Fund{" "}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card text-card-foreground border-border rounded-xl shadow-xl max-w-md">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black flex items-center gap-2">
                      <Coins className="w-6 h-6 text-primary" /> Make a Donation
                    </DialogTitle>
                  </DialogHeader>

                  <div className="py-6 space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="amount" className="text-base font-bold">
                        Contribution Amount (USD)
                      </Label>

                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {suggestedAmounts.map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant={
                              selectedAmount === amount ? "default" : "outline"
                            }
                            className="h-10"
                            onClick={() => handleAmountSelect(amount)}>
                            ${amount}
                          </Button>
                        ))}
                      </div>

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">
                          ${" "}
                        </span>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          className={`w-full pl-8 h-12 ${
                            errors.amount ? "border-destructive" : ""
                          }`}
                          {...register("amount", {
                            required: "Amount is required",
                            min: { value: 1, message: "Min $1" },
                          })}
                        />
                      </div>
                      {errors.amount && (
                        <p className="text-destructive text-sm font-medium">
                          Please enter a valid amount (Min $1)
                        </p>
                      )}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="submit"
                      className="w-full h-12 font-bold"
                      disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>Processing...</>
                      ) : (
                        <>
                          Secure Checkout{" "}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Impact Areas Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2
              className="text-3xl font-bold text-foreground mb-4"
              data-aos="fade-up">
              How Your Donation Makes an Impact
            </h2>
            <p
              className="text-muted-foreground max-w-2xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="100">
              Your contribution is allocated strategically to maximize our
              impact on saving lives through blood donation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactAreas.map((area, index) => (
              <Card
                key={index}
                className="h-full"
                data-aos="fade-up"
                data-aos-delay={index * 100}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <area.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{area.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {area.description}
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Allocation</span>
                      <span className="font-medium">{area.percentage}%</span>
                    </div>
                    <Progress value={area.percentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Donations & Top Donors */}
        <div className="space-y-8">
          <Tabs defaultValue="recent" className="w-full">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="recent">Recent Donations</TabsTrigger>
                <TabsTrigger value="top">Top Donors</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="recent" className="space-y-6 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentDonations.map((donation, index) => (
                  <Card
                    key={donation.id}
                    data-aos="fade-up"
                    data-aos-delay={index * 50}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-bold text-sm">
                              {donation.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{donation.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(donation.date)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">
                            ${donation.amount}
                          </p>
                        </div>
                      </div>
                      {donation.message && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-sm text-muted-foreground italic">
                            "{donation.message}"
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="top" className="space-y-6 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {topDonors.map((donor, index) => (
                  <Card
                    key={donor.id}
                    className="overflow-hidden"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}>
                    <CardHeader className="pb-2 bg-linear-to-br from-primary/5 to-primary/10">
                      <div className="flex justify-between items-start">
                        <ShieldCheck className="text-primary w-6 h-6" />
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded">
                          {donor.title}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-bold">
                            {donor.avatar}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{donor.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Top Contributor
                          </p>
                        </div>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">
                          ${donor.amount.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">USD</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-primary text-primary"
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Testimonials Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2
              className="text-3xl font-bold text-foreground mb-4"
              data-aos="fade-up">
              Stories of Impact
            </h2>
            <p
              className="text-muted-foreground max-w-2xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="100">
              Hear from those whose lives have been touched by our blood
              donation network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="h-full"
                data-aos="fade-up"
                data-aos-delay={index * 100}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Quote className="w-8 h-8 text-primary/20 mb-2" />
                  <p className="text-muted-foreground italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Financial Transparency Section */}
        <div className="bg-card rounded-xl p-8 border border-border">
          <div className="text-center mb-8">
            <h2
              className="text-3xl font-bold text-foreground mb-4"
              data-aos="fade-up">
              Our Commitment to Transparency
            </h2>
            <p
              className="text-muted-foreground max-w-2xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="100">
              We believe in complete transparency about how your donations are
              used.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="200">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Annual Reports</h3>
              <p className="text-muted-foreground">
                Detailed financial reports published annually showing exactly
                how funds are allocated.
              </p>
            </div>

            <div
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Third-Party Audits</h3>
              <p className="text-muted-foreground">
                Regular audits by independent organizations to verify our
                financial practices.
              </p>
            </div>

            <div
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="400">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Impact Metrics</h3>
              <p className="text-muted-foreground">
                Regular updates on the tangible impact of your donations on
                saving lives.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div
          className="text-center px-4 sm:px-6 lg:px-12 py-10 sm:py-12 
             bg-linear-to-br from-primary/10 to-destructive/10 
             rounded-xl"
          data-aos="fade-up">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl 
                 font-bold text-foreground mb-4">
            Your Contribution Saves Lives
          </h2>

          <p
            className="text-sm sm:text-base 
                text-muted-foreground mb-6 
                max-w-xl lg:max-w-2xl mx-auto">
            Join our mission to ensure no one has to wait for life-saving blood.
            Every donation, no matter the size, makes a difference.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer w-full sm:w-auto"
              data-aos="zoom-in"
              data-aos-delay="100">
              Make a Donation Now
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                /* Navigate to about page */
              }}
              className="cursor-pointer w-full sm:w-auto"
              data-aos="zoom-in"
              data-aos-delay="200">
              Learn More About Our Work
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Funding;
