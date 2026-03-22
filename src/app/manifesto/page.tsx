import { AmbientBackdrop } from "@/components/ambient-backdrop";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const LINES = [
  "Feeds got smart. People got tired.",
  "The internet became a stage where everyone performs and nobody arrives.",
  "DROP is a refusal: no feed, no followers, no endless optimization.",
  "One moment appears. You react now, imperfectly, or you miss it.",
  "What stays is not content quality. What stays is that you were there.",
];

export default function ManifestoPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden pb-16">
      <AmbientBackdrop />
      <SiteHeader />

      <section className="relative z-10 mx-auto w-full max-w-4xl space-y-6 px-5 pt-8 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-zinc-400">DROP Manifesto</p>
        <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight text-zinc-50 sm:text-6xl">
          Real before perfect.
        </h1>
        <Card className="space-y-4 border-cyan-300/30">
          {LINES.map((line) => (
            <p key={line} className="text-lg leading-relaxed text-zinc-100">
              {line}
            </p>
          ))}
        </Card>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/drop?autostart=1">Receive Your Drop</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
