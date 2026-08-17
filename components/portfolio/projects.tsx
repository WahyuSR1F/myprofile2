'use client';

import { useState } from 'react';
import type { Project } from '@/lib/api';
import { useInView } from '@/lib/use-in-view';
import { Star, Eye } from 'lucide-react';
import { ProjectCatalog } from '@/components/ui/project-catalog';

interface Props {
  projects: Project[];
}

export function Projects({ projects }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (projects.length === 0) return (
    <section id="projects" className="relative overflow-hidden scroll-mt-20 bg-[#0a0a0c] py-20 lg:py-28">
      {/* Abstract animated orbs */}
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-30 blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.45), transparent 70%)", animation: "abstract-drift-1 20s ease-in-out infinite" }} />
      <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full opacity-25 blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)", animation: "abstract-drift-2 24s ease-in-out infinite" }} />
      <div className="absolute -bottom-48 left-1/4 h-[450px] w-[450px] rounded-full opacity-25 blur-[110px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.35) 0%, hsl(var(--accent) / 0.25) 50%, transparent 70%)", animation: "abstract-drift-3 22s ease-in-out infinite" }} />
      <div className="noise-overlay absolute inset-0 opacity-[0.04] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-white">Projects</h2>
            <div className="section-divider-light" />
          </div>
          <div className="glass-card-dark p-12 text-center">
            <p className="font-medium text-white">No projects yet</p>
            <p className="text-sm mt-1 text-slate-400">Add projects via the admin panel.</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <section id="projects" className="relative overflow-hidden scroll-mt-20 bg-[#0a0a0c] py-20 lg:py-28">
        {/* Abstract animated orbs */}
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-30 blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.45), transparent 70%)", animation: "abstract-drift-1 20s ease-in-out infinite" }} />
        <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full opacity-25 blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)", animation: "abstract-drift-2 24s ease-in-out infinite" }} />
        <div className="absolute -bottom-48 left-1/4 h-[450px] w-[450px] rounded-full opacity-25 blur-[110px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.35) 0%, hsl(var(--accent) / 0.25) 50%, transparent 70%)", animation: "abstract-drift-3 22s ease-in-out infinite" }} />
        <div className="noise-overlay absolute inset-0 opacity-[0.04] pointer-events-none" />

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
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${project.title}`}
                  className="glass-card-dark overflow-hidden animate-fade-in-up cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  style={{ animationDelay: `${i * 150}ms`, opacity: 0 }}
                  onClick={() => setSelectedProject(project)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedProject(project);
                    }
                  }}
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
                    <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-accent/15 flex items-center justify-center relative">
                      <span className="font-display text-3xl font-bold text-white/20">{project.title.charAt(0)}</span>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Eye className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-white">{project.title}</h3>
                      {project.featured && (
                        <span className="flex items-center gap-1 shrink-0 text-xs font-medium text-primary">
                          <Star className="h-3 w-3 fill-primary" /> Featured
                        </span>
                      )}
                    </div>

                    {project.description && (
                      <p className="text-sm text-slate-300 mb-3 line-clamp-2">{project.description}</p>
                    )}

                    {project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tech_stack.map((tech) => (
                          <span key={tech} className="px-2 py-1 rounded-md text-xs font-medium bg-muted text-foreground border border-border">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                      <span>View Catalog</span>
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
