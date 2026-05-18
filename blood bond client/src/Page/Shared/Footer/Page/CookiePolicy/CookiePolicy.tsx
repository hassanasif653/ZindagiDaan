import React from "react";
import {
  Cookie,
  ShieldCheck,
  Settings,
  Info,
  MousePointerClick,
  ToggleRight,
} from "lucide-react";
import Container from "@/Page/Shared/Responsive/Container";
import { Button } from "@/components/ui/button";

const CookiePolicy: React.FC = () => {
  const cookieTypes = [
    {
      title: "Essential Cookies",
      icon: <ShieldCheck className="text-primary" size={24} />,
      content:
        "These are necessary for the website to function. They handle donor login sessions and security authentication.",
    },
    {
      title: "Preference Cookies",
      icon: <Settings className="text-primary" size={24} />,
      content:
        "These allow us to remember your choices, like your preferred language or your default search location (Province/City).",
    },
    {
      title: "Analytics Cookies",
      icon: <MousePointerClick className="text-primary" size={24} />,
      content:
        "We use these to understand how users interact with our platform, helping us improve the donor-finding experience.",
    },
  ];

  return (
    <div className="min-h-screen text-foreground py-12 md:py-20">
      <Container>
        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-primary font-bold mb-4">
            <Cookie size={20} />
            <span className="uppercase tracking-[2px] text-xs">
              Browser Data
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
            Cookie <span className="text-primary">Policy</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            This policy explains how ZindagiDaan uses cookies and similar
            technologies to recognize you when you visit our platform.
          </p>
        </div>

        {/* What are cookies section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Info className="text-primary" size={22} /> What are cookies?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small data files that are placed on your computer or
              mobile device when you visit a website. They are widely used by
              website owners to make their websites work, or to work more
              efficiently, as well as to provide reporting information.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {cookieTypes.map((type, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-card/40 border border-border rounded-lg">
                  <div className="mb-4">{type.icon}</div>
                  <h4 className="font-bold mb-2">{type.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {type.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Quick Settings */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-8 bg-primary/5 border border-primary/20 rounded-lg">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ToggleRight size={20} className="text-primary" /> Manage
                Settings
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                You can choose to accept or decline cookies. Most web browsers
                automatically accept cookies, but you can usually modify your
                browser setting to decline cookies if you prefer.
              </p>
              <div className="space-y-3">
                <Button className="w-full">Accept All Cookies</Button>
                <Button variant="outline" className="w-full">
                  Cookie Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Explanation */}
        <div className="bg-card/20 border border-border rounded-lg p-8 md:p-12">
          <h3 className="text-xl font-bold mb-6 tracking-tight uppercase opacity-70">
            Updating this Policy
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            We may update this Cookie Policy from time to time in order to
            reflect, for example, changes to the cookies we use or for other
            operational, legal or regulatory reasons. Please therefore re-visit
            this Cookie Policy regularly to stay informed about our use of
            cookies and related technologies.
          </p>
          <p className="text-xs text-muted-foreground italic border-t border-border pt-6">
            For further information, please contact us at{" "}
            <span className="text-primary font-bold">
              privacy@ZindagiDaan.com
            </span>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default CookiePolicy;
