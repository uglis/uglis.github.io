"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PixelPet } from "./pixel-pet";

const MSGS = ["meow~", "prrr...", "ฅ^•ﻌ•^ฅ", "nya!", ":wq", "hi!"];

export function DeskPet() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [msg, setMsg] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [dragging, setDragging] = useState(false);
  const initialized = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!initialized.current) {
      setPos({ x: window.innerWidth - 140, y: window.innerHeight - 160 });
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    const resize = () =>
      setPos((p) => ({
        x: Math.min(p.x, window.innerWidth - 100),
        y: Math.min(p.y, window.innerHeight - 100),
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
        y: Math.max(0, Math.min(ev.clientY - offset.current.y, window.innerHeight - 100)),
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

      <PixelPet />
    </div>
  );
}
