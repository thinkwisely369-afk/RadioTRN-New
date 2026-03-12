import { useEffect, useState } from "react";
import { stationsAPI } from "@/lib/api";

const Footer = () => {
  const [stationCount, setStationCount] = useState(0);

  useEffect(() => {
    const loadStationCount = async () => {
      try {
        const stations = await stationsAPI.getAll();
        setStationCount(stations.length);
      } catch (error) {
        console.error('Failed to load station count:', error);
      }
    };
    loadStationCount();
  }, []);

  return (
    <footer id="contact" className="bg-card border-t border-border py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img src="/TRN-White-512.png" alt="The Radio Network" className="h-12 mb-4" />
            <p className="text-muted-foreground max-w-md">
              The Perfect Match for your ears. {stationCount} unique station{stationCount !== 1 ? 's' : ''}, endless entertainment.
              Stream your favorite music anytime, anywhere.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/#stations" className="text-muted-foreground hover:text-primary transition-colors">All Stations</a></li>
              <li><a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Contact Information</h4>
            <div className="space-y-4 text-muted-foreground text-sm">
              <div>
                <p className="font-semibold text-foreground mb-1">Network Headquarters</p>
                <p>The Radio Network</p>
                <p>St. Asaph Street, Christchurch Central City,</p>
                <p>Christchurch 8011, New Zealand</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Prime Broadcast Studio</p>
                <p>The Radio Network - Media Complex,</p>
                <p>Malani Bulathsinghala Mawatha,</p>
                <p>Boralesgamuwa 10290, Sri Lanka</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Phone</p>
                <p>+64273234523 / +94784818188</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Email</p>
                <p>info@radiotrn.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} The Radio Network. All rights reserved.</p>
          <p className="mt-2 text-muted-foreground">The Radio Network – Part of B360 International (Pvt) Ltd.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
