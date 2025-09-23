"use client";

import { useMemo, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { useGetProjects } from "@/hooks/queries/use-projects-query";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  Loader2,
  MapPin,
  Target,
  Users,
} from "lucide-react";
import { Project } from "@/lib/types";
import Header from "@/components/public/common/header";
import Footer from "@/components/public/common/footer";
import DonationModal from "@/components/public/landing/donation-modal";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // --- Data Fetching & Selection ---
  const { data: projects = [], isLoading, isError } = useGetProjects();
  
  const project = useMemo(() => 
    projects.find((p: Project) => p.slug === slug)
  , [projects, slug]);

  const [donationModal, setDonationModal] = useState({
    isOpen: false,
    type: "project" as "project" | "missionary",
    title: "",
    description: "",
  });

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


  // --- Render States ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  // After loading, if there's an error or the project isn't found, show notFound.
  if (isError || !project) {
    notFound();
  }
  
  const fundingPercentage = Math.round((project.fundingRaised / project.fundingGoal) * 100);

  return (
    <div className="bg-neutral-50">
      <Header />
      <main className="pt-20">
        {/* Header Section */}
        <section className="py-16 bg-white border-b">
          <div className="container mx-auto px-4">
            <Link href="/projects" className="inline-flex items-center text-primary-600 hover:underline mb-8">
              <ArrowLeft className="w-4 h-4 mr-2"/>
              Back to All Projects
            </Link>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4">{project.category}</Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">{project.title}</h1>
                <p className="text-lg text-neutral-600">{project.shortDescription}</p>
              </div>
              <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover"/>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>The Problem</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none">
                    <p>{project.problem}</p>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader>
                    <CardTitle>Our Solution</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none">
                     <p>{project.solution}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Expected Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {project.impact.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0"/>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <aside className="lg:col-span-1 space-y-6">
                <Card className="sticky top-28">
                   <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                     <div className="flex items-center">
                       <MapPin className="w-4 h-4 mr-3 text-neutral-400"/>
                       <span>{project.location}</span>
                     </div>
                     <div className="flex items-center">
                       <Clock className="w-4 h-4 mr-3 text-neutral-400"/>
                       <span>{project.duration}</span>
                     </div>
                     <div className="flex items-center">
                       <Users className="w-4 h-4 mr-3 text-neutral-400"/>
                       <span>{project.teamSize} Team Members</span>
                     </div>
                     <div className="flex items-center">
                       <Target className="w-4 h-4 mr-3 text-neutral-400"/>
                       <span>{project.beneficiaries}</span>
                     </div>
                  </CardContent>
                </Card>
                <Card>
                   <CardHeader>
                     <CardTitle>Support This Project</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="mb-4">
                       <div className="flex justify-between items-end mb-1">
                         <p className="text-2xl font-bold text-primary-600">
                           {project.fundingRaised.toLocaleString('en-US')} ETB
                         </p>
                         <p className="text-neutral-500 text-sm">
                           raised of {project.fundingGoal.toLocaleString('en-US')} ETB
                         </p>
                       </div>
                       <Progress value={fundingPercentage} className="h-2"/>
                     </div>
                     <Button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white" onClick={() => openDonationModal(project)}>
                       <Heart className="w-4 h-4 mr-2"/>
                       Donate Now
                     </Button>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </section>
      </main>
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