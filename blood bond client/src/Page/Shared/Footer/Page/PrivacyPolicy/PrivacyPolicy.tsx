import React from "react";
import { ShieldCheck, Lock, Eye, Server, RefreshCcw, Mail } from "lucide-react";
import Container from "@/Page/Shared/Responsive/Container";
import { Button } from "@/components/ui/button";

const PrivacyPolicy: React.FC = () => {
  const sections = [
    {
      title: "Data Collection",
      icon: <Eye className="text-primary" size={24} />,
      content:
        "We collect personal information such as name, blood group, contact details, and location to facilitate the matching process between donors and recipients.",
    },
    {
      title: "How We Use Data",
      icon: <RefreshCcw className="text-primary" size={24} />,
      content:
        "Your data is primarily used to alert you of nearby donation requests or to help recipients find your contact information during emergencies.",
    },
    {
      title: "Security Measures",
      icon: <Lock className="text-primary" size={24} />,
      content:
        "We implement industry-standard encryption and security protocols to ensure your sensitive health information is protected from unauthorized access.",
    },
    {
      title: "Third-Party Sharing",
      icon: <Server className="text-primary" size={24} />,
      content:
        "BloodBond does not sell or rent your personal data to third-party marketers. Data is only shared with authorized medical partners when necessary.",
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
              Security & Trust
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Last Updated: December 2024. Your privacy is our top priority. Learn
            how we handle your data with care and transparency.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="p-8 bg-card/40 border border-border rounded-lg hover:border-primary/20 transition-all">
              <div className="p-3 bg-primary/10 w-fit rounded-lg mb-6">
                {section.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 tracking-tight">
                {section.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Detailed Policy Text Area */}
        <div className="prose prose-sm max-w-none bg-muted/30 border border-border rounded-lg p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-6">Terms of Data Protection</h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              By using the BloodBond platform, you consent to the collection and
              use of information in accordance with this policy. Our commitment
              to privacy ensures that your identity and medical history are
              handled with the highest level of confidentiality.
            </p>
            <p>
              Donors have the right to change their availability status at any
              time or request the deletion of their account and associated data
              from our active servers.
            </p>
            <div className="pl-4 border-l-2 border-primary py-2 italic">
              "We believe that saving lives should not come at the cost of
              personal privacy."
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            Have questions about our privacy practices?
          </p>
          <Button variant="outline" className="gap-2">
            <Mail size={18} /> Contact Privacy Officer
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
