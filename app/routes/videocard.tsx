import type { MetaFunction } from "@remix-run/node";
import { useEffect, useRef } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: "Video Card: Sound1" },
    { name: "description", content: "Check out this video!" },
    // Open Graph tags for better iMessage/social media previews
    { property: "og:title", content: "Video Card: Sound1" },
    { property: "og:description", content: "A cool video presentation." },
    { property: "og:type", content: "video.other" }, // or video.movie, video.episode, video.tv_show
    { property: "og:video", content: "/sound1.mov" }, // Absolute URL needed when deployed: e.g., https://yourdomain.com/sound1.mov
    { property: "og:video:type", content: "video/mp4" },
    { property: "og:video:width", content: "1280" }, // Optional: specify video dimensions
    { property: "og:video:height", content: "720" },  // Optional: specify video dimensions
    // You might also want an og:image for a static preview
    // { property: "og:image", content: "/path/to/preview-image.jpg" }, 
  ];
};

export default function VideoCardPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Optional: Autoplay if desired, but be mindful of browser policies
    // if (videoRef.current) {
    //   videoRef.current.play().catch(error => console.log("Autoplay prevented: ", error));
    // }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Video Presentation</h2>
        <video ref={videoRef} controls style={styles.video} preload="metadata" playsInline>
          <source src="/sound1.mov" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p style={styles.caption}>Enjoy this short clip!</p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    padding: '20px',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '15px',
  },
  video: {
    width: '100%',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  caption: {
    fontSize: '14px',
    color: '#666',
  },
};