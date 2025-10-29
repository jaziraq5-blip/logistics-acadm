"use client"

import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import type { ReactNode } from "react"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale" | "rotate"
  delay?: number
  duration?: number
  triggerOnce?: boolean
}

export function AnimatedSection({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = 600,
  triggerOnce = false,
}: AnimatedSectionProps) {
  const { ref, isIntersecting, isCurrentlyIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
    triggerOnce,
  })

  const getAnimationClasses = () => {
    const baseClasses = `transition-opacity ease-in-out`

    const shouldShow = triggerOnce ? isIntersecting : isCurrentlyIntersecting

    if (!shouldShow) {
      return `${baseClasses} opacity-0`
    }

    return `${baseClasses} opacity-100`
  }

  return (
    <div
      ref={ref}
      className={`${getAnimationClasses()} ${className}`}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
}
