import {
  Waves,
  Sparkles,
  UtensilsCrossed,
  Wifi,
  Car,
  Dumbbell,
  Users,
  Clock,
} from 'lucide-react';

const amenities = [
  { icon: Waves, label: 'Infinity Pool', description: 'Rooftop pool with ocean views' },
  { icon: Sparkles, label: 'Spa & Wellness', description: 'Full-service relaxation center' },
  { icon: UtensilsCrossed, label: 'Fine Dining', description: 'Award-winning restaurant' },
  { icon: Wifi, label: 'High-Speed Wi-Fi', description: 'Complimentary throughout' },
  { icon: Car, label: 'Airport Transfer', description: 'Luxury vehicle service' },
  { icon: Dumbbell, label: 'Fitness Studio', description: '24/7 equipped gym' },
  { icon: Users, label: 'Meeting Lounge', description: 'Private event spaces' },
  { icon: Clock, label: '24/7 Concierge', description: 'Personalized assistance' },
];

const AmenitiesSection = () => {
  return (
    <section id="amenities" className="py-20 lg:py-28 bg-card">
      <div className="container-hotel">
        {/* Header */}
        <div className="text-center mb-14 animate-fade-in-up opacity-0">
          <span className="pill-tag mb-4">Experiences</span>
          <h2 className="section-title mx-auto">Amenities & Experiences</h2>
          <p className="section-subtitle mx-auto">
            Every comfort and convenience at your fingertips, designed to elevate 
            your stay to extraordinary.
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 stagger-children">
          {amenities.map((amenity, index) => {
            const Icon = amenity.icon;
            return (
              <div
                key={amenity.label}
                className="animate-fade-in-up opacity-0 group p-6 rounded-2xl bg-background hover:bg-gradient-ocean transition-all duration-400 cursor-pointer text-center hover:shadow-medium hover:-translate-y-1"
                style={{ animationDelay: `${(index + 1) * 0.08}s` }}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 group-hover:bg-primary-foreground/20 flex items-center justify-center transition-all duration-300">
                  <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-secondary group-hover:text-primary-foreground mb-1 transition-colors">
                  {amenity.label}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/80 transition-colors">
                  {amenity.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
