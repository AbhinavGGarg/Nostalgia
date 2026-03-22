import { Card } from "@/components/ui/card";
import { readableTime } from "@/lib/time";
import { StoredResponse } from "@/lib/types";

export function ChaosMemoryCard({ response }: { response: StoredResponse }) {
  return (
    <Card className="space-y-4 border-white/15">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-200">{response.label}</p>
      <p className="text-lg text-zinc-100">{response.completed ? response.responseText : "Missed the moment."}</p>
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>{response.completed ? "Responded in time" : "Timed out"}</span>
        <span>{readableTime(response.submittedAt)}</span>
      </div>
    </Card>
  );
}
