"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const FACES = ["(◕‿◕)", "(◠‿◠)", "(◕ᴥ◕)", "(≧◡≦)", "(◕ω◕)"];

const MESSAGES = [
  "喵~",
  "meow!",
  "prrr...",
  "ฅ^•ﻌ•^ฅ",
  "hi!",
  "nya~",
  "> cat config.yaml",
  ":wq",
  ".",
];

export function DeskPet() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [face, setFace] = useState(0);
  const [msg, setMsg] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const petRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Init position bottom-right
  useEffect(() => {
    if (!initialized.current) {
      setPos({
        x: window.innerWidth - 100,
        y: window.innerHeight - 140,
      });
      initialized.current = true;
    }
  }, []);

  // Stick to edges on resize
  useEffect(() => {
    const handleResize = () => {
      setPos((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 80),
        y: Math.min(prev.y, window.innerHeight - 120),
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setDragging(true);
      setOffset({
        x: e.clientX - pos.x,
        y: e.clientY - pos.y,
      });
    },
    [pos]
  );

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => {
      setPos({
        x: Math.max(0, Math.min(e.clientX - offset.x, window.innerWidth - 80)),
        y: Math.max(0, Math.min(e.clientY - offset.y, window.innerHeight - 120)),
      });
    };
    const up = () => setDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging, offset]);

  const handleClick = () => {
    if (dragging) return;
    setFace((prev) => (prev + 1) % FACES.length);
    const m = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setMsg(m);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 2500);
  };

  return (
    <div
      ref={petRef}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className={`fixed z-[999] select-none transition-[filter] duration-300 ${
        dragging ? "cursor-grabbing scale-110" : "cursor-grab hover:scale-105"
      }`}
      style={{
        left: pos.x,
        top: pos.y,
      }}
    >
      {/* Speech bubble */}
      {showMsg && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-[#313244] border border-[#45475a] text-xs font-mono text-[#cdd6f4] shadow-lg animate-bounce">
          {msg}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#313244] border-r border-b border-[#45475a]" />
        </div>
      )}

      {/* Cat pixel art body */}
      <div className="flex flex-col items-center animate-pet-bob">
        {/* Ears + Head */}
        <div className="flex gap-2 mb-[-2px]">
          <div className="w-5 h-5 bg-[#cba6f7] rounded-tl-lg rounded-tr-sm rounded-bl-sm">
            <div className="w-3 h-3 bg-[#f5c2e7] rounded-tl-lg rounded-tr-sm mt-[2px] ml-[2px]" />
          </div>
          <div className="w-2" />
          <div className="w-5 h-5 bg-[#cba6f7] rounded-tl-sm rounded-tr-lg rounded-br-sm">
            <div className="w-3 h-3 bg-[#f5c2e7] rounded-tr-lg rounded-tl-sm mt-[2px] ml-[2px]" />
          </div>
        </div>

        {/* Face */}
        <div className="w-14 h-12 bg-[#cba6f7] rounded-2xl flex flex-col items-center justify-center relative shadow-lg">
          {/* Eyes */}
          <div className="flex gap-3 mt-1">
            <div className="w-2 h-2.5 bg-[#1e1e2e] rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full" />
            </div>
            <div className="w-2 h-2.5 bg-[#1e1e2e] rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full" />
            </div>
          </div>
          {/* Nose + mouth */}
          <div className="text-[7px] text-[#1e1e2e] mt-0.5 select-none">
            {FACES[face]}
          </div>
          {/* Whiskers */}
          <div className="flex gap-1 mt-[-1px]">
            <div className="w-3.5 h-[1px] bg-[#585b70]/50 rounded-full" />
            <div className="w-1.5 h-[1px] bg-[#585b70]/30 rounded-full" />
            <div className="w-1.5 h-[1px] bg-[#585b70]/30 rounded-full" />
            <div className="w-3.5 h-[1px] bg-[#585b70]/50 rounded-full" />
          </div>
        </div>

        {/* Body */}
        <div className="w-10 h-10 bg-[#cba6f7] rounded-b-2xl rounded-t-sm mt-[-4px] relative">
          {/* Paws */}
          <div className="absolute -left-2 bottom-0 w-4 h-3 bg-[#cba6f7] rounded-full animate-pet-paw" />
          <div className="absolute -right-2 bottom-0 w-4 h-3 bg-[#cba6f7] rounded-full animate-pet-paw-delayed" />
        </div>

        {/* Tail */}
        <div className="w-3 h-8 bg-[#cba6f7] rounded-full origin-bottom animate-pet-tail absolute -right-3 bottom-2 -rotate-12" />
      </div>

      {/* Shadow */}
      <div className="w-10 h-2 bg-[#1e1e2e]/20 rounded-full mx-auto mt-1 blur-[2px] animate-pet-shadow" />
    </div>
  );
}
