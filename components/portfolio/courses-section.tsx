'use client';

import type { Course } from '@/lib/api';
import InteractiveImageBentoGallery from '@/components/ui/bento-gallery';
import { BookOpen, ExternalLink } from 'lucide-react';

const courseImages: Record<string, string> = {
  'web development': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
  'frontend': 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=800&q=80',
  'backend': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  'devops': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
  'cloud': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
  'security': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  'data': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  'ai': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  'node': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  'computer science': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  'full stack': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
};

function getCourseImage(course: Course): string {
  if (course.image_url) return course.image_url;
  const name = course.name.toLowerCase();
  for (const [key, url] of Object.entries(courseImages)) {
    if (name.includes(key)) return url;
  }
  return courseImages['default'];
}

interface Props {
  courses: Course[];
}

export function CoursesSection({ courses }: Props) {
  if (courses.length === 0) return (
    <section id="courses" className="relative overflow-hidden scroll-mt-20 bg-[#0a0a0c] py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-white">Courses & <span className="text-[#FA500F]">Training</span></h2>
            <div className="section-divider-light" />
          </div>
          <div className="glass-card-dark p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-[#FA500F]/70" />
            <p className="font-medium text-white">No courses yet</p>
            <p className="text-sm mt-1 text-slate-400">Add courses via the admin panel.</p>
          </div>
        </div>
      </div>
    </section>
  );

  // Bento grid spans - varied layout for visual interest
  const spans = [
    "col-span-2 row-span-2",  // Big card
    "col-span-1 row-span-1",  // Normal
    "col-span-1 row-span-1",  // Normal
    "col-span-1 row-span-2",  // Tall
    "col-span-1 row-span-1",  // Normal
    "col-span-2 row-span-1",  // Wide
  ];

  const imageItems = courses.map((course, i) => ({
    id: course.id,
    title: course.name,
    desc: course.provider || 'Professional Course',
    url: getCourseImage(course),
    span: spans[i % spans.length],
  }));

  return (
    <section id="courses" className="relative scroll-mt-20 bg-[#0a0a0c] py-16 md:py-28">
      {/* Abstract animated orbs - orange tinted */}
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-30 blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(250, 80, 15, 0.45), transparent 70%)", animation: "abstract-drift-1 20s ease-in-out infinite" }} />
      <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full opacity-25 blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255, 175, 1, 0.4), transparent 70%)", animation: "abstract-drift-2 24s ease-in-out infinite" }} />
      <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full opacity-15 blur-[110px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(250, 80, 15, 0.35) 0%, rgba(255, 175, 1, 0.25) 50%, transparent 70%)", animation: "abstract-drift-3 22s ease-in-out infinite" }} />
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="noise-overlay absolute inset-0 opacity-[0.04] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <InteractiveImageBentoGallery
          imageItems={imageItems}
          title="Courses & Training"
          description="Continuous learning through professional courses and training programs to stay ahead in the industry."
        />

        {/* Course links */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {courses.map((course) => (
            course.url && (
              <a
                key={course.id}
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-slate-300 hover:border-[#FA500F]/50 hover:text-[#FA500F] transition-all duration-300"
              >
                <ExternalLink className="h-3 w-3" /> {course.name}
              </a>
            )
          ))}
        </div>
      </div>
    </section>
  );
}
