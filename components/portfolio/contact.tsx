'use client';

import { useState } from 'react';
import type { Profile } from '@/lib/api';
import { messagesApi } from '@/lib/api';
import { useInView } from '@/lib/use-in-view';
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  profile: Profile | null;
}

export function Contact({ profile }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      await messagesApi.send({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
    }
  }

  const contactInfo = [
    { icon: Mail, label: 'Email', value: profile?.email ?? '', href: profile?.email ? `mailto:${profile.email}` : '' },
    { icon: Phone, label: 'Phone', value: profile?.phone ?? '', href: '' },
    { icon: MapPin, label: 'Location', value: profile?.location ?? '', href: '' },
  ].filter((c) => c.value);

  return (
    <section id="contact" className="relative overflow-hidden scroll-mt-20 bg-gradient-to-b from-[#faf9f6] via-[#f4f1ea] to-[#faf9f6] dark:from-[#0a0a0c] dark:via-[#101013] dark:to-[#0a0a0c] py-20 lg:py-28">
      {/* Abstract animated orbs */}
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-30 blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.45), transparent 70%)", animation: "abstract-drift-1 20s ease-in-out infinite" }} />
      <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full opacity-25 blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)", animation: "abstract-drift-2 24s ease-in-out infinite" }} />
      <div className="absolute -bottom-48 left-1/4 h-[450px] w-[450px] rounded-full opacity-25 blur-[110px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.35) 0%, hsl(var(--accent) / 0.25) 50%, transparent 70%)", animation: "abstract-drift-3 22s ease-in-out infinite" }} />
      <div className="noise-overlay absolute inset-0 opacity-[0.03] pointer-events-none" />
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('/images/jobs/bg-contact.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className={`max-w-4xl mx-auto ${inView ? 'animate-fade-in-up' : 'opacity-0-init'}`}>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-slate-900 dark:text-white">Get in Touch</h2>
            <div className="section-divider-light" />
            <p className="text-slate-600 dark:text-slate-400 mt-4">Have a question or want to work together? Send me a message.</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {contactInfo.map((info) => (
                <div key={info.label} className="glass-card-light p-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/15 flex items-center justify-center shrink-0">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{info.label}</div>
                    {info.href ? (
                      <a href={info.href} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">{info.value}</a>
                    ) : (
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{info.value}</div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-2">
                {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg glass-card-light text-sm hover:bg-primary/10 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-300">LinkedIn</a>}
                {profile?.github_url && <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg glass-card-light text-sm hover:bg-primary/10 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-300">GitHub</a>}
                {profile?.twitter_url && <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg glass-card-light text-sm hover:bg-primary/10 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-300">Twitter</a>}
                {profile?.instagram_url && <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg glass-card-light text-sm hover:bg-primary/10 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-300">Instagram</a>}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="lg:col-span-3 glass-card-light p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="sr-only">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#141417] border border-slate-200 dark:border-white/10 focus:border-primary focus:outline-none transition-colors text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="sr-only">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="Your email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#141417] border border-slate-200 dark:border-white/10 focus:border-primary focus:outline-none transition-colors text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-subject" className="sr-only">Subject</label>
                <input
                  id="contact-subject"
                  name="subject"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#141417] border border-slate-200 dark:border-white/10 focus:border-primary focus:outline-none transition-colors text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="sr-only">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Your message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#141417] border border-slate-200 dark:border-white/10 focus:border-primary focus:outline-none transition-colors text-sm text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
                />
              </div>
              <p className="sr-only" role="status" aria-live="polite">
                {status === 'sending'
                  ? 'Sending your message...'
                  : status === 'sent'
                    ? 'Message sent successfully.'
                    : status === 'error'
                      ? 'Failed to send the message. Please try again.'
                      : ''}
              </p>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-mistral-primary w-full h-12 gap-2"
              >
                {status === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
                {status === 'sent' && <CheckCircle2 className="h-4 w-4" />}
                {status === 'error' && <AlertCircle className="h-4 w-4" />}
                {status === 'idle' && <Send className="h-4 w-4" />}
                {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : status === 'error' ? 'Error - Try again' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
