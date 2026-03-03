import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import AboutSection from "../components/AboutSection";
import CatalogSection from "../components/CatalogSection";
import FeaturedSection from "../components/FeaturedSection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import {
  useAllStickers,
  useFeaturedStickers,
  useSeedStickers,
  useStickersByCategory,
} from "../hooks/useQueries";

export default function ShopPage() {
  const { data: allStickers, isLoading: isLoadingAll } = useAllStickers();
  const seedStickers = useSeedStickers();
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (
      !isLoadingAll &&
      allStickers &&
      allStickers.length === 0 &&
      !seeded &&
      !seedStickers.isPending
    ) {
      setSeeded(true);
      seedStickers.mutate();
    }
  }, [allStickers, isLoadingAll, seeded, seedStickers]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedSection />
        <CatalogSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
