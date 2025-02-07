"use client";

import { Footer } from "./common/Footer";
import { Navbar } from "./common/Navbar";
import FrontPage from "./common/FrontPage";
import { usePathname } from "next/navigation";
import Dashboard from "./dashboard/page"
import MyBlogs from "./my-blogs/page"

export default function Home() {
  const pathname = usePathname();

  let content;
  if (pathname === "/my-blogs") {
    content = <MyBlogs />;
  } else if (pathname === "/dashboard") {
    content = <Dashboard />;
  } else {
    content = <FrontPage />;
  }

  return (
    <div className="container flex flex-col">
      <Navbar />
      {content}
      <Footer />
    </div>
  );
}
