"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setPosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    },
    []
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setPosition({ x: 0.5, y: 0.5 });
  }, []);

  const active = hover && isHovered;
  const px = position.x * 100;
  const py = position.y * 100;

  // 3D tilt: max ±3 degrees
  const rotateX = (position.y - 0.5) * -6;
  const rotateY = (position.x - 0.5) * 6;

  return (
    <div
      ref={ref}
      onMouseMove={hover ? handleMouseMove : undefined}
      onMouseEnter={hover ? handleMouseEnter : undefined}
      onMouseLeave={hover ? handleMouseLeave : undefined}
      className={`relative rounded-2xl p-6 sm:p-8 overflow-hidden transition-transform duration-500 ease-out
        bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent
        backdrop-blur-3xl
        border border-white/[0.12] border-b-white/[0.06]
        shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]
        before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.04] before:to-transparent before:pointer-events-none
        ${hover ? "cursor-pointer" : ""}
        ${className}`}
      style={{
        transform: active
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.02)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)",
        borderColor: active
          ? "rgba(255,255,255,0.2)"
          : undefined,
      }}
    >
      {/* Spotlight glow that follows cursor */}
      {hover && (
        <div
          className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
          style={{ opacity: active ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 opacity-60 transition-[background] duration-200"
            style={{
              background: `radial-gradient(circle 200px at ${px}% ${py}%, rgba(255,255,255,0.08), transparent 70%)`,
            }}
          />
        </div>
      )}

      {/* Border shimmer on hover */}
      {hover && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-20 transition-opacity duration-300"
          style={{ opacity: active ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `
                radial-gradient(circle 150px at ${px}% 0%, rgba(255,255,255,0.08), transparent),
                radial-gradient(circle 150px at ${px}% 100%, rgba(255,255,255,0.04), transparent)
              `,
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-30">{children}</div>
    </div>
  );
}
