'use client';

import type { Course } from '@/lib/api';
import { useInView } from '@/lib/use-in-view';
import { BookOpen, ExternalLink, Calendar } from 'lucide-react';

interface Props {
  courses: Course[];
}

export function CoursesSection({ courses }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="courses" className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-20 lg:py-28">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      {/* Accent blobs */}
      <div className="blob bg-blue-700 w-[350px] h-[350px] -top-10 -right-10 opacity-20" />
      <div className="blob bg-slate-800 w-[250px] h-[250px] bottom-10 left-10 opacity-20" style={{ animationDelay: '2s' }} />
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('/images/proyek/bg-tech.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className={`max-w-4xl mx-auto ${inView ? 'animate-fade-in-up' : 'opacity-0-init'}`}>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-white">Courses & Training</h2>
            <div className="section-divider-light" />
          </div>

          {courses.length === 0 ? (
             <div className="glass-card-dark p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-blue-300" />
              <p className="font-medium text-white">Belum ada data kursus</p>
              <p className="text-sm mt-1 text-slate-400">Tambahkan kursus melalui admin panel.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {courses.map((course, i) => (
                <div
                  key={course.id}
                   className="glass-card-dark p-5 flex gap-4 items-start animate-fade-in-up hover:scale-[1.01] transition-all duration-300"
                  style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}
                >
                  {course.image_url ? (
                    <img src={course.image_url} alt={course.name} className="w-14 h-14 rounded-lg object-cover shrink-0 border border-blue-700/50" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                      <BookOpen className="h-7 w-7 text-blue-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold leading-snug text-white">{course.name}</h3>
                    {course.provider && (
                      <p className="text-sm text-blue-300 font-medium mt-0.5">{course.provider}</p>
                    )}
                    {course.date && (
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                        <Calendar className="h-3 w-3" />
                        {course.date}
                      </div>
                    )}
                    {course.url && (
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200 hover:underline mt-2 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" /> Lihat Kursus
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
