import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);

    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    setIsMenuOpen(false);

    // If already on home page, scroll to top
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // If on another page, navigate to home (default Link behavior)
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src="/TRN-White-512.png" alt="The Radio Network" className="h-10 md:h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" onClick={handleHomeClick} className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <button
              onClick={() => scrollToSection('stations')}
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Stations
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Contact
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={handleHomeClick}
                className="text-foreground/80 hover:text-primary transition-colors font-medium py-2"
              >
                Home
              </Link>
              <button
                onClick={() => scrollToSection('stations')}
                className="text-foreground/80 hover:text-primary transition-colors font-medium py-2 text-left"
              >
                Stations
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-foreground/80 hover:text-primary transition-colors font-medium py-2 text-left"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-foreground/80 hover:text-primary transition-colors font-medium py-2 text-left"
              >
                Contact
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
