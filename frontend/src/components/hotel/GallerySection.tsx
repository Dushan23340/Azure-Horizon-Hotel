import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import gallery6 from '@/assets/gallery-6.jpg';

const galleryImages = [
  { src: gallery1, alt: 'Luxurious hotel lobby with ocean views', label: 'Lobby' },
  { src: gallery2, alt: 'Infinity pool overlooking the beach at sunset', label: 'Pool' },
  { src: gallery3, alt: 'Elegant fine dining restaurant', label: 'Restaurant' },
  { src: gallery4, alt: 'Beachfront sunset view from hotel terrace', label: 'Beach' },
  { src: gallery5, alt: 'Spa and wellness treatment room', label: 'Spa' },
  { src: gallery6, alt: 'Premium hotel suite bedroom', label: 'Suite' },
];

const GallerySection = () => {
  return (
    <section id="gallery" className="py-20 lg:py-28 bg-muted/50">
      <div className="container-hotel">
        {/* Header */}
        <div className="text-center mb-14 animate-fade-in-up opacity-0">
          <span className="pill-tag mb-4">Visual Tour</span>
          <h2 className="section-title mx-auto">Gallery</h2>
          <p className="section-subtitle mx-auto">
            Explore the beauty of Azure Horizon through our curated collection of moments.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 stagger-children">
          {galleryImages.map((image, index) => (
            <div
              key={image.label}
              className={`animate-fade-in-up opacity-0 group relative rounded-2xl overflow-hidden cursor-pointer ${
                index === 0 || index === 3 ? 'md:row-span-2 h-64 md:h-full' : 'h-48 md:h-56'
              }`}
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/60 transition-all duration-400 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-400 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                  <span className="text-primary-foreground font-medium text-lg">
                    {image.label}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
