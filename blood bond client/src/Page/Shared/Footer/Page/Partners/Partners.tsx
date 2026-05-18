import React from "react";
import {
  Handshake,
  ExternalLink,
  Globe,
  Award,
  ShieldCheck,
} from "lucide-react";
import Container from "@/Page/Shared/Responsive/Container";
import { Button } from "@/components/ui/button";

const Partners: React.FC = () => {
  const partners = [
    {
      name: "Bahria Medical and Dental College",
      type: "Strategic Medical Partner",
      logo: "https://i.ibb.co/6P0jL6P/dmc.png", // Sample Logo URL
      desc: "Providing emergency blood transfusion support and clinical data validation.",
    },
    {
      name: "WHO Pakistan",
      type: "Global Health Partner",
      logo: "https://i.ibb.co/M9F5f5r/who.png",
      desc: "Collaborating on national blood donation awareness and safety standards.",
    },
    {
      name: "Red Crescent Society",
      type: "Logistics Partner",
      logo: "https://i.ibb.co/YyS8n4z/red-crescent.png",
      desc: "Managing blood storage facilities and mobile donation camps across the country.",
    },
    {
      name: "GHQ Hospital",
      type: "Corporate Partner",
      logo: "https://i.ibb.co/v4KjGzG/square.png",
      desc: "Premium partner for specialized blood grouping and donation campaigns.",
    },
  ];

  return (
    <div className="min-h-screen text-foreground">
      <Container>
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
              <Handshake className="text-primary" size={40} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Our <span className="text-primary">Global Partners</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            We collaborate with world-class healthcare institutions and
            organizations to ensure that safe blood is accessible to every
            individual in need.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className="p-8 bg-card/50 border border-border rounded-lg hover:border-primary/30 transition-all group flex flex-col md:flex-row gap-8 items-center">
              {/* Partner Logo Wrapper */}
              <div className="w-32 h-32 shrink-0 bg-background border border-border rounded-lg flex items-center justify-center p-4 grayscale group-hover:grayscale-0 transition-all shadow-sm">
                <span className="font-bold text-xs opacity-40 uppercase tracking-widest">
                  {partner.name.split(" ")[0]}
                </span>
              </div>

              {/* Partner Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <ShieldCheck size={16} className="text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">
                    {partner.type}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{partner.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {partner.desc}
                </p>
                <button className="flex items-center gap-2 text-xs font-bold hover:text-primary transition-colors uppercase tracking-widest">
                  Official Website <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-10 bg-muted/30 border border-border rounded-lg text-center">
          <div>
            <Globe className="mx-auto mb-3 text-primary opacity-70" size={32} />
            <h4 className="text-2xl font-black">50+</h4>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
              Active Hospitals
            </p>
          </div>
          <div>
            <Award className="mx-auto mb-3 text-primary opacity-70" size={32} />
            <h4 className="text-2xl font-black">12</h4>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
              Global Awards
            </p>
          </div>
          <div>
            <ShieldCheck
              className="mx-auto mb-3 text-primary opacity-70"
              size={32}
            />
            <h4 className="text-2xl font-black">100%</h4>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
              Data Security
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6 italic">
            "Together, we can save more lives."
          </h3>
          <Button size="lg" className="px-12">
            Become a Partner
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Partners;
