import React from "react";
import {
  ShieldCheck,
  Syringe,
  ClipboardList,
  Thermometer,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import Container from "@/Page/Shared/Responsive/Container";
import { Button } from "@/components/ui/button";

const SafetyGuidelines: React.FC = () => {
  const guidelines = [
    {
      title: "Sterile Equipment",
      icon: <Syringe className="text-primary" size={28} />,
      desc: "We ensure that every needle and collection bag used is 100% sterile, single-use, and disposable to prevent any risk of infection.",
    },
    {
      title: "Health Screening",
      icon: <Thermometer className="text-primary" size={28} />,
      desc: "Every donor undergoes a mini-physical checkup (Blood pressure, Pulse, Temperature, and Hemoglobin) before being cleared for donation.",
    },
    {
      title: "Donor Verification",
      icon: <UserCheck className="text-primary" size={28} />,
      desc: "We verify donor identities and maintain a history to ensure that the donation frequency follows medical safety standards.",
    },
    {
      title: "Post-Donation Care",
      icon: <ClipboardList className="text-primary" size={28} />,
      desc: "Our guidelines include a mandatory 15-minute rest period and refreshments to help the body begin the recovery process immediately.",
    },
  ];

  return (
    <div className="min-h-screen text-foreground">
      <Container>
        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-primary font-bold mb-4">
            <ShieldCheck size={20} />
            <span className="uppercase tracking-[2px] text-xs">
              Certified Standards
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
            Safety First, <span className="text-primary">Always.</span>
          </h1>
          <p className="text-muted-foreground mt-6 text-lg md:text-xl leading-relaxed">
            Your safety is our absolute priority. We strictly adhere to
            international medical protocols to ensure a secure environment for
            both donors and recipients.
          </p>
        </div>

        {/* Guidelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {guidelines.map((item, idx) => (
            <div
              key={idx}
              className="group p-8 bg-card/40 border border-border rounded-lg hover:border-primary/30 transition-all">
              <div className="w-14 h-14 bg-background border border-border rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Emergency/Alert Box */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-5">
            <ShieldCheck size={200} fill="currentColor" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="p-4 bg-primary/10 rounded-full">
              <AlertCircle size={40} className="text-primary animate-pulse" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">When Not to Donate?</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                If you have a fever, are taking certain medications, have
                recently traveled to malaria-endemic zones, or have undergone
                major surgery, please consult our medical team before scheduling
                a donation.
              </p>
            </div>
            <Button size="lg" className="shrink-0">
              Read Eligibility
            </Button>
          </div>
        </div>

        {/* Commitment Text */}
        <div className="mt-20 text-center max-w-2xl mx-auto">
          <h4 className="text-xl font-bold mb-4 italic">
            "A safe donation is a successful donation."
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We follow the World Health Organization (WHO) and Red Crescent
            guidelines to maintain the highest quality of blood collection and
            storage.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default SafetyGuidelines;
