import React from "react";
import { Calendar, User, ArrowRight, BellRing, Share2 } from "lucide-react";
import Container from "@/Page/Shared/Responsive/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const NewsUpdates: React.FC = () => {
  const newsItems = [
    {
      title: "Nationwide Blood Donation Drive: Winter 2024",
      category: "Event",
      date: "Dec 15, 2024",
      author: "Admin",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOs3K_1xOje-7oewZFI3zW0aLjMj-tQNTx3A&s",
      excerpt:
        "Join us this winter as we aim to collect 5000+ units of blood across major cities in Pakistan.",
    },
    {
      title: "New AI Matching Algorithm Launched",
      category: "Tech Update",
      date: "Nov 28, 2024",
      author: "Tech Team",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOs3K_1xOje-7oewZFI3zW0aLjMj-tQNTx3A&s",
      excerpt:
        "Our new algorithm reduces the time to find rare blood group donors by 40% using geospatial data.",
    },
    {
      title: "Success Story: Saving a Life in 30 Minutes",
      category: "Success Story",
      date: "Nov 12, 2024",
      author: "Community",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOs3K_1xOje-7oewZFI3zW0aLjMj-tQNTx3A&s",
      excerpt:
        "Read how our instant alert system helped a patient in Karachi receive O-negative blood in record time.",
    },
  ];

  return (
    <div className="min-h-screen text-foreground">
      <Container>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-border pb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-primary font-bold mb-4">
              <BellRing size={20} className="animate-bounce" />
              <span className="uppercase tracking-[2px] text-xs">
                Stay Informed
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
              News & <span className="text-primary">Updates</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-lg">
              Get the latest information about our donation camps, medical
              research, and success stories from the community.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              All News
            </Button>
            <Button variant="ghost" size="sm">
              Events
            </Button>
            <Button variant="ghost" size="sm">
              Medical
            </Button>
          </div>
        </div>

        {/* Featured News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {newsItems.map((news, idx) => (
            <article
              key={idx}
              className="group bg-card/40 border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-all flex flex-col">
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground border-none">
                  {news.category}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {news.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={14} /> {news.author}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug">
                  {news.title}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
                  {news.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary font-bold gap-2 group/btn">
                    Read More{" "}
                    <ArrowRight
                      size={16}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </Button>
                  <button className="text-muted-foreground hover:text-primary transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="bg-primary p-1 rounded-lg">
          <div className="bg-background rounded-[calc(var(--radius)-4px)] p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-black mb-2 tracking-tight">
                Subscribe to our newsletter
              </h2>
              <p className="text-muted-foreground">
                Receive weekly updates on donation camps and health tips
                directly in your inbox.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <Input type="email" placeholder="Enter your email" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NewsUpdates;
