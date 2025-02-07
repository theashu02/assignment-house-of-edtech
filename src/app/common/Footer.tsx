import type * as React from "react";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="container flex items-center justify-between py-4 p-6">
        <p className="text-sm text-muted-foreground">
          Created by{" "}
          <span className="font-semibold text-foreground">@Ashu Chauhan</span>
        </p>
        <div className="flex items-center space-x-2">
          <Button asChild variant="outline" size="icon">
            <Link
              href="https://www.linkedin.com/in/theashuchauhan/"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon">
            <Link
              href="https://github.com/theashu02"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
