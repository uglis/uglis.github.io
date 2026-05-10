export function Footer() {
  return (
    <footer className="w-[min(1000px,94vw)] mx-auto mb-8 text-[0.7rem] text-muted font-mono">
      <div className="flex items-center justify-between">
        <span>
          <span className="text-accent-green">$</span> whoami &mdash; 林方浩
          &middot; {new Date().getFullYear()}
        </span>
        <span className="status-bar">
          <span className="status-dot" />
          online
        </span>
      </div>
    </footer>
  );
}
