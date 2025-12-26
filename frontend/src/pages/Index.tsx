import Navbar from '@/components/hotel/Navbar';
import HeroSection from '@/components/hotel/HeroSection';
import AboutSection from '@/components/hotel/AboutSection';
import RoomsSection from '@/components/hotel/RoomsSection';
import AmenitiesSection from '@/components/hotel/AmenitiesSection';
import ParallaxBanner from '@/components/hotel/ParallaxBanner';
import GallerySection from '@/components/hotel/GallerySection';
import TestimonialsSection from '@/components/hotel/TestimonialsSection';
import LocationSection from '@/components/hotel/LocationSection';
import ContactSection from '@/components/hotel/ContactSection';
import Footer from '@/components/hotel/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <RoomsSection />
        <AmenitiesSection />
        <ParallaxBanner />
        <GallerySection />
        <TestimonialsSection />
        <LocationSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
