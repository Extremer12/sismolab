import React, { useState, useEffect } from 'react';
import { Lottie } from 'lottie-react';

interface LottieAnimationProps {
  src: string;
  fallbackSrc?: string;
  className?: string;
  loop?: boolean;
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  src,
  fallbackSrc,
  className = 'w-36 h-36',
  loop = true
}) => {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadAnimation = async () => {
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted) {
          setAnimationData(data);
        }
      } catch {
        if (fallbackSrc) {
          try {
            const fallbackRes = await fetch(fallbackSrc);
            if (fallbackRes.ok) {
              const fallbackData = await fallbackRes.json();
              if (isMounted) {
                setAnimationData(fallbackData);
                return;
              }
            }
          } catch {
            // Fallback error
          }
        }
        if (isMounted) setHasError(true);
      }
    };

    loadAnimation();

    return () => {
      isMounted = false;
    };
  }, [src, fallbackSrc]);

  if (hasError || !animationData) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <div className="w-16 h-16 rounded-full bg-brand-cyan/15 animate-pulse blur-md" />
      </div>
    );
  }

  return (
    <Lottie
      src={animationData || src}
      loop={loop}
      autoplay={true}
      className={className}
    />
  );
};
