import React from "react";
import { Apple, Waves, Moon, Dumbbell, Heart, ShieldCheck } from "lucide-react";

const HealthTips: React.FC = () => {
  const categories = [
    {
      title: "Nutrition & Diet",
      icon: <Apple className="text-primary" size={28} />,
      tips: [
        "Eat iron-rich foods like spinach, red meat, and beans.",
        "Increase Vitamin C intake to help iron absorption.",
        "Avoid fatty foods (like burgers or fries) before donation.",
        "Maintain a healthy, balanced diet daily.",
      ],
    },
    {
      title: "Hydration",
      icon: <Waves className="text-primary" size={28} />,
      tips: [
        "Drink at least 500ml of water right before donation.",
        "Stay hydrated for 48 hours after giving blood.",
        "Avoid caffeine and alcohol 24 hours before donation.",
        "Juice and broth are great for replenishing fluids.",
      ],
    },
    {
      title: "Rest & Recovery",
      icon: <Moon className="text-primary" size={28} />,
      tips: [
        "Get at least 8 hours of sleep the night before.",
        "Rest for 15 minutes in the refreshment area post-donation.",
        "Avoid heavy lifting for the rest of the day.",
        "If you feel dizzy, lie down with your feet elevated.",
      ],
    },
  ];

  return (
    <div className="min-h-screen  text-foreground">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-card/50 px-4 py-2 rounded-full mb-4 border border-border">
            <ShieldCheck size={18} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-accent-foreground">
              Donor Wellness
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Health & <span className="text-primary">Safety</span> Tips
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your health is our priority. Follow these guidelines to stay fit and
            make your donation experience smooth.
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-card border border-border rounded-lg p-8 shadow-sm hover:border-primary transition-colors">
              <div className="mb-6 flex items-center gap-3">
                <div className="p-3 bg-accent rounded-lg">{cat.icon}</div>
                <h3 className="text-xl font-bold">{cat.title}</h3>
              </div>
              <ul className="space-y-4">
                {cat.tips.map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Lifestyle Banner */}

        <div className="bg-primary rounded-lg p-8 md:p-12 text-primary-foreground overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">
                Maintain a Healthy Hemoglobin Level
              </h2>
              <p className="opacity-90 leading-relaxed mb-6">
                A high iron lifestyle ensures you can donate frequently without
                feeling fatigued. Include leafy greens, lentils, and citrus
                fruits in your daily meals.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <Dumbbell size={18} />
                  <span className="text-xs font-bold">Regular Exercise</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <Heart size={18} />
                  <span className="text-xs font-bold">Stress Management</span>
                </div>
              </div>
            </div>
            <div className="shrink-0 animate-pulse">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-8 border-white/20 flex items-center justify-center">
                <Heart size={64} fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTips;
