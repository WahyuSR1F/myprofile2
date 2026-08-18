"use client"

import React, { useRef, useState, useEffect } from "react"
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type Variants,
} from "framer-motion"
import { cn } from "@/lib/utils"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

type ImageItem = {
  id: number | string
  title: string
  desc: string
  url: string
  span: string
}

interface InteractiveImageBentoGalleryProps {
  imageItems: ImageItem[]
  title: string
  description: string
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 },
  },
}

const ImageModal = ({
  item,
  onClose,
}: {
  item: ImageItem
  onClose: () => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-5xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.url}
          alt={item.title}
          className="h-auto max-h-[85vh] w-full rounded-xl object-contain"
        />
        <div className="absolute bottom-8 left-8 right-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-b-xl p-6">
          <h3 className="text-xl font-bold text-white">{item.title}</h3>
          <p className="mt-1 text-sm text-white/80">{item.desc}</p>
        </div>
      </motion.div>
      <button
        onClick={onClose}
        className="absolute right-6 top-6 text-white/80 transition-colors hover:text-white bg-black/50 rounded-full p-2"
        aria-label="Close image view"
      >
        <X size={24} />
      </button>
    </motion.div>
  )
}

const InteractiveImageBentoGallery: React.FC<
  InteractiveImageBentoGalleryProps
> = ({ imageItems, title, description }) => {
  const [selectedItem, setSelectedItem] = useState<ImageItem | null>(null)
  const [dragConstraint, setDragConstraint] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const calculateConstraints = () => {
      if (gridRef.current && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const gridWidth = gridRef.current.scrollWidth
        const newConstraint = Math.min(0, containerWidth - gridWidth - 32)
        setDragConstraint(newConstraint)
        setCanScrollRight(gridWidth > containerWidth)
      }
    }

    calculateConstraints()
    window.addEventListener("resize", calculateConstraints)
    return () => window.removeEventListener("resize", calculateConstraints)
  }, [imageItems])

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2], [30, 0])

  const handleScroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 300
      const newScrollLeft = direction === "left"
        ? containerRef.current.scrollLeft - scrollAmount
        : containerRef.current.scrollLeft + scrollAmount

      containerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth"
      })

      setCanScrollLeft(newScrollLeft > 0)
      setCanScrollRight(newScrollLeft < containerRef.current.scrollWidth - containerRef.current.offsetWidth)
    }
  }

  return (
    <section
      ref={targetRef}
      className="relative w-full"
    >
      <motion.div
        style={{ opacity, y }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
          {description}
        </p>
      </motion.div>

      {/* Draggable gallery with arrows */}
      <div className="relative group">
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-[#FA500F]/80 text-white rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-white/20"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-[#FA500F]/80 text-white rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-white/20"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Gallery container */}
        <div
          ref={containerRef}
          className="relative w-full cursor-grab active:cursor-grabbing overflow-x-auto overflow-y-hidden scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={(e) => {
            const target = e.target as HTMLDivElement
            setCanScrollLeft(target.scrollLeft > 0)
            setCanScrollRight(target.scrollLeft < target.scrollWidth - target.offsetWidth - 10)
          }}
        >
          <motion.div
            ref={gridRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-8 auto-rows-[12rem] md:auto-rows-[14rem] w-max"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {imageItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={cn(
                  "group/card relative cursor-pointer items-end overflow-hidden rounded-2xl border border-white/10 bg-card shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-[#FA500F]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  item.span,
                )}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
                onClick={() => setSelectedItem(item)}
                onKeyDown={(e) => e.key === "Enter" && setSelectedItem(item)}
                tabIndex={0}
                aria-label={`View ${item.title}`}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 transition-opacity duration-500 group-hover/card:opacity-90" />
                <div className="relative z-10 translate-y-4 opacity-0 transition-all duration-500 group-hover/card:translate-y-0 group-hover/card:opacity-100 p-4">
                  <h3 className="text-base md:text-lg font-bold text-white drop-shadow-lg">{item.title}</h3>
                  <p className="mt-1 text-xs md:text-sm text-white/80">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator with text */}
      <div className="flex items-center justify-center mt-4 gap-3">
        <ChevronLeft className="w-4 h-4 text-white/30" />
        <span className="text-xs text-white/40 tracking-wider uppercase">Drag to explore</span>
        <ChevronRight className="w-4 h-4 text-white/30" />
      </div>

      <AnimatePresence>
        {selectedItem && (
          <ImageModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

export default InteractiveImageBentoGallery
