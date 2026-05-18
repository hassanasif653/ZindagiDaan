import React from "react";
import { Target, Heart, Users, ShieldCheck, ArrowRight } from "lucide-react";
import Container from "@/Page/Shared/Responsive/Container";
import { Button } from "@/components/ui/button";

const OurMission: React.FC = () => {
  const missionValues = [
    {
      title: "Saving Lives",
      desc: "Our primary goal is to ensure that no life is lost due to the unavailability of blood. We bridge the gap between donors and recipients.",
      icon: <Heart className="text-primary" size={28} />,
    },
    {
      title: "Community First",
      desc: "We are building a robust network of volunteers and donors who are committed to selfless service for the community.",
      icon: <Users className="text-primary" size={28} />,
    },
    {
      title: "Transparency",
      desc: "Every request and donation is handled with the utmost integrity, ensuring that blood reaches those who truly need it.",
      icon: <ShieldCheck className="text-primary" size={28} />,
    },
    {
      title: "Direct Impact",
      desc: "By removing intermediaries, we make the process faster, more efficient, and accessible for everyone, everywhere.",
      icon: <Target className="text-primary" size={28} />,
    },
  ];

  return (
    <div className="min-h-screen text-foreground">
      <Container>
        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
            We are on a <span className="text-primary">Mission</span> to save
            every drop that matters.
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            ZindagiDaan is more than just a platform; it's a movement to digitize
            and streamline blood donation, making it transparent, reliable, and
            instantly accessible during emergencies.
          </p>
        </div>

        {/* Mission Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="p-10 bg-card/50 border border-border rounded-lg shadow-sm">
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              To create a world where blood donation is a part of everyone's
              lifestyle and where the shortage of blood becomes a thing of the
              past. We envision a smart, tech-driven healthcare network that
              prioritizes human life above all.
            </p>
          </div>
          <div className="p-10 bg-primary text-primary-foreground rounded-lg shadow-xl flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">Our Commitment</h2>
            <p className="opacity-90 leading-relaxed italic">
              "To provide a seamless interface between donors and recipients,
              ensuring safety, speed, and 100% voluntary participation."
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold tracking-tight uppercase opacity-50">
              Our Core Values
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {missionValues.map((value, idx) => (
              <div
                key={idx}
                className="p-6 bg-card/30 border border-border rounded-lg hover:border-primary/50 transition-all group">
                <div className="w-14 h-14 bg-background border border-border rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-primary/10 group-hover:scale-105 transition-all">
                  {value.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{value.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-muted/30 p-8 md:p-12 rounded-lg border border-border text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Be the Hero in Someone's Story
          </h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join our mission today. Your contribution can give someone a second
            chance at life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2">
              Join as a Donor <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OurMission;
