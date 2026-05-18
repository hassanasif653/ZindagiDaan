import React from "react";
import { Flag, ShieldAlert, FileText, AlertTriangle } from "lucide-react";
import Container from "@/Page/Shared/Responsive/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Report: React.FC = () => {
  return (
    <div className="min-h-screen text-foreground">
      <Container>
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
              <ShieldAlert className="text-primary" size={40} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Report an <span className="text-primary">Issue</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Help us maintain the integrity of our community. If you encounter
            any misleading information or technical bugs, please let us know.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar Guidelines */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 bg-card/50 border border-border rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary" /> Guidelines
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <span className="font-bold text-primary">01.</span>
                  Be specific about the issue or user you are reporting.
                </li>
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <span className="font-bold text-primary">02.</span>
                  False reporting may lead to account temporary suspension.
                </li>
                <li className="flex gap-3 text-sm text-muted-foreground">
                  <span className="font-bold text-primary">03.</span>
                  Our team will review your report within 24-48 hours.
                </li>
              </ul>
            </div>

            <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2 text-primary font-bold">
                <AlertTriangle size={18} /> Emergency?
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If this is a medical emergency or life-threatening situation,
                please contact local emergency services immediately.
              </p>
            </div>
          </div>

          {/* Report Form using Shadcn components */}
          <div className="lg:col-span-2">
            <div className="p-8 bg-card/50 border border-secondary rounded-lg shadow-sm">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Select */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Report Category</Label>
                    <Select>
                      <SelectTrigger id="category" className="bg-background">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fraud">
                          Fraudulent Request
                        </SelectItem>
                        <SelectItem value="misconduct">
                          User Misconduct
                        </SelectItem>
                        <SelectItem value="bug">Technical Bug</SelectItem>
                        <SelectItem value="info">Inaccurate Info</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reference ID Input */}
                  <div className="space-y-2">
                    <Label htmlFor="refId">Reference ID (Optional)</Label>
                    <Input
                      id="refId"
                      placeholder="#REQ-12345"
                      className="bg-background"
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief summary of the issue"
                    className="bg-background"
                  />
                </div>

                {/* Description Textarea */}
                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the situation in detail..."
                    className="bg-background min-h-[150px]"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button className="w-full md:w-auto px-10 gap-2 flex items-center group">
                    Submit Report
                    <Flag
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Report;
