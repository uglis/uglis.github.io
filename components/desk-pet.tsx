"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MSGS = ["meow~", "prrr...", "ฅ^•ﻌ•^ฅ", "nya!", ":wq", "hi!", ">_<"];

export function DeskPet() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [msg, setMsg] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tapping, setTapping] = useState(false);
  const initialized = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!initialized.current) {
      setPos({ x: window.innerWidth - 115, y: window.innerHeight - 135 });
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    const resize = () =>
      setPos((p) => ({
        x: Math.min(p.x, window.innerWidth - 100),
        y: Math.min(p.y, window.innerHeight - 120),
      }));
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const down = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const ev = "touches" in e ? e.touches[0] : e;
      offset.current = { x: ev.clientX - pos.x, y: ev.clientY - pos.y };
      setDragging(true);
    },
    [pos]
  );

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent | TouchEvent) => {
      const ev = "touches" in e ? e.touches[0] : e;
      setPos({
        x: Math.max(0, Math.min(ev.clientX - offset.current.x, window.innerWidth - 100)),
        y: Math.max(0, Math.min(ev.clientY - offset.current.y, window.innerHeight - 120)),
      });
    };
    const up = () => setDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [dragging]);

  const click = () => {
    if (dragging) return;
    setTapping(true);
    setTimeout(() => setTapping(false), 600);
    const m = MSGS[Math.floor(Math.random() * MSGS.length)];
    setMsg(m);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 2000);
  };

  return (
    <div
      onMouseDown={down}
      onTouchStart={down}
      onClick={click}
      className={`fixed z-[999] select-none transition-transform ${
        dragging ? "scale-110 cursor-grabbing" : "cursor-grab hover:scale-105"
      }`}
      style={{ left: pos.x, top: pos.y }}
    >
      {showMsg && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#313244] border border-[#45475a] text-[12px] font-mono text-[#cdd6f4] shadow-lg">
          {msg}
        </div>
      )}

      {/* Table surface */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[76px] h-[10px] bg-[#585b70] rounded-full" />

      <div className="relative w-[80px] h-[80px]">
        {/* Body/neck below head */}
        <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2 w-[30px] h-[18px] bg-white rounded-b-lg" />

        {/* Head */}
        <div className="absolute bottom-[28px] left-1/2 -translate-x-1/2 w-[44px] h-[38px] bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          {/* Left ear */}
          <div className="absolute -top-[14px] left-[2px] w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-l-transparent border-r-transparent border-b-white" />
          <div className="absolute -top-[10px] left-[5px] w-0 h-0 border-l-[7px] border-r-[7px] border-b-[11px] border-l-transparent border-r-transparent border-b-[#f5c2e7]" />

          {/* Right ear */}
          <div className="absolute -top-[14px] right-[2px] w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-l-transparent border-r-transparent border-b-white" />
          <div className="absolute -top-[10px] right-[5px] w-0 h-0 border-l-[7px] border-r-[7px] border-b-[11px] border-l-transparent border-r-transparent border-b-[#f5c2e7]" />

          {/* Eyes */}
          <div className="flex justify-center gap-[14px] mt-[10px]">
            <div className="w-[5px] h-[6px] bg-[#1e1e2e] rounded-full" />
            <div className="w-[5px] h-[6px] bg-[#1e1e2e] rounded-full" />
          </div>

          {/* Nose + mouth */}
          <div className="flex flex-col items-center mt-[2px]">
            <div className="w-[3px] h-[3px] bg-[#f38ba8] rounded-full" />
            <div className="flex gap-[6px] mt-[1px]">
              <div className="w-[6px] h-[1px] bg-[#585b70]" />
              <div className="w-[6px] h-[1px] bg-[#585b70]" />
            </div>
          </div>
        </div>

        {/* Left paw */}
        <div
          className={`absolute bottom-[4px] left-[6px] w-[16px] h-[14px] bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-transform origin-top ${
            tapping ? "translate-y-[4px]" : "animate-pet-paw"
          }`}
        />

        {/* Right paw */}
        <div
          className={`absolute bottom-[4px] right-[6px] w-[16px] h-[14px] bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-transform origin-top ${
            tapping ? "translate-y-[4px]" : "animate-pet-paw-delayed"
          }`}
        />
      </div>
    </div>
  );
}
