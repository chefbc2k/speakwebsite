import { VideoUploader } from '@/components/video-uploader';
import { VideoList } from '@/components/video-list';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Video Streaming App</h1>
      <VideoUploader />
      <VideoList />
    </div>
  );
}