"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  ArrowLeft,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DonationModal from "@/components/public/common/donation-modal";
import Header from "@/components/public/common/header";
import { Project, Testimonial, TimelineEntry } from "@/lib/types";

interface ProjectDetailClientProps {
  project: Project; // Replace with proper type from your project data
}

export default function ProjectDetailClient({
  project,
}: ProjectDetailClientProps) {
  const [donationModal, setDonationModal] = useState<{
    isOpen: boolean;
    type: "project" | "missionary";
    title: string;
    description?: string;
  }>({
    isOpen: false,
    type: "project",
    title: "",
  });

  const openDonationModal = (
    type: "project" | "missionary",
    title: string,
    description?: string,
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
    });
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link
          href="/projects"
          className="inline-flex items-center text-stone-600 hover:text-stone-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">
                    {project.title}
                  </CardTitle>
                  <Badge variant="secondary">{project.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative mb-6">
                  <Image
                    src={project.image ?? "/placeholder.png"}
                    alt={project.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <p className="text-stone-600 mb-6">
                  {project.shortDescription}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-lg font-bold text-stone-800">
                      {project.fundingRaised.toLocaleString()} ETB
                    </div>
                    <div className="text-xs text-stone-600">Raised</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-lg font-bold text-stone-800">
                      {project.fundingGoal.toLocaleString()} ETB
                    </div>
                    <div className="text-xs text-stone-600">Goal</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-lg font-bold text-stone-800">
                      {project.beneficiaries}
                    </div>
                    <div className="text-xs text-stone-600">Beneficiaries</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-lg font-bold text-stone-800">
                      {project.duration}
                    </div>
                    <div className="text-xs text-stone-600">Duration</div>
                  </div>
                </div>
                <Progress
                  value={((Number(project.fundingRaised) || 0) / (Number(project.fundingGoal) || 1)) * 100}
                  className="mb-6"
                />
                
                <Button
                  className="w-full bg-[#f18b1e] hover:bg-[#e2730c] text-white"
                  onClick={() => openDonationModal("project", project.title)}
                >
                  Donate Now
                </Button>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">The Problem</h3>
                  <p className="text-stone-600 whitespace-pre-line">
                    {project.problem}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Our Solution</h3>
                  <p className="text-stone-600 whitespace-pre-line">
                    {project.solution}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Expected Impact</h3>
                  <ul className="list-disc list-inside text-stone-600 space-y-2">
                    {project.impact.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.timeLine?.map((phase: TimelineEntry, index: number) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {phase.status === "completed" && (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        )}
                        {phase.status === "in-progress" && (
                          <Clock className="w-6 h-6 text-blue-500" />
                        )}
                        {phase.status === "upcoming" && (
                          <AlertTriangle className="w-6 h-6 text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{phase.phase}</h4>
                        <p className="text-sm text-stone-600">
                          {phase.duration}
                        </p>
                        <p className="text-stone-600">{phase.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Location Card */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-stone-600">
                  <MapPin className="w-4 h-4" />
                  <span>{project.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Urgency Card */}
            <Card>
              <CardHeader>
                <CardTitle>Project Urgency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-red-500" />
                    <span className="font-semibold">{project.urgency}</span>
                  </div>
                  <ul className="list-disc list-inside text-stone-600 space-y-2">
                    {project.urgencyFactors.map(
                      (factor: string, index: number) => (
                        <li key={index}>{factor}</li>
                      ),
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card>
              <CardHeader>
                <CardTitle>Community Voices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.testimonials?.map((testimonial: Testimonial, index: number) => (
                      <div key={index} className="bg-stone-50 p-4 rounded-lg">
                        <p className="text-stone-600 italic mb-2">
                          &quot;{testimonial.quote}&quot;
                        </p>
                        <div className="text-sm">
                          <span className="font-semibold">
                            {testimonial.name}
                          </span>
                          <span className="text-stone-600">
                            {" "}
                            - {testimonial.role}
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

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
