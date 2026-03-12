import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - The Radio Network</title>
        <meta name="description" content="Terms of Service for The Radio Network - Read our terms and conditions for using our radio streaming services." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Terms of Service
            </h1>
            <p className="text-muted-foreground mb-8">
              Last Updated: December 27, 2025
            </p>

            <div className="prose prose-invert max-w-none space-y-6">
              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to The Radio Network. By accessing or using our website at radiotrn.com and our radio streaming services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">2. Description of Services</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The Radio Network provides free online radio streaming services featuring multiple stations with diverse music genres and content in Sinhala, English, and Tamil languages. Our Services include:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Live audio streaming of radio stations</li>
                  <li>Access to station information and schedules</li>
                  <li>Progressive Web App (PWA) for mobile and desktop devices</li>
                  <li>Background playback capabilities</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">3. User Obligations</h2>

                <h3 className="font-display text-xl font-semibold text-foreground mb-2">3.1 Acceptable Use</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree NOT to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Use the Services in any way that violates applicable laws or regulations</li>
                  <li>Attempt to gain unauthorized access to our systems or networks</li>
                  <li>Interfere with or disrupt the Services or servers</li>
                  <li>Use automated systems to access the Services without permission</li>
                  <li>Record, download, or redistribute our audio streams without authorization</li>
                  <li>Remove or modify any copyright, trademark, or proprietary notices</li>
                  <li>Use the Services for any commercial purposes without our written consent</li>
                </ul>

                <h3 className="font-display text-xl font-semibold text-foreground mb-2">3.2 Age Requirement</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You must be at least 13 years old to use our Services. If you are under 18, you must have permission from a parent or guardian.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">4. Intellectual Property Rights</h2>

                <h3 className="font-display text-xl font-semibold text-foreground mb-2">4.1 Our Content</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All content on our Services, including but not limited to text, graphics, logos, audio clips, digital downloads, and software, is the property of The Radio Network or its content suppliers and is protected by international copyright laws.
                </p>

                <h3 className="font-display text-xl font-semibold text-foreground mb-2">4.2 Music Rights</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We hold the necessary licenses for the music and content we broadcast. All music, audio content, and broadcasts are protected by copyright and other intellectual property rights.
                </p>

                <h3 className="font-display text-xl font-semibold text-foreground mb-2">4.3 Limited License</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We grant you a limited, non-exclusive, non-transferable license to access and use our Services for personal, non-commercial purposes only.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">5. Service Availability</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We strive to provide continuous service, but we do not guarantee that our Services will be:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Available at all times or uninterrupted</li>
                  <li>Free from errors, bugs, or viruses</li>
                  <li>Secure or free from unauthorized access</li>
                  <li>Compatible with all devices or networks</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We reserve the right to modify, suspend, or discontinue any part of our Services at any time without notice.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">6. Third-Party Links and Services</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our Services may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of any third-party sites. We encourage you to review the terms and policies of any third-party services you access.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">7. Disclaimer of Warranties</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Merchantability</li>
                  <li>Fitness for a particular purpose</li>
                  <li>Non-infringement</li>
                  <li>Title</li>
                  <li>Accuracy or reliability of content</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">8. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE RADIO NETWORK AND ITS AFFILIATES SHALL NOT BE LIABLE FOR:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                  <li>Loss of profits, revenue, data, or use</li>
                  <li>Damages arising from your use or inability to use the Services</li>
                  <li>Any unauthorized access to or alteration of your transmissions or data</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Our total liability shall not exceed the amount you paid us in the last twelve months (which is zero for free services).
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">9. Indemnification</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to indemnify, defend, and hold harmless The Radio Network, its affiliates, and their respective officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from your use of the Services or violation of these Terms.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">10. Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your use of our Services is also governed by our <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>. Please review our Privacy Policy to understand our practices regarding your personal information.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">11. Modifications to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes by updating the "Last Updated" date. Your continued use of the Services after changes constitutes acceptance of the modified Terms.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">12. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may terminate or suspend your access to our Services immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Services will immediately cease.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">13. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of New Zealand and Sri Lanka, without regard to conflict of law principles. Any disputes arising from these Terms or the Services shall be resolved in the courts of New Zealand or Sri Lanka.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">14. Severability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">15. Entire Agreement</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms, together with our Privacy Policy, constitute the entire agreement between you and The Radio Network regarding the use of our Services.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">16. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
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

export default TermsOfService;
