import React, { useState } from "react";
import {
  Phone,
  MessageSquare,
  Send,
  Loader2,
  Clock,
  ChevronRight,
  Globe,
  Shield,
  CheckCircle,
  AlertCircle,
  Building,
  Calendar,
} from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LogoFollowLight from "@/components/LogoFollowLight";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Container from "../Shared/Responsive/Container";
import { FaFacebook, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { DepartmentsData } from "@/Data/ContactPageInfo/DepartmentsData";
import { FaqsData } from "@/Data/ContactPageInfo/FaqsData";
import { ContactMethodsData } from "@/Data/ContactPageInfo/ContactMethodsData";

// --- [ 1. Zod Schema for Contact Form ] ---
const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormInputs = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    setLoading(true);
    setSubmissionStatus("idle");

    try {
      // ⚠️ API Call to send contact form data
      console.log("Contact form submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmissionStatus("success");
      reset(); // Clear form on success
    } catch (error) {
      console.error("Submission error:", error);
      setSubmissionStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // ! Contact MethodsData json data
  const contactMethods = ContactMethodsData;

  const officeHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM", emergency: false },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM", emergency: false },
    { day: "Sunday", hours: "Closed", emergency: false },
    { day: "Emergency Hotline", hours: "24/7 Available", emergency: true },
  ];

  // ! Faqs Data json data
  const faqs = FaqsData;
  //  ! departments json data
  const departments = DepartmentsData;

  const socialLinks = [
    { icon: FaFacebook, name: "Facebook", url: "https://www.facebook.com/share/1Hm9c3dG4M/" },
    { icon: FaXTwitter, name: "Twitter", url: "#" },
    { icon: FaLinkedinIn, name: "LinkedIn", url: "https://www.linkedin.com/in/muhammad-hassan-asif-7732b737b?" },
    { icon: FaInstagram, name: "Instagram", url: "https://www.instagram.com/hassan_asifff?igsh=M3JuYzFoOHlrdmdj" },
  ];

  return (
    <Container>
       <div className="relative">
    <LogoFollowLight />
      <div className="space-y-16 overflow-hidden">
        {/* --- [ 2. Header ] --- */}
        <div className="text-center pb-4 border-b border-border">
          <h1
            className="text-5xl font-extrabold text-primary mb-2"
            data-aos="fade-up">
            Get In Touch
          </h1>
          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100">
            We're here to help you. Send us a message or find our details below.
            Your feedback and questions help us improve our services.
          </p>
        </div>

        {/* --- [ 3. Contact Methods ] --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => (
            <Card
              key={index}
              className="h-full hover:shadow-lg transition-shadow"
              data-aos="fade-up"
              data-aos-delay={index * 100}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <method.icon className={`w-8 h-8 ${method.color}`} />
                </div>
                <CardTitle className="text-xl">{method.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                {method.details.map((detail, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    {detail}
                  </p>
                ))}
                <p className="text-xs text-muted-foreground">
                  {method.description}
                </p>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => (window.location.href = method.action)}>
                  Contact Us
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* --- [ 4. Contact Form (2/3 width on large screen) ] --- */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-3xl font-bold text-foreground flex items-center">
                  <MessageSquare className="w-6 h-6 mr-3 text-primary" /> Send
                  Us A Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0 pb-0">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        {...register("name")}
                        placeholder="Your Name"
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="you@example.com"
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      type="text"
                      {...register("subject")}
                      placeholder="Regarding Blood Donation Request"
                      className={errors.subject ? "border-destructive" : ""}
                    />
                    {errors.subject && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      {...register("message")}
                      placeholder="How can we help you?"
                      className={errors.message ? "border-destructive" : ""}
                    />
                    {errors.message && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Status and Submit */}
                  <div className="flex flex-col items-center pt-4">
                    <Button type="submit" disabled={loading} size="lg">
                      {loading ? (
                        <span className="flex items-center">
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Send Message <Send className="w-5 h-5 ml-2" />
                        </span>
                      )}
                    </Button>

                    {submissionStatus === "success" && (
                      <div className="flex items-center mt-3 text-green-600 font-semibold">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Thank you! Your message has been sent successfully.
                      </div>
                    )}
                    {submissionStatus === "error" && (
                      <div className="flex items-center mt-3 text-destructive font-semibold">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        Submission failed. Please try again later.
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* --- [ 5. Organization Details (1/3 width on large screen) ] --- */}
          <div className="space-y-6">
            {/* Office Hours Card */}
            <Card data-aos="fade-left">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary" />
                  Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {officeHours.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center">
                    <div>
                      <p
                        className={`font-medium ${
                          schedule.emergency ? "text-primary" : ""
                        }`}>
                        {schedule.day}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm ${
                          schedule.emergency
                            ? "text-primary font-bold"
                            : "text-muted-foreground"
                        }`}>
                        {schedule.hours}
                      </p>
                      {schedule.emergency && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Emergency
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Departments Card */}
            <Card data-aos="fade-left" data-aos-delay="100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2 text-primary" />
                  Departments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {departments.map((dept, index) => (
                  <div
                    key={index}
                    className="border-b border-border pb-3 last:border-0">
                    <h4 className="font-semibold text-sm">{dept.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {dept.description}
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs">
                        <span className="font-medium">Email:</span>{" "}
                        <a
                          href={`mailto:${dept.email}`}
                          className="text-primary hover:underline">
                          {dept.email}
                        </a>
                      </p>
                      <p className="text-xs">
                        <span className="font-medium">Phone:</span>{" "}
                        <a
                          href={`tel:${dept.phone}`}
                          className="text-primary hover:underline">
                          {dept.phone}
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Social Media Card */}
            <Card data-aos="fade-left" data-aos-delay="200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-primary" />
                  Follow Us
                </CardTitle>
                <CardDescription>
                  Stay connected with us on social media
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={() => window.open(social.url, "_blank")}>
                      <social.icon className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* --- [ 6. FAQ Section ] --- */}
        <div className="space-y-8">
          <div className="text-center">
            <h2
              className="text-3xl font-bold text-foreground mb-4"
              data-aos="fade-up">
              Frequently Asked Questions
            </h2>
            <p
              className="text-muted-foreground max-w-2xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="100">
              Find quick answers to common questions about our services and
              contact options.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* --- [ 7. Emergency Contact Banner ] --- */}
        <div
          className="bg-linear-to-r from-destructive/10 to-primary/10 rounded-xl p-8 text-center border border-border"
          data-aos="fade-up">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Emergency Blood Request?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            For urgent blood donation requests, please call our emergency
            hotline immediately. We're available 24/7 to help you in critical
            situations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => (window.location.href = "tel:+923001234567")}
              className="cursor-pointer w-full sm:w-auto">
              <Phone className="w-5 h-5 mr-2" />
              Call Emergency Hotline
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                (window.location.href = "/dashboard/donation-requests")
              }>
              <Calendar className="w-5 h-5 mr-2" />
              Create Blood Request
            </Button>
          </div>
        </div>
      </div>
      </div>
    </Container>
    
  );
};

export default Contact;
