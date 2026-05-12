import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.dataset.theme === 'light');
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.dataset.theme = 'light';
      localStorage.setItem('theme', 'light');
    } else {
      delete document.documentElement.dataset.theme;
      localStorage.setItem('theme', 'dark');
    }
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="text-xs text-muted hover:text-accent px-2 py-1 rounded cursor-pointer bg-transparent border-0 font-mono"
        aria-label="theme toggle"
      >
        [ ]
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="text-xs text-muted hover:text-accent-green px-2 py-1 rounded cursor-pointer bg-transparent border-0 font-mono transition-colors"
      aria-label={isLight ? 'switch to dark mode' : 'switch to light mode'}
    >
      [{isLight ? 'x' : ' '}]
    </button>
  );
}
