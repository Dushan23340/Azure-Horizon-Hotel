import heroImage from '@/assets/hotel-hero.jpg';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 animate-float" />
        <div className="absolute top-40 right-20 w-20 h-20 rounded-full bg-sand/20 animate-float-slow animation-delay-300" />
        <div className="absolute bottom-40 left-1/4 w-16 h-16 rounded-full bg-ocean-light/20 animate-wave" />
        <div className="absolute bottom-20 right-1/3 w-24 h-24 rounded-full bg-primary/5 animate-float animation-delay-500" />
      </div>

      <div className="container-hotel relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="animate-fade-in-up opacity-0">
              <span className="pill-tag mb-6 inline-block">
                <span className="w-2 h-2 rounded-full bg-sand mr-2 inline-block animate-pulse-soft" />
                Beachfront · 5-Star Boutique
              </span>
            </div>

            <h1 className="animate-fade-in-up opacity-0 animation-delay-100 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-secondary leading-tight mb-6">
              Wake up to the{' '}
              <span className="text-gradient-ocean">Azure Horizon</span>
            </h1>

            <p className="animate-fade-in-up opacity-0 animation-delay-200 text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Experience luxury where the ocean meets the sky. Our boutique beachfront 
              retreat offers an unforgettable escape with world-class amenities, 
              stunning views, and personalized service.
            </p>

            <div className="animate-fade-in-up opacity-0 animation-delay-300 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#rooms" className="btn-primary">
                Check Availability
              </a>
              <a href="#rooms" className="btn-outline">
                View Rooms
              </a>
            </div>

            {/* Stats */}
            <div className="animate-fade-in-up opacity-0 animation-delay-400 mt-12 flex justify-center lg:justify-start gap-8">
              {[
                { value: '50+', label: 'Luxury Suites' },
                { value: '4.9', label: 'Guest Rating' },
                { value: '15+', label: 'Years Excellence' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="animate-fade-in-right opacity-0 animation-delay-200 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-medium">
              <img
                src={heroImage}
                alt="Azure Horizon Hotel beachfront view with infinity pool overlooking the ocean"
                className="w-full h-[400px] lg:h-[550px] object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent" />
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 lg:-left-12 bg-card rounded-2xl p-4 shadow-medium animate-float-slow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-ocean flex items-center justify-center">
                  <span className="text-primary-foreground text-xl">★</span>
                </div>
                <div>
                  <div className="font-semibold text-secondary">Best Beach Hotel</div>
                  <div className="text-sm text-muted-foreground">Travel Awards 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse-soft" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
