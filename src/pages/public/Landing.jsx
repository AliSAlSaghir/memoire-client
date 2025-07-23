import FeatureSection from "../../components/FeatureSection";
import FutureMessage from "../../components/FutureMessage";
import HeroSection from "../../components/HeroSection";

const Landing = () => {
  return (
    <>
      <HeroSection />
      <FutureMessage />
      <FeatureSection
        title="Discover the Wall of Memories"
        description="Explore messages from users around the world. Dive into the shared past and future memories stored safely in Memoire."
        imageUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
        buttonText="View Capsules Wall"
        buttonLink="/wall"
        reversed={false}
      />
      <FeatureSection
        title="Create Your Own Capsule"
        description="Send a message to your future self or someone special. Set the delivery date and keep your memories alive."
        imageUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
        buttonText="Create Capsule"
        buttonLink="/create"
        reversed={true}
      />
    </>
  );
};

export default Landing;
