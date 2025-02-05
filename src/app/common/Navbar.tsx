import type * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NavItems = [
  { name: "Blogs", href: "/blogs" },
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
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              SimpL Blogs
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {NavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileLink
              href="/"
              className="flex items-center"
              onOpenChange={() => {}}
            >
              <span className="font-bold">SimpL Blogs</span>
            </MobileLink>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {NavItems.map((item) => (
                  <MobileLink
                    key={item.name}
                    href={item.href}
                    onOpenChange={() => {}}
                  >
                    {item.name}
                  </MobileLink>
                ))}
                <Button 
                  variant="ghost" 
                  className="justify-start p-0"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="ghost" className="ml-auto" asChild>
              <Link href="/">SimpL Blogs</Link>
            </Button>
          </div>
          <nav className="flex items-center">
            <Button 
              variant="ghost" 
              className="hidden md:inline-flex"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </nav>
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
