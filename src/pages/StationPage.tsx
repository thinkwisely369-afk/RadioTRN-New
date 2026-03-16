import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Share2, Play, Pause, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StationCard from "@/components/StationCard";
import { stationsAPI, Station } from "@/lib/api";
import { useAudio } from "@/contexts/AudioContext";
import { toast } from "@/hooks/use-toast";
import PreflightCheck from "@/components/PreflightCheck";

const StationPage = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const [station, setStation] = useState<Station | null>(null);
  const [otherStations, setOtherStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWafChallenge, setIsWafChallenge] = useState(false);
  const { currentStation, isPlaying, playStation, togglePlay } = useAudio();

  const loadStation = async () => {
    setLoading(true);
    setIsWafChallenge(false);
    try {
      const identifier = id || slug;
      if (!identifier) return;

      // Fetch current station - check if it's a number (ID) or string (slug)
      let stationData: Station;
      if (!isNaN(Number(identifier))) {
        stationData = await stationsAPI.getById(parseInt(identifier));
      } else {
        stationData = await stationsAPI.getBySlug(identifier);
      }
      setStation(stationData);

      // Fetch other stations
      const allStations = await stationsAPI.getAll();
      setOtherStations(allStations.filter(s => s.id !== stationData.id).slice(0, 4));
    } catch (error: any) {
      if (error.message === 'WAF_CHALLENGE_DETECTED') {
        setIsWafChallenge(true);
      } else {
        console.error('Error loading station:', error);
        setStation(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStation();
  }, [id, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center w-full max-w-md">
          {isWafChallenge ? (
            <PreflightCheck onSuccess={loadStation} />
          ) : (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-4">Station not found</h1>
              <Link to="/" className="text-primary hover:underline">
                Go back home
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  const isCurrentStation = currentStation?.id === station.id;
  const isThisPlaying = isCurrentStation && isPlaying;

  const handlePlayClick = () => {
    if (isCurrentStation) {
      togglePlay();
    } else {
      playStation(station);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: `${station.name} - The Radio Network`,
        text: `Listen to ${station.name} on The Radio Network`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Station link has been copied to your clipboard.",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{station.name} - The Radio Network | {station.genre} Radio</title>
        <meta name="description" content={`Stream ${station.name} live on The Radio Network. ${station.tagline}. Free ${station.genre} music streaming 24/7.`} />
        <meta name="keywords" content={`${station.name}, ${station.genre} radio, online radio, streaming music, The Radio Network`} />
        <link rel="canonical" href={`https://theradionetwork.com/station/${station.id}`} />
      </Helmet>

      <div className="min-h-screen bg-background pb-24">
        <Header />

        {/* Hero with gradient */}
        <section
          className="pt-24 pb-12 md:pt-32 md:pb-16"
          style={{
            background: `linear-gradient(180deg, ${station.color}20 0%, hsl(var(--background)) 100%)`,
          }}
        >
          <div className="container mx-auto px-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft size={20} />
              Back to All Stations
            </Link>

            <div className="flex flex-col md:flex-row md:items-start gap-8">
              {/* Station Visual */}
              <div
                className="w-full md:w-72 aspect-square rounded-2xl overflow-hidden relative"
                style={{
                  background: `linear-gradient(135deg, ${station.color}cc 0%, ${station.color}66 100%)`,
                  boxShadow: `0 20px 60px ${station.color}4d`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {station.logoUrl ? (
                    <img
                      src={station.logoUrl}
                      alt={`${station.name} logo`}
                      className="w-full h-full object-contain p-8"
                    />
                  ) : isThisPlaying ? (
                    <div className="flex items-end gap-1 h-24">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className="w-3 bg-foreground/90 rounded-full animate-equalizer"
                          style={{
                            height: "100%",
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-end gap-1 h-24 opacity-50">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className="w-3 bg-foreground/90 rounded-full"
                          style={{ height: `${30 + (i % 3) * 25}%` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Station Info */}
              <div className="flex-1">
                <span
                  className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
                  style={{
                    background: `${station.color}33`,
                    color: station.color,
                  }}
                >
                  {station.genre}
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {station.name}
                </h1>
                <p className="text-xl text-muted-foreground mb-6">{station.tagline}</p>

                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={handlePlayClick}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 text-white"
                    style={{
                      background: station.color,
                      boxShadow: isThisPlaying ? `0 0 30px ${station.color}80` : 'none',
                    }}
                  >
                    {isThisPlaying ? (
                      <>
                        <Pause className="w-5 h-5 fill-current" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                        Play Now
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-full text-muted-foreground hover:text-foreground border border-border hover:border-foreground/30 transition-colors"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Station Description */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                About The Radio Network
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  The Radio Network is the official online platform representing our group of radio stations, offering a diverse range of entertainment for Sinhala, English, and Tamil audiences.
                </p>
                <p>
                  These stations form the heart of The Radio Network, working together to deliver a vibrant mix of music, entertainment, and culture to listeners everywhere. Whether you're tuning in for nonstop hits, timeless classics, or the latest chart-toppers, The Radio Network is your trusted destination for modern digital broadcasting connecting creators and audiences worldwide.
                </p>
                <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-2">
                  Our Mission
                </h3>
                <p>
                  At The Radio Network, our mission is to amplify voices, celebrate culture, and keep the rhythm alive, offering a seamless blend of Sinhala, English, and Tamil entertainment that moves with the modern world.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Other Stations */}
        {otherStations.length > 0 && (
          <section className="py-12 bg-card">
            <div className="container mx-auto px-4">
              <h2 className="font-display text-2xl font-bold text-foreground mb-8">
                Explore More Stations
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {otherStations.map((s, index) => (
                  <StationCard key={s.id} station={s} index={index} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  to="/#stations"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  View All Stations
                </Link>
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </>
  );
};

export default StationPage;
