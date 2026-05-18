import React, { useState } from "react";
import {
  FaHeart,
  FaHandHoldingHeart,
  FaHospital,
  FaUserMd,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

// --- Interfaces ---
interface FooterLink {
  name: string;
  href: string;
  // React.ReactNode is used because icons are JSX elements
  icon?: React.ReactNode;
}

interface FooterProps {
  className?: string;
}

// --- Static Data (moved outside component for performance) ---
const quickLinks: FooterLink[] = [
  {
    name: "Find Donors",
    href: "/search-page",
    icon: <FaUserMd className="w-4 h-4" />,
  },
  {
    name: "Blood Requests",
    href: "/dashboard/donation-requests",
    icon: <FaHandHoldingHeart className="w-4 h-4" />,
  },
  {
    name: "My donation",
    href: "/dashboard/my-donation-requests",
    icon: <FaHospital className="w-4 h-4" />,
  },
  {
    name: "Become e volunteer",
    href: "/volunteer",
    icon: <FaCalendarAlt className="w-4 h-4" />,
  },
  { name: "Become Donor", href: "/register" },
  { name: "Organizations", href: "" },
];

const resources: FooterLink[] = [
  { name: "Donor Eligibility", href: "/eligibility" },
  { name: "Donation Process", href: "/process" },
  { name: "Blood Types Guide", href: "/blood-types" },
  { name: "Health Tips", href: "/health-tips" },
  { name: "FAQ", href: "/faq" },
  { name: "Research", href: "/research" },
];

const aboutUs: FooterLink[] = [
  { name: "Our Mission", href: "/mission" },
  { name: "Our Team", href: "/team" },
  { name: "Partners", href: "/partners" },
  { name: "Careers", href: "/careers" },
  { name: "News & Updates", href: "/news" },
  { name: "Annual Report", href: "/report" },
];

const emergencyContacts = [
  { label: "Emergency Helpline", number: "106" },
  { label: "Blood Bank", number: "+1 (800) 123-HELP" },
  { label: "Ambulance", number: "102" },
];

const socialLinks = [
  {
    icon: <FaFacebook />,
    href: "https://www.facebook.com/share/1Hm9c3dG4M/",
    label: "Facebook",
    color: "hover:text-blue-600",
  },
  {
    icon: <FaTwitter />,
    href: "https://x.com/",
    label: "Twitter",
    color: "hover:text-sky-500",
  },
  {
    icon: <FaInstagram />,
    href: "https://www.instagram.com/hassan_asifff?igsh=M3JuYzFoOHlrdmdj",
    label: "Instagram",
    color: "hover:text-pink-600",
  },
  {
    icon: <FaLinkedin />,
    href: "https://www.linkedin.com/in/muhammad-hassan-asif-7732b737b?",
    label: "LinkedIn",
    color: "hover:text-blue-700",
  },
  {
    icon: <FaYoutube />,
    href: "https://youtube.com",
    label: "YouTube",
    color: "hover:text-red-600",
  },
];

const stats = [
  { label: "Lives Saved", value: "50,000+" },
  { label: "Active Donors", value: "25,000+" },
  { label: "Blood Units", value: "100K+" },
  { label: "Partner Hospitals", value: "500+" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/safety", label: "Safety Guidelines" },
];

// --- Sub-components ---

// Reusable component for link sections
const FooterLinks: React.FC<{ title: string; links: FooterLink[] }> = ({
  title,
  links,
}) => (
  <div>
    <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-primary inline-block font-sans">
      {title}
    </h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.name}>
          <Link
            to={`${link.href}`}
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground hover:translate-x-2 transition-all duration-300 group font-sans">
            {link.icon && (
              <span className="text-primary group-hover:scale-110 transition-transform">
                {link.icon}
              </span>
            )}
            <span>{link.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

// Brand and Emergency Contacts Section
const FooterBrand: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="bg-primary p-3 rounded-full shadow-lg">
        <FaHeart className="w-8 h-8 text-primary-foreground" />
      </div>
      <div>
        <h2 className="text-3xl font-bold bg-linear-to-r from-primary/80 to-primary bg-clip-text text-transparent font-sans">
          Zindagidaan
        </h2>
        <p className="text-muted-foreground font-medium font-sans">
          Connecting Lives, Saving Lives
        </p>
      </div>
    </div>
    <p className="text-muted-foreground font-sans leading-relaxed">
      A lifeline platform connecting blood donors with recipients. Join our
      community of heroes who save lives through voluntary blood donation.
    </p>
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground font-sans">
        Emergency Contacts
      </h3>
      {emergencyContacts.map((contact, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 bg-card/50 rounded-lg shadow-sm">
          <div className="bg-primary/30 p-2 rounded">
            <FaPhone className="w-4 h-4 text-primary/70" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-sans">
              {contact.label}
            </p>
            <p className="font-bold text-lg text-foreground font-sans">
              {contact.number}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Newsletter Section (Optimized to remove dependency on useAuth)
const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    // Simulate API call or form submission delay
    setTimeout(() => {
      console.log("Subscribed email:", email);
      setIsSubscribed(true);
      setIsSubmitting(false);
      setEmail("");

      // Show success message briefly
      setTimeout(() => setIsSubscribed(false), 3000);
    }, 1000);
  };

  return (
    <div className="bg-card/50">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground font-sans">
        <FaHeart className="text-primary" />
        Stay Connected
      </h3>
      <p className="text-muted-foreground mb-4 font-sans leading-relaxed">
        Subscribe to receive updates about urgent needs, donation drives, and
        health tips.
      </p>
      {isSubscribed ? (
        <div className="bg-primary/10 text-primary p-3 rounded-lg text-center font-sans">
          Thank you for subscribing!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      )}
    </div>
  );
};

// Main Footer Component
const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-card text-card-foreground ${className} font-sans`}>
      {/* Emergency Banner */}
      <div className="bg-primary text-primary-foreground py-3 text-center shadow-md">
        <div className="container mx-auto px-4">
          <p className="font-semibold flex items-center justify-center gap-2 font-sans">
            <FaHeart className="animate-pulse" />
            <span>
              URGENT NEED: O- Blood Type • A+ Blood Type • B- Blood Type
            </span>
            <FaHeart className="animate-pulse" />
          </p>
          <p className="text-sm mt-1 font-sans">
            Call Emergency Helpline: <strong>106</strong>
          </p>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FooterBrand />
          <FooterLinks title="Quick Links" links={quickLinks} />
          <div>
            <FooterLinks title="Resources" links={resources} />
            {/* Stats Section */}
            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="font-semibold mb-4 text-foreground font-sans">
                Our Impact
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-3 bg-secondary/30 rounded-lg shadow-sm">
                    <p className="text-2xl font-bold text-primary font-sans">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground font-sans">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <FooterLinks title="About Zindagidaan" links={aboutUs} />

            {/* Contact Us Section */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-primary inline-block font-sans">
                Contact Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-foreground font-sans">
                      Headquarters
                    </p>
                    <p className="text-muted-foreground text-sm font-sans leading-relaxed">
                      Naeem Builders, Golden town, Karchi 75230
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground font-sans">
                      Email
                    </p>
                    <a
                      href="mailto:contact@Zindagidaan.org"
                      className="text-muted-foreground hover:text-foreground text-sm font-sans">
                      contact@Zindagidaan.org
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter & Social */}
        <div className="mt-12 pt-8 border-t border-border grid grid-cols-1 lg:grid-cols-2 gap-8">
          <NewsletterSection />
          <div className="bg-card/50  rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-foreground font-sans">
              Follow Our Journey
            </h3>
            <p className="text-muted-foreground mb-6 font-sans leading-relaxed">
              Join our community of lifesavers on social media
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  to={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`bg-secondary text-muted-foreground ${social.color} w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-300 transform hover:scale-110 hover:bg-secondary/80 shadow-sm`}>
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-background/80 py-6 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm font-sans">
              © {currentYear} Zindagidaan. All rights reserved.
              <span className="text-primary ml-2">❤️ Every Drop Counts</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-sans">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="text-xs text-muted-foreground/60 font-sans">
              Registered Non-Profit Organization • Tax ID: 45-1234567
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50 text-center">
            <p className="text-xs text-muted-foreground/80 font-sans leading-relaxed">
              Blood types displayed are for informational purposes. Always
              consult with medical professionals.
              <br />
              This platform connects donors with recipients but does not provide
              medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
