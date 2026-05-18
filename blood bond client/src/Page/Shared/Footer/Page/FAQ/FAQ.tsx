import React from "react";

import { HelpCircle, MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "How long does a blood donation take?",
      answer:
        "The entire process, from registration to refreshments, takes about 45-60 minutes. However, the actual donation usually takes only 8-10 minutes.",
    },
    {
      question: "Is it safe to donate blood?",
      answer:
        "Absolutely. Blood donation is a safe process. We use brand-new, sterile, disposable needles for every donor, so there is no risk of contracting any blood-borne diseases.",
    },
    {
      question: "How often can I donate blood?",
      answer:
        "For whole blood donation, you can donate every 8-12 weeks (approximately every 3 months) to ensure your body has enough time to replenish its iron levels.",
    },
    {
      question: "Can I donate if I have a tattoo?",
      answer:
        "In most cases, yes. However, you must wait 6 to 12 months after getting a tattoo or piercing before you are eligible to donate, depending on the regulations of the facility.",
    },
    {
      question: "What should I eat before donating?",
      answer:
        "Eat a healthy, low-fat meal and stay well-hydrated. Avoid fatty foods like burgers or fries before donation, as they can affect the quality of the plasma.",
    },
    {
      question: "Will it hurt?",
      answer:
        "You will feel a quick pinch when the needle is inserted, but after that, you shouldn't feel any pain during the donation process.",
    },
  ];

  return (
    <div className="min-h-screen  text-foreground ">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-card/50 rounded-lg border border-secondary">
              <HelpCircle className="text-primary" size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-black mb-4 tracking-tight">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-muted-foreground">
            Everything you need to know about blood donation. Can't find an
            answer? Contact our support.
          </p>
        </div>

        {/* Shadcn Accordion */}
        <div className="bg-card/50 border border-secondary rounded-lg p-2 md:p-6 shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-border px-4">
                <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary transition-colors py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Support CTA */}
        <div className="mt-12 text-center p-8 bg-card/50 rounded-lg border border-secondary">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MessageCircle size={20} className="text-primary" />
            <h3 className="font-bold">Still have questions?</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Our medical team is here to help you 24/7.
          </p>
          <Button>Contact Support</Button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
