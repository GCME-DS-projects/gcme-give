"use client";

import { useState } from 'react';
import { useForm, Controller, useFieldArray, FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MediaUpload } from '@/components/admin/missionaries/media-upload';
import { CreateMissionaryDto, Missionary, Strategy } from '@/lib/types';
import { Loader2, PlusCircle, Trash, ArrowRight, ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const formSchema = z.object({
  // Step 1: Basic Info
  imageUrl: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  type: z.string().optional(),

  // Step 2: Biography
  shortBio: z.string().optional(),
  fullBio: z.string().optional(),
  mission: z.string().optional(),

  // Step 3: Ministry Details
  qualification: z.string().optional(),
  experience: z.string().optional(),
  years: z.string().optional(),
  focus: z.string().optional(),
  strategyId: z.string().optional(),
  livesImpacted: z.number().optional(),
  communitiesServed: z.number().optional(),
  projectsCompleted: z.number().optional(),
  
  // Step 4: Support & Prayer
  prayerRequests: z.array(z.object({ value: z.string().min(1, "Request cannot be empty") })).optional(),
  supportNeeds: z.array(z.object({
    item: z.string().min(1, "Item name is required"),
    amount: z.number().min(0, "Amount must be positive"),
    description: z.string().optional()
  })).optional(),
  
  // Step 5: Organizational
  staffId: z.string().optional(),
  parentRc: z.string().optional(),
  rcAccount: z.string().optional(),
  designationNumber: z.string().optional(),
  region: z.string().optional(),
  role: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type FormSubmitDto = Omit<CreateMissionaryDto, 'userId'>;

// FIX STARTS HERE: Define a 'Step' type to strongly type the `fields` array.
type Step = {
  id: string;
  name: string;
  fields: FieldPath<FormValues>[]; //
};

// Apply the `Step[]` type to the `steps` constant.
const steps: Step[] = [
    { id: 'Step 1', name: 'Basic Info', fields: ['title', 'phone', 'location', 'website', 'status', 'type'] },
    { id: 'Step 2', name: 'Biography', fields: ['shortBio', 'fullBio', 'mission'] },
    { id: 'Step 3', name: 'Ministry Details', fields: ['focus', 'strategyId', 'qualification', 'years', 'experience', 'livesImpacted', 'communitiesServed', 'projectsCompleted'] },
    { id: 'Step 4', name: 'Support & Prayer', fields: ['prayerRequests', 'supportNeeds'] },
    { id: 'Step 5', name: 'Organizational', fields: ['staffId', 'parentRc', 'rcAccount', 'designationNumber', 'region', 'role'] }
];
// FIX ENDS HERE

interface MissionaryFormProps {
  onSubmit: (data: FormSubmitDto) => void;
  isPending: boolean;
  defaultValues?: Partial<Missionary>;
  strategies: Strategy[];
}

export function MissionaryForm({ onSubmit, isPending, defaultValues, strategies }: MissionaryFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
    const { control, handleSubmit, setValue, watch, trigger } = useForm<FormValues>({
        resolver: zodResolver<FormValues, unknown, FormValues>(formSchema),
        defaultValues: {
            imageUrl: defaultValues?.user?.image || '',
            title: defaultValues?.title || '',
            phone: defaultValues?.phone || '',
            location: defaultValues?.location || '',
            website: defaultValues?.website || '',
            status: defaultValues?.status || '',
            type: defaultValues?.type || '',

            shortBio: defaultValues?.shortBio || '',
            fullBio: defaultValues?.fullBio || '',
            mission: defaultValues?.mission || '',

            qualification: defaultValues?.qualification || '',
            experience: defaultValues?.experience || '',
            years: defaultValues?.years || '',
            focus: defaultValues?.focus || '',
            strategyId: defaultValues?.strategyId || '',
            livesImpacted: defaultValues?.livesImpacted || 0,
            communitiesServed: defaultValues?.communitiesServed || 0,
            projectsCompleted: defaultValues?.projectsCompleted || 0,

            prayerRequests: defaultValues?.prayerRequests?.map(pr => ({ value: pr })) || [],
            supportNeeds: defaultValues?.supportNeeds || [],

            staffId: defaultValues?.staffId || '',
            parentRc: defaultValues?.parentRc || '',
            rcAccount: defaultValues?.rcAccount || '',
            designationNumber: defaultValues?.designationNumber || '',
            region: defaultValues?.region || '',
            role: defaultValues?.role || '',
        }
    });

  
  const { fields: supportFields, append: appendSupport, remove: removeSupport } = useFieldArray({ control, name: "supportNeeds" });
  const { fields: prayerFields, append: appendPrayer, remove: removePrayer } = useFieldArray({ control, name: "prayerRequests" });
  
  const imageUrl = watch('imageUrl');

  const handleFormSubmit = (data: FormValues) => {
    const formattedData = {
        ...data,
        prayerRequests: data.prayerRequests?.map(pr => pr.value)
    };
    onSubmit(formattedData as FormSubmitDto);
  };

  const handleNext = async () => {
    const fields = steps[currentStep].fields;
    // Because `steps` is now strongly typed, this line will no longer cause a TypeScript error.
    const output = await trigger(fields, { shouldFocus: true }); 

    if (!output) return;

    if (currentStep < steps.length - 1) {
        setCurrentStep(step => step + 1);
    } else {
        await handleSubmit(handleFormSubmit)();
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
        setCurrentStep(step => step - 1);
    }
  }

  return (
    <div className="p-4 sm:p-6 bg-slate-50 rounded-xl">
        {/* Stepper Navigation */}
        <nav aria-label="Progress">
            <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                {steps.map((step, index) => (
                    <li key={step.name} className="md:flex-1">
                        <div className={`group flex flex-col border-l-4 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0 ${index <= currentStep ? 'border-[#001F54]' : 'border-gray-200'}`}>
                            <span className={`text-sm font-medium transition-colors ${index <= currentStep ? 'text-[#001F54]' : 'text-gray-500'}`}>{step.id}</span>
                            <span className="text-sm font-medium">{step.name}</span>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>

        <form className="mt-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* --- Step 1: Basic Info & Image --- */}
                    {currentStep === 0 && (
                        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                             <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-1 space-y-4">
                                    <Label className="text-sm font-medium text-gray-700">Profile Image</Label>
                                    <MediaUpload
                                        currentImage={imageUrl}
                                        onImageUpload={(url) => setValue('imageUrl', url, { shouldValidate: true })}
                                        onRemove={() => setValue('imageUrl', undefined, { shouldValidate: true })}
                                        disabled={isPending}
                                    />
                                </div>
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Controller name="title" control={control} render={({ field, fieldState }) => ( <div><Label htmlFor={field.name} className="text-sm font-medium text-gray-700">Title/Role</Label><Input id={field.name} {...field} placeholder="e.g., Lead Missionary, Evangelist" className="rounded-md mt-1" /><p className="text-red-500 text-xs mt-1">{fieldState.error?.message}</p></div> )}/>
                                    <Controller name="phone" control={control} render={({ field }) => ( <div><Label htmlFor={field.name} className="text-sm font-medium text-gray-700">Phone</Label><Input id={field.name} {...field} placeholder="+251-XXX-XXXXXX" className="rounded-md mt-1" /></div> )}/>
                                    <Controller name="location" control={control} render={({ field }) => ( <div><Label htmlFor={field.name} className="text-sm font-medium text-gray-700">Location</Label><Input id={field.name} {...field} placeholder="e.g., Addis Ababa, Ethiopia" className="rounded-md mt-1" /></div> )}/>
                                    <Controller name="website" control={control} render={({ field }) => ( <div><Label htmlFor={field.name} className="text-sm font-medium text-gray-700">Website</Label><Input id={field.name} {...field} placeholder="https://missionaryname.org" className="rounded-md mt-1" /></div> )}/>
                                    <Controller name="status" control={control} render={({ field, fieldState }) => ( <div><Label className="text-sm font-medium text-gray-700">Status</Label><Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger className="rounded-md mt-1"><SelectValue placeholder="Select status" /></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select><p className="text-red-500 text-xs mt-1">{fieldState.error?.message}</p></div> )}/>
                                    <Controller name="type" control={control} render={({ field }) => ( <div><Label className="text-sm font-medium text-gray-700">Type</Label><Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger className="rounded-md mt-1"><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="Full-time">Full-time</SelectItem><SelectItem value="Part-time">Part-time</SelectItem></SelectContent></Select></div> )}/>
                                </div>
                             </div>
                        </div>
                    )}
                    {/* --- Step 2: Bio & Mission --- */}
                    {currentStep === 1 && (
                        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Biography & Mission</h2>
                            <Controller name="shortBio" control={control} render={({ field }) => ( <div><Label htmlFor={field.name} className="text-sm font-medium text-gray-700">Short Bio</Label><Textarea id={field.name} {...field} rows={2} placeholder="A brief summary..." className="rounded-md mt-1" /></div> )}/>
                            <Controller name="fullBio" control={control} render={({ field }) => ( <div><Label htmlFor={field.name} className="text-sm font-medium text-gray-700">Full Biography</Label><Textarea id={field.name} {...field} rows={5} placeholder="Provide a detailed biography..." className="rounded-md mt-1" /></div> )}/>
                            <Controller name="mission" control={control} render={({ field }) => ( <div><Label htmlFor={field.name} className="text-sm font-medium text-gray-700">Mission Statement</Label><Textarea id={field.name} {...field} rows={3} placeholder="What is the core mission?" className="rounded-md mt-1" /></div> )}/>
                        </div>
                    )}
                    {/* --- Step 3: Ministry Details --- */}
                    {currentStep === 2 && (
                        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Ministry Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <Controller name="focus" control={control} render={({ field }) => ( <div><Label htmlFor={field.name} className="text-sm font-medium text-gray-700">Focus Area</Label><Input id={field.name} {...field} placeholder="e.g., Youth Evangelism" className="rounded-md mt-1" /></div> )}/>
                                    <Controller name="strategyId" control={control} render={({ field }) => ( <div><Label className="text-sm font-medium text-gray-700">Strategy</Label><Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger className="rounded-md mt-1"><SelectValue placeholder="Assign strategy" /></SelectTrigger><SelectContent>{strategies.map(s => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}</SelectContent></Select></div> )}/>
                                    <Controller name="qualification" control={control} render={({ field }) => ( <div><Label htmlFor={field.name} className="text-sm font-medium text-gray-700">Qualification</Label><Input id={field.name} {...field} placeholder="e.g., M.Div" className="rounded-md mt-1" /></div> )}/>
                                    <Controller name="years" control={control} render={({ field }) => ( <div><Label htmlFor={field.name} className="text-sm font-medium text-gray-700">Years of Experience</Label><Input id={field.name} {...field} placeholder="e.g., 5 years" className="rounded-md mt-1" /></div> )}/>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-700 mb-4">Impact Statistics</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Controller name="livesImpacted" control={control} render={({ field }) => ( <div><Label htmlFor={field.name} className="text-sm font-medium text-gray-700">Lives Impacted</Label><Input id={field.name} type="number" {...field} placeholder="e.g., 1500" className="rounded-md mt-1" /></div> )}/>
                                    <Controller name="communitiesServed" control={control} render={({ field }) => ( <div><Label htmlFor={field.name} className="text-sm font-medium text-gray-700">Communities Served</Label><Input id={field.name} type="number" {...field} placeholder="e.g., 15" className="rounded-md mt-1" /></div> )}/>
                                    <Controller name="projectsCompleted" control={control} render={({ field }) => ( <div><Label htmlFor={field.name} className="text-sm font-medium text-gray-700">Projects Completed</Label><Input id={field.name} type="number" {...field} placeholder="e.g., 7" className="rounded-md mt-1" /></div> )}/>
                                </div>
                            </div>
                        </div>
                    )}
                     {/* --- Step 4: Prayer & Support --- */}
                    {currentStep === 3 && (
                         <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 space-y-12">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Prayer Requests</h2>
                                <div className="space-y-4 mt-2">
                                    {prayerFields.map((field, index) => (
                                        <div key={field.id} className="flex items-center gap-3">
                                            <Controller name={`prayerRequests.${index}.value`} control={control} render={({ field, fieldState }) => <div className="flex-grow"><Input placeholder={`Request #${index + 1}`} {...field} className="rounded-md" /><p className="text-red-500 text-xs mt-1">{fieldState.error?.message}</p></div>} />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removePrayer(index)} className="rounded-md"><Trash className="h-4 w-4 text-red-500" /></Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => appendPrayer({ value: '' })} className="rounded-md w-full md:w-auto"><PlusCircle className="h-4 w-4 mr-2" /> Add Request</Button>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Support Needs</h2>
                                <div className="space-y-4 mt-2">
                                    {supportFields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-12 gap-3 p-4 border rounded-lg bg-gray-50 items-start">
                                            <Controller name={`supportNeeds.${index}.item`} control={control} render={({ field, fieldState }) => <div className="col-span-12 md:col-span-4"><Label className="text-xs text-gray-600">Item</Label><Input placeholder="e.g., Monthly support" {...field} className="rounded-md mt-1" /><p className="text-red-500 text-xs mt-1">{fieldState.error?.message}</p></div>} />
                                            <Controller name={`supportNeeds.${index}.amount`} control={control} render={({ field, fieldState }) => <div className="col-span-6 md:col-span-3"><Label className="text-xs text-gray-600">Amount</Label><Input placeholder="e.g., 500" type="number" {...field} className="rounded-md mt-1" /><p className="text-red-500 text-xs mt-1">{fieldState.error?.message}</p></div>} />
                                            <Controller name={`supportNeeds.${index}.description`} control={control} render={({ field }) => <div className="col-span-6 md:col-span-4"><Label className="text-xs text-gray-600">Desc.</Label><Input placeholder="Short note" {...field} className="rounded-md mt-1" /></div>} />
                                            <div className="col-span-12 md:col-span-1 flex justify-end md:justify-center items-center h-full pt-6 md:pt-0"><Button type="button" variant="ghost" size="icon" onClick={() => removeSupport(index)} className="rounded-md"><Trash className="h-4 w-4 text-red-500" /></Button></div>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => appendSupport({ item: '', amount: 0, description: '' })} className="rounded-md w-full md:w-auto"><PlusCircle className="h-4 w-4 mr-2" /> Add Need</Button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* --- Step 5: Organizational Info --- */}
                    {currentStep === 4 && (
                        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Organizational Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Controller name="staffId" control={control} render={({ field }) => ( <div><Label htmlFor={field.name} className="text-sm font-medium text-gray-700">Staff ID</Label><Input id={field.name} {...field} placeholder="e.g., GCME-001" className="rounded-md mt-1" /></div> )}/>
                                <Controller name="parentRc" control={control} render={({ field }) => ( <div><Label htmlFor={field.name} className="text-sm font-medium text-gray-700">Parent RC</Label><Input id={field.name} {...field} placeholder="e.g., Global Ministries" className="rounded-md mt-1" /></div> )}/>
                                <Controller name="rcAccount" control={control} render={({ field }) => ( <div><Label htmlFor={field.name} className="text-sm font-medium text-gray-700">RC Account</Label><Input id={field.name} {...field} placeholder="e.g., 123456789" className="rounded-md mt-1" /></div> )}/>
                                <Controller name="designationNumber" control={control} render={({ field }) => ( <div><Label htmlFor={field.name} className="text-sm font-medium text-gray-700">Designation No.</Label><Input id={field.name} {...field} placeholder="e.g., D-9876" className="rounded-md mt-1" /></div> )}/>
                                <Controller name="region" control={control} render={({ field }) => ( <div><Label htmlFor={field.name} className="text-sm font-medium text-gray-700">Region</Label><Input id={field.name} {...field} placeholder="e.g., East Africa" className="rounded-md mt-1" /></div> )}/>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </form>

        {/* Navigation Buttons */}
        <div className="mt-8 pt-5">
            <div className="flex justify-between">
                <Button type="button" onClick={handlePrev} disabled={currentStep === 0} variant="outline" className="rounded-lg">
                    <ArrowLeft className="w-4 h-4 mr-2"/>
                    Previous
                </Button>
                 <Button type="button" onClick={handleNext} disabled={isPending} className="px-6 py-3 rounded-lg bg-[#001F54] hover:bg-[#001F54]/90">
                    {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    {currentStep === steps.length - 1 ? 'Save Missionary' : 'Next Step'}
                    {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4 ml-2"/>}
                </Button>
            </div>
        </div>
    </div>
  );
}