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
    <section id="certificates" className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-20 lg:py-28">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      {/* Accent blobs */}
      <div className="blob bg-blue-800 w-[350px] h-[350px] -top-10 -left-10 opacity-20" />
      <div className="blob bg-slate-700 w-[250px] h-[250px] bottom-10 right-10 opacity-20" style={{ animationDelay: '2s' }} />
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
              <Award className="h-12 w-12 mx-auto mb-3 text-blue-300" />
              <p className="font-medium text-white">Belum ada data sertifikat</p>
              <p className="text-sm mt-1 text-slate-400">Tambahkan sertifikat melalui admin panel.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {certificates.map((cert, i) => (
                <div
                  key={cert.id}
                   className="glass-card-dark p-5 flex gap-4 items-start animate-fade-in-up hover:scale-[1.01] transition-all duration-300"
                  style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}
                >
                  {cert.image_url ? (
                    <img src={cert.image_url} alt={cert.title} className="w-14 h-14 rounded-lg object-cover shrink-0 border border-blue-200" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                      <Award className="h-7 w-7 text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold leading-snug text-white">{cert.title}</h3>
                    <p className="text-sm text-blue-300 font-medium mt-0.5">{cert.issuer}</p>
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
                        className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200 hover:underline mt-2 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" /> Lihat Sertifikat
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
