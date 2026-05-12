import { useCallback, useEffect, useRef, useState } from "react";
import { PixelPet } from './PixelPet';

const MSGS = ["meow~", "prrr...", "ฅ^•ﻌ•^ฅ", "nya!", ":wq", "hi!"];

export function DeskPet() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [msg, setMsg] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [jumping, setJumping] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [landed, setLanded] = useState(false);
  const initialized = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const prevX = useRef(0);

  // Init
  useEffect(() => {
    if (!initialized.current) {
      const x = window.innerWidth - 140;
      const y = window.innerHeight - 180;
      setPos({ x, y });
      prevX.current = x;
      initialized.current = true;
    }
  }, []);

  // Random actions
  useEffect(() => {
    const doAction = () => {
      const r = Math.random();
      if (r < 0.4) {
        // Jump up
        setJumping(true);
        setTimeout(() => {
          setJumping(false);
          setLanded(true);
          setTimeout(() => setLanded(false), 300);
        }, 500);
      } else if (r < 0.7) {
        // Walk left/right
        setPos((p) => {
          const dx = (Math.random() - 0.5) * 100;
          const nx = Math.max(0, Math.min(p.x + dx, window.innerWidth - 100));
          setFlipped(dx < 0);
          return { x: nx, y: p.y };
        });
      }
      // else: idle (just bob)
    };

    const timer = setInterval(doAction, 3500 + Math.random() * 2000);
    return () => clearInterval(timer);
  }, []);

  // Resize
  useEffect(() => {
    const resize = () =>
      setPos((p) => ({
        x: Math.min(p.x, window.innerWidth - 100),
        y: Math.min(p.y, window.innerHeight - 100),
      }));
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Track direction for drag
  useEffect(() => {
    const dx = pos.x - prevX.current;
    if (Math.abs(dx) > 3) setFlipped(dx < 0);
    prevX.current = pos.x;
  }, [pos.x]);

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
        y: Math.max(0, Math.min(ev.clientY - offset.current.y, window.innerHeight - 150)),
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
    setBouncing(true);
    setTimeout(() => setBouncing(false), 400);
    const m = MSGS[Math.floor(Math.random() * MSGS.length)];
    setMsg(m);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 2000);
  };

  // Compose transform
  let transform = "";
  if (flipped) transform += " scaleX(-1)";
  if (jumping) transform += " translateY(-40px)";
  if (landed) transform += " translateY(0) scaleY(0.8)";
  if (bouncing) transform += " scale(0.85)";
  if (dragging) transform += " scale(1.1)";
  else if (!jumping && !bouncing) transform += " scale(1)";

  return (
    <div
      onMouseDown={down}
      onTouchStart={down}
      onClick={click}
      className={`fixed z-[999] select-none ${
        dragging ? "cursor-grabbing" : "cursor-grab hover:scale-105"
      }`}
      style={{
        left: pos.x,
        top: pos.y,
        transform: transform.trim() || undefined,
        transition: jumping
          ? "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
          : landed
            ? "transform 0.15s ease-out"
            : bouncing
              ? "transform 0.2s ease"
              : "transform 0.3s ease",
      }}
    >
      {showMsg && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#313244] border border-[#45475a] text-[12px] font-mono text-[#cdd6f4] shadow-lg animate-pet-bob">
          {msg}
        </div>
      )}

      {/* Shadow */}
      <div
        className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-8 h-2 bg-black/15 rounded-full blur-[2px] transition-transform duration-300"
        style={{
          transform: jumping ? "scale(0.5)" : landed ? "scale(1.2)" : "scale(1)",
        }}
      />

      <PixelPet />
    </div>
  );
}
