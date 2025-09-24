"use client";

import { useState, useMemo } from "react";
import { useGetProjects } from "@/hooks/queries/use-projects-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Clock,
  Target,
  Search,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Project } from "@/lib/types";
import Header from "@/components/public/common/header";
import Footer from "@/components/public/common/footer";
import DonationModal from "@/components/public/common/donation-modal";

export default function ProjectsPage() {
  // --- Data Fetching using React Query ---
  const { data: allProjects = [], isLoading, isError, error } = useGetProjects();

  // --- UI State for Filtering and Pagination ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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

  // --- Memoized Filtering and Pagination Logic ---
  const categories = useMemo(() => 
    Array.from(new Set(allProjects.map((project) => project.category)))
  , [allProjects]);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || project.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allProjects, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openDonationModal = (project: Project) => {
    setDonationModal({
      isOpen: true,
      type: "project",
      title: project.title,
      description: project.shortDescription,
    });
  };

  const closeDonationModal = () => {
    setDonationModal({ ...donationModal, isOpen: false });
  };

  const renderPagination = () => (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <Button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        variant="outline"
      >
        Previous
      </Button>
      <span className="text-neutral-600 font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        variant="outline"
      >
        Next
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header currentPage="projects" />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#102C80]/5 to-[#0E276E]/5">
        <div className="container mx-auto px-4 relative text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#102C80] to-[#0E276E]">
              Transforming Lives Through Faith
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-8">
              Explore our diverse range of projects making a real difference in communities across Ethiopia.
            </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b sticky top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96">
                <Input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-4 h-11"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset page on new search
                  }}
                />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory(null);
                  setCurrentPage(1);
                }}
              >
                All Projects
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-12 h-12 animate-spin text-primary-600"/>
            </div>
          ) : isError ? (
            <div className="text-center text-red-500 py-24">
              <p>{error?.message || "Failed to load projects."}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-neutral-200 cursor-pointer group transform hover:-translate-y-1"
                  >
                    <Link href={`/projects/${project.slug}`}>
                      <div className="relative h-48">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
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
                      <div className="grid grid-cols-3 gap-4 text-sm text-center mb-4">
                        <div>
                          <p className="font-bold text-primary-700">{project.duration}</p>
                          <p className="text-neutral-500">Duration</p>
                        </div>
                         <div>
                          <p className="font-bold text-primary-700">{project.beneficiaries}</p>
                          <p className="text-neutral-500">Beneficiaries</p>
                        </div>
                         <div>
                          <p className="font-bold text-primary-700">{project.teamSize}</p>
                          <p className="text-neutral-500">Team Size</p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                         <Button
                           variant="outline"
                           className="w-full border-primary-600 text-primary-600 hover:bg-primary-50"
                           asChild
                         >
                           <Link href={`/projects/${project.slug}`}>Learn More</Link>
                         </Button>
                         <Button
                           className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white"
                           onClick={() => openDonationModal(project)}
                         >
                           Donate
                         </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {totalPages > 1 && renderPagination()}
            </>
          )}
        </div>
      </section>

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