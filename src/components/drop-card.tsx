"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";
import { ActiveDrop } from "@/lib/types";
import { motion } from "framer-motion";
import { Loader2, Mic, Send, Video } from "lucide-react";

const placeholderByType: Record<ActiveDrop["type"], string> = {
  text: "Type immediately. No overthinking.",
  reaction: "One-word gut reaction.",
  voice_stub: "Voice mode arrives in the next build.",
};

type DropCardProps = {
  drop: ActiveDrop;
  value: string;
  setValue: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  isSubmitting?: boolean;
};

export function DropCard({ drop, value, setValue, onSubmit, disabled, isSubmitting }: DropCardProps) {
  const voiceMode = drop.type === "voice_stub";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.32 }}
      className="w-full"
    >
      <Card className={cn("space-y-5", drop.isGlobal && "border-fuchsia-300/40 shadow-[0_0_80px_rgba(232,121,249,0.16)]")}>
        {drop.isGlobal ? (
          <p className="inline-flex rounded-full border border-fuchsia-300/40 bg-fuchsia-400/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-fuchsia-100">
            Global Drop
          </p>
        ) : null}

        <p className="text-xl font-semibold leading-tight text-zinc-50 sm:text-2xl whitespace-pre-wrap">{drop.prompt}</p>

        {drop.mediaUrl ? (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={drop.mediaUrl} alt={drop.mediaAlt ?? "Drop media"} className="h-56 w-full object-cover sm:h-72" />
          </div>
        ) : null}

        {drop.options?.length ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {drop.options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setValue(option.label)}
                className={cn(
                  "rounded-xl border px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300",
                  value === option.label
                    ? "border-cyan-300/70 bg-cyan-300/15 text-cyan-100"
                    : "border-white/20 bg-white/5 text-zinc-200 hover:bg-white/10",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}

        {voiceMode ? (
          <div className="grid gap-3 rounded-2xl border border-dashed border-white/30 bg-black/20 p-5 text-zinc-300 sm:grid-cols-2">
            <button
              disabled
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm"
            >
              <Mic className="size-4" />
              Record 5s audio (soon)
            </button>
            <button
              disabled
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm"
            >
              <Video className="size-4" />
              Capture webcam moment (soon)
            </button>
          </div>
        ) : null}

        {drop.type === "text" ? (
          <Textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={placeholderByType[drop.type]}
            disabled={disabled}
            maxLength={220}
          />
        ) : null}

        {drop.type === "reaction" && !drop.options?.length ? (
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={placeholderByType[drop.type]}
            disabled={disabled}
            maxLength={80}
          />
        ) : null}

        {drop.type === "voice_stub" ? (
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Type a fallback line for now"
            disabled={disabled}
            maxLength={120}
          />
        ) : null}

        <div className="flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">One moment. No second take.</p>
          <Button onClick={onSubmit} disabled={disabled || value.trim().length === 0} className="gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending
              </>
            ) : (
              <>
                <Send className="size-4" />
                Drop It
              </>
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
