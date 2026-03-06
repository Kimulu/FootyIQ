"use client";

import { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Container } from "@/components/layout/Container";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent!", {
        description: "We'll get back to you shortly.",
      });
      // In real version: await fetch('/api/contact', ...)
    }, 1500);
  };

  return (
    <PublicLayout>
      <section className="relative pt-32 pb-20 bg-[#050505] min-h-screen">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
                Get in <span className="text-orange-500">Touch</span>
              </h1>
              <p className="text-white/50">
                Have questions about our premium tips or need support?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Info Side */}
              <div className="space-y-8">
                <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-white font-bold text-lg mb-6">
                    Contact Info
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-orange-500">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-1">
                          Email Us
                        </p>
                        <a
                          href="mailto:support@footyiq.com"
                          className="text-white hover:text-orange-500 transition-colors"
                        >
                          support@footyiq.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-orange-500">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-1">
                          Call Us
                        </p>
                        <p className="text-white">+254 700 000 000</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-orange-500">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-1">
                          Location
                        </p>
                        <p className="text-white">Nairobi, Kenya</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Side */}
              <form
                onSubmit={handleSubmit}
                className="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl space-y-6"
              >
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                    Name
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none resize-none"
                    placeholder="How can we help?"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
