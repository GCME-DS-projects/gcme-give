'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, Image as Img, Upload } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Image from "next/image";

interface MediaUploadProps {
  onImageUpload?: (imageUrl: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  currentImage?: string;
}

export function MediaUpload({
  onImageUpload,
  onRemove,
  currentImage,
  disabled = false,
}: MediaUploadProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Size validation (15MB for images)
    if (file.size > 15 * 1024 * 1024) {
      toast.error('Image size should not exceed 15MB');
      return;
    }

    // File type validation
    if (!file.type.startsWith('image/')) {
      toast.error('Select an image file');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Simulating download progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const response = await api.strategies.uploadImage(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      onImageUpload?.(response.imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onRemove?.();
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Download buttons */}
      {!currentImage && !uploading && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            <Img className="h-4 w-4" />
            Add photo
          </Button>
          
        </div>
      )}

      {/* Download progress */}
      {uploading && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Upload className="h-5 w-5 animate-pulse" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">Uploading file...</p>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </div>
        </Card>
      )}

      {/* Image preview */}
      {currentImage && !uploading && (
        <Card className="relative px-4 pb-14">

          <Image
            src={currentImage}
            alt="strategy image"
            width={400}        
            height={256}       
            className="w-fit h-64 object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Replace image button */}
          <div className="absolute bottom-2 left-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => imageInputRef.current?.click()}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              <Img className="h-4 w-4" />
              Replace
            </Button>
          </div>
        </Card>
      )}

    

      {/* Hidden input elements */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
      
    </div>
  );
} 