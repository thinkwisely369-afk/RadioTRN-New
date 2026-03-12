import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Radio, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StationCard from "@/components/StationCard";
import InstallPrompt from "@/components/InstallPrompt";
import { stationsAPI, Station } from "@/lib/api";

const Index = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStations = async () => {
      try {
        const data = await stationsAPI.getAll();
        setStations(data);
      } catch (err) {
        setError('Failed to load stations');
        console.error('Error loading stations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  const stationCount = stations.length;
  const pageTitle = `The Radio Network - The Perfect Match | ${stationCount} Online Radio Stations`;
  const pageDescription = `Stream ${stationCount} unique online radio stations for free. From pop hits to classical, jazz to hip hop - find your perfect match at The Radio Network.`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="online radio, streaming radio, music stations, free radio, The Radio Network" />
        <link rel="canonical" href="https://theradionetwork.com" />
      </Helmet>

      <div className="min-h-screen bg-background pb-24">
        <Header />

        {/* Hero Section */}
        <section className="bg-hero min-h-[80vh] flex items-center justify-center pt-20">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <img
                src="/TRN-White-512.png"
                alt="The Radio Network"
                className="h-24 md:h-32 mx-auto mb-8 animate-fade-in"
              />
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
                Your Sound, <span className="text-gradient">Your Way</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 animate-fade-in" style={{ animationDelay: "200ms" }}>
                {loading ? 'Loading' : stations.length} unique station{stations.length !== 1 ? 's' : ''}. One perfect match. Stream free, anytime.
              </p>
              <a
                href="#stations"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 glow animate-fade-in"
                style={{ animationDelay: "300ms" }}
              >
                <Radio size={24} />
                Explore Stations
              </a>
            </div>
          </div>
        </section>

        {/* Stations Grid */}
        <section id="stations" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Stations
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                From chart-topping hits to chill vibes, discover your new favorite station
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {loading ? (
                <div className="col-span-full flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="col-span-full text-center py-12 text-red-500">
                  {error}
                </div>
              ) : stations.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No stations available yet.
                </div>
              ) : (
                stations.map((station, index) => (
                  <StationCard key={station.id} station={station} index={index} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                About The Radio Network
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                The Radio Network is the official online platform representing our group of radio stations, offering a diverse range of entertainment for Sinhala, English, and Tamil audiences.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                These stations form the heart of The Radio Network, working together to deliver a vibrant mix of music, entertainment, and culture to listeners everywhere. Whether you're tuning in for nonstop hits, timeless classics, or the latest chart-toppers, The Radio Network is your trusted destination for modern digital broadcasting connecting creators and audiences worldwide.
              </p>
              <h3 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">
                Our Mission
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                At The Radio Network, our mission is to amplify voices, celebrate culture, and keep the rhythm alive, offering a seamless blend of Sinhala, English, and Tamil entertainment that moves with the modern world.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <InstallPrompt />
    </>
  );
};

export default Index;
