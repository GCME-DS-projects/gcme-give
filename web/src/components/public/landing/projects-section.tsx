"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Users, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useGetProjects } from "@/hooks/queries/use-projects-query";

// Define props for the ProjectsSection component
interface ProjectsSectionProps {
  openDonationModal: (
    type: "project" | "missionary",
    title: string,
    description?: string
  ) => void;
}

export default function ProjectsSection({
  openDonationModal,
}: ProjectsSectionProps) {
  // --- Data Fetching ---
  const { data: projects = [], isLoading, error } = useGetProjects();

  // --- State for Animation ---
  const [isHovered, setIsHovered] = useState(false);
  const projectsContainerRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentTranslateX = useRef(0);
  const cardWidthWithMargin = useRef(0);
  const totalProjectsWidth = useRef(0);

  const slideDuration = 1000; // ms for slide animation
  const pauseDuration = 3000; // ms for pause

  // --- Animation Logic ---
  const calculateDimensions = useCallback(() => {
    if (!projectsContainerRef.current || projects.length === 0) return;

    // Calculate card width including margin
    const firstCard = projectsContainerRef.current.querySelector(
      ".group.flex-\\[0_0_400px\\]"
    );
    if (firstCard) {
      const computedStyle = window.getComputedStyle(firstCard);
      const marginRight = parseFloat(computedStyle.marginRight) || 0;
      cardWidthWithMargin.current = firstCard.clientWidth + marginRight;
    }

    // Calculate total width of one set of projects
    const firstProjectGroup =
      projectsContainerRef.current.querySelector(".flex-nowrap.shrink-0");
    if (firstProjectGroup) {
      totalProjectsWidth.current = firstProjectGroup.scrollWidth;
    }
  }, [projects.length]);

  useEffect(() => {
    calculateDimensions();
    const observer = new ResizeObserver(calculateDimensions);
    const container = projectsContainerRef.current;
    if (container) {
      observer.observe(container);
    }

    currentTranslateX.current = 0;
    if (container) {
      container.style.transform = `translateX(0px)`;
      container.style.transition = `none`;
    }

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, [calculateDimensions, projects]); // Recalculate when projects data loads

  useEffect(() => {
    const startSlide = () => {
      // Skip animation if conditions aren't met
      if (
        isHovered ||
        cardWidthWithMargin.current === 0 ||
        totalProjectsWidth.current === 0 ||
        projects.length === 0
      ) {
        animationTimeoutRef.current = setTimeout(startSlide, 100);
        return;
      }

      const container = projectsContainerRef.current;
      if (!container) return;

      const nextTranslateX =
        currentTranslateX.current - cardWidthWithMargin.current;

      // Apply smooth transition
      container.style.transition = `transform ${
        slideDuration / 1000
      }s ease-in-out`;
      container.style.transform = `translateX(${nextTranslateX}px)`;

      animationTimeoutRef.current = setTimeout(() => {
        currentTranslateX.current = nextTranslateX;

        // Reset position when we've scrolled through one complete set
        if (Math.abs(currentTranslateX.current) >= totalProjectsWidth.current) {
          container.style.transition = "none";
          currentTranslateX.current += totalProjectsWidth.current;
          container.style.transform = `translateX(${currentTranslateX.current}px)`;
          void container.offsetHeight; // Force reflow
          container.style.transition = `transform ${
            slideDuration / 1000
          }s ease-in-out`;
        }

        // Continue animation after pause
        animationTimeoutRef.current = setTimeout(startSlide, pauseDuration);
      }, slideDuration);
    };

    // Start animation only when we have projects
    if (projects.length > 0) {
      animationTimeoutRef.current = setTimeout(startSlide, pauseDuration);
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isHovered, slideDuration, pauseDuration, projects.length]);


  // --- Render Logic ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20 text-center">
          <div>
            <Loader2 className="animate-spin h-8 w-8 text-primary-600 mx-auto mb-4" />
            <p className="text-neutral-600">Loading projects...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20">
          <p className="text-red-600 mb-4">
            Failed to load projects. Please try again later.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="border-primary-600 text-primary-600 hover:bg-primary-50"
          >
            Retry
          </Button>
        </div>
      );
    }

    if (projects.length === 0) {
      return (
        <div className="text-center py-20">
          <p className="text-neutral-600">
            No projects available at the moment.
          </p>
        </div>
      );
    }

    return (
      <div
        className="relative overflow-hidden w-full mx-auto max-w-[1264px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={projectsContainerRef}
          className="flex flex-nowrap will-change-transform"
          style={{ transition: "none" }}
        >
          {Array(3)
            .fill(null)
            .map((_, groupIndex) => (
              <div
                key={`project-group-${groupIndex}`}
                className="flex flex-nowrap shrink-0"
              >
                {projects.map((project, index) => (
                  <Card
                    key={`${project.id}-${groupIndex}-${index}`}
                    className="flex-[0_0_400px] min-w-0 mr-6 md:mr-8 overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-neutral-200 cursor-pointer group transform hover:-translate-y-1"
                  >
                    <Link href={`/projects/${project.slug}`}>
                      <div className="relative h-48">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                        <Badge
                          className={`absolute top-3 right-3 text-white shadow-lg ${
                            project.urgency === "Critical Need"
                              ? "bg-primary-600"
                              : project.urgency === "High Priority"
                              ? "bg-primary-500"
                              : "bg-secondary-500"
                          }`}
                        >
                          {project.urgency}
                        </Badge>
                        <Badge className="absolute top-3 left-3 bg-neutral-700 text-white shadow-lg">
                          {project.category}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl text-neutral-800 group-hover:text-primary-600 transition-colors">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="text-neutral-600 line-clamp-2">
                          {project.shortDescription}
                        </CardDescription>
                      </CardHeader>
                    </Link>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center text-neutral-600">
                            <Clock className="w-4 h-4 mr-2 text-primary-600" />
                            <span className="font-medium">Duration:</span>
                          </div>
                          <div className="text-neutral-800">
                            {project.duration}
                          </div>

                          <div className="flex items-center text-neutral-600">
                            <Target className="w-4 h-4 mr-2 text-primary-600" />
                            <span className="font-medium">Beneficiaries:</span>
                          </div>
                          <div className="text-neutral-800">
                            {project.beneficiaries}
                          </div>

                          <div className="flex items-center text-neutral-600">
                            <Users className="w-4 h-4 mr-2 text-primary-600" />
                            <span className="font-medium">Team Size:</span>
                          </div>
                          <div className="text-neutral-800">
                            {project.teamSize}
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <Link
                            href={`/projects/${project.slug}`}
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              className="w-full border-primary-600 text-primary-600 hover:bg-primary-50"
                            >
                              Learn More
                            </Button>
                          </Link>
                          <Button
                            className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg"
                            onClick={(e) => {
                              e.preventDefault();
                              openDonationModal(
                                "project",
                                project.title,
                                project.shortDescription
                              );
                            }}
                          >
                            Donate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-12 md:py-20 bg-neutral-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-neutral-800 mb-4">
            Our Impactful Projects
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
            Explore our initiatives designed to bring hope and transformation to
            communities across Ethiopia.
          </p>
        </div>
        {renderContent()}
      </div>
    </section>
  );
}