import { useCallback, useEffect, useRef, useState } from "react";

interface LightboxState {
  open: boolean;
  src: string;
  alt: string;
  caption: string;
}

export function useLightbox() {
  const [state, setState] = useState<LightboxState>({
    open: false,
    src: "",
    alt: "",
    caption: "",
  });
  const lastFocused = useRef<HTMLElement | null>(null);

  const open = useCallback(
    (src: string, alt: string = "", caption: string = "") => {
      lastFocused.current = document.activeElement as HTMLElement;
      setState({ open: true, src, alt, caption });
    },
    []
  );

  const close = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
    requestAnimationFrame(() => {
      lastFocused.current?.focus();
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state.open) close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.open, close]);

  return { state, open, close };
}

export function Lightbox({
  open,
  src,
  alt,
  caption,
  onClose,
}: LightboxState & { onClose: () => void }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(3,7,15,0.88)] flex items-center justify-center flex-col p-5 z-[120]"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        className="absolute right-[18px] top-[18px] w-[42px] h-[42px] border border-[rgba(212,221,251,0.4)] rounded-full bg-[rgba(12,17,29,0.75)] text-[#d4ddfb] text-[1.4rem] cursor-pointer"
        onClick={onClose}
        aria-label="close lightbox"
      >
        &times;
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-[min(1000px,92vw)] max-h-[75vh] rounded-xl object-contain shadow-[0_22px_70px_rgba(0,0,0,0.45)]"
      />
      {caption && (
        <p className="text-[#d4ddfb] mt-3 text-center">{caption}</p>
      )}
    </div>
  );
}
