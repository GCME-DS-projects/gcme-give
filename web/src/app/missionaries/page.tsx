"use client";

import { useState, useEffect, useMemo } from "react";
import { useGetMissionaries } from "@/hooks/queries/use-missionaries-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Search, Users, Globe, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Missionary } from "@/lib/types";
// FIX: Corrected import paths for consistency
import Header from "@/components/public/common/header";
import Footer from "@/components/public/common/footer";
import DonationModal from "@/components/public/landing/donation-modal";

// A simple debounce hook to prevent excessive API calls while typing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function MissionariesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // --- Data Fetching with React Query ---
  const {
    data: missionaries = [],
    isLoading,
    isError,
    error,
  } = useGetMissionaries({ search: debouncedSearchTerm });

  const [donationModal, setDonationModal] = useState<{
    isOpen: boolean;
    type: "project" | "missionary";
    title: string;
    description?: string;
  }>({
    isOpen: false,
    type: "missionary",
    title: "",
    description: "",
  });

  const openDonationModal = (missionary: Missionary) => {
    setDonationModal({
      isOpen: true,
      type: "missionary",
      title: missionary.user?.name || "Missionary",
      description:
        missionary.mission ||
        `Support the ministry of ${missionary.user?.name}.`,
    });
  };

  const closeDonationModal = () => {
    setDonationModal({ ...donationModal, isOpen: false });
  };

  // --- Impact stats are now calculated with useMemo for efficiency ---
  const impactStats = useMemo(() => {
    if (!missionaries || missionaries.length === 0) {
      return [
        { label: "Active Missionaries", value: "0", icon: Users },
        { label: "Ethiopian Regions Served", value: "0", icon: Globe },
        { label: "Years of Combined Service", value: "0+", icon: Calendar },
      ];
    }
    return [
      {
        label: "Active Missionaries",
        value: missionaries
          .filter((m) => m.status === "Active")
          .length.toString(),
        icon: Users,
      },
      {
        label: "Ethiopian Regions Served",
        value: new Set(missionaries.map((m) => m.location)).size.toString(),
        icon: Globe,
      },
      {
        label: "Years of Combined Service",
        value:
          missionaries
            .reduce((total, m) => total + parseInt(m.years || "0"), 0)
            .toString() + "+",
        icon: Calendar,
      },
    ];
  }, [missionaries]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      );
    }

    if (isError) {
      // FIX: Safely check for the error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load missionaries.";

      return (
        <div className="text-center min-h-[400px] flex flex-col justify-center items-center">
          <p className="text-lg text-red-600 mb-4">{errorMessage}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      );
    }

    if (missionaries.length === 0) {
      return (
        <div className="text-center min-h-[400px] flex flex-col justify-center items-center">
          <p className="text-lg text-stone-600">
            No missionaries found matching your search.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {missionaries.map((missionary) => (
          <Card
            key={missionary.id}
            className="text-center hover:shadow-lg transition-all duration-300 bg-white border-stone-200 cursor-pointer group"
          >
            <Link href={`/missionaries/${missionary.id}`}>
              <CardHeader className="pb-4">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={missionary.imageUrl || "/placeholder.svg"}
                    alt={missionary.user?.name || "Missionary"}
                    fill
                    className="object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="text-lg text-stone-800 group-hover:text-primary-600 transition-colors">
                  {missionary.user?.name}
                </CardTitle>
                <div className="flex items-center justify-center text-sm text-stone-500 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {missionary.location}
                </div>
                <Badge
                  variant="secondary"
                  className="bg-stone-100 text-stone-700"
                >
                  {missionary.focus}
                </Badge>
              </CardHeader>
            </Link>
            <CardContent>
              <p className="text-sm text-stone-600 mb-4 line-clamp-3">
                {missionary.shortBio || missionary.mission}
              </p>
              <div className="flex items-center justify-center text-xs text-stone-500 mb-4">
                <Calendar className="w-3 h-3 mr-1" />
                {missionary.years} of service
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                  onClick={() => openDonationModal(missionary)}
                >
                  Support {missionary.user?.name?.split(" ")[0]}
                </Button>
                <Link
                  href={`/missionaries/${missionary.id}`}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    className="w-full border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header currentPage="missionaries" />
      <div className="pt-20">
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
                Our Ethiopian Missionaries
              </h1>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto">
                Meet the dedicated individuals serving communities across
                Ethiopia, spreading hope, love, and transformation.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              {impactStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-[#B8C0D4] rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-[#0E276E]" />
                    </div>
                    <div className="text-3xl font-bold text-stone-800 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-stone-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-8 bg-stone-50 sticky top-20 z-30 border-b border-stone-200">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by name, location, or focus..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-lg h-12 rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">{renderContent()}</div>
        </section>

        <section className="py-16 bg-primary-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Support Our Ethiopian Missionaries
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Your partnership enables these faithful servants to continue their
              vital work.
            </p>
          </div>
        </section>
      </div>
      <Footer />
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