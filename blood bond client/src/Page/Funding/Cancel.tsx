import { Link } from "react-router-dom";
import { XCircle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

import Container from "../Shared/Responsive/Container";

const Cancel = () => {
  return (
    <Container>
      <div className="max-w-xl mx-auto text-center space-y-8">
        {/* Cancel Icon with subtle animation */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-destructive/10 blur-3xl rounded-full animate-pulse"></div>
          <XCircle className="w-24 h-24 text-primary relative z-10 mx-auto" />
        </div>

        {/* Main Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            FUNDING <span className="text-primary">CANCELLED</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            It looks like the payment process was interrupted or cancelled. No
            funds have been deducted from your account.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild size="lg" className="rounded">
            <Link to="/funding">
              <RefreshCcw className="mr-2 w-5 h-5" /> Try Again
            </Link>
          </Button>

          <Button variant="outline" asChild size="lg" className="rounded">
            <Link to="/">
              <Home className="mr-2 w-5 h-5" /> Back to Home
            </Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground font-medium italic">
          Need help? Contact our support if you're facing technical issues.
        </p>
      </div>
    </Container>
  );
};

export default Cancel;
