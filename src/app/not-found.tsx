import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60dvh] flex-col items-center justify-center gap-6 text-center">
      <div className="animate-shimmer bg-gradient-to-r from-foreground via-purple-400 to-foreground bg-clip-text text-7xl font-bold tracking-tighter text-transparent sm:text-9xl">
        404
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          This route didn&apos;t compile.
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist. It may have been
          moved, renamed, or it was never here to begin with.
        </p>
      </div>
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "gap-2 bg-background/40 backdrop-blur-sm"
        )}
      >
        <ArrowLeft className="size-4" />
        Back home
      </Link>
    </main>
  );
}
