'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, Image as Img, Upload } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface MissionaryImageUploadProps {
  userId: string;
  currentImage?: string;
  onUploadSuccess?: (imageUrl: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
}

export function MissionaryImageUpload({
  userId,
  currentImage,
  onUploadSuccess,
  onRemove,
  disabled = false,
}: MissionaryImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(currentImage || '');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error('Image size should not exceed 15MB');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `/missionaries/${userId}/image`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (event) => {
            setProgress(Math.round((event.loaded * 100) / (event.total || 1)));
          },
        }
      );

      const imageUrl = response.data.imageUrl;
      setImage(imageUrl);
      onUploadSuccess?.(imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setImage('');
    onRemove?.();
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {!image && !uploading && (
        <Button
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Img className="h-4 w-4" />
          Upload Image
        </Button>
      )}

      {uploading && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Upload className="h-5 w-5 animate-pulse" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">Uploading...</p>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </Card>
      )}

      {image && !uploading && (
        <Card className="relative px-4 pb-4">
          <img
            src={image}
            alt="Missionary"
            className="w-full h-64 object-cover rounded-lg"
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
        </Card>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
