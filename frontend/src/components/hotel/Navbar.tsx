import { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#rooms', label: 'Rooms' },
  { href: '#amenities', label: 'Amenities' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#location', label: 'Location' },
  { href: '#contact', label: 'Contact' },
];

const Navbar = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-3 bg-card/90 backdrop-blur-lg shadow-soft'
          : 'py-5 bg-transparent'
      }`}
    >
      <nav className="container-hotel flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#home" 
          className="flex items-center gap-2"
          onClick={(e) => {
            if (window.location.pathname !== '/') {
              e.preventDefault();
              window.location.href = '/#home';
            }
          }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-ocean flex items-center justify-center">
            <span className="text-primary-foreground font-serif font-bold text-lg">AH</span>
          </div>
          <span className="font-serif text-xl font-semibold text-secondary hidden sm:block">
            Azure Horizon
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              className="nav-link text-sm"
              onClick={(e) => {
                if (window.location.pathname !== '/') {
                  e.preventDefault();
                  window.location.href = '/' + link.href;
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Authentication Buttons or User Profile */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 rounded-full flex items-center gap-2">
                  <span className="text-sm font-medium hidden md:block">
                    {user?.name}
                  </span>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                {user?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <a href="/user-dashboard?tab=bookings">Dashboard</a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <a href="/user-dashboard?tab=profile">Profile</a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsLoginModalOpen(true)}
              >
                Login
              </Button>
              <Button 
                size="sm" 
                onClick={() => setIsRegisterModalOpen(true)}
              >
                Register
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-secondary hover:text-primary transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-lg shadow-medium overflow-hidden transition-all duration-400 ${
          isMobileMenuOpen ? 'max-h-[400px] py-4' : 'max-h-0'
        }`}
      >
        <div className="container-hotel flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link py-2 text-center"
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                if (window.location.pathname !== '/') {
                  e.preventDefault();
                  window.location.href = '/' + link.href;
                }
              }}
            >
              {link.label}
            </a>
          ))}
          {isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <a href="/user-dashboard" className="btn-primary text-center">
                Dashboard
              </a>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={logout}
              >
                Log out
              </Button>
            </div>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setIsLoginModalOpen(true)}
              >
                Login
              </Button>
              <Button 
                className="w-full" 
                onClick={() => setIsRegisterModalOpen(true)}
              >
                Register
              </Button>
              <a 
                href="#rooms" 
                className="btn-primary text-center mt-2"
                onClick={(e) => {
                  if (window.location.pathname !== '/') {
                    e.preventDefault();
                    window.location.href = '/#rooms';
                  }
                }}
              >
                Book Now
              </a>
            </>
          )}
        </div>
      </div>
    </header>
    
    {/* Authentication Modals */}
    <LoginModal 
      isOpen={isLoginModalOpen} 
      onClose={() => setIsLoginModalOpen(false)} 
      onSwitchToRegister={() => {
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(true);
      }}
    />
    <RegisterModal 
      isOpen={isRegisterModalOpen} 
      onClose={() => setIsRegisterModalOpen(false)} 
      onSwitchToLogin={() => {
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(true);
      }}
    />
    </>
  );
};

export default Navbar;
