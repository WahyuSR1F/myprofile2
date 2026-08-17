'use client'
import React from 'react'
import { cn } from '@/lib/utils'

interface EducationItemProps {
  index: string
  className?: string
  institution: string
  tagline?: string
  period: string
  degree: string
  field?: string | null
  description?: string | null
}

const EducationItem: React.FC<EducationItemProps> = ({
  index,
  className,
  institution,
  tagline,
  period,
  degree,
  field,
  description,
}) => {
  return (
    <div className={cn('relative')}>
      <div
        className={cn(
          'grid grid-cols-1 group px-4 md:grid-cols-12 gap-8 py-12 border-neutral-200 dark:border-white/10 overflow-hidden z-10 relative w-full',
          className
        )}
      >
        {/* Left: Institution info */}
        <div className="md:col-span-4 space-y-4 relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white leading-tight">
            {institution}
          </h3>
          <div className="space-y-1">
            {tagline && (
              <p className="text-sm group-hover:text-neutral-800 dark:group-hover:text-white text-neutral-500 dark:text-white/50 font-medium">
                {tagline}
              </p>
            )}
            <p className="text-sm group-hover:text-neutral-800 dark:group-hover:text-white text-neutral-500 dark:text-white/50 tabular-nums">
              {period}
            </p>
          </div>
        </div>

        {/* Middle: Degree details */}
        <div className="md:col-span-3 space-y-4 relative z-10">
          <div className="grid grid-cols-2 gap-y-4">
            <span className="text-sm group-hover:text-neutral-800 dark:group-hover:text-white text-neutral-500 dark:text-white/50">
              Degree
            </span>
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              {degree}
            </span>

            {field && (
              <>
                <span className="text-sm group-hover:text-neutral-800 dark:group-hover:text-white text-neutral-500 dark:text-white/50">
                  Field
                </span>
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {field}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Description */}
        <div className="md:col-span-5 space-y-4 relative z-10">
          {description && (
            <p className="group-hover:text-neutral-800 dark:group-hover:text-white text-neutral-600 dark:text-white/60 leading-relaxed text-pretty">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export interface ImpactExperienceProps {
  title?: string
  headline?: string
  items: {
    id: string
    institution: string
    degree: string
    field?: string | null
    start_date?: string | null
    end_date?: string | null
    description?: string | null
  }[]
}

export const ImpactExperience: React.FC<ImpactExperienceProps> = ({
  title = 'EDUCATION',
  headline = 'Building a foundation that drives innovation.',
  items,
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Headline */}
      {headline && (
        <p className="text-lg md:text-xl text-neutral-500 dark:text-white/50 mb-6 px-5 font-medium">
          {headline}
        </p>
      )}

      {/* Title bar */}
      <h2 className="text-4xl md:text-6xl px-5 font-bold bg-neutral-100 dark:bg-white/5 border-neutral-200 dark:border-white/10 tracking-tight py-8 md:py-10 text-neutral-900 dark:text-white border-x rounded-b-xl border-b">
        {title}
      </h2>

      {/* Items */}
      <div>
        {items.map((item, i) => (
          <EducationItem
            key={item.id}
            index={String(i + 1)}
            institution={item.institution}
            period={`${item.start_date ?? ''} — ${item.end_date ?? 'Present'}`}
            degree={item.degree}
            field={item.field}
            description={item.description}
            className={cn(
              'border-neutral-200 dark:border-white/10',
              i === 0 && 'border rounded-xl bg-neutral-100 dark:bg-white/5',
              i === items.length - 1 && 'border-x border-b rounded-b-xl bg-neutral-100 dark:bg-white/5',
              i > 0 && i < items.length - 1 && 'border-x bg-neutral-100 dark:bg-white/5',
            )}
          />
        ))}
      </div>
    </div>
  )
}

export default ImpactExperience
