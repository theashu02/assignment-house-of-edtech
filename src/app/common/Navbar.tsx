import type * as React from "react";
import Link from "next/link";
import { Menu, LogOut, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {ScrollArea} from "@/components/ui/scroll-area"

const NavItems = [
  { name: "Home", href: "/dashboard" },
  { name: "MyBlogs", href: "/my-blogs" },
];

export function Navbar({ className }: React.HTMLAttributes<HTMLElement>) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/login");
        // Force refresh
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/80",
        className
      )}
    >
      <div className="container flex h-16 items-center p-6">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-8 flex items-center space-x-3 group">
            <PenLine className="h-6 w-6 text-blue-500 group-hover:text-blue-400 transition-colors" />
            <span className="hidden font-bold text-lg text-zinc-100 group-hover:text-blue-400 transition-colors sm:inline-block">
              SimpL Blogs
            </span>
          </Link>
          <nav className="flex items-center space-x-8 text-sm font-medium">
            {NavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-zinc-400 hover:text-zinc-100 transition-colors duration-200 group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-200" />
              </Link>
            ))}
          </nav>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 focus-visible:bg-transparent focus-visible:ring-1 focus-visible:ring-blue-500 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-72 border-r border-zinc-800 bg-zinc-900 pr-0"
          >
            <MobileLink
              href="/"
              className="flex items-center space-x-3 px-6"
              onOpenChange={() => {}}
            >
              <PenLine className="h-6 w-6 text-blue-500" />
              <span className="font-bold text-lg text-zinc-100">
                SimpL Blogs
              </span>
            </MobileLink>
            <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-4">
                {NavItems.map((item) => (
                  <MobileLink
                    key={item.name}
                    href={item.href}
                    className="text-zinc-400 hover:text-zinc-100 transition-colors"
                    onOpenChange={() => {}}
                  >
                    {item.name}
                  </MobileLink>
                ))}
                <Button
                  variant="ghost"
                  className="justify-start text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors w-fit"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-end">
          <Button
            variant="ghost"
            className="hidden md:inline-flex items-center text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

interface MobileLinkProps extends React.PropsWithChildren {
  href: string;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
}: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false);
      }}
      className={cn(className)}
    >
      {children}
    </Link>
  );
}
