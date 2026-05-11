"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";

export function BentoCard({
  children,
  className = "",
  accent = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  accent?: string;
  hover?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
    },
    []
  );

  const active = hover && isHovered;
  const ry = (pos.y - 0.5) * -4;
  const rx = (pos.x - 0.5) * 4;

  return (
    <div
      ref={ref}
      onMouseMove={hover ? handleMouseMove : undefined}
      onMouseEnter={hover ? () => setIsHovered(true) : undefined}
      onMouseLeave={() => { setIsHovered(false); setPos({ x: 0.5, y: 0.5 }); }}
      className={`group relative rounded-2xl sm:rounded-3xl bg-[#313244] p-5 sm:p-7
        shadow-[0_0_0_1px_rgba(69,71,90,0.4),0_2px_8px_rgba(0,0,0,0.15)]
        transition-[transform,box-shadow] duration-400 ease-out
        ${hover ? "cursor-pointer" : ""}
        ${className}`}
      style={{
        transform: active
          ? `perspective(1200px) rotateX(${ry}deg) rotateY(${rx}deg) scale(1.015)`
          : undefined,
        boxShadow: active
          ? `${accent} 0 0 0 2px, 0 12px 40px rgba(0,0,0,0.25)`
          : undefined,
      }}
    >
      {/* Accent top stripe */}
      {accent && (
        <div
          className="absolute top-0 left-4 right-4 h-[3px] rounded-b-full opacity-60 transition-opacity group-hover:opacity-100"
          style={{ background: accent }}
        />
      )}
      {children}
    </div>
  );
}
