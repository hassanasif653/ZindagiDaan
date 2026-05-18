import useAxiosSecure from "@/Hook/useAxiosSecure";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "../Shared/Responsive/Container";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import confetti from "canvas-confetti";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (sessionId) {
      axiosSecure
        .post(`/save-founder-details?session_id=${sessionId}`)
        .then((res) => {
          console.log(res);
        });
    }
  }, [axiosSecure, sessionId]);

  // Trigger confetti effect on mount
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#fb2c36", "#ffffff", "#000000"],
    });
  }, []);

  return (
    <Container>
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Success Icon */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
          <CheckCircle2 className="w-24 h-24 text-primary relative z-10 mx-auto" />
        </div>

        {/* Main Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black ">
            THANK YOU <span className="text-primary">SO MUCH</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Your generous contribution has been successfully processed.
            Together, we are making the world a better place.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded">
            <Link to="/">
              Go to Home <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>

          <Button variant="outline" size="lg" className="rounded">
            <Share2 className="mr-2 w-5 h-5" /> Share the Cause
          </Button>
        </div>

        <p className="text-sm text-muted-foreground pt-4">
          A confirmation email has been sent to your registered address.
        </p>
      </div>
    </Container>
  );
};

export default Success;
