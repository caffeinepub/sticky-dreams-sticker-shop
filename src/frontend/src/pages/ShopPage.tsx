import AboutSection from "../components/AboutSection";
import BrandValuesSection from "../components/BrandValuesSection";
import CatalogSection from "../components/CatalogSection";
import FeaturedSection from "../components/FeaturedSection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedSection />
        <CatalogSection />
        <AboutSection />
        <BrandValuesSection />
      </main>
      <Footer />
    </div>
  );
}
