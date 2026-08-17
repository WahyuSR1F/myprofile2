'use client';

import type { Certificate } from '@/lib/api';
import { useInView } from '@/lib/use-in-view';
import { Award, ExternalLink, Calendar } from 'lucide-react';

interface Props {
  certificates: Certificate[];
}

export function CertificatesSection({ certificates }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="certificates" className="relative overflow-hidden scroll-mt-20 bg-[#0a0a0c] py-20 lg:py-28">
      {/* Abstract animated orbs */}
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-30 blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.45), transparent 70%)", animation: "abstract-drift-1 20s ease-in-out infinite" }} />
      <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full opacity-25 blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)", animation: "abstract-drift-2 24s ease-in-out infinite" }} />
      <div className="absolute -bottom-48 left-1/4 h-[450px] w-[450px] rounded-full opacity-25 blur-[110px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.35) 0%, hsl(var(--accent) / 0.25) 50%, transparent 70%)", animation: "abstract-drift-3 22s ease-in-out infinite" }} />
      <div className="noise-overlay absolute inset-0 opacity-[0.04] pointer-events-none" />
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('/images/certicate/bg-certificate.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className={`max-w-4xl mx-auto ${inView ? 'animate-fade-in-up' : 'opacity-0-init'}`}>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-white">Certificates</h2>
            <div className="section-divider-light" />
          </div>

          {certificates.length === 0 ? (
             <div className="glass-card-dark p-12 text-center">
              <Award className="h-12 w-12 mx-auto mb-3 text-primary/70" />
              <p className="font-medium text-white">No certificates yet</p>
              <p className="text-sm mt-1 text-slate-400">Add certificates via the admin panel.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {certificates.map((cert, i) => (
                <div
                  key={cert.id}
                   className="glass-card-dark p-5 flex gap-4 items-start animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}
                >
                  {cert.image_url ? (
                    <img src={cert.image_url} alt={cert.title} className="w-14 h-14 rounded-lg object-cover shrink-0 border border-white/10" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                      <Award className="h-7 w-7 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold leading-snug text-white">{cert.title}</h3>
                    <p className="text-sm text-primary font-medium mt-0.5">{cert.issuer}</p>
                    {cert.date && (
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                        <Calendar className="h-3 w-3" />
                        {cert.date}
                      </div>
                    )}
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 hover:underline mt-2 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" /> View Certificate
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
