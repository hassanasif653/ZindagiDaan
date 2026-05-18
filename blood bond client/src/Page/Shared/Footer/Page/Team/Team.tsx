import React from "react";
import { Heart } from "lucide-react";
import Container from "@/Page/Shared/Responsive/Container";
import { Button } from "@/components/ui/button";
import { FaGithubSquare, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import useAuth from "@/Hook/useAuth";

const Team: React.FC = () => {
  const { user } = useAuth();
  const teamMembers = [
    {
      name: "M.Hassan Asif",
      role: "Medical Director",
      image: `${user?.photoURL}`,
      bio: "Hematology expert specializing in safe blood transfusion protocols and donor wellness.",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "M.Hassan Asif",
      role: "Lead Systems Architect",
      image: `${user?.photoURL}`,
      bio: "Full-stack engineer dedicated to building high-availability systems for emergency responses.",
      social: { github: "#", linkedin: "#" },
    },
    {
      name: "M.Hassan Asif",
      role: "Community Manager",
      image: `${user?.photoURL}`,
      bio: "Driving nationwide donation campaigns and managing our volunteer blood donor network.",
      social: { twitter: "#", linkedin: "#" },
    },
    {
      name: "M.Hassan Asif",
      role: "UX Strategy Lead",
      image: `${user?.photoURL}`,
      bio: "Focusing on empathetic design to make the blood request process fast and stress-free.",
      social: { github: "#", twitter: "#" },
    },
  ];

  return (
    <div className="min-h-screen text-foreground">
      <Container>
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 rotate-3 group hover:rotate-0 transition-transform">
              <Heart
                className="text-primary group-hover:fill-primary transition-colors"
                size={40}
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
            The Hearts Behind <span className="text-primary">ZindagiDaan</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed italic">
            "Combining medical expertise with technological innovation to ensure
            that no life is lost due to blood shortage."
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="group bg-card/40 border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(251,44,54,0.1)]">
              {/* Image with Overlay */}
              <div className="relative aspect-square overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content Area */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-1 tracking-tight">
                  {member.name}
                </h3>
                <p className="text-primary text-xs font-black uppercase tracking-[2px] mb-4">
                  {member.role}
                </p>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                  {member.bio}
                </p>

                {/* Social Icons */}
                <div className="flex justify-center gap-5 border-t border-border pt-6">
                  {member.social.github && (
                    <a
                      href={member.social.github}
                      className="text-muted-foreground hover:text-primary transition-all hover:-translate-y-1">
                      <FaGithubSquare size={20} />
                    </a>
                  )}
                  {member.social.linkedin && (
                    <Link
                      to={member.social.linkedin}
                      className="text-muted-foreground hover:text-primary transition-all hover:-translate-y-1">
                      <FaLinkedin size={20} />
                    </Link>
                  )}
                  {member.social.twitter && (
                    <Link
                      to={member.social.twitter}
                      className="text-muted-foreground hover:text-primary transition-all hover:-translate-y-1">
                      <FaXTwitter size={20} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advisory Board / CTA */}
        <div className="bg-card/30 border border-border rounded-lg p-8 md:p-16 text-center">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">
            Interested in joining our mission?
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            We are always looking for passionate medical volunteers, developers,
            and community organizers to help grow our network.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="px-8 font-bold gap-2">
              Join the Team <ArrowRight size={18} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 font-bold border-primary/20 hover:bg-primary/5">
              Our Partners
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

// Internal Helper Icon
const ArrowRight = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default Team;
