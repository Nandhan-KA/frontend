import { useEffect, useRef, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [fading, setFading] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      // When metadata is loaded, get video dimensions
      const handleMetadataLoaded = () => {
        setVideoSize({
          width: video.videoWidth,
          height: video.videoHeight
        });
        setVideoLoaded(true);
      };
      
      // Check if video can play
      const canPlay = () => {
        // Start playing the video
        video.play().catch(error => {
          console.error('Auto-play prevented:', error);
          skipIntro();
        });
      };
      
      // When video ends, begin the fade animation
      const handleVideoEnd = () => {
        setVideoEnded(true);
        setTimeout(() => {
          setFading(true);
          
          // After animation completes, signal to parent component
          setTimeout(() => {
            onComplete();
          }, 1000); // Match this with CSS animation duration
        }, 500);
      };
      
      // Skip intro function for fallbacks
      const skipIntro = () => {
        setVideoEnded(true);
        setFading(true);
        setTimeout(() => {
          onComplete();
        }, 500);
      };
      
      // Handle if video fails to load or has an error
      const handleVideoError = () => {
        console.error('Video failed to load');
        skipIntro();
      };
      
      // Set up timeout to skip intro if video takes too long to load
      const timeoutId = setTimeout(() => {
        if (video.readyState < 3) { // HAVE_FUTURE_DATA
          skipIntro();
        }
      }, 5000); // 5 second timeout
      
      // Event listeners
      video.addEventListener('loadedmetadata', handleMetadataLoaded);
      video.addEventListener('canplay', canPlay);
      video.addEventListener('ended', handleVideoEnd);
      video.addEventListener('error', handleVideoError);
      
      return () => {
        clearTimeout(timeoutId);
        video.removeEventListener('loadedmetadata', handleMetadataLoaded);
        video.removeEventListener('canplay', canPlay);
        video.removeEventListener('ended', handleVideoEnd);
        video.removeEventListener('error', handleVideoError);
      };
    }
  }, [onComplete]);
  
  // Calculate the object fit and position based on video aspect ratio
  const calculateVideoStyles = () => {
    if (!videoLoaded || videoSize.width === 0) return {};
    
    const videoAspect = videoSize.width / videoSize.height;
    const windowAspect = window.innerWidth / window.innerHeight;
    
    let objectFit: 'cover' | 'contain' = 'cover';
    
    // If video is wider than the viewport (relative to their heights)
    if (videoAspect > windowAspect) {
      objectFit = 'cover';
    } else {
      objectFit = 'contain';
    }
    
    return { objectFit };
  };
  
  const videoStyle = calculateVideoStyles();
  
  return (
    <div className={`fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden transition-opacity duration-1000 ${fading ? 'opacity-0' : 'opacity-100'}`}>
      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
        <video 
          ref={videoRef}
          className="h-full w-auto max-w-none"
          src="/entry_video.mp4"
          playsInline
          muted
          preload="auto"
          style={videoStyle}
        />
      </div>
    </div>
  );
};

export default SplashScreen; 