import React, { useCallback, useEffect } from "react";
import { Heart, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion, useAnimation } from "framer-motion";
import Container from "../Responsive/Container";
import { volunteerData } from "@/Data/VolunteerData/VolunteerData";

const OurVolunteers: React.FC = () => {
  const volunteers = volunteerData;
  const doubledVolunteers = [...volunteers, ...volunteers];

  // Animation Control
  const controls = useAnimation();

  const startAnimation = useCallback(() => {
    controls.start({
      x: ["0%", "-50%"],
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity,
      },
    });
  }, [controls]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  return (
    <section className="py-10 overflow-hidden ">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-primary font-bold mb-4">
              <Star size={18} className="fill-primary" />
              <span className="uppercase tracking-[3px] text-xs">
                Community Heroes
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black">
              Our dedicated <span className="text-primary">volunteers</span>
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Meet the selfless individuals who donate their time and blood.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex gap-2">
            View All Volunteers <Award size={18} />
          </Button>
        </div>

        {/* --- Infinite Marquee Wrapper --- */}
        <div
          className="relative flex overflow-hidden group py-4"
          onMouseEnter={() => controls.stop()}
          onMouseLeave={() => startAnimation()}>
          <motion.div
            className="flex gap-8 whitespace-nowrap"
            animate={controls}>
            {doubledVolunteers.map((person, idx) => (
              <div
                key={idx}
                className="w-[300px] shrink-0 group relative bg-card border border-border rounded-lg p-6 transition-all duration-500 hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/5">
                {/* Badge */}
                {person.donations >= 10 && (
                  <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-[10px] font-black px-3 py-1 rounded-full shadow-lg z-10 flex items-center gap-1">
                    <Heart size={10} fill="currentColor" /> TOP DONOR
                  </div>
                )}

                {/* Profile Image */}
                <div className="relative mb-6">
                  <div className="aspect-square rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors italic">
                    {person.name}
                  </h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-4">
                    {person.role}
                  </p>

                  <div className="flex items-center justify-center gap-2 mb-6 bg-muted/50 py-1.5 rounded-full">
                    <span className="text-xs font-bold text-primary">
                      {person.donations}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                      Times Donated
                    </span>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-4 border-t border-border pt-5">
                    {person.social.github && (
                      <Link
                        to={person.social.github}
                        className="text-muted-foreground hover:text-primary transition-colors">
                        <FaGithub size={18} />
                      </Link>
                    )}
                    {person.social.linkedin && (
                      <a
                        href={person.social.linkedin}
                        className="text-muted-foreground hover:text-primary transition-colors">
                        <FaLinkedin size={18} />
                      </a>
                    )}
                    {person.social.twitter && (
                      <a
                        href={person.social.twitter}
                        className="text-muted-foreground hover:text-primary transition-colors">
                        <FaXTwitter size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Side Gradients */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-background to-transparent z-10" />
        </div>
      </Container>
    </section>
  );
};

export default OurVolunteers;
