import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - The Radio Network</title>
        <meta name="description" content="Privacy Policy for The Radio Network - Learn how we collect, use, and protect your information." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground mb-8">
              Last Updated: December 27, 2025
            </p>

            <div className="prose prose-invert max-w-none space-y-6">
              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to The Radio Network ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website radiotrn.com and use our radio streaming services.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>

                <h3 className="font-display text-xl font-semibold text-foreground mb-2">2.1 Information You Provide</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may collect information that you voluntarily provide to us, including:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Contact information (name, email address, phone number) when you contact us</li>
                  <li>Feedback and correspondence when you communicate with us</li>
                  <li>Any other information you choose to provide</li>
                </ul>

                <h3 className="font-display text-xl font-semibold text-foreground mb-2">2.2 Automatically Collected Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you access our services, we automatically collect certain information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Device information (device type, operating system, browser type)</li>
                  <li>IP address and general location information</li>
                  <li>Usage data (pages visited, time spent, stations listened to)</li>
                  <li>Audio streaming data (buffering, playback quality)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>To provide and maintain our radio streaming services</li>
                  <li>To improve and optimize our website and user experience</li>
                  <li>To respond to your inquiries and provide customer support</li>
                  <li>To analyze usage patterns and improve our station offerings</li>
                  <li>To send administrative information and service updates</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">4. Cookies and Tracking Technologies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to enhance your experience:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for basic site functionality and audio playback</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
                  <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  You can control cookie settings through your browser, but note that disabling cookies may affect site functionality.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">5. Information Sharing and Disclosure</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our website and services</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">6. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">7. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Depending on your location, you may have the following rights:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Access to your personal information</li>
                  <li>Correction of inaccurate data</li>
                  <li>Deletion of your personal information</li>
                  <li>Objection to or restriction of processing</li>
                  <li>Data portability</li>
                  <li>Withdrawal of consent</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  To exercise these rights, please contact us at info@radiotrn.com
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">8. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">9. International Data Transfers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">10. Changes to This Privacy Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">11. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <p className="text-foreground font-semibold mb-2">The Radio Network</p>
                  <p className="text-muted-foreground">Part of B360 International (Pvt) Ltd.</p>
                  <p className="text-muted-foreground mt-4">
                    <strong>Email:</strong> info@radiotrn.com<br />
                    <strong>Phone:</strong> +64273234523 / +94784818188
                  </p>
                  <p className="text-muted-foreground mt-4">
                    <strong>Network Headquarters:</strong><br />
                    St. Asaph Street, Christchurch Central City<br />
                    Christchurch 8011, New Zealand
                  </p>
                  <p className="text-muted-foreground mt-4">
                    <strong>Prime Broadcast Studio:</strong><br />
                    The Radio Network - Media Complex<br />
                    Malani Bulathsinghala Mawatha<br />
                    Boralesgamuwa 10290, Sri Lanka
                  </p>
                </div>
              </section>

              <div className="mt-12 pt-8 border-t border-border">
                <Link to="/" className="text-primary hover:underline">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
