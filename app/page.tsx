import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import FeatureSection from "@/components/feature-section";
import TestimonialsSection from "@/components/testimonials";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <HeroSection />
        <FeatureSection />
        <TestimonialsSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
