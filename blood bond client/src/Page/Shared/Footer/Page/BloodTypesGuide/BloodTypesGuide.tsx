import React from "react";
import { Info, CheckCircle2, AlertCircle } from "lucide-react";
import Container from "@/Page/Shared/Responsive/Container";
import { Button } from "@/components/ui/button";

const BloodTypesGuide: React.FC = () => {
  const bloodData = [
    {
      type: "O-",
      give: "Everyone (Universal Donor)",
      receive: "O-",
      desc: "Highest demand; used in emergencies when blood type is unknown.",
    },
    {
      type: "O+",
      give: "O+, A+, B+, AB+",
      receive: "O+, O-",
      desc: "The most common blood type.",
    },
    {
      type: "A-",
      give: "A-, A+, AB-, AB+",
      receive: "A-, O-",
      desc: "Used to treat patients with A- and AB- blood types.",
    },
    {
      type: "A+",
      give: "A+, AB+",
      receive: "A+, A-, O+, O-",
      desc: "One of the most common blood types.",
    },
    {
      type: "B-",
      give: "B-, B+, AB-, AB+",
      receive: "B-, O-",
      desc: "A rare blood type; always in need.",
    },
    {
      type: "B+",
      give: "B+, AB+",
      receive: "B+, B-, O+, O-",
      desc: "Important for treating patients with B+ and AB+.",
    },
    {
      type: "AB-",
      give: "AB-, AB+",
      receive: "AB-, A-, B-, O-",
      desc: "The rarest blood type.",
    },
    {
      type: "AB+",
      give: "AB+ Only",
      receive: "Everyone (Universal Recipient)",
      desc: "Can receive blood from any group.",
    },
  ];

  return (
    <div className="min-h-screen text-foreground">
      <Container>
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Blood Group <span className="text-primary">Compatibility</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Understanding blood types is crucial for safe transfusions. Some
            types can give to many, while others are universal recipients.
          </p>
        </div>

        {/* Compatibility Table/Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {bloodData.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-card/50 border border-border rounded-lg hover:shadow-lg transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-110 transition-transform">
                  {item.type}
                </div>
                <Info size={18} className="text-muted-foreground opacity-50" />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase font-bold text-primary tracking-widest mb-1">
                    Can Give To
                  </p>
                  <p className="text-sm font-medium">{item.give}</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-primary tracking-widest mb-1">
                    Can Receive From
                  </p>
                  <p className="text-sm font-medium">{item.receive}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Educational Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Universal Donor */}
          <div className="p-8 bg-card/50 rounded-lg border border-border flex gap-5">
            <div className="shrink-0">
              <CheckCircle2 size={40} className="text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-accent-foreground">
                Universal Donor (O Negative)
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                O-negative blood can be given to patients of any blood type. In
                emergency situations, when there isn't time to determine a
                patient's blood type, O-negative is often used.
              </p>
            </div>
          </div>

          {/* Universal Recipient */}
          <div className="p-8 bg-card/50 rounded-lg border border-border flex gap-5">
            <div className="shrink-0">
              <AlertCircle size={40} className="text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-accent-foreground">
                Universal Recipient (AB Positive)
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                People with AB-positive blood can receive blood from all other
                blood types. However, they can only donate to other AB-positive
                individuals.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6 italic text-sm">
            *Always consult with a medical professional for official blood
            testing and compatibility.
          </p>
          <Button>Find Your Blood Group Match</Button>
        </div>
      </Container>
    </div>
  );
};

export default BloodTypesGuide;
