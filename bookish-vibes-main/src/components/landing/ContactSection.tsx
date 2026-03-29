import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone, Mail, MapPin, Clock, ChevronDown, ChevronUp,
  Send, AlertTriangle, Lightbulb, CheckCircle,
  Bell, ArrowRight, Users, Headphones, BookOpen,
  Globe, Twitter, Instagram, Youtube, Linkedin, Facebook
} from "lucide-react";

const TODAY = new Date().getDay(); // 0 = Sunday

const HOURS = [
  { day: "Monday",    dayIdx: 1, hours: "8:00 AM – 9:00 PM" },
  { day: "Tuesday",   dayIdx: 2, hours: "8:00 AM – 9:00 PM" },
  { day: "Wednesday", dayIdx: 3, hours: "8:00 AM – 9:00 PM" },
  { day: "Thursday",  dayIdx: 4, hours: "8:00 AM – 9:00 PM" },
  { day: "Friday",    dayIdx: 5, hours: "8:00 AM – 8:00 PM" },
  { day: "Saturday",  dayIdx: 6, hours: "10:00 AM – 6:00 PM" },
  { day: "Sunday",    dayIdx: 0, hours: "12:00 PM – 5:00 PM" },
];



const SOCIALS = [
  { label: "Twitter / X",  icon: Twitter,   handle: "@LibraVault",      href: "#" },
  { label: "Instagram",    icon: Instagram, handle: "@libravault.lib",  href: "#" },
  { label: "Facebook",     icon: Facebook,  handle: "LibraVault",       href: "#" },
  { label: "LinkedIn",     icon: Linkedin,  handle: "LibraVault Org",   href: "#" },
  { label: "YouTube",      icon: Youtube,   handle: "LibraVault",       href: "#" },
  { label: "Website",      icon: Globe,     handle: "libravault.org",   href: "#" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};



/* ── Main Contact Section ─────────────────────────────────── */
const ContactSection = () => {
  // const [faqSearch, setFaqSearch] = useState("");
  const [contactSent, setContactSent] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [suggestionSent, setSuggestionSent] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);



  return (
    <div id="contact" className="space-y-0">

      {/* ── 1. Hero Contact Header ─────────────────────────── */}
      <section className="py-24 px-6 bg-foreground text-background overflow-hidden relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 40px,currentColor 40px,currentColor 42px),repeating-linear-gradient(90deg,transparent,transparent 40px,currentColor 40px,currentColor 42px)" }}
        />
        <div className="container mx-auto relative z-10">
          <motion.div
            className="max-w-3xl"
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="font-heading font-bold text-primary text-sm tracking-[0.3em] uppercase mb-4">
              LibraVault — Contact
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-heading text-6xl md:text-8xl font-black leading-none mb-6">
              LET'S<br />
              <span className="text-primary">TALK.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="font-body text-xl text-background/70 max-w-xl mb-10">
              Have a question, a suggestion, or just want to say hello? Our team is here and ready to help — every single day.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <a href="#contact-form" className="brutal-btn bg-primary text-primary-foreground rounded-md font-heading inline-flex items-center gap-2">
                Send Us a Message <ArrowRight className="w-5 h-5" />
              </a>
              <a href="tel:+15550100000" className="brutal-btn bg-background text-foreground rounded-md font-heading inline-flex items-center gap-2"
                style={{ border: "2px solid hsl(var(--background))" }}>
                <Phone className="w-5 h-5" /> Call Now
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Response Time Promise ───────────────────────── */}
      <section className="py-8 px-6 bg-primary">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-8 text-primary-foreground">
            {[
              { icon: Clock,        label: "Reply within 24 hours" },
              { icon: CheckCircle,  label: "Expert team available" },
              { icon: Headphones,   label: "Dedicated support line" },
              { icon: Mail,         label: "Email response guaranteed" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 font-heading font-bold">
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Get In Touch Cards ─────────────────────────── */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.h3
            className="font-heading text-4xl font-black mb-10"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
          >
            Get In Touch
          </motion.h3>
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          >
            {[
              { icon: Phone,  title: "Call Us",   detail: "+1 (555) 010-0000",    sub: "Mon–Fri, 8 AM – 9 PM",     color: "bg-primary",   href: "tel:+15550100000" },
              { icon: Mail,   title: "Email Us",  detail: "hello@libravault.org", sub: "We reply within 24 hours", color: "bg-secondary", href: "mailto:hello@libravault.org" },
              { icon: MapPin, title: "Visit Us",  detail: "42 Library Lane, NY",  sub: "Open 7 days a week",       color: "bg-accent",    href: "#map" },
            ].map(({ icon: Icon, title, detail, sub, color, href }) => (
              <motion.a
                key={title}
                variants={fadeUp}
                href={href}
                className="brutal-card p-6 rounded-lg group block"
              >
                <div className={`${color} w-14 h-14 brutal-border rounded-lg flex items-center justify-center mb-4 group-hover:rotate-3 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h4 className="font-heading text-2xl font-black mb-1">{title}</h4>
                <p className="font-heading font-bold text-lg">{detail}</p>
                <p className="text-muted-foreground text-sm mt-1">{sub}</p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 4. Contact Form + Library Hours ───────────────── */}
      <section id="contact-form" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Contact Form */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <h3 className="font-heading text-4xl font-black mb-8">Send a Message</h3>
              {contactSent ? (
                <div className="brutal-card p-8 rounded-lg text-center space-y-4">
                  <CheckCircle className="w-16 h-16 mx-auto text-primary" />
                  <h4 className="font-heading text-2xl font-black">Message Sent!</h4>
                  <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setContactSent(false)} className="brutal-btn bg-primary text-primary-foreground rounded-md font-heading text-sm">
                    Send Another
                  </button>
                </div>
              ) : (
                <form
                  className="space-y-4"
                  onSubmit={(e) => { e.preventDefault(); setContactSent(true); }}
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-heading font-bold text-sm mb-1 block">Full Name *</label>
                      <input required placeholder="Jane Smith" className="brutal-input w-full rounded-md" data-testid="input-contact-name" />
                    </div>
                    <div>
                      <label className="font-heading font-bold text-sm mb-1 block">Email *</label>
                      <input required type="email" placeholder="jane@example.com" className="brutal-input w-full rounded-md" data-testid="input-contact-email" />
                    </div>
                  </div>
                  <div>
                    <label className="font-heading font-bold text-sm mb-1 block">Subject *</label>
                    <select required className="brutal-input w-full rounded-md bg-background" data-testid="select-contact-subject">
                      <option value="">— Select a subject —</option>
                      <option>General Enquiry</option>
                      <option>Membership Help</option>
                      <option>Book Request</option>
                      <option>Borrowing / Returns</option>
                      <option>Fines & Payments</option>
                      <option>Events & Programs</option>
                      <option>Technical Issue</option>
                      <option>Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-heading font-bold text-sm mb-1 block">Message *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us how we can help..."
                      className="brutal-input w-full rounded-md resize-none"
                      data-testid="textarea-contact-message"
                    />
                  </div>
                  <button type="submit" className="brutal-btn bg-primary text-primary-foreground rounded-md font-heading inline-flex items-center gap-2 w-full justify-center" data-testid="button-contact-submit">
                    <Send className="w-5 h-5" /> Send Message
                  </button>
                </form>
              )}
            </motion.div>

            {/* Library Hours */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <h3 className="font-heading text-4xl font-black mb-8">Library Hours</h3>
              <div className="brutal-card rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-foreground text-background">
                      <th className="font-heading font-black text-left px-5 py-3 text-sm uppercase tracking-wider">Day</th>
                      <th className="font-heading font-black text-left px-5 py-3 text-sm uppercase tracking-wider">Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HOURS.map(({ day, dayIdx, hours }) => {
                      const isToday = dayIdx === TODAY;
                      return (
                        <tr
                          key={day}
                          className={`border-t-2 border-border transition-colors ${isToday ? "bg-primary" : "hover:bg-muted"}`}
                        >
                          <td className="px-5 py-3 font-heading font-bold flex items-center gap-2">
                            {day}
                            {isToday && (
                              <span className="text-[10px] font-black bg-foreground text-background px-1.5 py-0.5 rounded uppercase">
                                Today
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3 font-body text-sm">{hours}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-3 font-body">
                * Hours may differ on public holidays. Follow us on social media for updates.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 5. Map + Visit Us ─────────────────────────────── */}
      <section id="map" className="py-20 px-6">
        <div className="container mx-auto">
          <motion.h3
            className="font-heading text-4xl font-black mb-10"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
          >
            Find Us
          </motion.h3>
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Map Embed */}
            <motion.div
              className="lg:col-span-2"
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            >
              <div className="brutal-card rounded-lg overflow-hidden" style={{ height: 380 }}>
                <iframe
                  title="LibraVault Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215256803!2d-73.98566!3d40.74844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9aeb1c6b5%3A0x35b1cfbc89a6097f!2sNew%20York%20Public%20Library!5e0!3m2!1sen!2sus!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>

            {/* Visit Us Info */}
            <motion.div
              className="space-y-5"
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            >
              {[
                {
                  icon: MapPin,
                  title: "Address",
                  lines: ["42 Library Lane", "New York, NY 10018"],
                },
                {
                  icon: Clock,
                  title: "Parking",
                  lines: ["Free 2-hour parking", "Lot B — entrance on Oak St"],
                },
                {
                  icon: Users,
                  title: "Accessibility",
                  lines: ["Wheelchair ramp at main entrance", "Elevator to all floors", "Hearing loop available"],
                },
                {
                  icon: BookOpen,
                  title: "Floor Guide",
                  lines: ["G: Reception & Lending", "1F: Fiction & Children's", "2F: Research & Non-Fiction", "3F: Quiet Study Rooms"],
                },
              ].map(({ icon: Icon, title, lines }) => (
                <motion.div key={title} variants={fadeUp} className="brutal-card p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-secondary flex-shrink-0" />
                    <h4 className="font-heading font-black text-base">{title}</h4>
                  </div>
                  {lines.map((l) => (
                    <p key={l} className="text-sm text-muted-foreground font-body">{l}</p>
                  ))}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>



      {/* ── 8. Report an Issue + Suggestion Box ───────────── */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">

            {/* Report an Issue */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-destructive brutal-border rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-black">Report an Issue</h3>
              </div>
              {reportSent ? (
                <div className="brutal-card p-6 rounded-lg text-center space-y-3">
                  <CheckCircle className="w-12 h-12 mx-auto text-primary" />
                  <p className="font-heading font-bold">Report received — thank you!</p>
                  <button onClick={() => setReportSent(false)} className="brutal-btn bg-primary text-primary-foreground rounded-md text-sm font-heading">
                    Submit Another
                  </button>
                </div>
              ) : (
                <form className="brutal-card p-6 rounded-lg space-y-4" onSubmit={(e) => { e.preventDefault(); setReportSent(true); }}>
                  <div>
                    <label className="font-heading font-bold text-sm mb-1 block">Issue Type *</label>
                    <select required className="brutal-input w-full rounded-md bg-background" data-testid="select-report-type">
                      <option value="">— Select type —</option>
                      <option>Damaged Book</option>
                      <option>Missing Page / Content</option>
                      <option>Website Bug</option>
                      <option>Incorrect Catalogue Info</option>
                      <option>Billing / Fine Error</option>
                      <option>Staff Complaint</option>
                      <option>Accessibility Issue</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-heading font-bold text-sm mb-1 block">Description *</label>
                    <textarea required rows={4} placeholder="Describe the issue in detail..." className="brutal-input w-full rounded-md resize-none" data-testid="textarea-report-description" />
                  </div>
                  <div>
                    <label className="font-heading font-bold text-sm mb-1 block">Your Email (optional)</label>
                    <input type="email" placeholder="For follow-up updates" className="brutal-input w-full rounded-md" data-testid="input-report-email" />
                  </div>
                  <button type="submit" className="brutal-btn bg-destructive text-destructive-foreground rounded-md font-heading w-full inline-flex items-center justify-center gap-2" data-testid="button-report-submit">
                    <Send className="w-4 h-4" /> Submit Report
                  </button>
                </form>
              )}
            </motion.div>

            {/* Suggestion Box */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary brutal-border rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-black">Suggestion Box</h3>
              </div>
              {suggestionSent ? (
                <div className="brutal-card p-6 rounded-lg text-center space-y-3">
                  <CheckCircle className="w-12 h-12 mx-auto text-primary" />
                  <p className="font-heading font-bold">Thanks for the idea!</p>
                  <p className="text-sm text-muted-foreground">We review all suggestions weekly.</p>
                  <button onClick={() => setSuggestionSent(false)} className="brutal-btn bg-primary text-primary-foreground rounded-md text-sm font-heading">
                    Drop Another Idea
                  </button>
                </div>
              ) : (
                <form className="brutal-card p-6 rounded-lg space-y-4" onSubmit={(e) => { e.preventDefault(); setSuggestionSent(true); }}>
                  <div>
                    <label className="font-heading font-bold text-sm mb-1 block">Category *</label>
                    <select required className="brutal-input w-full rounded-md bg-background" data-testid="select-suggestion-category">
                      <option value="">— What's your idea about? —</option>
                      <option>Book Request</option>
                      <option>New Feature / Website</option>
                      <option>Event / Program Idea</option>
                      <option>Improvement to Existing Service</option>
                      <option>Collection Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-heading font-bold text-sm mb-1 block">Your Idea *</label>
                    <textarea required rows={4} placeholder="Tell us your brilliant idea..." className="brutal-input w-full rounded-md resize-none" data-testid="textarea-suggestion" />
                  </div>
                  <button type="submit" className="brutal-btn bg-primary text-primary-foreground rounded-md font-heading w-full inline-flex items-center justify-center gap-2" data-testid="button-suggestion-submit">
                    <Lightbulb className="w-4 h-4" /> Drop Your Idea
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 10. Social Media ──────────────────────────────── */}
      <section className="py-20 px-6 bg-foreground text-background">
        <div className="container mx-auto">
          <motion.h3
            className="font-heading text-4xl font-black mb-10"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
          >
            Follow Us
          </motion.h3>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          >
            {SOCIALS.map(({ label, icon: Icon, handle, href }) => (
              <motion.a
                key={label}
                variants={fadeUp}
                href={href}
                className="brutal-card p-4 rounded-lg text-center group hover:-translate-y-1 transition-transform"
                style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}
              >
                <Icon className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-heading font-black text-sm">{label}</p>
                <p className="text-[11px] text-muted-foreground">{handle}</p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>



      {/* ── 12. Newsletter Opt-in ─────────────────────────── */}
      <section className="py-20 px-6 bg-primary">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="w-16 h-16 bg-foreground brutal-border rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-8 h-8 text-background" />
            </motion.div>
            <motion.h3 variants={fadeUp} className="font-heading text-4xl font-black mb-3 text-primary-foreground">
              Stay in the Loop
            </motion.h3>
            <motion.p variants={fadeUp} className="text-primary-foreground/80 mb-8 font-body">
              Get new arrivals, event announcements, and reading picks — straight to your inbox. No spam, ever.
            </motion.p>
            {newsletterSent ? (
              <motion.div
                className="brutal-card p-6 rounded-lg inline-flex items-center gap-3"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle className="w-6 h-6 text-primary" />
                <span className="font-heading font-bold">You're subscribed!</span>
              </motion.div>
            ) : (
              <motion.form
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                onSubmit={(e) => { e.preventDefault(); setNewsletterSent(true); }}
              >
                <input
                  required
                  type="email"
                  placeholder="your@email.com"
                  className="brutal-input flex-1 rounded-md"
                  data-testid="input-newsletter-email"
                />
                <button type="submit" className="brutal-btn bg-foreground text-background rounded-md font-heading flex-shrink-0" data-testid="button-newsletter-subscribe">
                  Subscribe
                </button>
              </motion.form>
            )}
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default ContactSection;
