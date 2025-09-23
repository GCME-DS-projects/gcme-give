"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import { useGetMissionary } from "@/hooks/queries/use-missionaries-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, Calendar, Mail, Phone, Globe, Heart, Target, Users, ArrowLeft,
  Loader2, Award, BookOpen, MessageCircle, Share2, Gift, ExternalLink
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/public/common/header";
import Footer from "@/components/public/common/footer";
import DonationModal from "@/components/public/landing/donation-modal";

export default function MissionaryDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  // --- Data fetching is now handled by the hook ---
  const { 
    data: missionary, 
    isLoading, 
    isError 
  } = useGetMissionary(id);

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

  const openDonationModal = () => {
    if (!missionary) return;
    setDonationModal({
      isOpen: true,
      type: "missionary",
      title: missionary.user?.name || "Missionary",
      description: missionary.mission || `Support the ministry of ${missionary.user?.name}.`,
    });
  };

  const closeDonationModal = () => {
    setDonationModal({ ...donationModal, isOpen: false });
  };

  // --- Render states are driven by the hook's status ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (isError || !missionary) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50">
      <Header currentPage="missionaries" />

      <div className="relative pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-amber-500/5"></div>
        
        <div className="relative container mx-auto px-4 py-6">
          <Link href="/missionaries">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-stone-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Missionaries</span>
            </Button>
          </Link>
        </div>

        <section className="relative py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-1">
                  <div className="relative group">
                    <div className="relative w-80 h-80 mx-auto lg:mx-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-amber-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <Image
                        src={missionary.imageUrl || "/placeholder.svg"}
                        alt={missionary.user?.name || "Missionary"}
                        fill
                        className="object-cover rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {missionary.status && (
                      <div className="absolute -top-4 -right-4">
                        <Badge className="bg-green-500 text-white shadow-lg px-4 py-2 text-sm font-semibold">
                          <div className="w-2 h-2 rounded-full bg-white mr-2"></div>
                          {missionary.status}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-3 bg-gradient-to-r from-primary-600 to-amber-600 bg-clip-text text-transparent">
                        {missionary.user?.name}
                      </h1>
                      <p className="text-xl md:text-2xl text-stone-600 mb-2 font-medium">
                        {missionary.title || missionary.focus}
                      </p>
                       <div className="flex items-center space-x-2 text-stone-500">
                         <Award className="w-5 h-5 text-amber-500" />
                         <span className="font-medium">{missionary.qualification}</span>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-stone-200/50">
                          <div className="flex items-center space-x-2 text-stone-600 mb-1">
                             <MapPin className="w-4 h-4 text-primary-500" />
                             <span className="text-xs font-medium uppercase tracking-wide">Location</span>
                          </div>
                          <p className="font-semibold text-stone-800">{missionary.location}</p>
                       </div>
                       <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-stone-200/50">
                          <div className="flex items-center space-x-2 text-stone-600 mb-1">
                             <Calendar className="w-4 h-4 text-amber-500" />
                             <span className="text-xs font-medium uppercase tracking-wide">Experience</span>
                          </div>
                          <p className="font-semibold text-stone-800">{missionary.years} years</p>
                       </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-stone-200/50">
                          <div className="flex items-center space-x-2 text-stone-600 mb-1">
                             <Target className="w-4 h-4 text-green-500" />
                             <span className="text-xs font-medium uppercase tracking-wide">Focus</span>
                          </div>
                          <p className="font-semibold text-stone-800">{missionary.focus}</p>
                       </div>
                       <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-stone-200/50">
                          <div className="flex items-center space-x-2 text-stone-600 mb-1">
                             <Users className="w-4 h-4 text-blue-500" />
                             <span className="text-xs font-medium uppercase tracking-wide">Type</span>
                          </div>
                          <p className="font-semibold text-stone-800">{missionary.type}</p>
                       </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={openDonationModal}>
                         <Gift className="w-4 h-4 mr-2" /> Support Ministry
                      </Button>
                      <Button asChild variant="outline">
                        <a href={`mailto:${missionary.email}`}>
                           <MessageCircle className="w-4 h-4 mr-2" /> Send Message
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-gradient-to-r from-primary-50 to-amber-50">
           <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-12">
                 <h2 className="text-3xl md:text-4xl font-bold text-stone-800">Mission Statement</h2>
                 <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-amber-500 mx-auto rounded-full mt-4"></div>
              </div>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                 <CardContent className="p-8 text-lg text-stone-700 leading-relaxed font-medium">
                    {missionary.mission}
                 </CardContent>
              </Card>
           </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800">Biography</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-amber-500 mx-auto rounded-full mt-4"></div>
            </div>
             <Card className="bg-gradient-to-br from-stone-50 to-white border-0 shadow-lg">
                <CardContent className="p-8 prose prose-lg max-w-none text-stone-700 leading-relaxed whitespace-pre-wrap">
                   {missionary.fullBio || missionary.shortBio}
                </CardContent>
             </Card>
          </div>
        </section>

        {missionary.supportNeeds && missionary.supportNeeds.length > 0 && (
          <section className="py-20 bg-gradient-to-r from-stone-50 to-amber-50">
             <div className="container mx-auto px-4 max-w-4xl">
               <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-stone-800">Support Needs</h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-amber-500 mx-auto rounded-full mt-4"></div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {missionary.supportNeeds.map((need, index) => (
                    <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                       <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-lg">
                             <Gift className="w-5 h-5 text-primary-600" />
                             <span>{need.item}</span>
                          </CardTitle>
                       </CardHeader>
                       <CardContent className="space-y-4">
                          <div className="text-3xl font-bold text-primary-600">
                             {need.amount.toLocaleString('en-US', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0 })}
                          </div>
                          <p className="text-stone-600 text-sm">{need.description}</p>
                       </CardContent>
                    </Card>
                  ))}
               </div>
             </div>
          </section>
        )}
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