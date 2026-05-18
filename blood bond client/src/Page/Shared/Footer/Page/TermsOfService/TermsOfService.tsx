import React from "react";
import {
  Scale,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldAlert,
  Gavel,
} from "lucide-react";
import Container from "@/Page/Shared/Responsive/Container";
import { Button } from "@/components/ui/button";

const TermsOfService: React.FC = () => {
  const terms = [
    {
      title: "User Eligibility",
      icon: <CheckCircle2 className="text-primary" size={24} />,
      content:
        "Users must be at least 18 years old to create an account. Donors must provide accurate health information to ensure recipient safety.",
    },
    {
      title: "Prohibited Conduct",
      icon: <ShieldAlert className="text-primary" size={24} />,
      content:
        "Any attempt to sell blood for money or fraudulent donation requests will result in an immediate permanent ban and legal action.",
    },
    {
      title: "Data Accuracy",
      icon: <FileText className="text-primary" size={24} />,
      content:
        "You agree to provide true, accurate, and complete information. Impersonating medical professionals or organizations is strictly forbidden.",
    },
    {
      title: "Limitation of Liability",
      icon: <Scale className="text-primary" size={24} />,
      content:
        "ZindagiDaan is a matching platform. We are not responsible for medical complications arising from direct interactions between donors and recipients.",
    },
  ];

  return (
    <div className="min-h-screen text-foreground py-12 md:py-20">
      <Container>
        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-primary font-bold mb-4">
            <Gavel size={20} />
            <span className="uppercase tracking-[2px] text-xs">
              Legal Agreement
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            By accessing ZindagiDaan, you agree to comply with our rules and
            regulations. Please read these terms carefully to understand your
            rights and responsibilities.
          </p>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {terms.map((term, idx) => (
            <div
              key={idx}
              className="p-8 bg-card/40 border border-border rounded-lg hover:border-primary/20 transition-all group">
              <div className="mb-6 flex items-center justify-between">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  {term.icon}
                </div>
                <span className="text-4xl font-black opacity-10 tracking-tighter">
                  0{idx + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-4 tracking-tight">
                {term.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {term.content}
              </p>
            </div>
          ))}
        </div>

        {/* Important Disclaimer */}
        <div className="bg-primary/5 border-l-4 border-primary p-8 rounded-r-lg mb-16">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-primary" size={24} />
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Important Disclaimer
            </h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            ZindagiDaan does not provide medical advice. Our service is limited to
            connecting voluntary donors with those in need. Always consult with
            a certified medical professional or hospital before proceeding with
            a blood transfusion.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 border border-border rounded-lg bg-card/20">
          <div>
            <h3 className="text-lg font-bold">
              Have questions about our terms?
            </h3>
            <p className="text-sm text-muted-foreground">
              Download the full PDF version for your records.
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">Download PDF</Button>
            <Button>Accept Terms</Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TermsOfService;
