"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PETS = ["🐱", "🐈", "🐾", "😺", "😸", "😻"];
const MSGS = ["meow~", "prrr...", "ฅ^•ﻌ•^ฅ", "nya!", ":wq", "hi!"];

export function DeskPet() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [pet, setPet] = useState(0);
  const [msg, setMsg] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const initialized = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const walkTimer = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    if (!initialized.current) {
      setPos({ x: window.innerWidth - 90, y: window.innerHeight - 120 });
      initialized.current = true;
    }
  }, []);

  // Random walk
  useEffect(() => {
    walkTimer.current = setInterval(() => {
      setPos((prev) => {
        const dx = (Math.random() - 0.5) * 120;
        const dy = (Math.random() - 0.5) * 60;
        const nx = Math.max(0, Math.min(prev.x + dx, window.innerWidth - 80));
        const ny = Math.max(0, Math.min(prev.y + dy, window.innerHeight - 110));
        setFlipped(dx < 0);
        return { x: nx, y: ny };
      });
    }, 4000);
    return () => clearInterval(walkTimer.current!);
  }, []);

  useEffect(() => {
    const resize = () =>
      setPos((p) => ({
        x: Math.min(p.x, window.innerWidth - 80),
        y: Math.min(p.y, window.innerHeight - 110),
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
        x: Math.max(0, Math.min(ev.clientX - offset.current.x, window.innerWidth - 80)),
        y: Math.max(0, Math.min(ev.clientY - offset.current.y, window.innerHeight - 110)),
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
    setPet((p) => (p + 1) % PETS.length);
    const m = MSGS[Math.floor(Math.random() * MSGS.length)];
    setMsg(m);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 2200);
  };

  return (
    <div
      onMouseDown={down}
      onTouchStart={down}
      onClick={click}
      className={`fixed z-[999] select-none transition-transform duration-200 ${
        dragging ? "scale-125 cursor-grabbing" : "cursor-grab hover:scale-110"
      }`}
      style={{ left: pos.x, top: pos.y }}
    >
      {/* Speech bubble */}
      {showMsg && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#313244] border border-[#45475a] text-[11px] font-mono text-[#cdd6f4] shadow-lg">
          {msg}
        </div>
      )}

      {/* Shadow */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/15 rounded-full blur-sm" />

      {/* Pet emoji */}
      <div
        className="text-5xl leading-none"
        style={{ transform: flipped ? "scaleX(-1)" : undefined }}
      >
        {PETS[pet]}
      </div>
    </div>
  );
}
