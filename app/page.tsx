import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getRecentMoments } from "@/lib/moments";
import { MomentsList } from "./moments.client";

export default async function HomePage() {
  const recentMoments = await getRecentMoments(3);

  return (
    <>
      <ScrollReveal>
        <section className="hero-grid border border-line rounded-[28px] p-[clamp(28px,5vw,72px)] shadow-[0_24px_80px_rgba(0,0,0,0.34)] bg-[linear-gradient(140deg,rgba(13,17,28,0.86),rgba(9,12,18,0.72))] grid grid-cols-[1.35fr_0.9fr] gap-[clamp(16px,3vw,30px)] items-center max-[900px]:grid-cols-1">
          <div>
            <p className="m-0 text-[0.75rem] text-accent-2 tracking-[0.24em]">
              LIN FANGHAO &middot; DIGITAL CRAFT
            </p>
            <h1 className="mt-[18px] font-serif text-[clamp(2.1rem,6vw,4.8rem)] leading-[1.06] max-w-[9.5ch]">
              凡心所向
              <br />
              素履可往
            </h1>
            <p className="mt-[18px] text-muted leading-[1.86] max-w-[60ch]">
              分享一些学习cs的经历，或者有趣的东西，也会不定期更新一些我的日常。
            </p>
            <div className="mt-[30px] flex gap-3 flex-wrap">
              <Link
                href="/posts"
                className="no-underline rounded-full px-5 py-[11px] border border-transparent transition-transform hover:-translate-y-0.5 bg-[linear-gradient(120deg,var(--color-accent),#d1ebff)] text-[#081522]"
              >
                阅读文章
              </Link>
              <Link
                href="/moments"
                className="no-underline rounded-full px-5 py-[11px] border border-line text-text transition-transform hover:-translate-y-0.5"
              >
                查看动态
              </Link>
            </div>
          </div>

          <figure
            className="m-0 border border-line rounded-[18px] bg-[rgba(10,14,24,0.8)] p-[10px] w-[min(280px,100%)] justify-self-end max-[900px]:w-[min(260px,100%)] max-[900px]:justify-self-start cursor-zoom-in"
            tabIndex={0}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/6af52c916f1b4aa7d9d816a6240ff8b9.JPG"
              alt="林方浩证件照"
              className="w-full h-[clamp(220px,30vw,320px)] object-cover object-[center_18%] rounded-xl block max-[900px]:h-[clamp(220px,72vw,360px)] max-[900px]:object-contain max-[900px]:object-top max-[900px]:bg-[rgba(8,12,20,0.92)]"
            />
          </figure>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <section className="panel mt-4 border border-line rounded-2xl bg-surface p-[clamp(22px,3.6vw,38px)]">
          <div className="flex justify-between items-baseline gap-3">
            <p className="m-0 text-[0.78rem] tracking-[0.2em] text-accent-2">
              BLOG
            </p>
            <h2 className="font-serif">个人博客</h2>
          </div>
          <p className="text-muted leading-[1.84]">
            这个主页已升级为可持续更新的博客站：记录生活的点滴与我琐碎的思考
          </p>
          <div className="mt-[30px] flex gap-3 flex-wrap">
            <Link
              href="/posts"
              className="no-underline rounded-full px-5 py-[11px] border border-transparent bg-[linear-gradient(120deg,var(--color-accent),#d1ebff)] text-[#081522] transition-transform hover:-translate-y-0.5"
            >
              去写文章
            </Link>
            <Link
              href="/moments"
              className="no-underline rounded-full px-5 py-[11px] border border-line text-text transition-transform hover:-translate-y-0.5"
            >
              去发动态
            </Link>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={160}>
        <section className="panel mt-4 border border-line rounded-2xl bg-surface p-[clamp(22px,3.6vw,38px)]">
          <div className="flex justify-between items-baseline gap-3">
            <p className="m-0 text-[0.78rem] tracking-[0.2em] text-accent-2">
              MOMENTS
            </p>
            <h2 className="font-serif">最近分享</h2>
          </div>
          <p className="text-muted leading-[1.84]">
            首页只放最近几条预览，完整内容请进入动态页查看。
          </p>
          <MomentsList moments={recentMoments} mode="preview" />
          <div className="mt-[6px] flex gap-3 flex-wrap">
            <Link
              href="/moments"
              className="no-underline rounded-full px-5 py-[11px] border border-line text-text transition-transform hover:-translate-y-0.5"
            >
              查看全部动态
            </Link>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={240}>
        <section id="about" className="panel mt-4 border border-line rounded-2xl bg-surface p-[clamp(22px,3.6vw,38px)] scroll-mt-24">
          <div className="flex justify-between items-baseline gap-3">
            <p className="m-0 text-[0.78rem] tracking-[0.2em] text-accent-2">
              ABOUT
            </p>
            <h2 className="font-serif">关于我</h2>
          </div>
          <p className="text-muted leading-[1.84]">
            南京大学2023级本科在读，MBTI 是 INFP。关注产品、设计与工程的结合，也热爱书法创作。
          </p>
          <ul className="mt-3 pl-[18px] text-muted leading-[1.8]">
            <li>学校：南京大学（本科在读）</li>
            <li>MBTI：INFP</li>
            <li>爱好：书法，阅读</li>
            <li>社会身份：江苏省连云港市书法家协会会员</li>
            <li>身高 / 体重：175cm / 60kg</li>
            <li>生日：2005年1月10日</li>
            <li>星座：摩羯座</li>
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={320}>
        <section id="projects" className="scroll-mt-24 mt-4 grid grid-cols-3 gap-[14px] max-[900px]:grid-cols-1">
          <article className="border border-line rounded-[20px] bg-[rgba(14,18,30,0.78)] p-5 transition-transform hover:-translate-y-1 hover:border-accent/50">
            <p className="m-0 text-accent text-[0.76rem] tracking-[0.14em]">
              01 &middot; 产品增长
            </p>
            <h3 className="font-serif mt-[10px]">Growth Console</h3>
            <p className="text-muted leading-[1.7]">
              重构指标面板信息架构，缩短关键决策路径，提升团队协作效率。
            </p>
          </article>
          <article className="border border-line rounded-[20px] bg-[rgba(14,18,30,0.78)] p-5 transition-transform hover:-translate-y-1 hover:border-accent/50">
            <p className="m-0 text-accent text-[0.76rem] tracking-[0.14em]">
              02 &middot; 品牌体验
            </p>
            <h3 className="font-serif mt-[10px]">Brand Experience Site</h3>
            <p className="text-muted leading-[1.7]">
              从视觉语言到交互节奏全链路重做，打造更具辨识度的品牌官网。
            </p>
          </article>
          <article className="border border-line rounded-[20px] bg-[rgba(14,18,30,0.78)] p-5 transition-transform hover:-translate-y-1 hover:border-accent/50">
            <p className="m-0 text-accent text-[0.76rem] tracking-[0.14em]">
              03 &middot; 工程提效
            </p>
            <h3 className="font-serif mt-[10px]">UI System Kit</h3>
            <p className="text-muted leading-[1.7]">
              建立统一组件规范与交互准则，减少重复开发并提高交付一致性。
            </p>
          </article>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={400}>
        <section id="contact" className="panel mt-4 border border-line rounded-2xl bg-surface p-[clamp(22px,3.6vw,38px)] scroll-mt-24">
          <div className="flex justify-between items-baseline gap-3">
            <p className="m-0 text-[0.78rem] tracking-[0.2em] text-accent-2">
              CONTACT
            </p>
            <h2 className="font-serif">联系我</h2>
          </div>
          <div className="grid grid-cols-[1.2fr_minmax(150px,220px)] gap-[18px] items-start max-[900px]:grid-cols-1">
            <div>
              <p>
                手机：<a className="text-accent no-underline hover:underline" href="tel:15896103575">15896103575</a>
              </p>
              <p>
                邮箱：<a className="text-accent no-underline hover:underline" href="mailto:231098078@smail.nju.edu.cn">231098078@smail.nju.edu.cn</a>
              </p>
              <p>
                GitHub：<a className="text-accent no-underline hover:underline" href="https://github.com/uglis" target="_blank" rel="noopener noreferrer">github.com/uglis</a>
              </p>
              <p>微信：扫码添加</p>
            </div>
            <figure className="m-0 border border-line rounded-[14px] bg-[rgba(11,16,27,0.75)] p-[10px] max-[900px]:w-[min(220px,100%)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/IMG_5955.jpg"
                alt="林方浩微信二维码"
                className="w-full rounded-[10px] block"
                loading="lazy"
              />
              <figcaption className="mt-2 text-muted text-[0.84rem] text-center">
                微信二维码
              </figcaption>
            </figure>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
