"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Target, Users, BarChart3, AlertCircle, Lightbulb } from "lucide-react";

interface ProjectModalProps {
  project: Project;
  onOpenChange: (isOpen: boolean) => void;
}

export function ProjectModal({ project, onOpenChange }: ProjectModalProps) {
  if (!project) return null;

  return (
    <Dialog open={!!project} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl bg-gradient-to-br from-white via-[#f9fbfd] to-[#f1f4f9] p-10 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] border border-[#001F54]/10">
        <DialogHeader className="space-y-3 text-center mb-6">
          <DialogTitle className="text-3xl font-extrabold text-[#001F54] tracking-tight">
            {project.title}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-base">
            Strategy:{" "}
            <span className="font-medium text-[#001F54]">
              {project.Strategy?.title ?? "No strategy"}
            </span>
          </DialogDescription>
        </DialogHeader>

        {project.image && (
          <div className="relative mb-8">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-80 object-cover rounded-2xl shadow-md border border-gray-200"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#001F54]/30 to-transparent" />
          </div>
        )}

        <div className="space-y-10 text-gray-800">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
            <p className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#001F54]" />
              <span className="font-semibold text-[#001F54]">Location:</span>{" "}
              {project.location}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#001F54]" />
              <span className="font-semibold text-[#001F54]">Duration:</span>{" "}
              {project.duration}
            </p>
          </div>

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100">
              <Target className="mx-auto mb-2 w-6 h-6 text-[#001F54]" />
              <p className="text-sm text-gray-500">Funding Goal</p>
              <p className="font-bold text-xl text-[#001F54]">
                ${Number(project.fundingGoal).toLocaleString()}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100">
              <BarChart3 className="mx-auto mb-2 w-6 h-6 text-[#001F54]" />
              <p className="text-sm text-gray-500">Funding Raised</p>
              <p className="font-bold text-xl text-[#001F54]">
                ${Number(project.fundingRaised).toLocaleString()}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100">
              <Users className="mx-auto mb-2 w-6 h-6 text-[#001F54]" />
              <p className="text-sm text-gray-500">Beneficiaries</p>
              <p className="font-bold text-xl text-[#001F54]">
                {project.beneficiaries}
              </p>
            </div>
          </div>

          <Separator />

          {/* Problem */}
          <section>
            <h3 className="flex items-center gap-2 text-xl font-semibold text-[#001F54] mb-3">
              <AlertCircle className="w-5 h-5 text-[#001F54]" /> Problem
            </h3>
            <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
              {project.problem}
            </p>
          </section>

          {/* Solution */}
          <section>
            <h3 className="flex items-center gap-2 text-xl font-semibold text-[#001F54] mb-3">
              <Lightbulb className="w-5 h-5 text-[#001F54]" /> Solution
            </h3>
            <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
              {project.solution}
            </p>
          </section>

          {/* Impact */}
          {project.impact?.length > 0 && (
            <section>
              <h3 className="flex items-center gap-2 text-xl font-semibold text-[#001F54] mb-3">
                <BarChart3 className="w-5 h-5 text-[#001F54]" /> Impact
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                {project.impact.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Urgency Factors */}
          {project.urgencyFactors?.length > 0 && (
            <section>
              <h3 className="flex items-center gap-2 text-xl font-semibold text-[#001F54] mb-3">
                <AlertCircle className="w-5 h-5 text-[#001F54]" /> Urgency Factors
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                {project.urgencyFactors.map((factor, i) => (
                  <li key={i}>{factor}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="flex justify-center pt-10">
          <Button
            onClick={() => onOpenChange(false)}
            className="px-10 py-3 bg-[#001F54] text-white font-semibold rounded-xl shadow-md hover:bg-[#00296b] transition-colors"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
