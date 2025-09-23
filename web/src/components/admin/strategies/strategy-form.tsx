"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaUpload } from "@/components/admin/strategies/MediaUpload";
import { Strategy } from "@/lib/types";
import { Loader2, Plus, X } from "lucide-react";

const strategySchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  fullDescription: z.string().optional(),
  visionText: z.string().optional(),
  involvedText: z.string().optional(),
  impactQuote: z.string().optional(),
  imagePath: z.string().optional(),
  activities: z.array(z.string()).optional(),
});

type StrategyFormValues = z.infer<typeof strategySchema>;

interface StrategyFormProps {
  onSubmit: (data: Partial<Strategy>) => void;
  isPending: boolean;
  defaultValues?: Partial<Strategy>;
}

export function StrategyForm({
  onSubmit,
  isPending,
  defaultValues = {},
}: StrategyFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StrategyFormValues>({
    resolver: zodResolver(strategySchema),
    defaultValues: {
      title: defaultValues.title ?? "",
      slug: (defaultValues as any).slug ?? "",
      description: defaultValues.description ?? "",
      fullDescription: (defaultValues as any).fullDescription ?? "",
      visionText: (defaultValues as any).visionText ?? "",
      involvedText: (defaultValues as any).involvedText ?? "",
      impactQuote: (defaultValues as any).impactQuote ?? "",
      imagePath: (defaultValues as any).imagePath ?? "",
      activities: Array.isArray((defaultValues as any).activities)
        ? (defaultValues as any).activities
        : [],
    },
  });

  const currentImage = watch("imagePath");
  const activities = watch("activities") || [];
  const [activityInput, setActivityInput] = useState("");

  const handleFormSubmit = (data: StrategyFormValues) => {
    onSubmit(data);
  };

  const handleImageUpload = (imageUrl: string) => {
    setValue("imagePath", imageUrl || "", { shouldValidate: true });
  };

  const handleImageRemove = () => {
    setValue("imagePath", "", { shouldValidate: true });
  };

  const handleAddActivity = () => {
    if (activityInput.trim()) {
      setValue("activities", [...activities, activityInput.trim()]);
      setActivityInput("");
    }
  };

  const handleRemoveActivity = (index: number) => {
    const updated = [...activities];
    updated.splice(index, 1);
    setValue("activities", updated);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 p-6 bg-white rounded-2xl shadow-md"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <Label htmlFor="title">Title</Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => <Input id="title" {...field} value={field.value || ""} />}
          />
          <p className="text-sm text-gray-500">
            This is the strategy’s display name.
          </p>
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Controller
            name="slug"
            control={control}
            render={({ field }) => <Input id="slug" {...field} value={field.value || ""} />}
          />
          <p className="text-sm text-gray-500">
            This will be used in the URL (e.g.{" "}
            <span className="text-blue-600">/strategies/your-slug</span>).
          </p>
          {errors.slug && (
            <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Short Description</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => <Textarea id="description" {...field} value={field.value || ""} />}
        />
        <p className="text-sm text-gray-500">
          A short overview shown in strategy cards and previews.
        </p>
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Full Description */}
      <div>
        <Label htmlFor="fullDescription">Full Description</Label>
        <Controller
          name="fullDescription"
          control={control}
          render={({ field }) => (
            <Textarea id="fullDescription" {...field} value={field.value || ""} rows={5} />
          )}
        />
        <p className="text-sm text-gray-500">
          A detailed explanation shown on the strategy’s profile page.
        </p>
      </div>

      {/* Media Upload */}
      <div>
        <Label>Image</Label>
        <MediaUpload
          currentImage={currentImage}
          onImageUpload={handleImageUpload}
          onRemove={handleImageRemove}
          disabled={isPending}
        />
        <p className="text-sm text-gray-500">
          Upload an image that represents this strategy.
        </p>
      </div>

      {/* Activities */}
      <div>
        <Label>Activities</Label>
        <div className="flex gap-2 mt-1">
          <Input
            value={activityInput}
            onChange={(e) => setActivityInput(e.target.value)}
            placeholder="Add an activity..."
          />
          <Button
            type="button"
            onClick={handleAddActivity}
            className="bg-blue-900 text-white"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {activities.map((act, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-sm"
            >
              {act}
              <button
                type="button"
                onClick={() => handleRemoveActivity(idx)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          List activities involved in this strategy.
        </p>
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="visionText">Vision Text</Label>
          <Controller
            name="visionText"
            control={control}
            render={({ field }) => <Input id="visionText" {...field} value={field.value || ""} />}
          />
          <p className="text-sm text-gray-500">
            A statement that communicates the strategy’s vision.
          </p>
        </div>
        <div>
          <Label htmlFor="involvedText">Get Involved Text</Label>
          <Controller
            name="involvedText"
            control={control}
            render={({ field }) => <Input id="involvedText" {...field} value={field.value || ""} />}
          />
          <p className="text-sm text-gray-500">
            Call to action to encourage participation.
          </p>
        </div>
        <div>
          <Label htmlFor="impactQuote">Impact Quote</Label>
          <Controller
            name="impactQuote"
            control={control}
            render={({ field }) => <Input id="impactQuote" {...field} value={field.value || ""} />}
          />
          <p className="text-sm text-gray-500">
            A quote that highlights the impact of this strategy.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-blue-900 text-white hover:bg-blue-800"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Strategy
        </Button>
      </div>
    </form>
  );
}
