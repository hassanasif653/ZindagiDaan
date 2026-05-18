import React from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Heart,
} from "lucide-react";
import Container from "@/Page/Shared/Responsive/Container";
import { Button } from "@/components/ui/button";

const Careers: React.FC = () => {
  const jobs = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote / Karachi",
      type: "Full-time",
    },
    {
      title: "Medical Data Analyst",
      department: "Research",
      location: "Lahore, PK",
      type: "Full-time",
    },
    {
      title: "Community Growth Manager",
      department: "Marketing",
      location: "Remote",
      type: "Contract",
    },
    {
      title: "UI/UX Product Designer",
      department: "Design",
      location: "Islamabad, PK",
      type: "Full-time",
    },
  ];

  return (
    <div className="min-h-screen text-foreground ">
      <Container>
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} /> Join the Revolution
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
              Build Technology that{" "}
              <span className="text-primary">Saves Lives.</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              At ZindagiDaan, we don't just write code or manage data; we create
              lifelines. Join our mission-driven team and help us redefine the
              future of blood donation.
            </p>
            <Button size="lg" className="gap-2">
              View Openings <ArrowRight size={18} />
            </Button>
          </div>
          <div className="flex-1 bg-card/50 border border-border p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Heart size={120} fill="var(--primary)" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Why work with us?</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <p className="text-sm text-muted-foreground">
                  Work on a product with real-world social impact.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <p className="text-sm text-muted-foreground">
                  Flexible remote-first culture and modern tech stack.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <p className="text-sm text-muted-foreground">
                  Competitive compensation and health benefits.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Open <span className="text-primary">Positions</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              {jobs.length} roles available
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job, idx) => (
              <div
                key={idx}
                className="group p-6 bg-card/30 border border-border rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/50 transition-all cursor-pointer">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase size={14} /> {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {job.type}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  Apply Now
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Culture Section */}
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold mb-12">Don't see a perfect fit?</h3>
          <div className="max-w-xl mx-auto p-8 bg-muted/50 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground mb-6">
              We're always looking for talented individuals who believe in our
              mission. Send us your resume and we'll keep you in mind for future
              roles.
            </p>
            <Button variant="link" className="text-primary font-bold underline">
              careers@Zindagidaan.com
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Careers;
