'use client';

import { useState } from 'react';
import type { Project } from '@/lib/api';
import { useInView } from '@/lib/use-in-view';
import { ExternalLink, Github, Star, Eye } from 'lucide-react';
import { ProjectCatalog } from '@/components/ui/project-catalog';

interface Props {
  projects: Project[];
}

export function Projects({ projects }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (projects.length === 0) return (
    <section id="projects" className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-20 lg:py-28">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url('/images/proyek/bg-projects.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: '0.15',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-blue-50/80 to-sky-50/90" />
      <div className="blob bg-blue-200 w-[400px] h-[400px] -top-20 right-1/4 opacity-30" />
      <div className="blob bg-slate-200 w-[300px] h-[300px] bottom-0 left-10 opacity-30" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-white">Projects</h2>
            <div className="section-divider-light" />
          </div>
          <div className="glass-card-dark p-12 text-center">
            <p className="font-medium text-white">Belum ada data proyek</p>
            <p className="text-sm mt-1 text-slate-400">Tambahkan proyek melalui admin panel.</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <section id="projects" className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-20 lg:py-28">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url('/images/proyek/bg-projects.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            opacity: '0.15',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-blue-50/80 to-sky-50/90" />
        <div className="blob bg-blue-200 w-[400px] h-[400px] -top-20 right-1/4 opacity-30" />
        <div className="blob bg-slate-200 w-[300px] h-[300px] bottom-0 left-10 opacity-30" style={{ animationDelay: '2s' }} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div ref={ref} className={`max-w-5xl mx-auto ${inView ? 'animate-fade-in-up' : 'opacity-0-init'}`}>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-white">Projects</h2>
              <div className="section-divider-light" />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {projects.map((project, i) => (
                <div
                  key={project.id}
                  className="glass-card-dark overflow-hidden animate-fade-in-up hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                  style={{ animationDelay: `${i * 150}ms`, opacity: 0 }}
                  onClick={() => setSelectedProject(project)}
                >
                  {project.image_url ? (
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Eye className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-800/40 via-sky-900/30 to-blue-900/40 flex items-center justify-center relative">
                      <span className="font-display text-3xl font-bold text-slate-900/30">{project.title.charAt(0)}</span>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Eye className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-white">{project.title}</h3>
                      {project.featured && (
                        <span className="flex items-center gap-1 shrink-0 text-xs font-medium text-blue-600">
                          <Star className="h-3 w-3 fill-blue-600" /> Featured
                        </span>
                      )}
                    </div>

                    {project.description && (
                      <p className="text-sm text-slate-300 mb-3 line-clamp-2">{project.description}</p>
                    )}

                    {project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tech_stack.map((tech) => (
                          <span key={tech} className="px-2 py-1 rounded-md text-xs font-medium bg-white/10 text-slate-200 border border-white/15">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-blue-400 font-medium">
                      <span>Lihat Katalog</span>
                      <Eye className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Catalog Modal */}
      {selectedProject && (
        <ProjectCatalog
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
