import type { Metadata } from "next";
import { getAllMoments } from "@/lib/moments";
import { MomentsList } from "../moments.client";

export const metadata: Metadata = {
  title: "moments",
  description: "动态时间线",
};

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function MomentsPage() {
  const moments = await getAllMoments();

  return (
    <>
      <section className="terminal-window mb-3">
        <div className="terminal-header">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">uglis@home:~/moments</span>
        </div>
        <div className="terminal-body">
          <div className="cmd-line">
            <span className="cmd-prompt">$ </span>
            <span className="cmd-command">cat moments.jsonl</span>
          </div>
          <div className="cmd-output">
            total {moments.length} moments
          </div>
        </div>
      </section>

      <section className="terminal-window">
        <div className="terminal-header">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">stdout</span>
        </div>
        <div className="terminal-body">
          <MomentsList moments={moments} mode="full" />
        </div>
      </section>
    </>
  );
}
