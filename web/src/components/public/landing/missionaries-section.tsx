"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetMissionaries } from "@/hooks/queries/use-missionaries-query";

export default function MissionariesSection() {
  const [isHovered, setIsHovered] = useState(false);
  const missionariesContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentTranslateX = useRef(0);
  const contentWidthRef = useRef(0);

  const scrollSpeed = 0.8;

  // Fetch missionaries using the custom React Query hook
  const { data: missionaries = [], isLoading, error } = useGetMissionaries();

  // Optimized animation step with performance considerations
  const animateStep = useCallback(() => {
    if (missionaries.length === 0) return;
    
    currentTranslateX.current -= scrollSpeed;

    // Wrap around logic for seamless loop
    if (currentTranslateX.current <= -contentWidthRef.current) {
      currentTranslateX.current += contentWidthRef.current;
    }

    if (missionariesContainerRef.current) {
      missionariesContainerRef.current.style.transform = `translateX(${currentTranslateX.current}px)`;
    }
  }, [scrollSpeed, missionaries.length]);

  // Effect for calculating content width when missionaries data loads/changes
  useEffect(() => {
    const container = missionariesContainerRef.current;
    if (!container || missionaries.length === 0) return;

    const calculateContentWidth = () => {
      if (container) {
        // The total width is duplicated 3 times for the seamless loop
        const totalDuplicatedContentWidth = container.scrollWidth;
        contentWidthRef.current = totalDuplicatedContentWidth / 3;
      }
    };

    calculateContentWidth();
    const observer = new ResizeObserver(calculateContentWidth);
    observer.observe(container);

    // Reset position when data changes
    currentTranslateX.current = 0;
    if (missionariesContainerRef.current) {
      missionariesContainerRef.current.style.transform = `translateX(0px)`;
    }

    return () => {
      if (observer && container) {
        observer.unobserve(container);
      }
    };
  }, [missionaries]);

  // Effect for managing the animation loop based on hover state and data availability
  useEffect(() => {
    const loop = () => {
      animateStep();
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    if (!isHovered && missionaries.length > 0) {
      animationFrameRef.current = requestAnimationFrame(loop);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHovered, animateStep, missionaries.length]);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-neutral-800 mb-4">
              Our Dedicated Missionaries
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
              Meet the passionate individuals who are making a difference in
              communities across Ethiopia.
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading missionaries...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-neutral-800 mb-4">
              Our Dedicated Missionaries
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
              Meet the passionate individuals who are making a difference in
              communities across Ethiopia.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              Failed to load missionaries. Please try again later.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 border border-primary-600 text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (missionaries.length === 0) {
    return (
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-neutral-800 mb-4">
              Our Dedicated Missionaries
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
              Meet the passionate individuals who are making a difference in
              communities across Ethiopia.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-neutral-600">
              No missionaries available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Main component render
  return (
    <section className="py-12 md:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-neutral-800 mb-4">
            Our Dedicated Missionaries
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
            Meet the passionate individuals who are making a difference in
            communities across Ethiopia.
          </p>
        </div>

        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            ref={missionariesContainerRef}
            className="flex flex-nowrap will-change-transform"
            style={{ transition: "none" }}
          >
            {/* Duplicate the content 3 times for a seamless loop */}
            {Array(3)
              .fill(null)
              .map((_, groupIndex) => (
                <div
                  key={`group-${groupIndex}`}
                  className="flex flex-nowrap shrink-0"
                >
                  {missionaries.map((missionary, index) => (
                    <div
                      key={`${missionary.id}-${groupIndex}-${index}`}
                      className={`flex-[0_0_240px] md:flex-[0_0_280px] min-w-0 mr-4 md:mr-8`}
                    >
                      <Link href={`/missionaries/${missionary.id}`}>
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer">
                          <Image
                            src={missionary.imageUrl || "/placeholder.svg"}
                            alt={missionary.user?.name || "Missionary"}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                            <h3 className="text-base md:text-xl font-semibold mb-1">
                              {missionary.user?.name}
                            </h3>
                            <p className="text-xs md:text-sm text-neutral-200">
                              {missionary.title || missionary.focus}
                            </p>
                            <p className="text-xs md:text-sm text-neutral-200 mt-1">
                              {missionary.location}
                            </p>
                            {missionary.shortBio && (
                              <p className="text-xs text-neutral-300 mt-2 line-clamp-2">
                                {missionary.shortBio}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ))}
          </div>

          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
}