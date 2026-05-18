import React from "react";
import {
  HeartHandshake,
  Target,
  ArrowRight,
  Star,
  Quote,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoFollowLight from "@/components/LogoFollowLight";
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
import Container from "../Shared/Responsive/Container";
import {
  faqsData,
  principlesData,
  processStepsData,
  teamStatsData,
} from "@/Data/AbountComponentData/AboutComponentData";
import { Testimonials } from "@/Data/Funding/TestimonialsData";

// AOS will be initialized globally, so we don't need to import it here

const About: React.FC = () => {
  const mission =
    "To create a seamless, efficient, and reliable platform that bridges the gap between voluntary blood donors and those in critical need, ensuring timely access to life-saving resources across the nation.";

  const teamStats = teamStatsData;
  const principles = principlesData;
  const processSteps = processStepsData;
  const testimonials = Testimonials;
  const faqs = faqsData;
 return (
    <div className="relative">

      {/* 💡 THREE.JS BACKGROUND */}
        <LogoFollowLight />

      <Container>
        <div className="space-y-16">

        {/* --- [ 1. Header & Mission ] --- */}
        <div className="text-center pb-4 border-b border-border">
          <h1
            className="text-5xl font-extrabold text-primary mb-4"
            data-aos="fade-up"
            data-aos-duration="800">
            Our Mission: Saving Lives Together
          </h1>
          <p
            className="text-lg text-foreground max-w-3xl mx-auto font-medium"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="100">
            {mission}
          </p>
        </div>

        {/* --- [ 2. Our Story Section ] --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Our Story
            </h2>
            <p className="text-muted-foreground mb-4">
              ZindagiDaan App began in 2025 when our founder witnessed a
              critical blood shortage at a local hospital. A young mother needed
              rare blood type for emergency surgery, but the hospital couldn't
              find a donor in time.
            </p>
            <p className="text-muted-foreground mb-4">
              This tragic experience sparked a mission to create a platform that
              could instantly connect blood donors with those in need. What
              started as a small initiative in one city has now grown into a
              nationwide network saving thousands of lives each year.
            </p>
            <p className="text-muted-foreground">
              Today, we're proud to be the bridge between voluntary donors and
              recipients, making blood donation accessible, efficient, and
              reliable for everyone involved.
            </p>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="bg-linear-to-br from-primary/20 to-destructive/20 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center">
                <HeartHandshake className="w-24 h-24 mx-auto text-primary mb-4" />
                <p className="text-2xl font-bold text-foreground">
                  Every Drop Counts
                </p>
                <p className="text-muted-foreground mt-2">
                  Join us in saving lives
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- [ 3. Core Principles/Values Section ] --- */}
        <div className="space-y-4">
          <h2
            className="text-3xl font-bold text-center text-foreground flex items-center justify-center"
            data-aos="fade-up">
            <Target className="w-6 h-6 mr-3 text-primary" /> Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            {principles.map((p, index) => (
              <div
                key={index}
                className="p-6 rounded-md bg-card border border-border hover:-translate-y-2 transition-all duration-500"
                data-aos="fade-up"
                data-aos-delay={index * 100}>
                <p.icon className="w-10 h-10 mx-auto text-primary mb-3" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {p.title}
                </h3>
                <p className="text-muted-foreground text-sm">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- [ 4. How It Works Section ] --- */}
        <div className="space-y-6">
          <h2
            className="text-3xl font-bold text-center text-foreground"
            data-aos="fade-up">
            How Our Platform Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="relative"
                data-aos="fade-up"
                data-aos-delay={index * 100}>
                <div className="bg-card border border-border rounded-lg p-6 h-full">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* --- [ 5. Impact & Statistics Section ] --- */}
        <div className="bg-card rounded-xl p-8 border border-border">
          <h2
            className="text-3xl font-bold text-center text-foreground mb-8"
            data-aos="fade-up">
            Our Impact at a Glance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamStats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4"
                data-aos="zoom-in"
                data-aos-delay={index * 100}>
                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 mx-auto">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <p className="text-4xl font-bold text-primary">{stat.number}</p>
                <p className="text-lg font-medium text-foreground mt-2">
                  {stat.label}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* --- [ 6. Testimonials Section ] --- */}
        <div className="space-y-6">
          <h2
            className="text-3xl font-bold text-center text-foreground"
            data-aos="fade-up">
            What People Say About Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <CardTitle className="text-base">
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-primary/20 mb-2" />
                  <p className="text-muted-foreground italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* --- [ 7. FAQ Section ] --- */}
        <div className="space-y-6">
          <h2
            className="text-3xl font-bold text-center text-foreground"
            data-aos="fade-up">
            Frequently Asked Questions
          </h2>
          <Accordion
            type="single"
            collapsible
            className="w-full max-w-3xl mx-auto">
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

        {/* --- [ 8. Partners Section ] --- */}
        <div className="space-y-6">
          <h2
            className="text-3xl font-bold text-center text-foreground"
            data-aos="fade-up">
            Our Trusted Partners
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-4 flex items-center justify-center h-24"
                data-aos="zoom-in"
                data-aos-delay={index * 50}>
                <div className="text-center">
                  <Activity className="w-8 h-8 mx-auto text-primary/50 mb-1" />
                  <p className="text-xs text-muted-foreground">
                    Partner {index + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- [ 9. Call to Action ] --- */}
        <div
          className="bg-linear-to-r from-destructive/10 to-primary/10 rounded-xl p-8 text-center border border-border"
          data-aos="fade-up">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Be the reason someone survives today.
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join our mission. Whether you need blood, can donate, or want to
            volunteer, your contribution saves lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                /* Navigate to Registration page */
              }}
              className="cursor-pointer"
              data-aos="zoom-in"
              data-aos-delay="100">
              Join Our Donor Community
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                /* Navigate to Donor Search page */
              }}
              className="cursor-pointer"
              data-aos="zoom-in"
              data-aos-delay="200">
             Find Donors Near You
            </Button>
          </div>
        </div>

      </div> {/* space-y-16 end */}
    </Container>
  </div>
);
};

export default About;