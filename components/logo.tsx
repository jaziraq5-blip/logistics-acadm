"use client"

import React, { useState } from "react"
import Image from "next/image"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const [imageError, setImageError] = useState(false)
  
  const sizeClasses = {
    sm: "h-[32px] w-[120px]",
    md: "h-[45px] w-[160px] md:h-[50px] md:w-[180px]",
    lg: "h-[60px] w-[200px] md:h-[70px] md:w-[220px]"
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-lg md:text-xl", 
    lg: "text-xl md:text-2xl"
  }

  if (imageError) {
    // Fallback logo with star symbol
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center relative overflow-hidden group ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700"></div>
        <span className={`text-white font-bold ${textSizes[size]} relative z-10`}>★</span>
        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300"></div>
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} relative ${className}`}>
      <Image
        src="/logo.jpg"
        alt="BLACK SEA STAR logo"
        fill
        className="object-contain transition-all duration-300 group-hover:scale-105"
        onError={() => setImageError(true)}
        priority
      />
    </div>
  )
}
