import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export function LoaderThree({ 
  size = "md", 
  color = "#3b82f6", 
  className = "" 
}: LoaderProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div className="relative">
        <div 
          className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
          style={{
            borderTopColor: color,
            borderRightColor: color,
            animationDuration: "1s"
          }}
        />
        <div 
          className="absolute inset-1 rounded-full border-2 border-transparent animate-spin"
          style={{
            borderBottomColor: color,
            borderLeftColor: color,
            animationDuration: "1.5s",
            animationDirection: "reverse"
          }}
        />
        <div 
          className="absolute inset-2 rounded-full border-2 border-transparent animate-spin"
          style={{
            borderTopColor: color,
            borderBottomColor: color,
            animationDuration: "2s"
          }}
        />
      </div>
    </div>
  );
}

// Additional loader variants
export function LoaderOne({ 
  size = "md", 
  color = "#3b82f6", 
  className = "" 
}: LoaderProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div 
        className="w-full h-full rounded-full border-2 border-transparent animate-spin"
        style={{
          borderTopColor: color,
          animationDuration: "1s"
        }}
      />
    </div>
  );
}

export function LoaderTwo({ 
  size = "md", 
  color = "#3b82f6", 
  className = "" 
}: LoaderProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="flex space-x-1">
        <div 
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ 
            backgroundColor: color,
            animationDelay: "0ms"
          }}
        />
        <div 
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ 
            backgroundColor: color,
            animationDelay: "150ms"
          }}
        />
        <div 
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ 
            backgroundColor: color,
            animationDelay: "300ms"
          }}
        />
      </div>
    </div>
  );
}