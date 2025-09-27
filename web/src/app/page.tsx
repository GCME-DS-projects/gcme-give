"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Users, Globe } from "lucide-react";
import Header from "@/components/public/common/header";
import HeroSection from "@/components/public/landing/hero-section";
import ProjectsSection from "@/components/public/landing/projects-section";
import MissionariesSection from "@/components/public/landing/missionaries-section";
import DonationModal from "@/components/public/common/donation-modal";
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


  return (
    <div className="min-h-screen bg-neutral-50">
      <Header currentPage="home" />

      <HeroSection openDonationModal={openDonationModal} />

      {/* Bible Verse & Impact Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <blockquote className="text-2xl md:text-3xl font-light text-neutral-700 italic mb-4 max-w-4xl mx-auto">
              {"How beautiful are the feet of those who bring good news!"}
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
