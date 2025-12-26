const footerLinks = [
  { href: '#home', label: 'Home' },
  { href: '#rooms', label: 'Rooms' },
  { href: '#amenities', label: 'Amenities' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
];

const socialLinks = [
  { label: 'Instagram', icon: '📷' },
  { label: 'Facebook', icon: '📘' },
  { label: 'TripAdvisor', icon: '🌍' },
];

const Footer = () => {
  return (
    <footer className="relative bg-secondary text-secondary-foreground">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-ocean-light to-sand" />

      <div className="container-hotel py-12 lg:py-16">
        <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
          {/* Brand */}
          <div>
            <a href="#home" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-ocean flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-lg">AH</span>
              </div>
              <span className="font-serif text-xl font-semibold">
                Azure Horizon
              </span>
            </a>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed max-w-xs">
              A boutique beachfront escape where luxury meets tranquility. 
              Experience the perfect blend of modern comfort and natural beauty.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Stay Connected</h4>
            <div className="text-secondary-foreground/70 text-sm mb-6 space-y-1">
              <p>123 Oceanfront Boulevard</p>
              <p>Paradise Bay, Coastal Region 12345</p>
              <p className="pt-2">
                <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </p>
              <p>
                <a href="mailto:info@azurehorizon.com" className="hover:text-primary transition-colors">
                  info@azurehorizon.com
                </a>
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-secondary-foreground/10 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-secondary-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-secondary-foreground/50 text-sm">
            © 2025 Azure Horizon Hotel. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-secondary-foreground/50">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
