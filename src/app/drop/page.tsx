import { DropExperience } from "@/components/drop-experience";
import { Suspense } from "react";

export default function DropPage() {
  return (
    <Suspense fallback={null}>
      <DropExperience />
    </Suspense>
  );
}
