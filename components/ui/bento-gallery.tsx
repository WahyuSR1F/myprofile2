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
import { X } from "lucide-react"

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
  const targetRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2], [30, 0])

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

      {/* Scrollable gallery container */}
      <div
        ref={scrollContainerRef}
        className="relative w-full overflow-x-auto overflow-y-hidden scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-max min-w-full"
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
                "group relative cursor-pointer items-end overflow-hidden rounded-2xl border border-white/10 bg-card shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-[#FA500F]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background min-w-[14rem] h-[16rem] sm:h-[18rem] md:h-[20rem]",
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
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
              <div className="relative z-10 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 p-4">
                <h3 className="text-base md:text-lg font-bold text-white drop-shadow-lg">{item.title}</h3>
                <p className="mt-1 text-xs md:text-sm text-white/80">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center mt-4 gap-2">
        <div className="h-1 w-12 rounded-full bg-white/20" />
        <div className="h-1 w-12 rounded-full bg-[#FA500F]/50" />
        <div className="h-1 w-12 rounded-full bg-white/20" />
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
