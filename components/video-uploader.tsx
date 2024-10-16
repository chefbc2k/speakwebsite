"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Upload } from 'lucide-react';

const formSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size <= 100 * 1024 * 1024, {
    message: 'Max file size is 100MB.',
  }),
});

export function VideoUploader() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: { file: File }) => {
    const formData = new FormData();
    formData.append('file', data.file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      toast({
        title: 'Video uploaded successfully',
        description: 'Your video is now being processed.',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your video. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          type="file"
          accept="video/*"
          {...register('file')}
        />
        {errors.file && (
          <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
        )}
      </div>
      <Button type="submit" disabled={uploadProgress > 0}>
        <Upload className="mr-2 h-4 w-4" /> Upload Video
      </Button>
      {uploadProgress > 0 && (
        <Progress value={uploadProgress} className="w-full" />
      )}
    </form>
  );
}