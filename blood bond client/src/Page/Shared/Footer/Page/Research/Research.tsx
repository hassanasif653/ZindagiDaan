import React from "react";
import {
  BookOpen,
  FlaskConical,
  Globe,
  Microscope,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import Container from "@/Page/Shared/Responsive/Container";

const Research: React.FC = () => {
  const studies = [
    {
      title: "Impact of Regular Donation on Cardiovascular Health",
      category: "Clinical Study",
      year: "2024",
      desc: "Research indicates that regular blood donors have a 33% lower risk of suffering from cardiovascular diseases due to iron level maintenance.",
      icon: <TrendingUp className="text-primary" size={24} />,
    },
    {
      title: "Synthetic Blood Oxygen Carriers (SBOCs)",
      category: "Bio-Tech",
      year: "2023",
      desc: "Exploring the development of artificial blood alternatives for emergency transfusions in remote areas where cold storage is unavailable.",
      icon: <FlaskConical className="text-primary" size={24} />,
    },
    {
      title: "Rare Blood Group Genomic Mapping",
      category: "Genetics",
      year: "2024",
      desc: "Global research project aiming to identify and map rare phenotypes like Bombay Blood Group to optimize international donor networks.",
      icon: <Microscope className="text-primary" size={24} />,
    },
  ];

  return (
    <div className="min-h-screen  text-foreground ">
      <Container>
        {/* Header */}
        <div className="mb-16 border-b border-border pb-10">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="text-primary" size={32} />
            <span className="text-sm font-bold uppercase tracking-widest opacity-70">
              Scientific Research
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-none">
            Advancing <span className="text-primary">Hematology</span> & Lives
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
            Our platform supports and highlights cutting-edge research in blood
            science, donor health, and transfusion technologies to bridge the
            gap between science and humanity.
          </p>
        </div>

        {/* Global Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 bg-card/50 border border-secondary rounded-lg text-center">
            <h4 className="text-4xl font-black text-primary mb-2">118.5M</h4>
            <p className="text-sm font-medium uppercase tracking-tighter opacity-70">
              Global Donations/Year
            </p>
          </div>
          <div className="p-8 bg-card/50 border border-secondary rounded-lg text-center">
            <h4 className="text-4xl font-black text-primary mb-2">40%</h4>
            <p className="text-sm font-medium uppercase tracking-tighter opacity-70">
              Donations in Low Income Countries
            </p>
          </div>
          <div className="p-8 bg-card/50 border border-secondary rounded-lg text-center">
            <h4 className="text-4xl font-black text-primary mb-2">3</h4>
            <p className="text-sm font-medium uppercase tracking-tighter opacity-70">
              Lives Saved Per Unit
            </p>
          </div>
        </div>

        {/* Research Papers Grid */}
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Globe className="text-primary" size={24} />
          Latest Research Papers
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {studies.map((study, idx) => (
            <div
              key={idx}
              className="group relative p-6 bg-card/50 border border-secondary rounded-lg hover:border-primary transition-all">
              <div className="mb-4 flex justify-between items-start">
                <div className="p-2 bg-accent rounded-lg">{study.icon}</div>
                <span className="text-[10px] font-bold px-2 py-1 bg-secondary rounded-full text-secondary-foreground uppercase">
                  {study.year}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                {study.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {study.desc}
              </p>
              <button className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider hover:gap-3 transition-all">
                Read Abstract <ExternalLink size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Future of Donation Banner */}

        <div className="bg-accent/50 border border-secondary p-10 rounded-lg">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">
                The Future of <span className="text-primary">Precision</span>{" "}
                Medicine
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We are collaborating with global health organizations to
                implement AI-driven donor matching, ensuring that the rarest
                blood types reach the patients in the fastest time possible.
              </p>
              <div className="flex gap-4">
                <div className="w-12 h-1 bg-primary rounded-full"></div>
                <div className="w-4 h-1 bg-primary opacity-30 rounded-full"></div>
                <div className="w-4 h-1 bg-primary opacity-30 rounded-full"></div>
              </div>
            </div>
            <div className="w-full md:w-1/3 p-6 bg-card rounded-xl border border-border shadow-xl rotate-3 hover:rotate-0 transition-transform cursor-pointer">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase">
                  Live Data Stream
                </span>
              </div>
              <p className="text-xs font-mono opacity-80 leading-tight">
                // Research Node-041 <br />
                Analyzing donor frequency patterns... <br />
                Result: Optimal gap 12 weeks. <br />
                Status: Verified.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Research;
