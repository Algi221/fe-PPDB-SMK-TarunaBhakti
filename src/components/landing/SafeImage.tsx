"use client";

import React, { useState } from "react";
import Image from "next/image";

interface SafeImageProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  onError?: (e: any) => void;
  [key: string]: any;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  onError,
  ...props
}) => {
  const [useFallbackImg, setUseFallbackImg] = useState(false);
  const isDataUrl = src && src.startsWith("data:");
  
  if (isDataUrl || useFallbackImg || !src) {
    return (
      <img 
        src={src || "/logo_smktb.png"} 
        alt={alt} 
        width={width} 
        height={height} 
        className={className} 
        onError={onError} 
        {...props} 
      />
    );
  }
  
  return (
    <Image 
      src={src} 
      alt={alt} 
      width={width} 
      height={height} 
      className={className} 
      onError={(e) => {
        setUseFallbackImg(true);
        if (onError) onError(e);
      }}
      unoptimized={src && (src.startsWith('http') && !src.includes('localhost') && !src.includes('127.0.0.1'))}
      {...props}
    />
  );
};
