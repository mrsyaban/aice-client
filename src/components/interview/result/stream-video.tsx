import React, { useRef, useEffect, useState } from 'react';

interface StreamingVideoProps {
  videoUrl: string;
}

const StreamingVideo: React.FC<StreamingVideoProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleError = () => {
      setError('Failed to load video. Please check the URL and try again.');
    };

    video.src = videoUrl;
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('error', handleError);
    };
  }, [videoUrl]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="video-container">
      <video 
        ref={videoRef}
        controls
        playsInline
        className="w-full max-w-3xl mx-auto"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default StreamingVideo;