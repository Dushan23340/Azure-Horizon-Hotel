const testimonials = [
  {
    name: 'Sarah Mitchell',
    location: 'New York, USA',
    rating: 5,
    review:
      'Absolutely breathtaking experience! The ocean view from our suite was spectacular, and the staff went above and beyond to make our anniversary unforgettable.',
    avatar: 'SM',
  },
  {
    name: 'James Chen',
    location: 'Singapore',
    rating: 5,
    review:
      'The perfect blend of luxury and relaxation. The infinity pool at sunset is a must-experience, and the seafood at their restaurant is simply divine.',
    avatar: 'JC',
  },
  {
    name: 'Emma Rodriguez',
    location: 'Barcelona, Spain',
    rating: 5,
    review:
      "We've stayed at many boutique hotels, but Azure Horizon sets a new standard. The attention to detail and personalized service made us feel truly special.",
    avatar: 'ER',
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? 'text-sand' : 'text-muted'}`}
      >
        ★
      </span>
    ))}
  </div>
);

const TestimonialsSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="container-hotel">
        {/* Header */}
        <div className="text-center mb-14 animate-fade-in-up opacity-0">
          <span className="pill-tag mb-4">Reviews</span>
          <h2 className="section-title mx-auto">What guests say</h2>
          <p className="section-subtitle mx-auto">
            Real stories from travelers who have experienced the Azure Horizon difference.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 stagger-children">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="animate-fade-in-up opacity-0 bg-background rounded-2xl p-6 lg:p-8 shadow-soft hover:shadow-medium transition-all duration-400 hover:-translate-y-2"
              style={{
                animationDelay: `${(index + 1) * 0.15}s`,
                animationName: index === 0 ? 'fadeInLeft' : index === 2 ? 'fadeInRight' : 'fadeInUp',
              }}
            >
              <StarRating rating={testimonial.rating} />
              <p className="text-muted-foreground my-5 leading-relaxed italic">
                "{testimonial.review}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-ocean flex items-center justify-center text-primary-foreground font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-serif font-semibold text-secondary">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
