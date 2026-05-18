import useAuth from "@/Hook/useAuth";
import ContactUs from "../Shared/ContactUs/ContactUs";
import Features from "../Shared/Feature/Feature";
import HowItWorks from "../Shared/HowItWorks/HowItWorks";
import Container from "../Shared/Responsive/Container";
import LoadingSpinner from "../Shared/Spinner/LoadingSpinner";
import VideoLikeHeroBanner from "@/components/VideoLikeHeroBanner/VideoLikeHeroBanner";
import OurVolunteers from "../Shared/OurVolunteers/OurVolunteers";
import AnimatedBackground from "@/components/AnimatedBackground/AnimatedBackground";
import LogoFollowLight from "@/components/LogoFollowLight";

const Home = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative">
    <LogoFollowLight />  {/* ✅ Koi wrapper nahi */}

      {/* HERO SECTION */}
      <VideoLikeHeroBanner />

      {/* MAIN CONTENT */}
      <AnimatedBackground>
        <div className="mt-5 md:mt-10">
          <Features />
          <OurVolunteers />
          <Container>
            <HowItWorks />
            <ContactUs />
          </Container>
        </div>
      </AnimatedBackground>
    </div>
  );
};

export default Home;
