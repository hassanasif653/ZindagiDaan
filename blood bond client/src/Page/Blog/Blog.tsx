/* eslint-disable react-hooks/purity */
import React, { useState, useMemo } from "react";
import {
  Filter,
  Calendar,
  User,
  BookOpen,
  Clock,
  Share2,
  Heart,
  Search,
  TrendingUp,
  Tag,
  ArrowRight,
  Eye,
  Bookmark,
  Mail,
  Rss,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { BlogPost } from "@/types/blog";
import mockBlogPosts from "@/Data/MockBlogPosts/MockBlogPosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import LogoFollowLight from "@/components/LogoFollowLight";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Container from "../Shared/Responsive/Container";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// Get unique categories for filtering
const allCategories = [
  "All",
  ...Array.from(new Set(mockBlogPosts.map((post) => post.category))),
];

// Get popular tags
const popularTags = [
  "Blood Donation",
  "Health Tips",
  "Donor Stories",
  "Emergency",
  "Medical",
  "Community",
  "First Aid",
  "Blood Types",
];

// --- [ Individual Blog Card Component ] ---
const BlogCard: React.FC<{ post: BlogPost; index?: number }> = ({
  post,
  index = 0,
}) => (
  <Card
    className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col"
    data-aos="fade-up"
    data-aos-delay={index * 50}>
    <Link to={`/blog/${post.slug}`} className="block">
      {/* Image Section */}
      <div className="h-48 overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
    </Link>

    <CardContent className="p-5 space-y-3 flex-1 flex flex-col">
      {/* Category Badge */}
      <Badge variant="secondary" className="w-fit">
        {post.category}
      </Badge>

      {/* Title and Excerpt */}
      <div className="flex-1">
        <Link to={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-foreground line-clamp-2 hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-3 mt-2">
          {post.excerpt}
        </p>
      </div>

      {/* Meta Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
        <div className="flex items-center gap-3">
          <span className="flex items-center">
            <User className="w-3 h-3 mr-1" /> {post.author}
          </span>
          <span className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" /> {post.date}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />{" "}
            {Math.ceil(post.excerpt.length / 10)} min read
          </span>
          <span className="flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            {Math.floor(Math.random() * 1000) + 100}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Heart className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Bookmark className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
        <Button variant="link" size="sm" className="h-8 p-0">
          Read More <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [postsToShow, setPostsToShow] = useState(6);

  // --- [ Filtering Logic ] ---
  const filteredPosts = useMemo(() => {
    let posts = mockBlogPosts;

    // Filter by category
    if (selectedCategory !== "All") {
      posts = posts.filter((post) => post.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return posts;
  }, [selectedCategory, searchTerm]);
  

  // Get posts to display (with pagination)
  const displayedPosts = filteredPosts.slice(0, postsToShow);
  const hasMorePosts = filteredPosts.length > postsToShow;

  const featuredPost = mockBlogPosts[0]; // Assuming the latest post is the featured one
  const popularPosts = mockBlogPosts.slice(1, 4); // Get next 3 posts for sidebar

  return (
    <div className="relative">
    <LogoFollowLight />
    <Container>
      <div className="space-y-16">
        {/* --- [ 1. Header & Featured Post Banner ] --- */}
        <div className="text-center pb-4 border-b border-border">
          <h1
            className="text-5xl font-extrabold text-primary mb-4 flex items-center justify-center"
            data-aos="fade-up">
            <BookOpen className="w-10 h-10 mr-3 text-destructive" />{" "}
            BloodConnect Blog
          </h1>
          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100">
            Latest articles on health, donation facts, and community stories.
          </p>
        </div>

        {/* --- [ 2. Featured Post Section ] --- */}
        {featuredPost && (
          <div
            className="bg-linear-to-br from-card to-card/50 rounded-xl shadow-lg border border-border overflow-hidden"
            data-aos="fade-up"
            data-aos-delay="200">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 overflow-hidden">
                <img
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="lg:w-1/2 p-8 lg:p-10 space-y-4">
                <Badge variant="destructive" className="w-fit">
                  Featured Article
                </Badge>
                <Link to={`/blog/${featuredPost.slug}`}>
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                </Link>
                <p className="text-lg text-muted-foreground line-clamp-4">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${featuredPost.author}`}
                      alt={featuredPost.author}
                    />
                    <AvatarFallback>
                      {featuredPost.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{featuredPost.author}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />{" "}
                        {featuredPost.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />{" "}
                        {Math.ceil(featuredPost.excerpt.length / 10)} min read
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Link to={`/blog/${featuredPost.slug}`}>
                    <Button>
                      Read Full Article <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* --- [ 3. Main Content Area ] --- */}
          <div className="lg:col-span-3 space-y-8">
            {/* Search and Filter Section */}
            <div className="space-y-4">
              <h2
                className="text-3xl font-bold text-foreground"
                data-aos="fade-up">
                Latest Insights
              </h2>

              {/* Search Bar */}
              <div className="relative" data-aos="fade-up" data-aos-delay="100">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Buttons */}
              <div
                className="flex flex-wrap items-center gap-2 p-4 bg-card/50 rounded-lg border border-border"
                data-aos="fade-up"
                data-aos-delay="200">
                <Filter className="w-5 h-5 text-primary shrink-0" />
                {allCategories.map((cat) => (
                  <Button
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="rounded-full">
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Blog Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedPosts.length > 0 ? (
                displayedPosts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-lg text-muted-foreground">
                    No articles found matching your criteria.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearchTerm("");
                    }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Load More Button */}
            {hasMorePosts && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => setPostsToShow(postsToShow + 3)}
                  data-aos="fade-up">
                  Load More Articles
                </Button>
              </div>
            )}
          </div>

          {/* --- [ 4. Sidebar ] --- */}
          <div className="space-y-6">
            {/* Newsletter Signup */}
            <Card data-aos="fade-left">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-primary" />
                  Newsletter
                </CardTitle>
                <CardDescription>
                  Subscribe to get the latest articles delivered to your inbox
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Your email address" />
                <Button className="w-full">Subscribe</Button>
              </CardContent>
            </Card>

            {/* Popular Posts */}
            <Card data-aos="fade-left" data-aos-delay="100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Popular Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {popularPosts.map((post) => (
                  <div key={post.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded overflow-hidden shrink-0">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Link to={`/blog/${post.slug}`}>
                        <h4 className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors">
                          {post.title}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card data-aos="fade-left" data-aos-delay="200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-primary" />
                  Popular Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card data-aos="fade-left" data-aos-delay="300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="w-5 h-5 mr-2 text-primary" />
                  Follow Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <FaFacebook className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <FaXTwitter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <FaLinkedin className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Rss className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
    </div>
  );
};

export default Blog;
