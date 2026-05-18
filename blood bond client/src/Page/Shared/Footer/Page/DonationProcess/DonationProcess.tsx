import React from "react";
import { UserPlus, ClipboardCheck, Syringe, Coffee } from "lucide-react";
import Container from "@/Page/Shared/Responsive/Container";

const DonationProcess: React.FC = () => {
  const steps = [
    {
      id: "01",
      title: "Registration",
      desc: "Fill out a quick donor registration form with your basic details and medical history.",
      icon: <UserPlus size={32} className="text-primary" />,
    },
    {
      id: "02",
      title: "Health Screening",
      desc: "A brief physical exam to check your pulse, blood pressure, body temperature, and hemoglobin levels.",
      icon: <ClipboardCheck size={32} className="text-primary" />,
    },
    {
      id: "03",
      title: "Donation",
      desc: "The actual donation takes about 8-10 minutes. We use new, sterile needles for every donor.",
      icon: <Syringe size={32} className="text-primary" />,
    },
    {
      id: "04",
      title: "Refreshment",
      desc: "After donating, enjoy some snacks and drinks in the recovery area for 10-15 minutes.",
      icon: <Coffee size={32} className="text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen  text-foreground ">
      <Container>
        {/* Header Section */}
        <div className="text-center mb-20">
          <span className="text-primary font-bold tracking-widest uppercase text-sm border-b-2 border-primary pb-1">
            How it works
          </span>
          <h1 className="text-4xl md:text-6xl font-black mt-6 mb-4 tracking-tighter">
            The <span className="text-primary">Donation</span> Process
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Giving blood is a simple, four-step process that can save up to
            three lives.
          </p>
        </div>

        {/* Process Timeline */}

        <div className="relative">
          {/* Vertical Line (Desktop only) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2"></div>

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}>
                {/* Step Content */}
                <div className="flex-1 w-full text-center md:text-left">
                  <div
                    className={`p-8 bg-card/50 border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                      index % 2 === 1 ? "md:text-right" : ""
                    }`}>
                    <span className="text-5xl font-black text-primary opacity-20 mb-2 block">
                      {step.id}
                    </span>
                    <h3 className="text-2xl font-bold mb-3 text-card-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Step Icon (Center) */}
                <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-card border-4 border-primary rounded-full shadow-lg shrink-0">
                  {step.icon}
                </div>

                {/* Empty Space for alignment */}
                <div className="hidden md:block flex-1"></div>
              </div>
            ))}
          </div>
        </div>

        {/* After Care Section */}
        <div className="mt-24 p-8 bg-card/50 rounded-lg border border-border">
          <h2 className="text-2xl font-bold mb-6 text-center">
            After Your Donation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="font-bold text-primary mb-2">Drink Plenty</div>
              <p className="text-sm text-muted-foreground">
                Increase your fluid intake for the next 24-48 hours.
              </p>
            </div>
            <div className="text-center">
              <div className="font-bold text-primary mb-2">
                Avoid Heavy Lifting
              </div>
              <p className="text-sm text-muted-foreground">
                Keep your physical activity light for the rest of the day.
              </p>
            </div>
            <div className="text-center">
              <div className="font-bold text-primary mb-2">
                Eat Iron-Rich Food
              </div>
              <p className="text-sm text-muted-foreground">
                Focus on leafy greens and proteins to replenish your body.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DonationProcess;
