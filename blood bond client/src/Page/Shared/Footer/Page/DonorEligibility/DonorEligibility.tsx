import React from "react";
import { CheckCircle2, AlertCircle, Clock, Ban, Droplet } from "lucide-react";
import Container from "@/Page/Shared/Responsive/Container";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DonorEligibility: React.FC = () => {
  const requirements = [
    {
      title: "Age",
      desc: "Must be between 18 and 65 years old.",
      icon: <Clock className="text-primary" />,
    },
    {
      title: "Weight",
      desc: "Must weigh at least 50 kg (110 lbs).",
      icon: <Droplet className="text-primary" />,
    },
    {
      title: "Health",
      desc: "Should be in good general health at the time of donation.",
      icon: <CheckCircle2 className="text-primary" />,
    },
    {
      title: "Last Donation",
      desc: "At least 3 months gap since the last whole blood donation.",
      icon: <Clock className="text-primary" />,
    },
  ];

  const deferrals = [
    "Cold, flu, or sore throat (wait until fully recovered).",
    "Recent tattoos or piercings (wait 6-12 months).",
    "Major surgery in the last 6 months.",
    "Pregnant or breastfeeding women.",
    "History of certain infectious diseases (HIV, Hepatitis, etc.).",
  ];

  return (
    <div className="min-h-screen  text-foreground">
      <Container>
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Am I Eligible to <span className="text-primary">Donate?</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Before you donate blood, please check our basic eligibility criteria
            to ensure a safe experience for both you and the recipient.
          </p>
        </div>

        {/* Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {requirements.map((req, index) => (
            <div
              key={index}
              className="p-6 bg-card/50 border border-secondary rounded-lg shadow-sm hover:border-primary transition-all">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2 bg-accent rounded-full border border-border">
                  {req.icon}
                </div>
                <h3 className="font-bold text-xl text-card-foreground">
                  {req.title}
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {req.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Temporary Deferrals Section */}

        <div className="bg-card/80 border-l-4 border-primary p-8 rounded-r-(--radius) mb-16">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="text-primary" size={28} />
            <h2 className="text-2xl font-bold text-accent-foreground">
              Temporary Deferrals
            </h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deferrals.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm md:text-base text-muted-foreground">
                <Ban size={18} className="text-primary mt-1 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Section */}
        <div className="text-center p-10 bg-card/50 border border-secondary rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-card-foreground">
            Ready to Save a Life?
          </h3>
          <p className="text-muted-foreground mb-6">
            If you meet all the criteria above, you are ready to be a hero.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={"/volunteer"}>
              <Button>Become a Volunteer</Button>
            </Link>
            <Link to={"/faq"}>
              <Button>Check FAQ</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DonorEligibility;
