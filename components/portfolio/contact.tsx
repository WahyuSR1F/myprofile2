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
    <section id="contact" className="bg-gradient-to-b from-white via-sky-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-20 lg:py-28">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      {/* Accent blobs */}
      <div className="blob bg-slate-800 w-[350px] h-[350px] -top-10 -right-10 opacity-20" />
      <div className="blob bg-slate-300 w-[250px] h-[250px] bottom-10 left-10 opacity-20" style={{ animationDelay: '2s' }} />
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
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 dark:bg-blue-500/25 flex items-center justify-center shrink-0">
                    <info.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{info.label}</div>
                    {info.href ? (
                      <a href={info.href} className="text-sm font-medium text-blue-700 dark:text-blue-400 hover:text-blue-600 transition-colors">{info.value}</a>
                    ) : (
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{info.value}</div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-2">
                {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg glass-card-light text-sm hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">LinkedIn</a>}
                {profile?.github_url && <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg glass-card-light text-sm hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">GitHub</a>}
                {profile?.twitter_url && <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg glass-card-light text-sm hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">Twitter</a>}
                {profile?.instagram_url && <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg glass-card-light text-sm hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">Instagram</a>}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="lg:col-span-3 glass-card-light p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none transition-colors text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                <input
                  required
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none transition-colors text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
              <input
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-none transition-colors text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              <textarea
                required
                rows={5}
                placeholder="Your message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:outline-none transition-colors text-sm text-slate-900 placeholder:text-slate-400 resize-none"
              />

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
