'use client';

import type { Certificate } from '@/lib/api';
import { ArrowRight, Award, Calendar } from 'lucide-react';

interface Props {
  certificates: Certificate[];
}

export function CertificatesSection({ certificates }: Props) {
  if (certificates.length === 0) return (
    <section id="certificates" className="relative overflow-hidden scroll-mt-20 bg-[#0a0a0c] py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-white">Certificates</h2>
            <div className="section-divider-light" />
          </div>
          <div className="glass-card-dark p-12 text-center">
            <Award className="h-12 w-12 mx-auto mb-3 text-primary/70" />
            <p className="font-medium text-white">No certificates yet</p>
            <p className="text-sm mt-1 text-slate-400">Add certificates via the admin panel.</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <section id="certificates" className="relative overflow-hidden scroll-mt-20 bg-[#0a0a0c] py-16 md:py-28">
      {/* Abstract animated orbs — inside, no negative positions */}
      <div className="absolute top-10 left-10 h-[400px] w-[400px] rounded-full opacity-20 blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)", animation: "abstract-drift-1 20s ease-in-out infinite" }} />
      <div className="absolute top-1/3 right-10 h-[350px] w-[350px] rounded-full opacity-15 blur-[80px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.35), transparent 70%)", animation: "abstract-drift-2 24s ease-in-out infinite" }} />
      <div className="absolute bottom-10 left-1/4 h-[250px] w-[250px] rounded-full opacity-10 blur-[80px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, hsl(var(--accent) / 0.2) 50%, transparent 70%)", animation: "abstract-drift-3 22s ease-in-out infinite" }} />
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      {/* Noise grain */}
      <div className="noise-overlay absolute inset-0 opacity-[0.04] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Headline - centered */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-semibold md:text-4xl text-white mb-4">
            Certifications that validate my <span className="text-primary">expertise</span>
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400 md:text-lg">
            Industry-recognized credentials that demonstrate my commitment to professional excellence.
          </p>
        </div>

        {/* Certificate cards - alternating layout */}
        <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
          {certificates.map((cert, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={cert.id}
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-8 items-center`}
              >
                {/* Text side */}
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-3">
                    <span className="text-xs uppercase tracking-wider text-slate-500">
                      {cert.issuer}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl text-white">
                    {cert.url ? (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {cert.title}
                      </a>
                    ) : (
                      cert.title
                    )}
                  </h3>
                  {cert.date && (
                    <div className="mt-3 flex items-center justify-center md:justify-start gap-1 text-sm text-slate-400">
                      <Calendar className="h-3 w-3" />
                      <span>{cert.date}</span>
                    </div>
                  )}
                  {cert.url && (
                    <div className="mt-4">
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center font-semibold hover:underline text-primary"
                      >
                        <span>View Certificate</span>
                        <ArrowRight className="ml-2 size-4 transition-transform" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Image side */}
                <div className="flex-1 w-full">
                  {cert.image_url ? (
                    <a
                      href={cert.url || '#'}
                      target={cert.url ? '_blank' : undefined}
                      rel={cert.url ? 'noopener noreferrer' : undefined}
                      className="block"
                    >
                      <div className="aspect-[16/9] overflow-clip rounded-xl border border-white/10 hover:border-primary/30 transition-colors">
                        <img
                          src={cert.image_url}
                          alt={cert.title}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    </a>
                  ) : (
                    <div className="aspect-[16/9] overflow-clip rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                      <Award className="h-16 w-16 text-primary/30" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
