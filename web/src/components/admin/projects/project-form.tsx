import { useForm, Controller, Control, FieldValues, Path, UseFormStateReturn, ControllerFieldState, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MediaUpload } from '@/components/admin/projects/media-upload';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetStrategies } from '@/hooks/queries/use-strategies-query';
import { Strategy } from '@/lib/types';

// ✅ schema aligned with backend DTO
const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  image: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  location: z.string().optional(),
  duration: z.string().optional(),
  teamSize: z.string().optional(),
  fundingGoal: z.string().min(1, 'Funding goal is required'),
  fundingRaised: z.string().optional(),
  beneficiaries: z.string().optional(),
  problem: z.string().min(1, 'Problem definition is required'),
  solution: z.string().min(1, 'Problem Solution is required'),
  urgency: z.string().optional(),
  urgencyFactors: z.array(z.string()).optional(),
  impact: z.array(z.string()),
  timeLine: z.any().optional(),
  testimonials: z.any().optional(),
  strategyId: z.string().uuid().min(1, 'Strategy is required'),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  onSubmit: (data: ProjectFormValues) => void;
  isPending: boolean;
  defaultValues?: ProjectFormValues;
}

export function ProjectForm({ onSubmit, isPending, defaultValues }: ProjectFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      slug: defaultValues?.slug ?? '',
      shortDescription: defaultValues?.shortDescription ?? '',
      image: defaultValues?.image ?? '',
      category: defaultValues?.category ?? '',
      location: defaultValues?.location ?? '',
      duration: defaultValues?.duration ?? '',
      teamSize: defaultValues?.teamSize ?? '',
      fundingGoal: defaultValues?.fundingGoal ?? '',
      fundingRaised: defaultValues?.fundingRaised ?? '',
      beneficiaries: defaultValues?.beneficiaries ?? '',
      problem: defaultValues?.problem ?? '',
      solution: defaultValues?.solution ?? '',
      urgency: defaultValues?.urgency ?? '',
      urgencyFactors: defaultValues?.urgencyFactors ?? [],
      impact: defaultValues?.impact ?? [],
      timeLine: defaultValues?.timeLine ?? null,
      testimonials: defaultValues?.testimonials ?? null,
      strategyId: defaultValues?.strategyId ?? undefined,
    },
  });

  const { data: strategies, isLoading: loadingStrategies } = useGetStrategies();
  const currentImage = watch('image');
  const urgencyFactors = watch('urgencyFactors') || [];
  const impact = watch('impact') || [];

  // Helpers to manage dynamic arrays
  const addItem = (name: 'urgencyFactors' | 'impact') => {
    const current = watch(name) || [];
    setValue(name, [...current, '']);
  };

  const updateItem = (name: 'urgencyFactors' | 'impact', index: number, value: string) => {
    const current = [...(watch(name) || [])];
    current[index] = value;
    setValue(name, current, { shouldValidate: true });
  };

  const removeItem = (name: 'urgencyFactors' | 'impact', index: number) => {
    const current = [...(watch(name) || [])];
    current.splice(index, 1);
    setValue(name, current, { shouldValidate: true });
  };

  return (
    <Card className="bg-white shadow-xl rounded-2xl border border-navy-200">
      <CardContent className="p-8 space-y-6">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title + Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Title"
              description="Enter a clear, concise project title."
              error={errors.title?.message}
              control={control}
              name="title"
              render={({ field }) => <Input id="title" {...field} className="rounded-xl border-gray-300" />}
            />
            <FormField
              label="Slug"
              description="A unique identifier for the project (used in the URL)."
              error={errors.slug?.message}
              control={control}
              name="slug"
              render={({ field }) => <Input id="slug" {...field} className="rounded-xl border-gray-300" />}
            />
          </div>

          {/* Short Description */}
          <FormField
            label="Short Description"
            description="Briefly explain what this project is about."
            error={errors.shortDescription?.message}
            control={control}
            name="shortDescription"
            render={({ field }) => <Textarea id="shortDescription" {...field} rows={3} className="rounded-xl border-gray-300" />}
          />

          {/* Category + Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Category"
              description="E.g., Education, Health, Environment."
              error={errors.category?.message}
              control={control}
              name="category"
              render={({ field }) => <Input id="category" {...field} className="rounded-xl border-gray-300" />}
            />
            <FormField
              label="Location"
              description="Where will this project take place?"
              error={errors.location?.message}
              control={control}
              name="location"
              render={({ field }) => <Input id="location" {...field} className="rounded-xl border-gray-300" />}
            />
          </div>

          {/* Duration + Team Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Duration"
              description="E.g., 6 months, 1 year."
              error={errors.duration?.message}
              control={control}
              name="duration"
              render={({ field }) => <Input id="duration" {...field} className="rounded-xl border-gray-300" />}
            />
            <FormField
              label="Team Size"
              description="How many people are involved?"
              error={errors.teamSize?.message}
              control={control}
              name="teamSize"
              render={({ field }) => <Input id="teamSize" {...field} className="rounded-xl border-gray-300" />}
            />
          </div>

          {/* Funding */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Funding Goal"
              description="Target amount you want to raise."
              error={errors.fundingGoal?.message}
              control={control}
              name="fundingGoal"
              render={({ field }) => <Input id="fundingGoal" {...field} className="rounded-xl border-gray-300" />}
            />
            <FormField
              label="Funding Raised"
              description="Amount raised so far."
              error={errors.fundingRaised?.message}
              control={control}
              name="fundingRaised"
              render={({ field }) => <Input id="fundingRaised" {...field} className="rounded-xl border-gray-300" />}
            />
          </div>

          {/* Beneficiaries */}
          <FormField
            label="Beneficiaries"
            description="Who will benefit from this project?"
            error={errors.beneficiaries?.message}
            control={control}
            name="beneficiaries"
            render={({ field }) => <Input id="beneficiaries" {...field} className="rounded-xl border-gray-300" />}
          />

          {/* Problem + Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Problem"
              description="What issue does this project aim to solve?"
              error={errors.problem?.message}
              control={control}
              name="problem"
              render={({ field }) => <Textarea id="problem" {...field} rows={3} className="rounded-xl border-gray-300" />}
            />
            <FormField
              label="Solution"
              description="How will this project solve the problem?"
              error={errors.solution?.message}
              control={control}
              name="solution"
              render={({ field }) => <Textarea id="solution" {...field} rows={3} className="rounded-xl border-gray-300" />}
            />
          </div>

          {/* Urgency */}
          <FormField
            label="Urgency"
            description="Why should this project be done now?"
            error={errors.urgency?.message}
            control={control}
            name="urgency"
            render={({ field }) => <Textarea id="urgency" {...field} rows={2} className="rounded-xl border-gray-300" />}
          />

          {/* Urgency Factors (dynamic inputs) */}
          <div>
            <Label className="text-[#001F54] font-medium">Urgency Factors</Label>
            <p className="text-sm text-gray-500 mb-2">Add factors that make this project urgent.</p>
            <div className="space-y-2">
              {urgencyFactors.map((factor, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={factor}
                    onChange={(e) => updateItem('urgencyFactors', index, e.target.value)}
                    className="rounded-xl border-gray-300"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeItem('urgencyFactors', index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem('urgencyFactors')}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Factor
              </Button>
            </div>
          </div>

          {/* Impact (dynamic inputs) */}
          <div>
            <Label className="text-[#001F54] font-medium">Impact</Label>
            <p className="text-sm text-gray-500 mb-2">Add expected impacts.</p>
            <div className="space-y-2">
              {impact.map((imp, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={imp}
                    onChange={(e) => updateItem('impact', index, e.target.value)}
                    className="rounded-xl border-gray-300"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeItem('impact', index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem('impact')}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Impact
              </Button>
            </div>
          </div>

          {/* Image */}
          <div>
            <Label className="text-[#001F54]">Project Image</Label>
            <p className="text-sm text-gray-500 mb-2">Upload an image to represent this project.</p>
            <MediaUpload
              currentImage={currentImage}
              onImageUpload={(url) => setValue('image', url, { shouldValidate: true })}
              onRemove={() => setValue('image', '', { shouldValidate: true })}
              disabled={isPending}
            />
          </div>

          {/* Strategy Selection */}
          <div>
            <Label className="text-[#001F54]">Strategy</Label>
            <p className="text-sm text-gray-500 mb-2">Link this project to a strategy.</p>
            <Controller
              name="strategyId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="rounded-xl border-gray-300">
                    <SelectValue placeholder={loadingStrategies ? 'Loading...' : 'Select strategy'} />
                  </SelectTrigger>
                  <SelectContent>
                    {strategies?.map((strategy: Strategy) => (
                      <SelectItem key={strategy.id} value={strategy.id}>
                        {strategy.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#001F54] hover:bg-[#001F54]/90 text-white rounded-xl px-6 py-2"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Project
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* Reusable field wrapper */
function FormField<T extends FieldValues>({
  label,
  description,
  error,
  render,
  control,
  name,
}: {
  label: string;
  description?: string;
  error?: string;
  control: Control<T>;
  name: Path<T>;
  render: (props: {
    field: ControllerRenderProps<T, Path<T>>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<T>;
  }) => React.ReactElement;
}) {
  return (
    <div className="flex flex-col">
      <Label htmlFor={name} className="text-[#001F54] font-medium">
        {label}
      </Label>
      {description && <p className="text-sm text-gray-500 mb-1">{description}</p>}
      <Controller name={name} control={control} render={render} />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
