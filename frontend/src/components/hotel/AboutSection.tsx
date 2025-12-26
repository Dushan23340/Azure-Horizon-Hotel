import { Waves, Sparkles, UtensilsCrossed } from 'lucide-react';

const highlights = [
  {
    icon: Waves,
    title: 'Private Beach Access',
    description: 'Exclusive beachfront with pristine white sand and crystal-clear waters.',
  },
  {
    icon: Sparkles,
    title: 'Infinity Rooftop Pool',
    description: 'Swim in the clouds with panoramic ocean views from our stunning pool.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Gourmet Seaside Dining',
    description: 'World-class cuisine with fresh seafood and sunset views.',
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-card">
      <div className="container-hotel">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-left opacity-0">
            <span className="pill-tag mb-4">Our Story</span>
            <h2 className="section-title">
              A modern escape by the sea
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Nestled along the pristine coastline, Azure Horizon Hotel is a sanctuary 
              where contemporary luxury meets natural beauty. Our boutique property has 
              been thoughtfully designed to create an immersive experience that celebrates 
              the stunning seascape while providing world-class comfort.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you're seeking a romantic getaway, a family adventure, or a moment 
              of tranquil solitude, our dedicated team ensures every detail exceeds 
              expectations. From sunrise yoga on the beach to moonlit dinners by the water, 
              every moment at Azure Horizon is crafted to inspire and rejuvenate.
            </p>
          </div>

          {/* Right Content - Highlights */}
          <div className="space-y-6 stagger-children">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="animate-fade-in-up opacity-0 group flex items-start gap-5 p-5 rounded-2xl bg-background hover:bg-primary/5 transition-all duration-400 cursor-pointer hover:translate-x-2 hover:shadow-soft"
                  style={{ animationDelay: `${(index + 1) * 0.15}s` }}
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-ocean flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-secondary mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
