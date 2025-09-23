"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Users, Globe, ArrowRight, Clock, Target } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Header from "@/components/public/common/header";
import HeroSection from "@/components/public/landing/hero-section";
import ProjectsSection from "@/components/public/landing/projects-section";
import StrategiesSection from "@/components/public/landing/strategies-section";
import MissionariesSection from "@/components/public/landing/missionaries-section";
import DonationModal from "@/components/public/landing/donation-modal";
import Footer from "@/components/public/common/footer";

export default function MissionaryDonationPlatform() {
  const [donationModal, setDonationModal] = useState<{
    isOpen: boolean;
    type: "project" | "missionary";
    title: string;
    description?: string;
  }>({
    isOpen: false,
    type: "project",
    title: "",
    description: "",
  });

  // Embla Carousel configuration for Projects
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    dragFree: true,
    containScroll: "trimSnaps",
    slidesToScroll: 1,
    inViewThreshold: 0.7,
  });

  // Embla Carousel configuration for Missionaries (no speed/duration for CSS animation)
  const [missionariesRef, missionariesApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    dragFree: true,
    containScroll: "trimSnaps",
    slidesToScroll: 1,
    inViewThreshold: 0.7,
  });

  const autoplay = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const autoplayInterval = setInterval(autoplay, 5000); // Projects autoplay

    const onUserInteraction = () => {
      clearInterval(autoplayInterval);
      setTimeout(() => {
        setInterval(autoplay, 5000);
      }, 10000);
    };

    emblaApi.on("pointerDown", onUserInteraction);
    emblaApi.on("pointerUp", onUserInteraction);

    return () => {
      clearInterval(autoplayInterval);
      emblaApi.off("pointerDown", onUserInteraction);
      emblaApi.off("pointerUp", onUserInteraction);
    };
  }, [emblaApi, autoplay]);

  // Missionary carousel CSS animation does not use Embla API for direct scroll, so no autoplay function for it here.

  const openDonationModal = (
    type: "project" | "missionary",
    title: string,
    description?: string
  ) => {
    setDonationModal({
      isOpen: true,
      type,
      title,
      description,
    });
  };

  const closeDonationModal = () => {
    setDonationModal({
      isOpen: false,
      type: "project",
      title: "",
      description: "",
    });
  };

  const impactStats = [
    { label: "Missionaries Supported", value: "127", icon: Users },
    { label: "Ethiopian Regions Reached", value: "11", icon: Globe },
    { label: "Lives Transformed", value: "8,500+", icon: Heart },
  ];

  const projects = [
    {
      id: 1,
      slug: "yotor-church-management-system",
      title: "Yotor - Modern Church Management",
      description: "A Secure and Reliable Solution to Manage Your Church",
      image: "/images/projects/yotor.png?height=200&width=300",
      category: "Technology",
      duration: "8 months",
      beneficiaries: "2,500 people",
      teamSize: "8 volunteers",
      urgency: "High Priority",
    },
    {
      id: 2,
      slug: "my-fellow",
      title: "MY FELLOW",
      description:
        "an online platform designed to help you connect with Christian fellowship on campus. We understand that being a new student can be overwhelming, especially when it comes to finding a community of believers. That's why we are here to assist you every step of the way.",
      image: "/images/projects/my-fellow.png?height=200&width=300",
      category: "Education",
      duration: "12 months",
      beneficiaries: "1500 youth",
      teamSize: "8 volunteers",
      urgency: "Ongoing",
    },
    {
      id: 3,
      slug: "melhk-poadcast",
      title: "MELHIK - PODCAST",
      description:
        "Melhk Podcast is a program that helps Christian youth grow holistically, spiritually, emotionally, physically, and socially, and helps us have a biblical foundation by addressing pressing issues among young people.",
      image: "/images/projects/melhk.png?height=200&width=300",
      category: "Poadcast",
      duration: "2 years",
      beneficiaries: "5,000 people",
      teamSize: "8 volunteers",
      urgency: "Ongoing",
    },
    {
      id: 4,
      slug: "gemenaye",
      title: "GEMENAYE",
      description:
        "We all have different paths in life, but to a greater or lesser extent, we have all had issues that we have held within ourselves and faced; perhaps we have come out of our situation because we met someone who helped us, listened to us, and gave us true love.",
      image: "/images/projects/gemenaye.png?height=200&width=300",
      category: "Tv-program",
      duration: "10 months",
      beneficiaries: "800 families",
      teamSize: "6 volunteers",
      urgency: "Critical Need",
    },
    {
      id: 5,
      slug: "habesha-students",
      title: "HABESHA STUDENTS",
      description:
        "It is a place where students can find true answers to life's questions and God's truth. It also works with a website called addishiwot.net to send a series of lessons to those who are interested. This website is also available as a mobile application.",
      image: "/images/projects/habesha-students.png?height=200&width=300",
      category: "Online-platform",
      duration: "10 months",
      beneficiaries: "1000 families",
      teamSize: "5 volunteers",
      urgency: "Ongoing",
    },
    {
      id: 6,
      slug: "hulentenawi",
      title: "HULENTENAWI",
      description:
        "Everyone these days is concerned about how they can improve themselves and live with the society they live in, but with all these questions, we are confused about who to ask. But now, a mobile app that allows us to improve ourselves in these and many other ways now allows us to chat with people who are learning along with you.",
      image: "/images/projects/hulentenawi.png?height=200&width=300",
      category: "Online-platform",
      duration: "10 months",
      beneficiaries: "1000 families",
      teamSize: "5 volunteers",
      urgency: "Ongoing",
    },
    {
      id: 7,
      slug: "jesus-film",
      title: "JESUS FILM",
      description:
        "We want everyone, everywhere to encounter Jesus Sharing the Story of Jesus We believe film is the most dynamic way to hear and see the greatest story ever lived — so we are driven to bring Christ-centered video to the ends of the earth. More than 490 million people have come to Jesus after watching these films!",
      image: "/images/projects/jesus-film.png?height=200&width=300",
      category: "Online-platform",
      duration: "10 months",
      beneficiaries: "1000 families",
      teamSize: "5 volunteers",
      urgency: "Ongoing",
    },
  ];

  const missionariesContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = missionariesContainerRef.current;
    if (!container) return;

    let animationFrame: number;
    let startTime: number | null = null;
    const duration = 60000; // 60 seconds for one complete cycle
    const totalWidth = container.scrollWidth / 3; // Divide by 3 since we have three sets

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;

      if (!isHovered) {
        // Calculate the position based on progress
        const translateX = -progress * totalWidth * 2;

        // When we reach the end of the second set, smoothly transition to the beginning
        if (translateX <= -totalWidth * 2) {
          // Remove transition temporarily
          container.style.transition = "none";
          // Reset position
          container.style.transform = `translateX(0)`;
          // Force a reflow
          container.offsetHeight;
          // Restore transition
          container.style.transition = "transform 1000ms linear";
          // Reset start time
          startTime = timestamp;
        } else {
          container.style.transform = `translateX(${translateX}px)`;
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isHovered]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header currentPage="home" />

      <HeroSection openDonationModal={openDonationModal} />

      {/* Bible Verse & Impact Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <blockquote className="text-2xl md:text-3xl font-light text-neutral-700 italic mb-4 max-w-4xl mx-auto">
              "How beautiful are the feet of those who bring good news!"
            </blockquote>
            <cite className="text-primary-600 font-semibold">Romans 10:15</cite>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {impactStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#B8C0D4] to-[#8E9BBF] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <IconComponent className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-neutral-800 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-neutral-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <ProjectsSection openDonationModal={openDonationModal} />



      {/* Strategies Section */}
      <MissionariesSection />


      {/* Missionaries Section */}
      <MissionariesSection />

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[#102C80] to-[#0E276E]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Your support enables missionaries to continue their vital work
            spreading hope and love across Ethiopia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#0E276E] hover:bg-neutral-50 px-8 py-3 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() =>
                openDonationModal(
                  "project",
                  "Ethiopian Mission Support",
                  "General support for all our Ethiopian missions"
                )
              }
            >
              Start Donating Today
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#0E276E] px-8 py-3 text-lg bg-[#f0f9ff]/30 backdrop-blur-sm"
            >
              Learn More About Our Mission
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Donation Modal */}
      <DonationModal
        isOpen={donationModal.isOpen}
        onClose={closeDonationModal}
        type={donationModal.type}
        title={donationModal.title}
        description={donationModal.description}
      />
    </div>
  );
}
