import { MapPin, Plane, Umbrella, ShoppingBag, Mountain } from 'lucide-react';

const nearbyAttractions = [
  { icon: Umbrella, text: '5 min walk to main beach' },
  { icon: Plane, text: '20 min from international airport' },
  { icon: ShoppingBag, text: '10 min to shopping district' },
  { icon: Mountain, text: '30 min to nature reserve' },
];

const LocationSection = () => {
  return (
    <section id="location" className="py-20 lg:py-28 bg-background">
      <div className="container-hotel">
        {/* Header */}
        <div className="text-center mb-14 animate-fade-in-up opacity-0">
          <span className="pill-tag mb-4">Find Us</span>
          <h2 className="section-title mx-auto">Location</h2>
          <p className="section-subtitle mx-auto">
            Perfectly positioned for both relaxation and exploration.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-left opacity-0">
            <h3 className="font-serif text-2xl font-semibold text-secondary mb-4">
              Azure Horizon Hotel
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              123 Oceanfront Boulevard<br />
              Paradise Bay, Coastal Region 12345<br />
              United States
            </p>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our prime beachfront location offers easy access to the area's most 
              stunning attractions while providing a peaceful retreat from the everyday. 
              Whether you're looking to explore local culture or simply unwind by the sea, 
              everything is within reach.
            </p>

            <div className="space-y-4">
              {nearbyAttractions.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.text}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-gradient-ocean transition-all duration-300">
                      <Icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <span className="text-foreground">{item.text}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="tel:+1234567890" className="btn-outline text-sm">
                Call Us
              </a>
              <a href="mailto:info@azurehorizon.com" className="btn-outline text-sm">
                Email Us
              </a>
            </div>
          </div>

          {/* Right Content - Map Placeholder */}
          <div className="animate-fade-in-right opacity-0 animation-delay-200">
            <div className="relative rounded-3xl overflow-hidden bg-muted h-[400px] lg:h-[500px] shadow-soft">
              {/* Decorative map-like pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-ocean-light/20" />
                <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border-2 border-primary/30" />
                <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full border-2 border-primary/20" />
                <div className="absolute bottom-1/4 left-1/3 w-24 h-24 rounded-full border-2 border-primary/25" />
                {/* Grid lines */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }} />
              </div>

              {/* Center pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="relative">
                  <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full animate-pulse-soft -m-2" />
                  <div className="w-12 h-12 rounded-full bg-gradient-ocean flex items-center justify-center mx-auto shadow-glow animate-bounce">
                    <MapPin className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <div className="mt-4 px-4 py-2 bg-card rounded-lg shadow-soft">
                  <span className="font-serif font-semibold text-secondary text-sm">
                    Azure Horizon Hotel
                  </span>
                </div>
              </div>

              {/* Map frame label */}
              <div className="absolute bottom-4 right-4 px-4 py-2 bg-card/90 backdrop-blur-sm rounded-lg text-sm text-muted-foreground">
                Interactive map coming soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
