import LandingHeader from "./components/LandingHeader";
import HeroSection from "./components/HeroSection";
import BenefitsSection from "./components/BenefitsSection";
import ArtistSection from "./components/ArtistSection";
import RitualSection from "./components/RitualSection";
import CommunitySection from "./components/CommunitySection";
import LandingCta from "./components/LandingCta";
import LandingFooter from "./components/LandingFooter";

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-clip">
      <LandingHeader />
      <main>
        <HeroSection />
        <BenefitsSection />
        <ArtistSection />
        <RitualSection />
        <CommunitySection />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
