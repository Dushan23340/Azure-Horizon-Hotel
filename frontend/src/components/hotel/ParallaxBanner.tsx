import bannerImage from '@/assets/parallax-banner.jpg';

const ParallaxBanner = () => {
  return (
    <section
      className="relative py-24 lg:py-32 parallax-bg"
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/60" />

      {/* Content */}
      <div className="container-hotel relative z-10 text-center">
        <div className="animate-fade-in-up opacity-0">
          <span className="inline-block mb-4 text-sand font-medium tracking-wide uppercase text-sm">
            Limited Time Offer
          </span>
        </div>
        <h2 className="animate-fade-in-up opacity-0 animation-delay-100 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary-foreground mb-6">
          Book your stay at Azure Horizon today
        </h2>
        <p className="animate-fade-in-up opacity-0 animation-delay-200 text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
          Enjoy exclusive rates and complimentary upgrades when you book directly. 
          Your perfect beachfront escape awaits.
        </p>
        <div className="animate-fade-in-up opacity-0 animation-delay-300">
          <a
            href="#rooms"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold bg-sand text-secondary hover:bg-sand-light transition-all duration-300 hover:scale-105 shadow-medium"
          >
            Book Now
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ParallaxBanner;
