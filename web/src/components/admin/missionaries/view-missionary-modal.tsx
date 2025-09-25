"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Missionary } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Layers,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  BookOpen,
  CalendarDays,
  Target,
  Users,
  Building,
  Hash,
  Fingerprint,
  TrendingUp,
  X,
  HeartHandshake
} from "lucide-react";
import React from "react";
import Image from "next/image";

// --- Reusable Sub-components for a clean layout ---

const InfoItem = ({ icon: Icon, label, value, isLink = false }: { icon: React.ElementType; label: string; value?: string | null; isLink?: boolean }) => {
  const content = value ? (
    isLink ? <a href={value.startsWith('http') ? value : `mailto:${value}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{value}</a> : value
  ) : (
    <span className="text-slate-400 italic">N/A</span>
  );
  
  return (
    <div className="flex items-start">
      <Icon className="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-slate-400" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="text-sm text-slate-800">{content}</p>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: number | null }) => (
    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border">
        <div className="p-3 bg-blue-100 rounded-lg">
            <Icon className="w-6 h-6 text-blue-700" />
        </div>
        <div>
            <p className="text-2xl font-bold text-[#001F54]">{value?.toLocaleString() ?? '0'}</p>
            <p className="text-sm text-slate-500">{label}</p>
        </div>
    </div>
);

// --- Main Modal Component ---

export function ViewMissionaryModal({ missionary, isOpen, onOpenChange }: { missionary: Missionary, isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
  if (!missionary) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-slate-100 rounded-2xl shadow-2xl flex flex-col">
        {/* --- Header --- */}
        <div className="relative">
            <div className="h-32 bg-[#001F54] rounded-t-2xl" />
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full">
                <X className="w-5 h-5" />
            </Button>
            <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center">
                <Image
                  src={missionary.user.image || `https://ui-avatars.com/api/?name=${missionary.user.name}&background=0D47A1&color=fff&size=128`}
                  alt={missionary.user.name || "User"}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover border-8 border-slate-100 shadow-lg"
                />

                <h2 className="mt-4 text-3xl font-bold text-[#001F54]">{missionary.user.name}</h2>
                <p className="text-slate-500">{missionary.title || 'Missionary'}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">{missionary.type}</Badge>
                  <Badge className={missionary.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{missionary.status}</Badge>
                </div>
            </div>
        </div>

        {/* --- Tabbed Content --- */}
        <Tabs defaultValue="overview" className="pt-40 flex-grow flex flex-col">
          <TabsList className="mx-auto grid w-full max-w-lg grid-cols-4 bg-slate-200">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ministry">Ministry Details</TabsTrigger>
            <TabsTrigger value="support">Support & Prayer</TabsTrigger>
            <TabsTrigger value="admin">Admin Info</TabsTrigger>
          </TabsList>

          <div className="p-6 md:p-8 flex-grow">
            {/* Overview Tab */}
            <TabsContent value="overview" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <h3 className="font-semibold text-slate-800">Biography</h3>
                    <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed">{missionary.fullBio || missionary.shortBio || "No biography provided."}</p>
                </div>
                <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800">Contact</h3>
                    <InfoItem icon={Mail} label="Email" value={missionary.user.email} isLink={true} />
                    <InfoItem icon={Phone} label="Phone" value={missionary.phone} />
                    <InfoItem icon={Globe} label="Website" value={missionary.website} isLink={true} />
                    <InfoItem icon={MapPin} label="Location" value={missionary.location} />
                </div>
            </TabsContent>

            {/* Ministry Details Tab */}
            <TabsContent value="ministry" className="space-y-8">
                 <div>
                    <h3 className="font-semibold text-slate-800 mb-4">Mission Statement</h3>
                    <p className="text-slate-600 whitespace-pre-wrap text-sm italic border-l-4 border-blue-200 pl-4 py-2">
                        {missionary.mission || "No mission statement provided."}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoItem icon={Target} label="Ministry Focus" value={missionary.focus} />
                    <InfoItem icon={Layers} label="Strategy" value={missionary.strategyId ? 'Strategy Assigned' : 'N/A'} />
                    <InfoItem icon={BookOpen} label="Qualification" value={missionary.qualification} />
                    <InfoItem icon={CalendarDays} label="Years of Experience" value={missionary.years} />
                    <InfoItem icon={Briefcase} label="Experience" value={missionary.experience} />
                    <InfoItem icon={Briefcase} label="Role" value={missionary.role} />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800 mb-4">Impact Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard icon={TrendingUp} label="Lives Impacted" value={missionary.livesImpacted} />
                        <StatCard icon={Users} label="Communities Served" value={missionary.communitiesServed} />
                        <StatCard icon={Briefcase} label="Projects Completed" value={missionary.projectsCompleted} />
                    </div>
                </div>
            </TabsContent>

            {/* Support & Prayer Tab */}
            <TabsContent value="support" className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><HeartHandshake className="w-5 h-5 text-blue-600"/> Support Needs</h3>
                    {missionary.supportNeeds && missionary.supportNeeds.length > 0 ? (
                        <div className="space-y-3">
                        {missionary.supportNeeds.map((need, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg border shadow-sm">
                            <div className="flex justify-between items-baseline"><h4 className="font-semibold text-slate-800">{need.item}</h4><p className="text-lg font-bold text-blue-700">${Number(need.amount).toLocaleString()}</p></div>
                            <p className="text-sm text-slate-500 mt-1">{need.description}</p>
                            </div>
                        ))}
                        </div>
                    ) : <p className="text-sm text-slate-500 italic">No specific support needs listed.</p>}
                </div>
                 <div>
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Heart className="w-5 h-5 text-red-500"/> Prayer Requests</h3>
                    {missionary.prayerRequests && missionary.prayerRequests.length > 0 ? (
                        <ul className="space-y-3">
                        {missionary.prayerRequests.map((req, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">{req}</li>
                        ))}
                        </ul>
                    ) : <p className="text-sm text-slate-500 italic">No specific prayer requests listed.</p>}
                </div>
            </TabsContent>

            {/* Admin Info Tab */}
            <TabsContent value="admin">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Organizational Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InfoItem icon={Fingerprint} label="Staff ID" value={missionary.staffId} />
                        <InfoItem icon={Hash} label="Designation No." value={missionary.designationNumber} />
                        <InfoItem icon={Building} label="Region" value={missionary.region} />
                        <InfoItem icon={Fingerprint} label="Parent RC" value={missionary.parentRc} />
                        <InfoItem icon={Hash} label="RC Account" value={missionary.rcAccount} />
                    </div>
                </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}