import type { Metadata } from "next";
import { getAllMoments } from "@/lib/moments";
import { ScrollReveal } from "@/components/scroll-reveal";
import { MomentsList } from "../moments.client";

export const metadata: Metadata = {
  title: "动态",
  description: "林方浩的 moments 动态分享页",
};

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function MomentsPage() {
  const moments = await getAllMoments();

  return (
    <>
      <ScrollReveal>
        <section className="panel border border-line rounded-2xl bg-surface p-[clamp(22px,3.6vw,38px)]">
          <div className="flex justify-between items-baseline gap-3">
            <p className="m-0 text-[0.78rem] tracking-[0.2em] text-accent-2">
              MOMENTS
            </p>
            <h1 className="font-serif">动态</h1>
          </div>
          <p className="text-muted leading-[1.84]">
            这里是完整的 moments 时间线，记录音乐和生活碎片。
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <section className="panel mt-4 border border-line rounded-2xl bg-surface p-[clamp(22px,3.6vw,38px)]">
          <MomentsList moments={moments} mode="full" />
        </section>
      </ScrollReveal>
    </>
  );
}
