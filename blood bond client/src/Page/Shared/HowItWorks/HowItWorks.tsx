import { Button } from "@/components/ui/button";
import { HowtoWorkStepData } from "@/Data/HowtoWorkStepData/HowtoWorkStepData";

const HowItWorks = () => {
  const steps = HowtoWorkStepData;

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          How It Works
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join our platform in four simple steps and start making a life-saving
          difference today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="p-6 rounded-md bg-card/50 border border-border  hover:-translate-y-2 transition-all duration-500">
            <div
              className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mx-auto mb-4`}>
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {step.title}
            </h3>
            <p className="text-muted-foreground">{step.description}</p>
            <div className="mt-4 flex justify-center">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-card/50 rounded-md p-8 md:p-12 border border-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Save Lives?
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of donors who are making a difference in their
            communities. Your donation can save lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="rounded-full">Register here now</Button>
            <Button className="rounded-full" variant={"outline"}>
              Learn about more
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
