"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";

interface Product {
  title: string;
  link?: string;
  thumbnail: string;
}

export const HeroParallaxCertificates = ({
  products,
  onImageClick,
}: {
  products: Product[];
  onImageClick?: (product: Product) => void;
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const springConfig = { stiffness: 200, damping: 30 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [-200, 200]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [200, -200]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
    springConfig
  );
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.9, 1]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="relative py-10 overflow-visible"
    >
      <motion.div
        style={{ opacity, scale }}
      >
        {firstRow.length > 0 && (
          <motion.div className="flex flex-row-reverse space-x-reverse space-x-10 mb-10 overflow-visible">
            {firstRow.map((product) => (
              <ProductCard
                product={product}
                translate={translateX}
                key={product.title}
                onClick={() => onImageClick?.(product)}
              />
            ))}
          </motion.div>
        )}
        {secondRow.length > 0 && (
          <motion.div className="flex flex-row mb-10 space-x-10 overflow-visible">
            {secondRow.map((product) => (
              <ProductCard
                product={product}
                translate={translateXReverse}
                key={product.title}
                onClick={() => onImageClick?.(product)}
              />
            ))}
          </motion.div>
        )}
        {thirdRow.length > 0 && (
          <motion.div className="flex flex-row-reverse space-x-reverse space-x-10 overflow-visible">
            {thirdRow.map((product) => (
              <ProductCard
                product={product}
                translate={translateX}
                key={product.title}
                onClick={() => onImageClick?.(product)}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
  onClick,
}: {
  product: Product;
  translate: MotionValue<number>;
  onClick?: () => void;
}) => {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -10, scale: 1.02 }}
      key={product.title}
      className="group/product h-64 w-72 sm:h-72 sm:w-80 relative flex-shrink-0 cursor-pointer rounded-xl overflow-hidden border border-border/50 shadow-lg"
      onClick={onClick}
    >
      <img
        src={product.thumbnail}
        className="object-cover absolute h-full w-full inset-0 transition-transform duration-500 group-hover/product:scale-110"
        alt={product.title}
      />
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-90 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 pointer-events-none" />
      <h2 className="absolute bottom-4 left-4 right-4 opacity-0 group-hover/product:opacity-100 text-white font-medium transition-opacity duration-300 z-10 truncate">
        {product.title}
      </h2>
    </motion.div>
  );
};
