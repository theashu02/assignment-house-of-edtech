import type * as React from "react";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer
      className={cn(
        "sticky bottom-0 z-50 bg-gradient-to-br from-gray-900 to-black shadow-lg",
        className
      )}
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between py-5">
          <div className="flex flex-col items-center md:items-start space-y-4 mb-6 md:mb-0">
            <p className="text-sm text-[#f4f4f4]">Ashu Chauhan © 2024 All rights reserved</p>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              size="icon"
              className="hover:bg-gray-800 transition-colors duration-200"
              asChild
            >
              <Link
                href="https://github.com/theashu02"
                target="_blank"
                rel="noreferrer"
                className="group"
              >
                <Github className="h-5 w-5 text-gray-800 group-hover:text-white transition-colors" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="hover:bg-gray-800 transition-colors duration-200"
              asChild
            >
              <Link
                href="https://www.linkedin.com/in/theashuchauhan/"
                target="_blank"
                rel="noreferrer"
                className="group"
              >
                <Linkedin className="h-5 w-5 text-gray-800 group-hover:text-white transition-colors" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
